# Documentación: TareasPorFechaPage.tsx

## Propósito
Pantalla de consulta agrupada por fecha (TR-048). Acceso para empleado, supervisor y cliente. Filtros de período; resultados filtrados por rol; grupos por fecha con total horas y cantidad; accordion expandible con detalle; total general; orden cronológico; botón Exportar a Excel (TR-049).

## Ubicación
- `frontend/src/features/tasks/components/TareasPorFechaPage.tsx`

## Dependencias
- `getReportByDate`, `ByDateGroup`, `ByDateReportParams` de `task.service`
- `buildExportFileName`, `exportGroupedToExcel`, `GroupedExportGroup` de `../utils/exportToExcel`
- Ruta: `/informes/tareas-por-fecha` (sin SupervisorRoute; todos los roles)

## data-testid
- tareasPorFecha.page, tareasPorFecha.filtros, tareasPorFecha.aplicarFiltros, tareasPorFecha.totalGeneral, tareasPorFecha.loading, tareasPorFecha.empty, tareasPorFecha.grupos, tareasPorFecha.grupo.{fecha}, tareasPorFecha.grupoExpandir.{fecha}, tareasPorFecha.mensajeError, exportarExcel.boton, exportarExcel.mensajeSinDatos
