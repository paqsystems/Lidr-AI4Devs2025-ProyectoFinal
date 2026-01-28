# Documentación de Autenticación

## Descripción General

El sistema utiliza autenticación basada en tokens mediante Laravel Sanctum. La autenticación se realiza contra la tabla centralizada `USERS`, y luego se determina si el usuario es un empleado (en `PQ_PARTES_USUARIOS`) o un cliente (en `PQ_PARTES_CLIENTES`).

## Flujo de Autenticación

### 1. Login de Empleado

```
POST /api/v1/auth/login
```

**Flujo interno:**
1. Validar campos de entrada (usuario, password)
2. Buscar usuario en tabla `USERS` por `code`
3. Validar estado activo y no inhabilitado en `USERS`
4. Verificar contraseña con `Hash::check()`
5. Buscar empleado en `PQ_PARTES_USUARIOS` por `code`
6. Validar estado activo y no inhabilitado en `PQ_PARTES_USUARIOS`
7. Generar token Sanctum
8. Retornar token y datos del usuario

### 2. Diagrama de Secuencia

```
Cliente          API              AuthService        USERS        PQ_PARTES_USUARIOS
   |               |                   |               |               |
   |--- POST /login -->|               |               |               |
   |               |--- validate() --->|               |               |
   |               |                   |--- find() --->|               |
   |               |                   |<-- user ------|               |
   |               |                   |--- check() -->|               |
   |               |                   |               |--- find() --->|
   |               |                   |               |<-- empleado --|
   |               |                   |<- token ------|               |
   |<-- 200 OK ----|                   |               |               |
```

## Endpoint de Login

### Request

```http
POST /api/v1/auth/login
Content-Type: application/json
Accept: application/json

{
  "usuario": "JPEREZ",
  "password": "password123"
}
```

### Response Exitosa (200 OK)

```json
{
  "error": 0,
  "respuesta": "Autenticación exitosa",
  "resultado": {
    "token": "1|abcdef1234567890abcdef1234567890",
    "user": {
      "user_id": 1,
      "user_code": "JPEREZ",
      "tipo_usuario": "usuario",
      "usuario_id": 5,
      "cliente_id": null,
      "es_supervisor": false,
      "nombre": "Juan Pérez",
      "email": "juan.perez@ejemplo.com"
    }
  }
}
```

### Códigos de Error

| Código | HTTP | Descripción |
|--------|------|-------------|
| 1101 | 422 | Código de usuario requerido |
| 1102 | 422 | Código de usuario no puede estar vacío |
| 1103 | 422 | Contraseña requerida |
| 1104 | 422 | Contraseña muy corta (mínimo 8 caracteres) |
| 3201 | 401 | Credenciales inválidas |
| 4203 | 401 | Usuario inactivo |
| 9999 | 500 | Error inesperado del servidor |

## Uso del Token

### En Frontend

```typescript
// Guardar token después del login
import { setToken } from '@/shared/utils/tokenStorage';
setToken(response.resultado.token);

// Obtener token para requests
import { getToken } from '@/shared/utils/tokenStorage';
const token = getToken();
```

### En Requests Subsiguientes

```http
GET /api/v1/protected-endpoint
Authorization: Bearer 1|abcdef1234567890abcdef1234567890
```

## Seguridad

### Mensajes de Error Genéricos

El sistema **NO revela** si un usuario existe o no. Tanto para "usuario no encontrado" como para "contraseña incorrecta", se retorna el mismo mensaje:

```json
{
  "error": 3201,
  "respuesta": "Credenciales inválidas"
}
```

### Validación de Estados

Se validan dos niveles de estado:
1. **En tabla USERS:** `activo = true` AND `inhabilitado = false`
2. **En tabla PQ_PARTES_USUARIOS:** `activo = true` AND `inhabilitado = false`

Si alguno falla, se retorna error 4203 (Usuario inactivo).

## Estructura de Archivos

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/V1/
│   │   │   └── AuthController.php
│   │   ├── Requests/Auth/
│   │   │   └── LoginRequest.php
│   │   └── Resources/Auth/
│   │       └── LoginResource.php
│   └── Services/
│       └── AuthService.php
├── routes/
│   └── api.php
└── tests/
    ├── Feature/Api/V1/Auth/
    │   └── LoginTest.php
    └── Unit/Services/
        └── AuthServiceTest.php
```

## Tests

### Ejecutar Tests de Autenticación

```bash
# Unit tests del servicio
php artisan test tests/Unit/Services/AuthServiceTest.php

# Integration tests del endpoint
php artisan test tests/Feature/Api/V1/Auth/LoginTest.php

# Todos los tests
php artisan test
```

## Referencias

- [TR-001(MH) - Login de Empleado](../hu-tareas/TR-001(MH)-login-de-empleado.md)
- [Laravel Sanctum Documentation](https://laravel.com/docs/10.x/sanctum)
