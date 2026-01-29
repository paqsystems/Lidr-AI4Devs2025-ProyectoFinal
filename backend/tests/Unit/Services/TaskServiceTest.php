<?php

namespace Tests\Unit\Services;

use App\Models\User;
use App\Models\Usuario;
use App\Models\Cliente;
use App\Models\TipoTarea;
use App\Models\RegistroTarea;
use App\Models\ClienteTipoTarea;
use App\Services\TaskService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Tests Unitarios: TaskService
 * 
 * Tests del servicio de creación de tareas cubriendo todos los casos de negocio.
 * Usa DatabaseTransactions para mejor rendimiento con SQL Server remoto.
 * 
 * @see TR-028(MH)-carga-de-tarea-diaria.md
 */
class TaskServiceTest extends TestCase
{
    use DatabaseTransactions;

    protected TaskService $taskService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->taskService = new TaskService();
        $this->seedTestData();
    }

    /**
     * Crear datos de prueba para los tests
     */
    protected function seedTestData(): void
    {
        // Limpiar datos existentes
        $testCodes = ['JPEREZ', 'MGARCIA', 'CLI001', 'CLI002', 'CLIINACTIVO'];
        
        // Eliminar registros de tarea de prueba
        $clienteIds = DB::table('PQ_PARTES_CLIENTES')->whereIn('code', $testCodes)->pluck('id');
        $usuarioIds = DB::table('PQ_PARTES_USUARIOS')->whereIn('code', $testCodes)->pluck('id');
        
        if ($clienteIds->isNotEmpty()) {
            DB::table('PQ_PARTES_REGISTRO_TAREA')->whereIn('cliente_id', $clienteIds)->delete();
            DB::table('PQ_PARTES_CLIENTE_TIPO_TAREA')->whereIn('cliente_id', $clienteIds)->delete();
        }
        
        DB::table('PQ_PARTES_USUARIOS')->whereIn('code', $testCodes)->delete();
        DB::table('PQ_PARTES_CLIENTES')->whereIn('code', $testCodes)->delete();
        
        $userIds = DB::table('USERS')->whereIn('code', $testCodes)->pluck('id');
        if ($userIds->isNotEmpty()) {
            DB::table('personal_access_tokens')
                ->where('tokenable_type', 'App\\Models\\User')
                ->whereIn('tokenable_id', $userIds)
                ->delete();
        }
        
        DB::table('USERS')->whereIn('code', $testCodes)->delete();

        // Obtener tipo de cliente
        $tipoClienteId = DB::table('PQ_PARTES_TIPOS_CLIENTE')->where('code', 'CORP')->value('id');
        if (!$tipoClienteId) {
            $tipoClienteId = DB::table('PQ_PARTES_TIPOS_CLIENTE')->first()?->id;
        }

        // Crear usuarios empleados
        DB::table('USERS')->insert([
            'code' => 'JPEREZ',
            'password_hash' => Hash::make('password123'),
            'activo' => true,
            'inhabilitado' => false,
            'created_at' => DB::raw('GETDATE()'),
            'updated_at' => DB::raw('GETDATE()'),
        ]);
        $jperezUserId = DB::table('USERS')->where('code', 'JPEREZ')->value('id');
        
        DB::table('PQ_PARTES_USUARIOS')->insert([
            'user_id' => $jperezUserId,
            'code' => 'JPEREZ',
            'nombre' => 'Juan Pérez',
            'email' => 'juan.perez@ejemplo.com',
            'supervisor' => false,
            'activo' => true,
            'inhabilitado' => false,
            'created_at' => DB::raw('GETDATE()'),
            'updated_at' => DB::raw('GETDATE()'),
        ]);

        DB::table('USERS')->insert([
            'code' => 'MGARCIA',
            'password_hash' => Hash::make('password456'),
            'activo' => true,
            'inhabilitado' => false,
            'created_at' => DB::raw('GETDATE()'),
            'updated_at' => DB::raw('GETDATE()'),
        ]);
        $mgarciaUserId = DB::table('USERS')->where('code', 'MGARCIA')->value('id');
        
        DB::table('PQ_PARTES_USUARIOS')->insert([
            'user_id' => $mgarciaUserId,
            'code' => 'MGARCIA',
            'nombre' => 'María García',
            'email' => 'maria.garcia@ejemplo.com',
            'supervisor' => true,
            'activo' => true,
            'inhabilitado' => false,
            'created_at' => DB::raw('GETDATE()'),
            'updated_at' => DB::raw('GETDATE()'),
        ]);

        // Crear clientes
        if ($tipoClienteId) {
            DB::table('USERS')->insert([
                'code' => 'CLI001',
                'password_hash' => Hash::make('cliente123'),
                'activo' => true,
                'inhabilitado' => false,
                'created_at' => DB::raw('GETDATE()'),
                'updated_at' => DB::raw('GETDATE()'),
            ]);
            $cli001UserId = DB::table('USERS')->where('code', 'CLI001')->value('id');
            
            DB::table('PQ_PARTES_CLIENTES')->insert([
                'user_id' => $cli001UserId,
                'code' => 'CLI001',
                'nombre' => 'Empresa ABC S.A.',
                'email' => 'contacto@empresaabc.com',
                'tipo_cliente_id' => $tipoClienteId,
                'activo' => true,
                'inhabilitado' => false,
                'created_at' => DB::raw('GETDATE()'),
                'updated_at' => DB::raw('GETDATE()'),
            ]);

            DB::table('USERS')->insert([
                'code' => 'CLI002',
                'password_hash' => Hash::make('cliente002'),
                'activo' => true,
                'inhabilitado' => false,
                'created_at' => DB::raw('GETDATE()'),
                'updated_at' => DB::raw('GETDATE()'),
            ]);
            $cli002UserId = DB::table('USERS')->where('code', 'CLI002')->value('id');
            
            DB::table('PQ_PARTES_CLIENTES')->insert([
                'user_id' => $cli002UserId,
                'code' => 'CLI002',
                'nombre' => 'Corporación XYZ',
                'email' => 'contacto@corporacionxyz.com',
                'tipo_cliente_id' => $tipoClienteId,
                'activo' => true,
                'inhabilitado' => false,
                'created_at' => DB::raw('GETDATE()'),
                'updated_at' => DB::raw('GETDATE()'),
            ]);

            DB::table('USERS')->insert([
                'code' => 'CLIINACTIVO',
                'password_hash' => Hash::make('cliente456'),
                'activo' => true,
                'inhabilitado' => false,
                'created_at' => DB::raw('GETDATE()'),
                'updated_at' => DB::raw('GETDATE()'),
            ]);
            $cliInactivoUserId = DB::table('USERS')->where('code', 'CLIINACTIVO')->value('id');
            
            DB::table('PQ_PARTES_CLIENTES')->insert([
                'user_id' => $cliInactivoUserId,
                'code' => 'CLIINACTIVO',
                'nombre' => 'Cliente Inactivo S.R.L.',
                'email' => 'contacto@clienteinactivo.com',
                'tipo_cliente_id' => $tipoClienteId,
                'activo' => false,
                'inhabilitado' => false,
                'created_at' => DB::raw('GETDATE()'),
                'updated_at' => DB::raw('GETDATE()'),
            ]);
        }

        // Crear tipos de tarea
        $desarrolloId = DB::table('PQ_PARTES_TIPOS_TAREA')->where('code', 'DESARROLLO')->value('id');
        if (!$desarrolloId) {
            DB::table('PQ_PARTES_TIPOS_TAREA')->insert([
                'code' => 'DESARROLLO',
                'descripcion' => 'Desarrollo de Software',
                'is_generico' => true,
                'is_default' => false,
                'activo' => true,
                'inhabilitado' => false,
                'created_at' => DB::raw('GETDATE()'),
                'updated_at' => DB::raw('GETDATE()'),
            ]);
        } else {
            // Asegurar que sea genérico
            DB::table('PQ_PARTES_TIPOS_TAREA')
                ->where('id', $desarrolloId)
                ->update(['is_generico' => true]);
        }

        $especialId = DB::table('PQ_PARTES_TIPOS_TAREA')->where('code', 'ESPECIAL')->value('id');
        if (!$especialId) {
            DB::table('PQ_PARTES_TIPOS_TAREA')->insert([
                'code' => 'ESPECIAL',
                'descripcion' => 'Tarea Especial para Cliente',
                'is_generico' => false,
                'is_default' => false,
                'activo' => true,
                'inhabilitado' => false,
                'created_at' => DB::raw('GETDATE()'),
                'updated_at' => DB::raw('GETDATE()'),
            ]);
        }

        // Crear asignación ClienteTipoTarea (CLI001 → ESPECIAL)
        $cli001Id = DB::table('PQ_PARTES_CLIENTES')->where('code', 'CLI001')->value('id');
        $especialId = DB::table('PQ_PARTES_TIPOS_TAREA')->where('code', 'ESPECIAL')->value('id');
        
        if ($cli001Id && $especialId) {
            $asignacionExists = DB::table('PQ_PARTES_CLIENTE_TIPO_TAREA')
                ->where('cliente_id', $cli001Id)
                ->where('tipo_tarea_id', $especialId)
                ->exists();
            
            if (!$asignacionExists) {
                DB::table('PQ_PARTES_CLIENTE_TIPO_TAREA')->insert([
                    'cliente_id' => $cli001Id,
                    'tipo_tarea_id' => $especialId,
                    'created_at' => DB::raw('GETDATE()'),
                    'updated_at' => DB::raw('GETDATE()'),
                ]);
            }
        }
    }

    /**
     * Test: Crear tarea exitosamente con datos válidos
     */
    public function test_create_task_success(): void
    {
        $user = User::where('code', 'JPEREZ')->first();
        $cliente = Cliente::where('code', 'CLI001')->first();
        $tipoTarea = TipoTarea::where('code', 'DESARROLLO')->first();

        $datos = [
            'fecha' => '2026-01-28',
            'cliente_id' => $cliente->id,
            'tipo_tarea_id' => $tipoTarea->id,
            'duracion_minutos' => 120,
            'sin_cargo' => false,
            'presencial' => true,
            'observacion' => 'Desarrollo de feature X',
        ];

        $resultado = $this->taskService->createTask($datos, $user);

        $this->assertIsArray($resultado);
        $this->assertArrayHasKey('id', $resultado);
        $this->assertEquals($datos['fecha'], $resultado['fecha']);
        $this->assertEquals($datos['duracion_minutos'], $resultado['duracion_minutos']);
        $this->assertEquals($datos['observacion'], $resultado['observacion']);

        // Verificar que se creó en la BD
        $registro = RegistroTarea::find($resultado['id']);
        $this->assertNotNull($registro);
        $this->assertEquals($user->id, Usuario::find($registro->usuario_id)->user_id);
    }

    /**
     * Test: Validar que cliente esté activo
     */
    public function test_create_task_validates_cliente_activo(): void
    {
        $user = User::where('code', 'JPEREZ')->first();
        $clienteInactivo = Cliente::where('code', 'CLIINACTIVO')->first();
        $tipoTarea = TipoTarea::where('code', 'DESARROLLO')->first();

        $datos = [
            'fecha' => '2026-01-28',
            'cliente_id' => $clienteInactivo->id,
            'tipo_tarea_id' => $tipoTarea->id,
            'duracion_minutos' => 120,
            'observacion' => 'Test',
        ];

        $this->expectException(\Exception::class);
        $this->expectExceptionCode(TaskService::ERROR_CLIENTE_INACTIVO);
        
        $this->taskService->createTask($datos, $user);
    }

    /**
     * Test: Validar tipo genérico
     */
    public function test_create_task_validates_tipo_tarea_generico(): void
    {
        $user = User::where('code', 'JPEREZ')->first();
        $cliente = Cliente::where('code', 'CLI001')->first();
        $tipoGenerico = TipoTarea::where('code', 'DESARROLLO')->first();

        $datos = [
            'fecha' => '2026-01-28',
            'cliente_id' => $cliente->id,
            'tipo_tarea_id' => $tipoGenerico->id,
            'duracion_minutos' => 120,
            'observacion' => 'Test',
        ];

        $resultado = $this->taskService->createTask($datos, $user);
        $this->assertIsArray($resultado);
    }

    /**
     * Test: Validar tipo asignado al cliente
     */
    public function test_create_task_validates_tipo_tarea_asignado(): void
    {
        $user = User::where('code', 'JPEREZ')->first();
        $cliente = Cliente::where('code', 'CLI001')->first();
        $tipoEspecial = TipoTarea::where('code', 'ESPECIAL')->first();

        $datos = [
            'fecha' => '2026-01-28',
            'cliente_id' => $cliente->id,
            'tipo_tarea_id' => $tipoEspecial->id,
            'duracion_minutos' => 120,
            'observacion' => 'Test',
        ];

        $resultado = $this->taskService->createTask($datos, $user);
        $this->assertIsArray($resultado);
    }

    /**
     * Test: Validar tramos de 15 minutos
     */
    public function test_create_task_validates_duracion_multiplo_15(): void
    {
        // Esta validación se hace en el FormRequest, pero verificamos que el servicio
        // maneja correctamente valores válidos
        $user = User::where('code', 'JPEREZ')->first();
        $cliente = Cliente::where('code', 'CLI001')->first();
        $tipoTarea = TipoTarea::where('code', 'DESARROLLO')->first();

        $datos = [
            'fecha' => '2026-01-28',
            'cliente_id' => $cliente->id,
            'tipo_tarea_id' => $tipoTarea->id,
            'duracion_minutos' => 90, // Múltiplo de 15
            'observacion' => 'Test',
        ];

        $resultado = $this->taskService->createTask($datos, $user);
        $this->assertEquals(90, $resultado['duracion_minutos']);
    }

    /**
     * Test: Validar máximo 1440 minutos
     */
    public function test_create_task_validates_duracion_maxima(): void
    {
        // Esta validación se hace en el FormRequest
        // El servicio debe aceptar 1440 minutos
        $user = User::where('code', 'JPEREZ')->first();
        $cliente = Cliente::where('code', 'CLI001')->first();
        $tipoTarea = TipoTarea::where('code', 'DESARROLLO')->first();

        $datos = [
            'fecha' => '2026-01-28',
            'cliente_id' => $cliente->id,
            'tipo_tarea_id' => $tipoTarea->id,
            'duracion_minutos' => 1440,
            'observacion' => 'Test',
        ];

        $resultado = $this->taskService->createTask($datos, $user);
        $this->assertEquals(1440, $resultado['duracion_minutos']);
    }

    /**
     * Test: Supervisor asigna a otro empleado
     */
    public function test_create_task_supervisor_asigna_otro_empleado(): void
    {
        $supervisor = User::where('code', 'MGARCIA')->first();
        $empleado = Usuario::where('code', 'JPEREZ')->first();
        $cliente = Cliente::where('code', 'CLI001')->first();
        $tipoTarea = TipoTarea::where('code', 'DESARROLLO')->first();

        $datos = [
            'fecha' => '2026-01-28',
            'cliente_id' => $cliente->id,
            'tipo_tarea_id' => $tipoTarea->id,
            'duracion_minutos' => 120,
            'observacion' => 'Test',
            'usuario_id' => $empleado->id,
        ];

        $resultado = $this->taskService->createTask($datos, $supervisor);
        
        $this->assertIsArray($resultado);
        $this->assertEquals($empleado->id, $resultado['usuario_id']);
    }

    /**
     * Test: Empleado solo puede asignar para sí mismo
     */
    public function test_create_task_empleado_solo_para_si_mismo(): void
    {
        $user = User::where('code', 'JPEREZ')->first();
        $empleado = Usuario::where('code', 'JPEREZ')->first();
        $cliente = Cliente::where('code', 'CLI001')->first();
        $tipoTarea = TipoTarea::where('code', 'DESARROLLO')->first();

        $datos = [
            'fecha' => '2026-01-28',
            'cliente_id' => $cliente->id,
            'tipo_tarea_id' => $tipoTarea->id,
            'duracion_minutos' => 120,
            'observacion' => 'Test',
            // No se proporciona usuario_id, debe asignarse al autenticado
        ];

        $resultado = $this->taskService->createTask($datos, $user);
        
        $this->assertIsArray($resultado);
        $this->assertEquals($empleado->id, $resultado['usuario_id']);
    }

    /**
     * Test: Empleado no puede asignar a otro
     */
    public function test_create_task_empleado_intenta_asignar_otro_falla(): void
    {
        $user = User::where('code', 'JPEREZ')->first();
        $otroEmpleado = Usuario::where('code', 'MGARCIA')->first();
        $cliente = Cliente::where('code', 'CLI001')->first();
        $tipoTarea = TipoTarea::where('code', 'DESARROLLO')->first();

        $datos = [
            'fecha' => '2026-01-28',
            'cliente_id' => $cliente->id,
            'tipo_tarea_id' => $tipoTarea->id,
            'duracion_minutos' => 120,
            'observacion' => 'Test',
            'usuario_id' => $otroEmpleado->id,
        ];

        $this->expectException(\Exception::class);
        $this->expectExceptionCode(TaskService::ERROR_FORBIDDEN);
        
        $this->taskService->createTask($datos, $user);
    }
}
