# TaskList.tsx

## Propósito
Componente principal de la pantalla **Mis Tareas** (TR-033). Muestra la lista paginada de tareas propias del usuario autenticado, con filtros (fecha, cliente, tipo, búsqueda, orden), totales (cantidad de tareas y horas) y acciones editar/eliminar por fila (deshabilitadas si la tarea está cerrada).

## Ubicación
`frontend/src/features/tasks/components/TaskList.tsx`

## Conservación de filtros al volver de edición (TR-029)
Al navegar a editar una tarea, se envía en `location.state` el estado actual de la lista: `returnFilters` (fecha desde/hasta, cliente, tipo de tarea, empleado, búsqueda, orden) y `returnPage`. Al volver desde la pantalla de edición (guardar o “Volver a la lista”), TaskForm hace `navigate('/tareas', { state: location.state })`. TaskList restaura filtros y página de dos formas: (1) estado inicial desde `getInitialStateFromLocation(location)`; (2) `useEffect` que, al detectar `location.state` con `returnFilters` y `returnPage` en `/tareas`, aplica esos valores (por si el estado llega después del primer render). Así se conservan fechas, cliente, tipo de tarea, búsqueda, ordenamiento y página.

## Dependencias
- `task.service.ts`: `getTasks()`, tipos `TaskListItem`, `TaskListParams`
- `TaskFilters`: componente y tipo `TaskFiltersValues`
- `TaskPagination`, `TaskTotals`
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
- Editar navega a `/tareas/:id/editar` con `state: { returnFilters, returnPage }` (TR-029); al volver se restauran filtros y página.
- Eliminar muestra confirmación (TR-030 pendiente de API).
- Los totales se calculan sobre el conjunto filtrado (backend).
