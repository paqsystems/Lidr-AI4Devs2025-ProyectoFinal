# Documentación: `frontend/src/features/auth/components/ResetPasswordPage.tsx`

## Propósito

Página pública para **restablecer la contraseña** con el token recibido por email (TR-004). El token se lee de la query `/reset-password?token=...`. Formulario con nueva contraseña y confirmación; al enviar se llama POST /api/v1/auth/reset-password. Tras éxito se muestra mensaje y enlace a login.

## Uso

- Ruta: `/reset-password` (con query `?token=...`). Acceso desde el enlace del correo de recuperación.
- Si no hay token en la URL se muestra mensaje y enlaces a "Solicitar recuperación" y "Volver al login".

## data-testid

- `resetPassword.form` – Formulario.
- `resetPassword.password` – Campo nueva contraseña.
- `resetPassword.passwordConfirm` – Campo confirmación.
- `resetPassword.submit` – Botón Guardar.
- `resetPassword.success` – Mensaje de éxito.
- `resetPassword.error` – Mensaje de error.
- `resetPassword.requestAgain` – Enlace solicitar recuperación (cuando no hay token).
- `resetPassword.goToLogin` – Enlace a login tras éxito.

## Archivos relacionados

- `ResetPasswordPage.css` – Estilos.
- `../services/auth.service.ts` – `resetPassword(token, password, passwordConfirmation)`.
- `docs/hu-tareas/TR-004(SH)-recuperación-de-contraseña.md`.
