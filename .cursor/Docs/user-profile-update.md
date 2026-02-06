# user-profile-update.md (spec endpoint)

## Ubicación
`specs/endpoints/user-profile-update.md`

## Propósito
Contrato del endpoint **PUT /api/v1/user/profile** para actualizar nombre y email del usuario autenticado (TR-007(SH)).

## Contenido
- Método PUT, ruta /api/v1/user/profile, autenticación Bearer.
- Body: nombre (requerido), email (opcional, único).
- Response 200: resultado con user_code, nombre, email, tipo_usuario, es_supervisor, created_at.
- Errores: 401 no autenticado, 422 validación (nombre vacío, email inválido o duplicado) con resultado.errors.

## Referencias
- TR-007(SH)-edición-de-perfil-de-usuario.md
