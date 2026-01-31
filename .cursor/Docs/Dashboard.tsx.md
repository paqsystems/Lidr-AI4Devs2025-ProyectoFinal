# Dashboard.tsx

## Ubicación
`frontend/src/app/Dashboard.tsx`

## Propósito
Componente de la página principal del sistema después del login (TR-051). Muestra:
- Mensaje de bienvenida y enlaces de navegación (perfil, informes, tareas).
- Selector de período (fecha desde / fecha hasta; botón "Mes actual").
- KPIs del período: total horas, cantidad de tareas, promedio horas/día.
- Bloque **Top clientes** (empleado y supervisor).
- Bloque **Top empleados** (solo supervisor).
- Bloque **Distribución por tipo** (solo cliente).

## Dependencias
- `getUserData` (tokenStorage): rol y datos del usuario.
- `getDashboard` (task.service): GET /api/v1/dashboard con `fecha_desde`, `fecha_hasta`.

## Estados
- `period`: { fechaDesde, fechaHasta } — por defecto primer y último día del mes actual.
- `dashboardData`: datos devueltos por el API o null.
- `loading`, `errorMessage`: carga y errores.

## data-testid (E2E)
- `dashboard.container`, `dashboard.periodSelector`, `dashboard.periodDesde`, `dashboard.periodHasta`, `dashboard.periodCurrentMonth`
- `dashboard.kpis`, `dashboard.kpi.totalHoras`, `dashboard.kpi.cantidadTareas`, `dashboard.kpi.promedioHoras`
- `dashboard.topClientes`, `dashboard.topEmpleados`, `dashboard.distribucionTipo`
- `dashboard.loading`, `dashboard.error`

## Reglas por rol
- **Empleado** (tipoUsuario === 'usuario' && !esSupervisor): Top clientes; sin Top empleados; sin Distribución por tipo.
- **Supervisor** (esSupervisor): Top clientes + Top empleados.
- **Cliente** (tipoUsuario === 'cliente'): Distribución por tipo; sin Top clientes ni Top empleados.

## Referencias
- TR-051(MH)-dashboard-principal.md
- TR-050 / HU-050: estado vacío ("No se encontraron tareas para los filtros seleccionados").
