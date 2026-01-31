# task-list-all.spec.ts

## Ubicación
`frontend/tests/e2e/task-list-all.spec.ts`

## Propósito
Tests E2E para la tarea **TR-034(MH) – Visualización de Lista de Todas las Tareas (Supervisor)**. Valida que:

1. El supervisor puede acceder a `/tareas/todas` (por URL o enlace futuro) y ver la lista.
2. En la vista de todas las tareas se muestra la tabla (con columna "Empleado" si hay datos) o el mensaje vacío, y los filtros (fecha desde/hasta, aplicar).
3. Un empleado sin permisos de supervisor que intenta acceder a `/tareas/todas` es redirigido a `/` (SupervisorRoute).

## Credenciales usadas
- **Supervisor:** `MGARCIA` / `password456`
- **Empleado:** `JPEREZ` / `password123`

## Testids utilizados
- `auth.login.form`, `auth.login.usuarioInput`, `auth.login.passwordInput`, `auth.login.submitButton`
- `app.dashboard`
- `task.all.container`, `task.all.table`, `task.all.loading`
- `task.list.filters.apply` (componente TaskFilters reutilizado)

## Dependencias
- Backend: `GET /api/v1/tasks/all` (solo supervisor).
- Frontend: `TaskListAll`, `SupervisorRoute`, ruta `/tareas/todas`, botón en Dashboard condicionado a `user.esSupervisor`.

## Ejecución
Desde `frontend/`: `npx playwright test tests/e2e/task-list-all.spec.ts`

## Referencias
- `docs/hu-tareas/TR-034(MH)-visualización-de-lista-de-todas-las-tareas-supervisor.md`
