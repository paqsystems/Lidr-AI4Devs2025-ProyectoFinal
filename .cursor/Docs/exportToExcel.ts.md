# Documentación: exportToExcel.ts

## Propósito
Utilidad de exportación a Excel (TR-049). Genera archivos XLSX a partir de datos de consultas (detallada o agrupada) y dispara la descarga en el navegador usando la librería `xlsx`.

## Ubicación
- `frontend/src/features/tasks/utils/exportToExcel.ts`

## Funciones principales
- **buildExportFileName(fechaDesde, fechaHasta, suffix?):** Devuelve nombre de archivo descriptivo (ej. `Tareas_2026-01-01_2026-01-31_por-cliente.xlsx`).
- **exportDetailToExcel(data, filename, includeEmpleado?):** Exporta lista de ítems de consulta detallada (DetailReportItem[]) a una hoja con columnas según tipo de usuario.
- **exportGroupedToExcel(groups, filename):** Exporta grupos (GroupedExportGroup[]) a una hoja con secciones: para cada grupo, fila de resumen (título, total horas, cantidad) y tabla de detalle (fecha, cliente, tipo tarea, horas, sin cargo, presencial, descripción).

## Tipos exportados
- **GroupedExportTaskRow:** fecha, cliente, tipoTarea, horas, sinCargo, presencial, descripcion.
- **GroupedExportGroup:** groupTitle, totalHoras, cantidadTareas, tareas (GroupedExportTaskRow[]).

## Dependencias
- `xlsx` (SheetJS)
- `DetailReportItem` de `task.service`

## Uso
En cada página de informes (ConsultaDetalladaPage, TareasPorClientePage, TareasPorEmpleadoPage, TareasPorTipoPage, TareasPorFechaPage) se llama a `exportDetailToExcel` o `exportGroupedToExcel` con los datos actuales y un nombre construido con `buildExportFileName(appliedFilters.fechaDesde, appliedFilters.fechaHasta, suffix)`.
