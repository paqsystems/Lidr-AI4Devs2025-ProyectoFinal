<?php

namespace Tests\Unit\Services;

use App\Models\User;
use App\Models\Usuario;
use App\Services\AuthService;
use App\Services\AuthException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Tests Unitarios: AuthService
 * 
 * Tests del servicio de autenticación cubriendo todos los casos de uso.
 * 
 * @see TR-001(MH)-login-de-empleado.md
 */
class AuthServiceTest extends TestCase
{
    use RefreshDatabase;

    protected AuthService $authService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->authService = new AuthService();
        $this->seedTestUsers();
    }

    /**
     * Crear usuarios de prueba para los tests
     * Usa DB::table con GETDATE() para compatibilidad con SQL Server
     */
    protected function seedTestUsers(): void
    {
        // Usuario activo normal
        DB::table('USERS')->insert([
            'code' => 'JPEREZ',
            'password_hash' => Hash::make('password123'),
            'activo' => true,
            'inhabilitado' => false,
            'created_at' => DB::raw('GETDATE()'),
            'updated_at' => DB::raw('GETDATE()'),
        ]);

        $jperezId = DB::table('USERS')->where('code', 'JPEREZ')->value('id');

        DB::table('PQ_PARTES_USUARIOS')->insert([
            'user_id' => $jperezId,
            'code' => 'JPEREZ',
            'nombre' => 'Juan Pérez',
            'email' => 'juan.perez@ejemplo.com',
            'supervisor' => false,
            'activo' => true,
            'inhabilitado' => false,
            'created_at' => DB::raw('GETDATE()'),
            'updated_at' => DB::raw('GETDATE()'),
        ]);

        // Usuario activo supervisor
        DB::table('USERS')->insert([
            'code' => 'MGARCIA',
            'password_hash' => Hash::make('password456'),
            'activo' => true,
            'inhabilitado' => false,
            'created_at' => DB::raw('GETDATE()'),
            'updated_at' => DB::raw('GETDATE()'),
        ]);

        $mgarciaId = DB::table('USERS')->where('code', 'MGARCIA')->value('id');

        DB::table('PQ_PARTES_USUARIOS')->insert([
            'user_id' => $mgarciaId,
            'code' => 'MGARCIA',
            'nombre' => 'María García',
            'email' => 'maria.garcia@ejemplo.com',
            'supervisor' => true,
            'activo' => true,
            'inhabilitado' => false,
            'created_at' => DB::raw('GETDATE()'),
            'updated_at' => DB::raw('GETDATE()'),
        ]);

        // Usuario inactivo en USERS
        DB::table('USERS')->insert([
            'code' => 'INACTIVO',
            'password_hash' => Hash::make('password789'),
            'activo' => false,
            'inhabilitado' => false,
            'created_at' => DB::raw('GETDATE()'),
            'updated_at' => DB::raw('GETDATE()'),
        ]);

        $inactivoId = DB::table('USERS')->where('code', 'INACTIVO')->value('id');

        DB::table('PQ_PARTES_USUARIOS')->insert([
            'user_id' => $inactivoId,
            'code' => 'INACTIVO',
            'nombre' => 'Usuario Inactivo',
            'email' => 'inactivo@ejemplo.com',
            'supervisor' => false,
            'activo' => true,
            'inhabilitado' => false,
            'created_at' => DB::raw('GETDATE()'),
            'updated_at' => DB::raw('GETDATE()'),
        ]);

        // Usuario inhabilitado en USERS
        DB::table('USERS')->insert([
            'code' => 'INHABILITADO',
            'password_hash' => Hash::make('password000'),
            'activo' => true,
            'inhabilitado' => true,
            'created_at' => DB::raw('GETDATE()'),
            'updated_at' => DB::raw('GETDATE()'),
        ]);

        $inhabilitadoId = DB::table('USERS')->where('code', 'INHABILITADO')->value('id');

        DB::table('PQ_PARTES_USUARIOS')->insert([
            'user_id' => $inhabilitadoId,
            'code' => 'INHABILITADO',
            'nombre' => 'Usuario Inhabilitado',
            'email' => 'inhabilitado@ejemplo.com',
            'supervisor' => false,
            'activo' => true,
            'inhabilitado' => false,
            'created_at' => DB::raw('GETDATE()'),
            'updated_at' => DB::raw('GETDATE()'),
        ]);

        // Usuario con empleado inactivo en PQ_PARTES_USUARIOS
        DB::table('USERS')->insert([
            'code' => 'USUINACTIVO',
            'password_hash' => Hash::make('password111'),
            'activo' => true,
            'inhabilitado' => false,
            'created_at' => DB::raw('GETDATE()'),
            'updated_at' => DB::raw('GETDATE()'),
        ]);

        $usuInactivoId = DB::table('USERS')->where('code', 'USUINACTIVO')->value('id');

        DB::table('PQ_PARTES_USUARIOS')->insert([
            'user_id' => $usuInactivoId,
            'code' => 'USUINACTIVO',
            'nombre' => 'Usuario Inactivo en Empleados',
            'email' => 'usuinactivo@ejemplo.com',
            'supervisor' => false,
            'activo' => false,
            'inhabilitado' => false,
            'created_at' => DB::raw('GETDATE()'),
            'updated_at' => DB::raw('GETDATE()'),
        ]);
    }

    /** @test */
    public function login_exitoso_con_empleado_normal()
    {
        $result = $this->authService->login('JPEREZ', 'password123');

        $this->assertArrayHasKey('token', $result);
        $this->assertArrayHasKey('user_data', $result);
        $this->assertEquals('JPEREZ', $result['user_data']['user_code']);
        $this->assertEquals('usuario', $result['user_data']['tipo_usuario']);
        $this->assertFalse($result['user_data']['es_supervisor']);
        $this->assertEquals('Juan Pérez', $result['user_data']['nombre']);
        $this->assertNull($result['user_data']['cliente_id']);
    }

    /** @test */
    public function login_exitoso_con_empleado_supervisor()
    {
        $result = $this->authService->login('MGARCIA', 'password456');

        $this->assertArrayHasKey('token', $result);
        $this->assertArrayHasKey('user_data', $result);
        $this->assertEquals('MGARCIA', $result['user_data']['user_code']);
        $this->assertEquals('usuario', $result['user_data']['tipo_usuario']);
        $this->assertTrue($result['user_data']['es_supervisor']);
        $this->assertEquals('María García', $result['user_data']['nombre']);
    }

    /** @test */
    public function login_fallido_usuario_no_encontrado()
    {
        $this->expectException(AuthException::class);
        $this->expectExceptionMessage('Credenciales inválidas');

        try {
            $this->authService->login('NOEXISTE', 'cualquierpass');
        } catch (AuthException $e) {
            $this->assertEquals(AuthService::ERROR_INVALID_CREDENTIALS, $e->getErrorCode());
            throw $e;
        }
    }

    /** @test */
    public function login_fallido_contrasena_incorrecta()
    {
        $this->expectException(AuthException::class);
        $this->expectExceptionMessage('Credenciales inválidas');

        try {
            $this->authService->login('JPEREZ', 'contraseñaincorrecta');
        } catch (AuthException $e) {
            $this->assertEquals(AuthService::ERROR_INVALID_CREDENTIALS, $e->getErrorCode());
            throw $e;
        }
    }

    /** @test */
    public function login_fallido_usuario_inactivo_en_users()
    {
        $this->expectException(AuthException::class);
        $this->expectExceptionMessage('Usuario inactivo');

        try {
            $this->authService->login('INACTIVO', 'password789');
        } catch (AuthException $e) {
            $this->assertEquals(AuthService::ERROR_USER_INACTIVE, $e->getErrorCode());
            throw $e;
        }
    }

    /** @test */
    public function login_fallido_usuario_inhabilitado_en_users()
    {
        $this->expectException(AuthException::class);
        $this->expectExceptionMessage('Usuario inactivo');

        try {
            $this->authService->login('INHABILITADO', 'password000');
        } catch (AuthException $e) {
            $this->assertEquals(AuthService::ERROR_USER_INACTIVE, $e->getErrorCode());
            throw $e;
        }
    }

    /** @test */
    public function login_fallido_usuario_inactivo_en_pq_partes_usuarios()
    {
        $this->expectException(AuthException::class);
        $this->expectExceptionMessage('Usuario inactivo');

        try {
            $this->authService->login('USUINACTIVO', 'password111');
        } catch (AuthException $e) {
            $this->assertEquals(AuthService::ERROR_USER_INACTIVE, $e->getErrorCode());
            throw $e;
        }
    }

    /** @test */
    public function login_genera_token_sanctum_valido()
    {
        $result = $this->authService->login('JPEREZ', 'password123');

        $this->assertNotEmpty($result['token']);
        // El token de Sanctum tiene formato "id|token"
        $this->assertStringContainsString('|', $result['token']);
    }

    /** @test */
    public function login_retorna_todos_los_campos_requeridos()
    {
        $result = $this->authService->login('JPEREZ', 'password123');

        $userData = $result['user_data'];

        // Verificar que todos los campos requeridos estén presentes
        $this->assertArrayHasKey('user_id', $userData);
        $this->assertArrayHasKey('user_code', $userData);
        $this->assertArrayHasKey('tipo_usuario', $userData);
        $this->assertArrayHasKey('usuario_id', $userData);
        $this->assertArrayHasKey('cliente_id', $userData);
        $this->assertArrayHasKey('es_supervisor', $userData);
        $this->assertArrayHasKey('nombre', $userData);
        $this->assertArrayHasKey('email', $userData);
    }

    /** @test */
    public function error_no_revela_si_usuario_existe()
    {
        // Intento con usuario que no existe
        try {
            $this->authService->login('NOEXISTE', 'password123');
        } catch (AuthException $e) {
            $messageNoExiste = $e->getMessage();
        }

        // Intento con contraseña incorrecta (usuario sí existe)
        try {
            $this->authService->login('JPEREZ', 'incorrecta12');
        } catch (AuthException $e) {
            $messageIncorrecta = $e->getMessage();
        }

        // Ambos mensajes deben ser idénticos (no revelar si usuario existe)
        $this->assertEquals($messageNoExiste, $messageIncorrecta);
        $this->assertEquals('Credenciales inválidas', $messageNoExiste);
    }
}
