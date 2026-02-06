# Documentación: `frontend/tests/e2e/auth-forgot-password.spec.ts`

## Propósito

Tests E2E con Playwright para el flujo de **recuperación de contraseña** (TR-004): enlace desde login a /forgot-password, envío del formulario con código y mensaje genérico de éxito; página reset-password sin token muestra mensaje y enlace a solicitar recuperación.

## Casos

1. **Enlace "¿Olvidaste tu contraseña?"** lleva a /forgot-password y se ve el formulario.
2. **Formulario forgot:** rellenar código (ej. JPEREZ), enviar; esperar 200 del API y mensaje de éxito (`forgotPassword.success`).
3. **Reset sin token:** ir a /reset-password sin query; ver mensaje "No se encontró un enlace válido" y `resetPassword.requestAgain`.

## Ejecución

```bash
cd frontend && npm run test:e2e -- tests/e2e/auth-forgot-password.spec.ts
```

## Referencias

- `docs/hu-tareas/TR-004(SH)-recuperación-de-contraseña.md`
- Selectores por data-testid (auth.forgotPasswordLink, forgotPassword.*, resetPassword.*).
