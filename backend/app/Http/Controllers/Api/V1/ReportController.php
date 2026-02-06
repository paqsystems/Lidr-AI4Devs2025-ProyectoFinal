<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\TaskService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Controller: ReportController
 *
 * Controlador para endpoints de informes (consulta detallada, agrupada, etc.).
 *
 * Endpoints:
 * - GET /api/v1/reports/detail - Consulta detallada de tareas (TR-044)
 * - GET /api/v1/reports/by-client - Consulta agrupada por cliente (TR-046)
 *
 * @see TR-044(MH)-consulta-detallada-de-tareas.md
 * @see TR-046(MH)-consulta-agrupada-por-cliente.md
 */
class ReportController extends Controller
{
    protected TaskService $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    /**
     * Consulta detallada de tareas (TR-044)
     *
     * GET /api/v1/reports/detail?page=1&per_page=15&fecha_desde=...&fecha_hasta=...&tipo_cliente_id=...&cliente_id=...&usuario_id=...&ordenar_por=fecha|cliente|empleado|tipo_tarea|horas&orden=asc|desc
     * Empleado: solo sus tareas. Supervisor: todas, con filtros opcionales. Cliente: solo tareas donde es el cliente.
     * Respuesta: data[], pagination, total_horas (decimal).
     * Error 1305 si fecha_desde > fecha_hasta.
     */
    public function detail(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $filters = [
                'page' => $request->query('page', 1),
                'per_page' => $request->query('per_page', 15),
                'fecha_desde' => $request->query('fecha_desde'),
                'fecha_hasta' => $request->query('fecha_hasta'),
                'tipo_cliente_id' => $request->query('tipo_cliente_id'),
                'cliente_id' => $request->query('cliente_id'),
                'usuario_id' => $request->query('usuario_id'),
                'ordenar_por' => $request->query('ordenar_por', 'fecha'),
                'orden' => $request->query('orden', 'desc'),
            ];

            $result = $this->taskService->listDetailReport($user, $filters);

            return response()->json([
                'error' => 0,
                'respuesta' => 'Consulta obtenida correctamente',
                'resultado' => $result,
            ], 200);
        } catch (\Exception $e) {
            if ($e->getCode() === TaskService::ERROR_PERIODO_INVALIDO) {
                return response()->json([
                    'error' => (int) $e->getCode(),
                    'respuesta' => $e->getMessage(),
                    'resultado' => (object) [],
                ], 422);
            }
            return response()->json([
                'error' => 9999,
                'respuesta' => 'Error inesperado del servidor',
                'resultado' => (object) [],
            ], 500);
        }
    }

    /**
     * Consulta agrupada por cliente (TR-046)
     *
     * GET /api/v1/reports/by-client?fecha_desde=...&fecha_hasta=...
     * Empleado: solo sus tareas agrupadas. Supervisor: todas. Cliente: solo donde es el cliente.
     * Respuesta: grupos[], total_general_horas, total_general_tareas.
     * Error 1305 si fecha_desde > fecha_hasta.
     */
    public function byClient(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $filters = [
                'fecha_desde' => $request->query('fecha_desde'),
                'fecha_hasta' => $request->query('fecha_hasta'),
            ];

            $result = $this->taskService->listByClientReport($user, $filters);

            return response()->json([
                'error' => 0,
                'respuesta' => 'Reporte por cliente obtenido correctamente',
                'resultado' => $result,
            ], 200);
        } catch (\Exception $e) {
            if ($e->getCode() === TaskService::ERROR_PERIODO_INVALIDO) {
                return response()->json([
                    'error' => (int) $e->getCode(),
                    'respuesta' => $e->getMessage(),
                    'resultado' => (object) [],
                ], 422);
            }
            return response()->json([
                'error' => 9999,
                'respuesta' => 'Error inesperado del servidor',
                'resultado' => (object) [],
            ], 500);
        }
    }
}
