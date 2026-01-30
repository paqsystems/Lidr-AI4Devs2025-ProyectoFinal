# TaskList.tsx

## Propósito
Componente principal de la pantalla **Mis Tareas** (TR-033). Muestra la lista paginada de tareas propias del usuario autenticado, con filtros (fecha, cliente, tipo, búsqueda, orden), totales (cantidad de tareas y horas) y acciones editar/eliminar por fila (deshabilitadas si la tarea está cerrada).

## Ubicación
`frontend/src/features/tasks/components/TaskList.tsx`

## Dependencias
- `task.service.ts`: `getTasks()`, tipos `TaskListItem`, `TaskListParams`, `TaskFiltersValues`
- `TaskFilters`, `TaskPagination`, `TaskTotals`
- Ruta protegida `/tareas` (solo empleados)

## data-testid (E2E)
- `task.list.container` – contenedor principal
- `task.list.filters` – bloque de filtros
- `task.list.totals` – totales
- `task.list.table` – tabla de datos
- `task.list.row.{id}` – fila por tarea
- `task.list.edit.{id}` – botón editar
- `task.list.delete.{id}` – botón eliminar
- `task.list.pagination` – paginación
- `task.list.empty` – mensaje sin datos
- `task.list.loading` – estado de carga

## Notas
- Editar navega a `/tareas/:id/editar` (TR-029); eliminar muestra confirmación (TR-030 pendiente de API).
- Los totales se calculan sobre el conjunto filtrado (backend).
