# TaskEditPage.tsx

## Ubicación
`frontend/src/features/tasks/components/TaskEditPage.tsx`

## Propósito
Página de edición de tarea. Obtiene el `id` de la URL (useParams) y renderiza `TaskForm` con `taskId={id}`. Si el id no es válido (NaN o <= 0), redirige a `/tareas`.

## Uso
- Ruta: `/tareas/:id/editar`.
- Renderiza `<TaskForm taskId={taskId} />` cuando el id es válido.
- Protegida por EmployeeRoute en App.tsx.

## Referencia
- TR-029(MH)-edición-de-tarea-propia.md
