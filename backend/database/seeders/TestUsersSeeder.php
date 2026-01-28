<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * Seeder: TestUsersSeeder
 * 
 * Crea usuarios de prueba para tests de autenticación.
 * Incluye usuarios con diferentes estados para cubrir todos los casos de test.
 * 
 * Usuarios creados:
 * - JPEREZ: Empleado activo normal (supervisor=false)
 * - MGARCIA: Empleado activo supervisor (supervisor=true)
 * - INACTIVO: Usuario inactivo en USERS (activo=false)
 * - INHABILITADO: Usuario inhabilitado en USERS (inhabilitado=true)
 * - USUINACTIVO: Usuario activo en USERS pero inactivo en PQ_PARTES_USUARIOS
 * 
 * @see TR-001(MH)-login-de-empleado.md
 */
class TestUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Usuarios de prueba en tabla USERS
        $testUsers = [
            [
                'code' => 'JPEREZ',
                'password' => 'password123',
                'activo' => true,
                'inhabilitado' => false,
            ],
            [
                'code' => 'MGARCIA',
                'password' => 'password456',
                'activo' => true,
                'inhabilitado' => false,
            ],
            [
                'code' => 'INACTIVO',
                'password' => 'password789',
                'activo' => false,
                'inhabilitado' => false,
            ],
            [
                'code' => 'INHABILITADO',
                'password' => 'password000',
                'activo' => true,
                'inhabilitado' => true,
            ],
            [
                'code' => 'USUINACTIVO',
                'password' => 'password111',
                'activo' => true,
                'inhabilitado' => false,
            ],
        ];

        // Insertar usuarios en USERS
        foreach ($testUsers as $user) {
            $exists = DB::table('USERS')
                ->where('code', $user['code'])
                ->exists();
            
            if (!$exists) {
                DB::table('USERS')->insert([
                    'code' => $user['code'],
                    'password_hash' => Hash::make($user['password']),
                    'activo' => $user['activo'],
                    'inhabilitado' => $user['inhabilitado'],
                    'created_at' => DB::raw('GETDATE()'),
                    'updated_at' => DB::raw('GETDATE()'),
                ]);
            }
        }

        // Obtener IDs de los usuarios creados
        $jperezId = DB::table('USERS')->where('code', 'JPEREZ')->value('id');
        $mgarciaId = DB::table('USERS')->where('code', 'MGARCIA')->value('id');
        $inactivoId = DB::table('USERS')->where('code', 'INACTIVO')->value('id');
        $inhabilitadoId = DB::table('USERS')->where('code', 'INHABILITADO')->value('id');
        $usuInactivoId = DB::table('USERS')->where('code', 'USUINACTIVO')->value('id');

        // Empleados de prueba en PQ_PARTES_USUARIOS
        $testEmpleados = [
            [
                'user_id' => $jperezId,
                'code' => 'JPEREZ',
                'nombre' => 'Juan Pérez',
                'email' => 'juan.perez@ejemplo.com',
                'supervisor' => false,
                'activo' => true,
                'inhabilitado' => false,
            ],
            [
                'user_id' => $mgarciaId,
                'code' => 'MGARCIA',
                'nombre' => 'María García',
                'email' => 'maria.garcia@ejemplo.com',
                'supervisor' => true,
                'activo' => true,
                'inhabilitado' => false,
            ],
            [
                'user_id' => $inactivoId,
                'code' => 'INACTIVO',
                'nombre' => 'Usuario Inactivo',
                'email' => 'inactivo@ejemplo.com',
                'supervisor' => false,
                'activo' => false,
                'inhabilitado' => false,
            ],
            [
                'user_id' => $inhabilitadoId,
                'code' => 'INHABILITADO',
                'nombre' => 'Usuario Inhabilitado',
                'email' => 'inhabilitado@ejemplo.com',
                'supervisor' => false,
                'activo' => true,
                'inhabilitado' => true,
            ],
            [
                'user_id' => $usuInactivoId,
                'code' => 'USUINACTIVO',
                'nombre' => 'Usuario Inactivo en Empleados',
                'email' => 'usuinactivo@ejemplo.com',
                'supervisor' => false,
                'activo' => false,
                'inhabilitado' => false,
            ],
        ];

        // Insertar empleados en PQ_PARTES_USUARIOS
        foreach ($testEmpleados as $empleado) {
            if ($empleado['user_id']) {
                $exists = DB::table('PQ_PARTES_USUARIOS')
                    ->where('code', $empleado['code'])
                    ->exists();
                
                if (!$exists) {
                    DB::table('PQ_PARTES_USUARIOS')->insert([
                        'user_id' => $empleado['user_id'],
                        'code' => $empleado['code'],
                        'nombre' => $empleado['nombre'],
                        'email' => $empleado['email'],
                        'supervisor' => $empleado['supervisor'],
                        'activo' => $empleado['activo'],
                        'inhabilitado' => $empleado['inhabilitado'],
                        'created_at' => DB::raw('GETDATE()'),
                        'updated_at' => DB::raw('GETDATE()'),
                    ]);
                }
            }
        }
    }
}
