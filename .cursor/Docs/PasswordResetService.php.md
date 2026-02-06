# Documentación: `backend/app/Services/PasswordResetService.php`

## Propósito

Servicio de **recuperación de contraseña** (forgot/reset) para TR-004. Busca usuario por código (USERS.code) o por email (PQ_PARTES_USUARIOS / PQ_PARTES_CLIENTES); si tiene email genera token, lo guarda en `password_reset_tokens` y envía correo. Restablece contraseña validando token (un solo uso, expiración 1 h).

## Métodos públicos

- **requestReset(string $codeOrEmail): void** – No lanza; si el usuario existe y tiene email, genera token, guarda y envía ResetPasswordMail. Respuesta genérica la maneja el controlador.
- **resetPassword(string $token, string $password): void** – Valida token, actualiza password_hash en USERS, borra token. Lanza `AuthException` con códigos 3205 (inválido/expirado), 3206 (expirado), 1104 (contraseña corta).

## Constantes

- `TOKEN_EXPIRATION_MINUTES = 60`.

## Tabla

- `password_reset_tokens`: email (PK), token, created_at. Se reemplaza la fila por email en cada nueva solicitud.

## Archivos relacionados

- `app/Http/Controllers/Api/V1/AuthController.php` – forgotPassword(), resetPassword().
- `app/Mail/ResetPasswordMail.php`, `resources/views/emails/reset-password.blade.php`.
- `docs/hu-tareas/TR-004(SH)-recuperación-de-contraseña.md`.
