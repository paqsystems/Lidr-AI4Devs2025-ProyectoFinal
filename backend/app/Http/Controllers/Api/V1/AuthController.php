<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\Auth\LoginResource;
use App\Services\AuthService;
use App\Services\AuthException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Controller: AuthController
 * 
 * Controlador para endpoints de autenticación.
 * 
 * Endpoints:
 * - POST /api/v1/auth/login - Autenticación de empleado
 * - POST /api/v1/auth/logout - Cierre de sesión
 * 
 * @see TR-001(MH)-login-de-empleado.md
 * @see TR-003(MH)-logout.md
 */
class AuthController extends Controller
{
    /**
     * Servicio de autenticación
     */
    protected AuthService $authService;

    /**
     * Constructor
     *
     * @param AuthService $authService Servicio de autenticación inyectado
     */
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Login de empleado
     * 
     * Autentica un empleado con código de usuario y contraseña.
     * 
     * @param LoginRequest $request Request validado con usuario y password
     * @return JsonResponse Respuesta con token y datos del usuario, o error
     * 
     * @response 200 {
     *   "error": 0,
     *   "respuesta": "Autenticación exitosa",
     *   "resultado": {
     *     "token": "1|abcdef...",
     *     "user": {
     *       "user_id": 1,
     *       "user_code": "JPEREZ",
     *       "tipo_usuario": "usuario",
     *       "usuario_id": 5,
     *       "cliente_id": null,
     *       "es_supervisor": false,
     *       "nombre": "Juan Pérez",
     *       "email": "juan.perez@ejemplo.com"
     *     }
     *   }
     * }
     * 
     * @response 401 {
     *   "error": 3201,
     *   "respuesta": "Credenciales inválidas",
     *   "resultado": {}
     * }
     * 
     * @response 422 {
     *   "error": 1102,
     *   "respuesta": "El código de usuario no puede estar vacío",
     *   "resultado": {
     *     "errors": {"usuario": ["El código de usuario no puede estar vacío"]}
     *   }
     * }
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            // Intentar login con credenciales validadas
            $result = $this->authService->login(
                $request->input('usuario'),
                $request->input('password')
            );

            // Retornar respuesta exitosa en formato envelope
            return response()->json([
                'error' => 0,
                'respuesta' => 'Autenticación exitosa',
                'resultado' => [
                    'token' => $result['token'],
                    'user' => $result['user_data']
                ]
            ], 200);

        } catch (AuthException $e) {
            // Manejar errores de autenticación
            $httpCode = $e->getErrorCode() === AuthService::ERROR_USER_INACTIVE ? 401 : 401;
            
            return response()->json([
                'error' => $e->getErrorCode(),
                'respuesta' => $e->getMessage(),
                'resultado' => (object) []
            ], $httpCode);

        } catch (\Exception $e) {
            // Error inesperado
            return response()->json([
                'error' => 9999,
                'respuesta' => 'Error inesperado del servidor',
                'resultado' => (object) []
            ], 500);
        }
    }

    /**
     * Logout de usuario
     * 
     * Cierra la sesión del usuario revocando su token actual.
     * Requiere autenticación (middleware auth:sanctum).
     * 
     * @param Request $request Request con usuario autenticado
     * @return JsonResponse Respuesta de éxito
     * 
     * @response 200 {
     *   "error": 0,
     *   "respuesta": "Sesión cerrada correctamente",
     *   "resultado": {}
     * }
     * 
     * @see TR-003(MH)-logout.md
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            // Obtener usuario autenticado y cerrar sesión
            $user = $request->user();
            $this->authService->logout($user);

            return response()->json([
                'error' => 0,
                'respuesta' => 'Sesión cerrada correctamente',
                'resultado' => (object) []
            ], 200);

        } catch (\Exception $e) {
            // Error inesperado
            return response()->json([
                'error' => 9999,
                'respuesta' => 'Error inesperado del servidor',
                'resultado' => (object) []
            ], 500);
        }
    }
}
