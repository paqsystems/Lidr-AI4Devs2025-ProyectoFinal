# Documentación: ConsultaDetalladaPage.tsx

## Descripción
Página de consulta detallada de tareas (TR-044). Muestra una tabla de tareas según el rol del usuario (empleado: solo propias; supervisor: todas con filtros opcionales; cliente: solo donde es el cliente). Incluye filtros de período; filtro por cliente para empleado y supervisor; filtro por empleado solo para supervisor. Botón "Aplicar Filtros"; total de horas; ordenamiento por columnas; paginación; estado vacío.

## Ubicación
`frontend/src/features/tasks/components/ConsultaDetalladaPage.tsx`

## Dependencias
- getUserData (tokenStorage), getDetailReport, getClients, getEmployees (task.service), TaskPagination, t (i18n).

## data-testid
- report.detail.container, report.detail.filters, report.detail.applyFilters, report.detail.totalHours, report.detail.loading, report.detail.empty, report.detail.table, report.detail.row.{id}, report.detail.pagination, report.detail.error.

## Generado
- Fecha: 2026-01-30
- TR: TR-044(MH)-consulta-detallada-de-tareas.md
