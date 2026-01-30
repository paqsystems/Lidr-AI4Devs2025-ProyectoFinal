<?php

namespace App\Services;

use App\Models\User;
use App\Models\Usuario;
use App\Models\Cliente;
use App\Models\TipoTarea;
use App\Models\RegistroTarea;
use App\Models\ClienteTipoTarea;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Service: TaskService
 * 
 * Servicio para gestionar la creación y listado de registros de tarea.
 * Implementa la lógica de negocio para crear tareas diarias y listar tareas propias.
 * 
 * Flujo de listado (TR-033):
 * - Solo tareas del usuario autenticado (usuario_id = empleado del user).
 * - Filtros: fecha, cliente, tipo, búsqueda en observación.
 * - Paginación y totales (cantidad, horas).
 * 
 * Flujo de creación de tarea:
 * 1. Validar que el cliente existe y está activo/no inhabilitado
 * 2. Validar que el tipo de tarea existe, está activo/no inhabilitado y es válido para el cliente
 * 3. Validar permisos: si usuario_id es diferente al autenticado, el usuario debe ser supervisor
 * 4. Determinar usuario_id final (del autenticado o del seleccionado si es supervisor)
 * 5. Crear el registro en PQ_PARTES_REGISTRO_TAREA
 * 6. Retornar datos del registro creado
 * 
 * Códigos de error:
 * - 4003: No tiene permisos para asignar tareas a otros empleados
 * - 4201: Cliente inactivo o inhabilitado
 * - 4202: Tipo de tarea inactivo o inhabilitado
 * - 4203: Empleado inactivo o inhabilitado
 * - 4204: Tipo de tarea no disponible para el cliente
 * 
 * @see TR-028(MH)-carga-de-tarea-diaria.md
 * @see TR-033(MH)-visualización-de-lista-de-tareas-propias.md
 */
class TaskService
{
    /**
     * Códigos de error
     */
    public const ERROR_FORBIDDEN = 4003;
    public const ERROR_CLIENTE_INACTIVO = 4201;
    public const ERROR_TIPO_TAREA_INACTIVO = 4202;
    public const ERROR_EMPLEADO_INACTIVO = 4203;
    public const ERROR_TIPO_TAREA_NO_DISPONIBLE = 4204;

    /**
     * Listar tareas del usuario autenticado con filtros y paginación
     *
     * @param User $user Usuario autenticado
     * @param array $filters page, per_page, fecha_desde, fecha_hasta, cliente_id, tipo_tarea_id, busqueda, ordenar_por, orden
     * @return array ['data' => [...], 'pagination' => [...], 'totales' => [...]]
     */
    public function listTasks(User $user, array $filters): array
    {
        $empleado = Usuario::where('user_id', $user->id)->first();
        if (!$empleado) {
            return [
                'data' => [],
                'pagination' => [
                    'current_page' => 1,
                    'per_page' => (int) ($filters['per_page'] ?? 15),
                    'total' => 0,
                    'last_page' => 1,
                ],
                'totales' => [
                    'cantidad_tareas' => 0,
                    'total_horas' => 0,
                ],
            ];
        }

        $perPage = max(10, min(20, (int) ($filters['per_page'] ?? 15)));
        $ordenarPor = $filters['ordenar_por'] ?? 'fecha';
        $orden = strtolower($filters['orden'] ?? 'desc') === 'asc' ? 'asc' : 'desc';

        $esSupervisor = (bool) $empleado->supervisor;
        $filtrarPorEmpleado = isset($filters['usuario_id']) && $filters['usuario_id'] !== '' && $filters['usuario_id'] !== null;
        $empleadoIdFiltro = $filtrarPorEmpleado && $esSupervisor ? (int) $filters['usuario_id'] : $empleado->id;

        $query = RegistroTarea::with(['cliente', 'tipoTarea']);
        if ($esSupervisor && !$filtrarPorEmpleado) {
            // Supervisor sin filtro empleado: todas las tareas
        } else {
            $query->where('usuario_id', $empleadoIdFiltro);
        }

        if (!empty($filters['fecha_desde'])) {
            $query->where('fecha', '>=', $filters['fecha_desde']);
        }
        if (!empty($filters['fecha_hasta'])) {
            $query->where('fecha', '<=', $filters['fecha_hasta']);
        }
        if (isset($filters['cliente_id']) && $filters['cliente_id'] !== '' && $filters['cliente_id'] !== null) {
            $query->where('cliente_id', (int) $filters['cliente_id']);
        }
        if (isset($filters['tipo_tarea_id']) && $filters['tipo_tarea_id'] !== '' && $filters['tipo_tarea_id'] !== null) {
            $query->where('tipo_tarea_id', (int) $filters['tipo_tarea_id']);
        }
        if (!empty($filters['busqueda'])) {
            $busqueda = trim($filters['busqueda']);
            $query->where('observacion', 'like', '%' . $busqueda . '%');
        }

        $totalesQuery = RegistroTarea::query();
        if ($esSupervisor && !$filtrarPorEmpleado) {
            // Todas las tareas para totales
        } else {
            $totalesQuery->where('usuario_id', $empleadoIdFiltro);
        }
        if (!empty($filters['fecha_desde'])) {
            $totalesQuery->where('fecha', '>=', $filters['fecha_desde']);
        }
        if (!empty($filters['fecha_hasta'])) {
            $totalesQuery->where('fecha', '<=', $filters['fecha_hasta']);
        }
        if (isset($filters['cliente_id']) && $filters['cliente_id'] !== '' && $filters['cliente_id'] !== null) {
            $totalesQuery->where('cliente_id', (int) $filters['cliente_id']);
        }
        if (isset($filters['tipo_tarea_id']) && $filters['tipo_tarea_id'] !== '' && $filters['tipo_tarea_id'] !== null) {
            $totalesQuery->where('tipo_tarea_id', (int) $filters['tipo_tarea_id']);
        }
        if (!empty($filters['busqueda'])) {
            $totalesQuery->where('observacion', 'like', '%' . trim($filters['busqueda']) . '%');
        }
        $cantidadTareas = $totalesQuery->count();
        $totalHoras = $totalesQuery->sum('duracion_minutos') / 60;

        $allowedOrder = ['fecha', 'created_at'];
        if (!in_array($ordenarPor, $allowedOrder)) {
            $ordenarPor = 'fecha';
        }
        $query->orderBy($ordenarPor, $orden);

        $paginator = $query->paginate($perPage);

        $data = $paginator->getCollection()->map(function (RegistroTarea $t) {
            $observacionTruncada = mb_strlen($t->observacion) > 50
                ? mb_substr($t->observacion, 0, 50) . '...'
                : $t->observacion;
            $horas = intdiv($t->duracion_minutos, 60);
            $minutos = $t->duracion_minutos % 60;
            $duracionHoras = sprintf('%d:%02d', $horas, $minutos);

            return [
                'id' => $t->id,
                'fecha' => $t->fecha->format('Y-m-d'),
                'cliente' => [
                    'id' => $t->cliente->id,
                    'nombre' => $t->cliente->nombre,
                ],
                'tipo_tarea' => [
                    'id' => $t->tipoTarea->id,
                    'nombre' => $t->tipoTarea->descripcion,
                ],
                'duracion_minutos' => $t->duracion_minutos,
                'duracion_horas' => $duracionHoras,
                'sin_cargo' => $t->sin_cargo,
                'presencial' => $t->presencial,
                'observacion' => $observacionTruncada,
                'cerrado' => $t->cerrado,
                'created_at' => $t->created_at->toIso8601String(),
            ];
        })->values()->all();

        return [
            'data' => $data,
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
            ],
            'totales' => [
                'cantidad_tareas' => $cantidadTareas,
                'total_horas' => round($totalHoras, 2),
            ],
        ];
    }

    /**
     * Crear un nuevo registro de tarea
     *
     * @param array $datos Datos validados del request
     * @param User $user Usuario autenticado
     * @return array Datos del registro creado
     * @throws \Exception Si hay error en la creación
     */
    public function createTask(array $datos, User $user): array
    {
        // Obtener empleado del usuario autenticado
        $empleadoAutenticado = Usuario::where('user_id', $user->id)->first();
        
        if (!$empleadoAutenticado) {
            throw new \Exception('El usuario autenticado no es un empleado', self::ERROR_FORBIDDEN);
        }

        // Validar cliente activo y no inhabilitado
        $cliente = Cliente::find($datos['cliente_id']);
        if (!$cliente) {
            throw new \Exception('Cliente no encontrado', 404);
        }
        if (!$cliente->activo || $cliente->inhabilitado) {
            throw new \Exception('El cliente seleccionado está inactivo o inhabilitado', self::ERROR_CLIENTE_INACTIVO);
        }

        // Validar tipo de tarea activo y no inhabilitado
        $tipoTarea = TipoTarea::find($datos['tipo_tarea_id']);
        if (!$tipoTarea) {
            throw new \Exception('Tipo de tarea no encontrado', 404);
        }
        if (!$tipoTarea->activo || $tipoTarea->inhabilitado) {
            throw new \Exception('El tipo de tarea seleccionado está inactivo o inhabilitado', self::ERROR_TIPO_TAREA_INACTIVO);
        }

        // Validar que el tipo de tarea sea genérico o esté asignado al cliente
        if (!$tipoTarea->is_generico) {
            $asignado = ClienteTipoTarea::where('cliente_id', $cliente->id)
                ->where('tipo_tarea_id', $tipoTarea->id)
                ->exists();
            
            if (!$asignado) {
                throw new \Exception('El tipo de tarea no está disponible para el cliente seleccionado', self::ERROR_TIPO_TAREA_NO_DISPONIBLE);
            }
        }

        // Determinar usuario_id final
        $usuarioIdFinal = $empleadoAutenticado->id;

        // Si se proporciona usuario_id, validar permisos y empleado
        if (isset($datos['usuario_id']) && $datos['usuario_id'] !== null) {
            // Validar que el usuario autenticado sea supervisor
            if (!$empleadoAutenticado->supervisor) {
                throw new \Exception('No tiene permisos para asignar tareas a otros empleados', self::ERROR_FORBIDDEN);
            }

            // Validar que el empleado seleccionado existe y está activo
            $empleadoSeleccionado = Usuario::find($datos['usuario_id']);
            if (!$empleadoSeleccionado) {
                throw new \Exception('Empleado no encontrado', 404);
            }
            if (!$empleadoSeleccionado->activo || $empleadoSeleccionado->inhabilitado) {
                throw new \Exception('El empleado seleccionado está inactivo o inhabilitado', self::ERROR_EMPLEADO_INACTIVO);
            }

            $usuarioIdFinal = $empleadoSeleccionado->id;
        }

        // Crear el registro de tarea
        try {
            $registroTarea = RegistroTarea::create([
                'usuario_id' => $usuarioIdFinal,
                'cliente_id' => $datos['cliente_id'],
                'tipo_tarea_id' => $datos['tipo_tarea_id'],
                'fecha' => $datos['fecha'],
                'duracion_minutos' => $datos['duracion_minutos'],
                'sin_cargo' => $datos['sin_cargo'] ?? false,
                'presencial' => $datos['presencial'] ?? false,
                'observacion' => trim($datos['observacion']),
                'cerrado' => false,
            ]);

            // Retornar datos del registro creado
            return [
                'id' => $registroTarea->id,
                'usuario_id' => $registroTarea->usuario_id,
                'cliente_id' => $registroTarea->cliente_id,
                'tipo_tarea_id' => $registroTarea->tipo_tarea_id,
                'fecha' => $registroTarea->fecha->format('Y-m-d'),
                'duracion_minutos' => $registroTarea->duracion_minutos,
                'sin_cargo' => $registroTarea->sin_cargo,
                'presencial' => $registroTarea->presencial,
                'observacion' => $registroTarea->observacion,
                'cerrado' => $registroTarea->cerrado,
                'created_at' => $registroTarea->created_at->toIso8601String(),
                'updated_at' => $registroTarea->updated_at->toIso8601String(),
            ];
        } catch (\Exception $e) {
            Log::error('Error al crear registro de tarea', [
                'user_id' => $user->id,
                'datos' => $datos,
                'error' => $e->getMessage(),
            ]);
            throw new \Exception('Error inesperado al crear el registro de tarea', 500);
        }
    }
}
