# Documentación: TareasPorTipoPage.tsx

## Propósito
Pantalla de consulta agrupada por tipo de tarea (TR-047). Solo supervisores. Filtros: período, cliente, empleado; grupos por tipo de tarea con total horas y cantidad; accordion expandible con detalle (mismas columnas que consulta detallada); total general; botón Exportar a Excel (TR-049).

## Ubicación
- `frontend/src/features/tasks/components/TareasPorTipoPage.tsx`

## Dependencias
- `getReportByTaskType`, `ByTaskTypeGroup`, `ByTaskTypeReportParams` de `task.service`
- `ClientSelector`, `EmployeeSelector`
- `buildExportFileName`, `exportGroupedToExcel`, `GroupedExportGroup` de `../utils/exportToExcel`
- Ruta: `/informes/tareas-por-tipo` (SupervisorRoute)

## data-testid
- tareasPorTipo.page, tareasPorTipo.filtros, tareasPorTipo.aplicarFiltros, tareasPorTipo.totalGeneral, tareasPorTipo.loading, tareasPorTipo.empty, tareasPorTipo.grupos, tareasPorTipo.grupo.{id}, tareasPorTipo.grupoExpandir.{id}, tareasPorTipo.mensajeError, exportarExcel.boton, exportarExcel.mensajeSinDatos
