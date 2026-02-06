# ChangePasswordTest.php

## Ubicación
`backend/tests/Feature/Api/V1/Auth/ChangePasswordTest.php`

## Propósito
Tests de integración para el endpoint **POST /api/v1/auth/change-password** (TR-005(SH) Cambio de contraseña).

## Contenido
- **seedTestUsers():** Crea usuario JPEREZ con password123 en USERS y PQ_PARTES_USUARIOS; limpia tokens y registros previos.
- **change_password_exitoso_retorna_200:** Usuario autenticado con Sanctum envía current_password, password y password_confirmation válidos → 200 y mensaje "Contraseña actualizada correctamente."
- **change_password_sin_token_retorna_401:** POST sin token → 401.
- **change_password_contrasena_actual_incorrecta_retorna_422:** Contraseña actual incorrecta → 422 y mensaje "La contraseña actual es incorrecta".
- **change_password_confirmacion_no_coincide_retorna_422:** password ≠ password_confirmation → 422.
- **change_password_nueva_contrasena_corta_retorna_422:** Nueva contraseña &lt; 8 caracteres → 422.
- **change_password_exitoso_actualiza_hash_en_base_de_datos:** Tras 200, verifica con Hash::check que el usuario tiene la nueva contraseña en BD.

## Ejecución
```bash
cd backend && php artisan test tests/Feature/Api/V1/Auth/ChangePasswordTest.php
```

## Dependencias
- DatabaseTransactions, Sanctum, User, Hash.
- Usuario JPEREZ debe poder crearse en USERS/PQ_PARTES_USUARIOS (tablas existentes).
