<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\CreateTaskRequest;
use App\Services\TaskService;
use App\Models\Cliente;
use App\Models\TipoTarea;
use App\Models\Usuario;
use App\Models\ClienteTipoTarea;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Controller: TaskController
 * 
 * Controlador para endpoints de gestión de tareas.
 * 
 * Endpoints:
 * - POST /api/v1/tasks - Crear nuevo registro de tarea
 * - GET /api/v1/tasks/clients - Obtener lista de clientes activos
 * - GET /api/v1/tasks/task-types - Obtener tipos de tarea disponibles
 * - GET /api/v1/tasks/employees - Obtener lista de empleados (solo supervisores)
 * 
 * @see TR-028(MH)-carga-de-tarea-diaria.md
 */
class TaskController extends Controller
{
    /**
     * Servicio de tareas
     */
    protected TaskService $taskService;

    /**
     * Constructor
     *
     * @param TaskService $taskService Servicio inyectado
     */
    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    /**
     * Crear un nuevo registro de tarea
     * 
     * Crea un registro de tarea para el usuario autenticado o para otro empleado si es supervisor.
     * Requiere autenticación (middleware auth:sanctum).
     * 
     * @param CreateTaskRequest $request Request validado
     * @return JsonResponse Respuesta con datos del registro creado
     * 
     * @response 201 {
     *   "error": 0,
     *   "respuesta": "Tarea registrada correctamente",
     *   "resultado": {
     *     "id": 1,
     *     "usuario_id": 1,
     *     "cliente_id": 1,
     *     "tipo_tarea_id": 2,
     *     "fecha": "2026-01-28",
     *     "duracion_minutos": 120,
     *     "sin_cargo": false,
     *     "presencial": true,
     *     "observacion": "Desarrollo de feature X",
     *     "cerrado": false,
     *     "created_at": "2026-01-28T10:30:00+00:00",
     *     "updated_at": "2026-01-28T10:30:00+00:00"
     *   }
     * }
     * 
     * @response 403 {
     *   "error": 4003,
     *   "respuesta": "No tiene permisos para asignar tareas a otros empleados",
     *   "resultado": {}
     * }
     * 
     * @response 422 {
     *   "error": 4220,
     *   "respuesta": "Errores de validación",
     *   "resultado": {
     *     "errors": {
     *       "fecha": ["La fecha es obligatoria"],
     *       "duracion_minutos": ["La duración debe ser múltiplo de 15 minutos"]
     *     }
     *   }
     * }
     */
    public function store(CreateTaskRequest $request): JsonResponse
    {
        try {
            // Obtener usuario autenticado
            $user = $request->user();
            
            // Crear tarea usando el servicio
            $datosTarea = $this->taskService->createTask($request->validated(), $user);

            return response()->json([
                'error' => 0,
                'respuesta' => 'Tarea registrada correctamente',
                'resultado' => $datosTarea
            ], 201);

        } catch (\Exception $e) {
            // Determinar código HTTP según el código de error
            $httpCode = 500;
            $errorCode = 9999;
            
            if ($e->getCode() === TaskService::ERROR_FORBIDDEN) {
                $httpCode = 403;
                $errorCode = TaskService::ERROR_FORBIDDEN;
            } elseif ($e->getCode() === TaskService::ERROR_CLIENTE_INACTIVO || 
                      $e->getCode() === TaskService::ERROR_TIPO_TAREA_INACTIVO ||
                      $e->getCode() === TaskService::ERROR_EMPLEADO_INACTIVO ||
                      $e->getCode() === TaskService::ERROR_TIPO_TAREA_NO_DISPONIBLE) {
                $httpCode = 422;
                $errorCode = $e->getCode();
            } elseif ($e->getCode() === 404) {
                $httpCode = 404;
                $errorCode = 4004;
            }

            return response()->json([
                'error' => $errorCode,
                'respuesta' => $e->getMessage(),
                'resultado' => (object) []
            ], $httpCode);
        }
    }

    /**
     * Obtener lista de clientes activos
     * 
     * Retorna lista de clientes activos y no inhabilitados para el selector.
     * Requiere autenticación (middleware auth:sanctum).
     * 
     * @param Request $request Request con usuario autenticado
     * @return JsonResponse Respuesta con lista de clientes
     * 
     * @response 200 {
     *   "error": 0,
     *   "respuesta": "Clientes obtenidos correctamente",
     *   "resultado": [
     *     {
     *       "id": 1,
     *       "code": "CLI001",
     *       "nombre": "Empresa ABC S.A."
     *     }
     *   ]
     * }
     */
    public function getClients(Request $request): JsonResponse
    {
        try {
            $clientes = Cliente::where('activo', true)
                ->where('inhabilitado', false)
                ->orderBy('nombre')
                ->get()
                ->map(function ($cliente) {
                    return [
                        'id' => $cliente->id,
                        'code' => $cliente->code,
                        'nombre' => $cliente->nombre,
                    ];
                });

            return response()->json([
                'error' => 0,
                'respuesta' => 'Clientes obtenidos correctamente',
                'resultado' => $clientes->values()->toArray()
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 9999,
                'respuesta' => 'Error inesperado del servidor',
                'resultado' => (object) []
            ], 500);
        }
    }

    /**
     * Obtener tipos de tarea disponibles
     * 
     * Retorna tipos de tarea genéricos o tipos asignados al cliente si se proporciona cliente_id.
     * Requiere autenticación (middleware auth:sanctum).
     * 
     * @param Request $request Request con usuario autenticado
     * @return JsonResponse Respuesta con lista de tipos de tarea
     * 
     * @response 200 {
     *   "error": 0,
     *   "respuesta": "Tipos de tarea obtenidos correctamente",
     *   "resultado": [
     *     {
     *       "id": 1,
     *       "code": "DESARROLLO",
     *       "descripcion": "Desarrollo de software",
     *       "is_generico": true
     *     }
     *   ]
     * }
     */
    public function getTaskTypes(Request $request): JsonResponse
    {
        try {
            $clienteId = $request->query('cliente_id');

            // Obtener tipos genéricos activos
            $tiposGenericos = TipoTarea::where('is_generico', true)
                ->where('activo', true)
                ->where('inhabilitado', false)
                ->get();

            $tiposDisponibles = $tiposGenericos;

            // Si se proporciona cliente_id, agregar tipos asignados al cliente
            if ($clienteId) {
                $tiposAsignadosIds = ClienteTipoTarea::where('cliente_id', $clienteId)
                    ->pluck('tipo_tarea_id')
                    ->toArray();

                $tiposAsignados = TipoTarea::whereIn('id', $tiposAsignadosIds)
                    ->where('activo', true)
                    ->where('inhabilitado', false)
                    ->get();

                // Combinar tipos genéricos y asignados, eliminar duplicados
                $tiposDisponibles = $tiposGenericos->merge($tiposAsignados)->unique('id');
            }

            $resultado = $tiposDisponibles->map(function ($tipo) {
                return [
                    'id' => $tipo->id,
                    'code' => $tipo->code,
                    'descripcion' => $tipo->descripcion,
                    'is_generico' => $tipo->is_generico,
                ];
            })->values()->toArray();

            return response()->json([
                'error' => 0,
                'respuesta' => 'Tipos de tarea obtenidos correctamente',
                'resultado' => $resultado
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 9999,
                'respuesta' => 'Error inesperado del servidor',
                'resultado' => (object) []
            ], 500);
        }
    }

    /**
     * Obtener lista de empleados activos
     * 
     * Retorna lista de empleados activos y no inhabilitados.
     * Solo accesible para supervisores.
     * Requiere autenticación (middleware auth:sanctum).
     * 
     * @param Request $request Request con usuario autenticado
     * @return JsonResponse Respuesta con lista de empleados o error 403
     * 
     * @response 200 {
     *   "error": 0,
     *   "respuesta": "Empleados obtenidos correctamente",
     *   "resultado": [
     *     {
     *       "id": 1,
     *       "code": "JPEREZ",
     *       "nombre": "Juan Pérez"
     *     }
     *   ]
     * }
     * 
     * @response 403 {
     *   "error": 4003,
     *   "respuesta": "Solo los supervisores pueden acceder a esta información",
     *   "resultado": {}
     * }
     */
    public function getEmployees(Request $request): JsonResponse
    {
        try {
            // Obtener usuario autenticado
            $user = $request->user();
            
            // Verificar que sea empleado supervisor
            $empleado = Usuario::where('user_id', $user->id)->first();
            
            if (!$empleado || !$empleado->supervisor) {
                return response()->json([
                    'error' => 4003,
                    'respuesta' => 'Solo los supervisores pueden acceder a esta información',
                    'resultado' => (object) []
                ], 403);
            }

            $empleados = Usuario::where('activo', true)
                ->where('inhabilitado', false)
                ->orderBy('nombre')
                ->get()
                ->map(function ($empleado) {
                    return [
                        'id' => $empleado->id,
                        'code' => $empleado->code,
                        'nombre' => $empleado->nombre,
                    ];
                });

            return response()->json([
                'error' => 0,
                'respuesta' => 'Empleados obtenidos correctamente',
                'resultado' => $empleados->values()->toArray()
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 9999,
                'respuesta' => 'Error inesperado del servidor',
                'resultado' => (object) []
            ], 500);
        }
    }
}
