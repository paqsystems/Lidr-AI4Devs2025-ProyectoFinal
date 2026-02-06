# profile-change-password.spec.ts

## Ubicación
`frontend/tests/e2e/profile-change-password.spec.ts`

## Propósito
Tests E2E con Playwright para el flujo de **cambio de contraseña** desde perfil (TR-005(SH)).

## Contenido
- **test.describe.serial:** Los tres tests se ejecutan en orden para no dejar al usuario JPEREZ con contraseña distinta de la esperada por otros E2E.
- **debe cambiar contraseña correctamente y mostrar mensaje de éxito:** Login JPEREZ/password123 → Perfil → "Cambiar contraseña" → formulario con contraseña actual correcta, nueva y confirmación → enviar → comprobar mensaje de éxito (profile.changePassword.success). Deja a JPEREZ con nuevaContraseña456.
- **debe mostrar error cuando la contraseña actual es incorrecta:** Login JPEREZ/nuevaContraseña456 → Perfil → "Cambiar contraseña" → contraseña actual incorrecta, nueva y confirmación válidas → enviar → comprobar mensaje de error (profile.changePassword.error).
- **restaura contraseña original para no afectar otros E2E:** Login JPEREZ/nuevaContraseña456 → Perfil → cambiar contraseña de nuevaContraseña456 a password123 → éxito. Deja a JPEREZ con password123 para auth-login y user-profile.

## Data-testid usados
- auth.login.*, app.profileLink, user.profile.container
- profile.changePasswordLink, profile.changePassword.form, profile.currentPassword, profile.newPassword, profile.newPasswordConfirm
- profile.changePasswordSubmit, profile.changePassword.success, profile.changePassword.error

## Requisitos
- Backend y frontend en ejecución (p. ej. backend en puerto 8000, frontend en 3000).
- Usuario JPEREZ con contraseña password123 en la BD (p. ej. seeder TestUsersSeeder o equivalente).

## Ejecución
```bash
cd frontend && npx playwright test tests/e2e/profile-change-password.spec.ts
```
