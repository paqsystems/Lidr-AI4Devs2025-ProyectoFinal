# Documentación: TareasPorClientePage.tsx

## Descripción
Página de consulta agrupada por cliente (TR-046). Muestra filtros de período (fecha desde, fecha hasta) y botón "Aplicar Filtros"; lista de grupos por cliente (accordion) con nombre, tipo cliente, total horas y cantidad de tareas; al expandir cada grupo se muestra tabla de tareas (fecha, tipo tarea, horas, empleado si supervisor, descripción). Total general de horas y tareas. Estados loading, vacío y error.

## Ubicación
`frontend/src/features/tasks/components/TareasPorClientePage.tsx`

## Dependencias
- getUserData (tokenStorage), getReportByClient (task.service), t (i18n).

## data-testid
- report.byClient.container, report.byClient.filters, report.byClient.applyFilters, report.byClient.totalGeneral, report.byClient.loading, report.byClient.empty, report.byClient.error, report.byClient.groups, report.byClient.group.{cliente_id}, report.byClient.table.{cliente_id}, report.byClient.row.{id}.

## Generado
- Fecha: 2026-01-30
- TR: TR-046(MH)-consulta-agrupada-por-cliente.md
