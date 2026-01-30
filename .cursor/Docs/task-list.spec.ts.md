# task-list.spec.ts

## Propósito
Tests E2E con Playwright para la visualización de lista de tareas propias (TR-033). Verifican: navegación a Mis Tareas desde el dashboard, presencia de filtros y totales, y que se muestre tabla o estado vacío según datos.

## Ubicación
`frontend/tests/e2e/task-list.spec.ts`

## Requisitos
- Backend y frontend en ejecución (o `PLAYWRIGHT_BASE_URL` apuntando al frontend).
- Usuario de prueba JPEREZ / password123 y datos de tareas opcionales.

## Reglas
- Selectores por `data-testid`; sin waits ciegos; assertions con `expect().toBeVisible()`.

## Ejecución
`cd frontend && npx playwright test tests/e2e/task-list.spec.ts`
