# Corrección de Tests de Autenticación

**Fecha:** 2026-01-28  
**TR relacionada:** TR-001(MH)-login-de-empleado.md

## Archivos Modificados

### backend/tests/Unit/Services/AuthServiceTest.php

Archivo de tests unitarios para el servicio `AuthService`.

**Cambios realizados:**
- Agregada lógica de limpieza de datos existentes antes de insertar usuarios de prueba
- Esto evita conflictos de `UniqueConstraintViolationException` cuando el `TestUsersSeeder` ya ha insertado usuarios con los mismos códigos

**Códigos de usuarios limpiados:**
- `JPEREZ`, `MGARCIA`, `INACTIVO`, `INHABILITADO`, `USUINACTIVO`

**Tests incluidos (13 total):**
- `login_exitoso_con_empleado_normal`
- `login_exitoso_con_empleado_supervisor`
- `login_fallido_usuario_no_encontrado`
- `login_fallido_contrasena_incorrecta`
- `login_fallido_usuario_inactivo_en_users`
- `login_fallido_usuario_inhabilitado_en_users`
- `login_fallido_usuario_inactivo_en_pq_partes_usuarios`
- `login_genera_token_sanctum_valido`
- `login_retorna_todos_los_campos_requeridos`
- `error_no_revela_si_usuario_existe`
- `logout_revoca_token_del_usuario`
- `logout_sin_token_no_genera_error`
- `logout_solo_revoca_token_actual`

---

### backend/tests/Feature/Api/V1/Auth/LoginTest.php

Archivo de tests de integración para el endpoint `POST /api/v1/auth/login`.

**Cambios realizados:**
- Agregada lógica de limpieza de datos existentes antes de insertar usuarios de prueba

**Códigos de usuarios limpiados:**
- `JPEREZ`, `MGARCIA`, `INACTIVO`, `INHABILITADO`

**Tests incluidos (11 total):**
- `login_exitoso_empleado_normal_retorna_200`
- `login_exitoso_empleado_supervisor_retorna_es_supervisor_true`
- `login_fallido_campo_usuario_vacio_retorna_422_error_1101`
- `login_fallido_campo_password_vacio_retorna_422_error_1103`
- `login_fallido_password_muy_corto_retorna_422_error_1104`
- `login_fallido_credenciales_invalidas_retorna_401_error_3201`
- `login_fallido_usuario_no_existe_retorna_401_error_3201`
- `login_fallido_usuario_inactivo_retorna_401_error_4203`
- `mensaje_error_no_revela_si_usuario_existe`
- `login_exitoso_genera_token_valido`
- `respuesta_tiene_formato_envelope_correcto`

---

### backend/tests/Feature/Api/V1/Auth/LogoutTest.php

Archivo de tests de integración para el endpoint `POST /api/v1/auth/logout`.

**Cambios realizados:**
- Agregada lógica de limpieza de datos existentes antes de insertar usuarios de prueba

**Códigos de usuarios limpiados:**
- `JPEREZ`

**Tests incluidos (7 total):**
- `logout_exitoso_retorna_200`
- `logout_sin_token_retorna_401`
- `logout_revoca_token_en_base_de_datos`
- `logout_con_token_invalido_retorna_401`
- `logout_respuesta_tiene_formato_envelope_correcto`
- `token_usado_para_logout_es_eliminado_de_base_de_datos`
- `logout_solo_revoca_token_actual_no_todos`

---

## Patrón de Limpieza Implementado

```php
protected function seedTestUsers(): void
{
    // 1. Definir códigos de usuarios de prueba
    $testCodes = ['JPEREZ', 'MGARCIA', ...];
    
    // 2. Eliminar de PQ_PARTES_USUARIOS primero (por FK)
    DB::table('PQ_PARTES_USUARIOS')->whereIn('code', $testCodes)->delete();
    
    // 3. Eliminar tokens asociados
    $userIds = DB::table('USERS')->whereIn('code', $testCodes)->pluck('id');
    if ($userIds->isNotEmpty()) {
        DB::table('personal_access_tokens')
            ->where('tokenable_type', 'App\\Models\\User')
            ->whereIn('tokenable_id', $userIds)
            ->delete();
    }
    
    // 4. Eliminar de USERS
    DB::table('USERS')->whereIn('code', $testCodes)->delete();
    
    // 5. Ahora insertar los usuarios de prueba
    // ...
}
```

## Razón del Cambio

Los tests usan `DatabaseTransactions` en lugar de `RefreshDatabase` para mejor rendimiento con SQL Server remoto. Sin embargo, cuando el `TestUsersSeeder` ya ha insertado usuarios con los mismos códigos, los tests fallan con error de clave duplicada.

La solución implementada permite que:
1. Los tests sean **idempotentes** (pueden ejecutarse múltiples veces)
2. Los tests funcionen independientemente del estado de la base de datos
3. Se mantenga el rendimiento de `DatabaseTransactions`
