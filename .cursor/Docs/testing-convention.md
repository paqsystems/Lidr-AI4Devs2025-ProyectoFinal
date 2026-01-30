# Convención de tests por tarea/historia

## Regla

**Cada vez que se implemente una tarea o historia (TR/HU), en frontend se deben cubrir los dos tipos de test:**

| Tipo        | Herramienta | Dónde                                      |
|------------|-------------|--------------------------------------------|
| Unitarios  | Vitest      | `frontend/src/**/*.{test,spec}.{ts,tsx}`   |
| E2E        | Playwright  | `frontend/tests/e2e/*.spec.ts`             |

## Al cerrar una tarea

1. Ejecutar **unitarios + E2E** en frontend:  
   `cd frontend && npm run test:all`
2. Si la tarea toca backend:  
   `cd backend && php artisan test`
3. Todo junto (opcional):  
   `cd backend && php artisan test && cd ../frontend && npm run test:all`

## Checklist al programar

1. ¿Hay lógica/servicio en frontend? → Tests en `src/` (Vitest).
2. ¿Hay pantalla o flujo de usuario? → Spec en `tests/e2e/` (Playwright).
3. Al terminar → `npm run test:all` en `frontend/`.

## Referencia completa

- `docs/testing.md` — Estrategia, comandos y alcance.
- `AGENTS.md` sección 6.3 — Reglas de tests para el agente.
