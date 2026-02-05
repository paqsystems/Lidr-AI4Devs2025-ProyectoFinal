# EmpleadosDetallePage.tsx

## Ubicación
`frontend/src/features/employees/components/EmpleadosDetallePage.tsx`

## Propósito
Componente de página que muestra el detalle completo de un empleado (solo supervisores). Implementa TR-022(SH) Visualización de Detalle de Empleado.

## Funcionalidad
- Obtiene el empleado por ID mediante `getEmpleadoDetalle(id)` (GET `/api/v1/empleados/{id}?include_stats=true`).
- Muestra: código, nombre, email, supervisor (sí/no), estado (activo/inactivo), inhabilitado (sí/no).
- Muestra opcionalmente: total de tareas registradas (`total_tareas`), fecha de creación (`created_at`), última actualización (`updated_at`).
- Acciones: **Editar** (navega a `/empleados/:id/editar`), **Eliminar** (abre modal de confirmación, llama a `deleteEmpleado` y redirige a `/empleados`), **Volver al listado** (navega a `/empleados`).
- Estados: loading, error (404/403 o ID inválido), success con datos.

## data-testid (accesibilidad)
- `empleados.detail.container`, `empleados.detail.loading`, `empleados.detail.error`, `empleados.detail.back`
- `empleados.detail.edit`, `empleados.detail.delete`, `empleados.detail.backList`
- `empleados.detail.code`, `empleados.detail.nombre`, `empleados.detail.email`, `empleados.detail.supervisor`, `empleados.detail.activo`, `empleados.detail.inhabilitado`, `empleados.detail.totalTareas`, `empleados.detail.createdAt`, `empleados.detail.updatedAt`
- Modal: `empleados.detail.delete.modal`, `empleados.detail.delete.code`, `empleados.detail.delete.nombre`, `empleados.detail.delete.error`, `empleados.detail.delete.cancel`, `empleados.detail.delete.confirm`

## Dependencias
- `react`, `react-router-dom` (useParams, useNavigate)
- `empleado.service`: getEmpleadoDetalle, deleteEmpleado, EmpleadoDetalleItem
- `EmpleadosDetallePage.css`

## Referencias
- `docs/hu-tareas/TR-022(SH)-visualización-de-detalle-de-empleado.md`
