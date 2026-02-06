# Documentación: `frontend/src/features/auth/components/ForgotPasswordPage.tsx`

## Propósito

Página pública para **solicitar recuperación de contraseña** (TR-004). El usuario ingresa código de usuario o email; al enviar se llama al API POST /api/v1/auth/forgot-password. Por seguridad se muestra siempre un mensaje genérico de éxito (sin revelar si el usuario existe o si se envió correo).

## Uso

- Ruta: `/forgot-password`. Acceso desde el enlace "¿Olvidaste tu contraseña?" en la pantalla de login.
- No requiere autenticación (PublicRoute en App.tsx).

## data-testid

- `forgotPassword.form` – Formulario.
- `forgotPassword.codeOrEmail` – Campo código o email.
- `forgotPassword.submit` – Botón Enviar.
- `forgotPassword.success` – Mensaje de éxito tras enviar.
- `forgotPassword.error` – Mensaje de error.
- `forgotPassword.cancel` – Enlace "Volver al inicio de sesión".

## Archivos relacionados

- `ForgotPasswordPage.css` – Estilos de la página.
- `../services/auth.service.ts` – `forgotPassword(codeOrEmail)`.
- `docs/hu-tareas/TR-004(SH)-recuperación-de-contraseña.md`.
