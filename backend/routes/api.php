<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\UserProfileController;
use App\Http\Controllers\Api\V1\TaskController;
use App\Http\Controllers\Api\V1\ReportController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\ClienteController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

/*
|--------------------------------------------------------------------------
| API V1 Routes
|--------------------------------------------------------------------------
*/
Route::prefix('v1')->group(function () {
    
    // Rutas públicas de autenticación
    Route::prefix('auth')->group(function () {
        // POST /api/v1/auth/login - Login de empleado
        Route::post('/login', [AuthController::class, 'login'])
            ->name('api.v1.auth.login');
    });
    
    // Rutas protegidas (requieren autenticación)
    Route::middleware('auth:sanctum')->group(function () {
        // POST /api/v1/auth/logout - Logout de usuario
        Route::post('/auth/logout', [AuthController::class, 'logout'])
            ->name('api.v1.auth.logout');
            
        // GET /api/v1/user - Obtener usuario actual (legacy)
        Route::get('/user', function (Request $request) {
            return $request->user();
        })->name('api.v1.user');
        
        // GET /api/v1/user/profile - Obtener perfil del usuario autenticado
        // @see TR-006(MH)-visualización-de-perfil-de-usuario.md
        Route::get('/user/profile', [UserProfileController::class, 'show'])
            ->name('api.v1.user.profile');

        // Dashboard (TR-051)
        Route::get('/dashboard', [DashboardController::class, 'index'])
            ->name('api.v1.dashboard');

        // Rutas de informes (TR-044 Consulta detallada, TR-046 Agrupada por cliente)
        Route::prefix('reports')->group(function () {
            Route::get('/detail', [ReportController::class, 'detail'])
                ->name('api.v1.reports.detail');
            Route::get('/by-client', [ReportController::class, 'byClient'])
                ->name('api.v1.reports.byClient');
        });
        
        // Rutas de clientes (solo supervisores) @see TR-008(MH), TR-009(MH), TR-010(MH)
        Route::get('/clientes', [ClienteController::class, 'index'])
            ->name('api.v1.clientes.index');
        Route::post('/clientes', [ClienteController::class, 'store'])
            ->name('api.v1.clientes.store');
        Route::get('/tipos-cliente', [ClienteController::class, 'tiposCliente'])
            ->name('api.v1.tipos-cliente.index');
        Route::get('/clientes/{id}', [ClienteController::class, 'show'])
            ->name('api.v1.clientes.show');
        Route::get('/clientes/{id}/tipos-tarea', [ClienteController::class, 'tiposTarea'])
            ->name('api.v1.clientes.tipos-tarea.index');
        Route::put('/clientes/{id}/tipos-tarea', [ClienteController::class, 'updateTiposTarea'])
            ->name('api.v1.clientes.tipos-tarea.update');
        Route::put('/clientes/{id}', [ClienteController::class, 'update'])
            ->name('api.v1.clientes.update');
        Route::delete('/clientes/{id}', [ClienteController::class, 'destroy'])
            ->name('api.v1.clientes.destroy');

        // Rutas de tareas
        // @see TR-028(MH)-carga-de-tarea-diaria.md
        // @see TR-033(MH)-visualización-de-lista-de-tareas-propias.md
        Route::prefix('tasks')->group(function () {
            // GET /api/v1/tasks - Listar tareas propias (paginado, filtros)
            Route::get('/', [TaskController::class, 'index'])
                ->name('api.v1.tasks.index');

            // GET /api/v1/tasks/all - Listar todas las tareas (solo supervisores) @see TR-034
            Route::get('/all', [TaskController::class, 'indexAll'])
                ->name('api.v1.tasks.indexAll');
            
            // POST /api/v1/tasks - Crear nuevo registro de tarea
            Route::post('/', [TaskController::class, 'store'])
                ->name('api.v1.tasks.store');
            
            // GET /api/v1/tasks/clients - Obtener lista de clientes activos
            Route::get('/clients', [TaskController::class, 'getClients'])
                ->name('api.v1.tasks.clients');
            
            // GET /api/v1/tasks/task-types - Obtener tipos de tarea disponibles
            Route::get('/task-types', [TaskController::class, 'getTaskTypes'])
                ->name('api.v1.tasks.task-types');
            
            // GET /api/v1/tasks/employees - Obtener lista de empleados (solo supervisores)
            Route::get('/employees', [TaskController::class, 'getEmployees'])
                ->name('api.v1.tasks.employees');

            // GET /api/v1/tasks/{id} - Obtener tarea para edición (TR-029)
            Route::get('/{id}', [TaskController::class, 'show'])
                ->name('api.v1.tasks.show');
            // PUT /api/v1/tasks/{id} - Actualizar tarea (TR-029)
            Route::put('/{id}', [TaskController::class, 'update'])
                ->name('api.v1.tasks.update');
            // DELETE /api/v1/tasks/{id} - Eliminar tarea (TR-030)
            Route::delete('/{id}', [TaskController::class, 'destroy'])
                ->name('api.v1.tasks.destroy');
        });
    });
});
