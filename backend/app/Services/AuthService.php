<?php

namespace App\Services;

use App\Models\User;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;

/**
 * Service: AuthService
 * 
 * Servicio de autenticación que maneja la lógica de login.
 * 
 * Flujo de autenticación:
 * 1. Buscar usuario en USERS por code
 * 2. Validar que usuario esté activo y no inhabilitado en USERS
 * 3. Validar contraseña con Hash::check()
 * 4. Buscar usuario en PQ_PARTES_USUARIOS por code
 * 5. Validar que usuario esté activo y no inhabilitado en PQ_PARTES_USUARIOS
 * 6. Determinar tipo_usuario y es_supervisor
 * 7. Generar token Sanctum
 * 8. Retornar respuesta con todos los campos requeridos
 * 
 * Códigos de error:
 * - 3201: Credenciales inválidas (genérico, no revela si usuario existe)
 * - 3202: Usuario no encontrado (interno, no se expone)
 * - 3203: Contraseña incorrecta (interno, no se expone)
 * - 4203: Usuario inactivo
 * 
 * @see TR-001(MH)-login-de-empleado.md
 */
class AuthService
{
    /**
     * Códigos de error
     */
    public const ERROR_INVALID_CREDENTIALS = 3201;
    public const ERROR_USER_NOT_FOUND = 3202;
    public const ERROR_WRONG_PASSWORD = 3203;
    public const ERROR_USER_INACTIVE = 4203;

    /**
     * Intentar login de usuario
     *
     * @param string $usuario Código de usuario
     * @param string $password Contraseña
     * @return array Respuesta con token y datos del usuario
     * @throws AuthException Si las credenciales son inválidas
     */
    public function login(string $usuario, string $password): array
    {
        // 1. Buscar usuario en USERS por code
        $user = User::where('code', $usuario)->first();
        
        if (!$user) {
            // Usuario no encontrado - retornar error genérico por seguridad
            throw new AuthException(
                'Credenciales inválidas',
                self::ERROR_INVALID_CREDENTIALS
            );
        }

        // 2. Validar que usuario esté activo y no inhabilitado en USERS
        if (!$user->activo || $user->inhabilitado) {
            throw new AuthException(
                'Usuario inactivo',
                self::ERROR_USER_INACTIVE
            );
        }

        // 3. Validar contraseña
        if (!Hash::check($password, $user->password_hash)) {
            // Contraseña incorrecta - retornar error genérico por seguridad
            throw new AuthException(
                'Credenciales inválidas',
                self::ERROR_INVALID_CREDENTIALS
            );
        }

        // 4. Buscar usuario en PQ_PARTES_USUARIOS por code
        $empleado = Usuario::where('code', $usuario)->first();
        
        if (!$empleado) {
            // El usuario existe en USERS pero no en PQ_PARTES_USUARIOS
            // Esto podría significar que es un cliente, no un empleado
            // Para esta HU (login de empleado), retornar error genérico
            throw new AuthException(
                'Credenciales inválidas',
                self::ERROR_INVALID_CREDENTIALS
            );
        }

        // 5. Validar que usuario esté activo y no inhabilitado en PQ_PARTES_USUARIOS
        if (!$empleado->activo || $empleado->inhabilitado) {
            throw new AuthException(
                'Usuario inactivo',
                self::ERROR_USER_INACTIVE
            );
        }

        // 6. Generar token Sanctum asociado al User
        $token = $user->createToken('auth_token')->plainTextToken;

        // 7. Preparar respuesta con todos los campos requeridos
        return [
            'token' => $token,
            'user_data' => [
                'user_id' => $user->id,
                'user_code' => $user->code,
                'tipo_usuario' => 'usuario', // Empleado
                'usuario_id' => $empleado->id,
                'cliente_id' => null, // No es cliente
                'es_supervisor' => (bool) $empleado->supervisor,
                'nombre' => $empleado->nombre,
                'email' => $empleado->email,
            ]
        ];
    }
}

/**
 * Exception: AuthException
 * 
 * Excepción personalizada para errores de autenticación.
 */
class AuthException extends \Exception
{
    /**
     * Código de error personalizado
     */
    protected int $errorCode;

    /**
     * Constructor
     *
     * @param string $message Mensaje de error
     * @param int $errorCode Código de error personalizado
     */
    public function __construct(string $message, int $errorCode)
    {
        parent::__construct($message, 0);
        $this->errorCode = $errorCode;
    }

    /**
     * Obtener código de error personalizado
     *
     * @return int
     */
    public function getErrorCode(): int
    {
        return $this->errorCode;
    }
}
