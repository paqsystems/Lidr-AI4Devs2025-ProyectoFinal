<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\UserProfileController;
use App\Http\Controllers\Api\V1\TaskController;

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
        
        // Rutas de tareas
        // @see TR-028(MH)-carga-de-tarea-diaria.md
        // @see TR-033(MH)-visualización-de-lista-de-tareas-propias.md
        Route::prefix('tasks')->group(function () {
            // GET /api/v1/tasks - Listar tareas propias (paginado, filtros)
            Route::get('/', [TaskController::class, 'index'])
                ->name('api.v1.tasks.index');
            
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
        });
    });
});
