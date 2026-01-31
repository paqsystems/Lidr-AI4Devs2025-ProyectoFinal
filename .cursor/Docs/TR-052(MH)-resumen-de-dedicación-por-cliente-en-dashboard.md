# TR-052(MH) – Resumen de dedicación por cliente en dashboard

## Resumen
Tarea TR-052 añade la sección **"Dedicación por Cliente"** en el Dashboard (TR-051). Reutiliza los datos `top_clientes` del mismo endpoint GET /api/v1/dashboard.

## Archivos modificados (implementación)

- **frontend/src/app/Dashboard.tsx**  
  Sección "Dedicación por Cliente" (empleado y supervisor): título, lista con nombre, total horas, cantidad tareas, porcentaje; enlace "Ver detalle" por cliente a `/informes/tareas-por-cliente?cliente_id=X&fecha_desde=...&fecha_hasta=...`; total general de horas. data-testid: `dashboard.dedicacionCliente`, `dashboard.dedicacionCliente.lista`, `dashboard.dedicacionCliente.totalGeneral`, `dashboard.dedicacionCliente.linkDetalle.{cliente_id}`.

- **frontend/src/app/Dashboard.css**  
  Estilos para `.dashboard-list-item-with-action`, `.dashboard-link-detalle`, `.dashboard-total-general` y responsive.

- **frontend/src/features/tasks/components/TareasPorClientePage.tsx**  
  Lectura de query params `cliente_id`, `fecha_desde`, `fecha_hasta` para prellenar filtros y expandir el grupo del cliente al llegar desde el dashboard.

- **frontend/tests/e2e/dashboard.spec.ts**  
  Test E2E TR-052: sección Dedicación por Cliente visible, total general, clic en "Ver detalle" navega a Tareas por Cliente.

## Referencias
- `docs/hu-tareas/TR-052(MH)-resumen-de-dedicación-por-cliente-en-dashboard.md`
- TR-051: Dashboard principal (endpoint y bloque Top clientes).
