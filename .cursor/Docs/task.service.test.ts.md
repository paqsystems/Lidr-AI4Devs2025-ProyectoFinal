# task.service.test.ts

## Ubicación
`frontend/src/features/tasks/services/task.service.test.ts`

## Propósito
Tests unitarios (Vitest) para el servicio de tareas: getTask y updateTask. Mock de fetch y getToken; verificación de respuestas 200, 404, 2110, 4030, 422.

## Casos
- getTask: retorna tarea (200), error 404, error 2110 (cerrada), error 4030 (sin permisos).
- updateTask: retorna tarea actualizada (200), error 2110 (cerrada), error 422 con validationErrors.

## Ejecución
`npm run test:run -- src/features/tasks/services/task.service.test.ts`

## Referencias
- TR-029(MH)-edición-de-tarea-propia.md
- TR-033(MH)-visualización-de-lista-de-tareas-propias.md
