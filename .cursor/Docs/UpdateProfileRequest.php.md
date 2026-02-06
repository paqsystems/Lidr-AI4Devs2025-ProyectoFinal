# UpdateProfileRequest.php

## Ubicación
`backend/app/Http/Requests/User/UpdateProfileRequest.php`

## Propósito
Valida el body de **PUT /api/v1/user/profile** (TR-007(SH) Edición de perfil). Campos: `nombre` (requerido, string min 1 max 255), `email` (opcional, formato email, único excluyendo al usuario actual).

## Contenido
- **authorize():** true si hay usuario autenticado.
- **rules():** nombre required|string|min:1|max:255; email nullable|string|email|max:255 + regla unique (excluye empleado o cliente actual según tipo de usuario).
- **buildEmailUniqueRule($user):** Devuelve `Rule::unique('PQ_PARTES_USUARIOS','email')->ignore($empleado->id)` para empleado, o `Rule::unique('PQ_PARTES_CLIENTES','email')->ignore($cliente->id)` para cliente. Tipo de retorno: `ValidationRule|Unique`.
- **failedValidation():** Responde 422 con error 1000 y `resultado.errors` por campo.

## Referencias
- TR-007(SH)-edición-de-perfil-de-usuario.md
