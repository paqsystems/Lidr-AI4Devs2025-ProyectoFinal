<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;

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
            
        // GET /api/v1/user - Obtener usuario actual
        Route::get('/user', function (Request $request) {
            return $request->user();
        })->name('api.v1.user');
    });
});
