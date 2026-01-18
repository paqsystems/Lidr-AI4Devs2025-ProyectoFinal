# Endpoint: Autenticación de Usuario

## Información General

- **Método:** `POST`
- **Ruta:** `/api/v1/auth/login`
- **Autenticación:** No requerida (endpoint público)
- **Versión:** v1

---

## Descripción

Autentica un usuario en el sistema mediante código y contraseña. Si las credenciales son válidas, genera un token de acceso que debe ser utilizado en todas las solicitudes subsiguientes.

Nota:
Este mecanismo de autenticación utiliza código de usuario en lugar de correo electrónico, por decisión de diseño.
Esta elección refleja el uso previsto del sistema en contextos internos o empresariales.

---

## Request

### Headers

```
Content-Type: application/json
Accept: application/json
```

### Body

```json
{
  "usuario": "JPEREZ",
  "password": "contraseña123"
}
```

### Parámetros

| Campo | Tipo | Requerido | Descripción | Validaciones |
|-------|------|-----------|-------------|--------------|
| `usuario` | string | Sí | code del usuario | no vacío y existente en tabla (1102) |
| `password` | string | Sí | Contraseña del usuario | No vacía (1103), mínimo 8 caracteres (1104) |

---

## Response

### Success (200 OK)

```json
{
  "error": 0,
  "respuesta": "Autenticación exitosa",
  "resultado": {
    "token": "1|abcdef1234567890abcdef1234567890",
    "user": {
      "id": 1,
      "code" : "JPEREZ",
      "nombre": "Juan Pérez",
      "email": "usuario@ejemplo.com"
    }
  }
}
```

### Campos de Respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `error` | integer | Código de error (0 = éxito) |
| `respuesta` | string | Mensaje legible para el usuario |
| `resultado.token` | string | Token de autenticación (Sanctum) |
| `resultado.user.id` | integer | ID del usuario |
| `resultado.user.code` | string | Código del usuario |
| `resultado.user.nombre` | string | Nombre completo del usuario |
| `resultado.user.email` | string | Email del usuario |

---

## Errores

### 422 Unprocessable Entity - Validación

```json
{
  "error": 1102,
  "respuesta": "El código de usuario no puede estar vacío",
  "resultado": {
    "errors": {
      "usuario": ["El código de usuario no puede estar vacío"]
    }
  }
}
```

**Códigos de error posibles:**
- `1101`: Código de usuario requerido
- `1102`: Código de usuario no puede estar vacío
- `1103`: Contraseña requerida
- `1104`: Contraseña muy corta

### 401 Unauthorized - Credenciales Inválidas

```json
{
  "error": 3201,
  "respuesta": "Credenciales inválidas",
  "resultado": null
}
```

**Códigos de error posibles:**
- `3201`: Credenciales inválidas
- `3202`: Usuario no encontrado
- `3203`: Contraseña incorrecta
- `4203`: Usuario inactivo

### 500 Internal Server Error

```json
{
  "error": 9999,
  "respuesta": "Error inesperado del servidor",
  "resultado": null
}
```

---

## Validaciones

### A Nivel de Request

1. **usuario:**
   - Debe estar presente (1101)
   - no debe estar vacío (1102)

2. **Contraseña:**
   - Debe estar presente (1103)
   - Debe tener al menos 8 caracteres (1104)

### A Nivel de Negocio

1. **Usuario debe existir:**
   - Buscar usuario por code en `PQ_PARTES_usuario`
   - Si no existe: Error 3202

2. **Usuario debe estar activo y no inhabilitado:**
   - Verificar campo `activo = true`
   - Verificar campo `inhabilitado = false`
   - Si está inactivo o inhabilitado: Error 4203

3. **Contraseña debe coincidir:**
   - Verificar hash con `Hash::check()`
   - Si no coincide: Error 3203

---

## Operaciones de Base de Datos

### Tablas Involucradas

- `PQ_PARTES_usuario`

### Consultas

```php
// 1. Buscar usuario por code
$usuario = Usuario::where('code', $code)
    ->where('activo', true)
    ->where('inhabilitado', false)
    ->first();

// 2. Verificar contraseña
if (!$usuario || !Hash::check($password, $usuario->password_hash)) {
    throw new AuthenticationException();
}

// 3. Actualizar último login (opcional)
$usuario->last_login_at = now();
$usuario->save();

// 4. Generar token
$token = $usuario->createToken('auth-token')->plainTextToken;
```

### Índices Utilizados

- `idx_usuario_code` (UNIQUE) - Búsqueda por código de usuario
- `idx_usuario_activo` - Filtro de usuarios activos

---

## Seguridad

### Consideraciones

1. **Nunca exponer:**
   - `password_hash` en ninguna respuesta
   - Detalles internos del sistema en mensajes de error

2. **Rate Limiting:**
   - Aplicar límite de intentos de login por IP
   - Bloquear temporalmente después de múltiples intentos fallidos

3. **Tokens:**
   - Tokens generados con Laravel Sanctum
   - Expiración configurable
   - Tokens almacenados de forma segura

---

## Ejemplos de Uso

### cURL

```bash
curl -X POST https://api.ejemplo.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "usuario": "JPEREZ",
    "password": "contraseña123"
  }'
```

### JavaScript (Fetch)

```javascript
const response = await fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    usuario: 'JPEREZ',
    password: 'contraseña123'
  })
});

const data = await response.json();

if (data.error === 0) {
  // Guardar token
  localStorage.setItem('token', data.resultado.token);
  // Redirigir al dashboard
}
```

---

## Notas

- Este es el único endpoint público que no requiere autenticación
- El token recibido debe incluirse en el header `Authorization: Bearer {token}` en todas las solicitudes subsiguientes
- Los tokens pueden revocarse desde el backend
- Se recomienda implementar refresh tokens para aplicaciones de larga duración

---

**Última actualización:** 2025-01-20

