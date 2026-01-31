# task-edit.spec.ts

## Ubicación
`frontend/tests/e2e/task-edit.spec.ts`

## Propósito
Tests E2E (Playwright) para la edición de tarea propia (TR-029). Flujo: login → lista tareas → click Editar → verificar URL y formulario; verificar título "Editar Tarea".

## Casos
- Navegar a editar desde la lista si hay botón Editar (skip si no hay filas).
- Mostrar formulario de edición con título "Editar Tarea".

## Ejecución
`npx playwright test tests/e2e/task-edit.spec.ts` (requiere backend y frontend en marcha).

## Referencia
- TR-029(MH)-edición-de-tarea-propia.md
