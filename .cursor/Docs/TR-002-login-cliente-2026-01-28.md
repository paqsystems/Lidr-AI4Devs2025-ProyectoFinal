# TR-002 - Login de Cliente

## Fecha
2026-01-28

## Descripción
Implementación del login de clientes extendiendo el AuthService existente.

## Archivos Modificados

### Backend

#### `backend/app/Services/AuthService.php`
- **Cambio**: Extendido el método `login()` para soportar clientes
- **Nuevos métodos**: 
  - `loginEmpleado()` - Procesa login de empleado
  - `loginCliente()` - Procesa login de cliente
- **Lógica**: Busca primero en `PQ_PARTES_USUARIOS`, si no existe busca en `PQ_PARTES_CLIENTES`

#### `backend/database/seeders/TestUsersSeeder.php`
- **Cambio**: Agregados clientes de prueba
- **Nuevos códigos**:
  - `CLI001` - Cliente activo con acceso
  - `CLIINACTIVO` - Cliente inactivo en PQ_PARTES_CLIENTES
  - `SINPERFIL` - Usuario sin perfil en ninguna tabla

### Tests

#### `backend/tests/Unit/Services/AuthServiceTest.php`
- **Nuevos tests** (6):
  - `login_exitoso_con_cliente`
  - `login_cliente_retorna_es_supervisor_false`
  - `login_cliente_retorna_usuario_id_null`
  - `login_fallido_cliente_inactivo_en_pq_partes_clientes`
  - `login_fallido_usuario_sin_perfil_en_ninguna_tabla`
  - `login_cliente_retorna_todos_los_campos_requeridos`

#### `backend/tests/Feature/Api/V1/Auth/LoginTest.php`
- **Nuevos tests** (6):
  - `login_exitoso_cliente_retorna_200`
  - `login_cliente_retorna_tipo_usuario_cliente`
  - `login_cliente_retorna_es_supervisor_false`
  - `login_cliente_retorna_usuario_id_null_y_cliente_id_valido`
  - `login_fallido_cliente_inactivo_retorna_401_error_4203`
  - `login_cliente_genera_token_valido`

#### `frontend/tests/e2e/auth-login.spec.ts`
- **Nuevos tests** (4):
  - `debe autenticar cliente y redirigir al dashboard`
  - `debe almacenar tipo_usuario cliente en localStorage`
  - `cliente NO debe tener badge de supervisor`
  - `cliente puede hacer logout igual que empleado`

### Documentación

#### `docs/hu-tareas/TR-002(SH)-login-de-cliente.md`
- **Archivo creado**: TR completo con plan de tareas, criterios de aceptación y trazabilidad

#### `docs/backend/autenticacion.md`
- **Cambio**: Agregada documentación del flujo de login de cliente

#### `docs/ia-log.md`
- **Cambio**: Agregada entrada #11 documentando esta implementación

## Decisiones Técnicas

1. **Refactoring del AuthService**: Métodos privados separados para empleado y cliente
2. **Prioridad empleado**: Si existe en ambas tablas, se trata como empleado
3. **Tests idempotentes**: Limpian datos existentes antes de insertar

## Comandos

```bash
# Ejecutar tests de autenticación
php artisan test --filter=Auth

# Seed de usuarios de prueba
php artisan db:seed --class=TestUsersSeeder

# Tests E2E
cd frontend && npm run test:e2e
```

## TR Relacionada
- [TR-002(SH)-login-de-cliente.md](../../docs/hu-tareas/TR-002(SH)-login-de-cliente.md)
