# Documentación: TR-048(SH) – Consulta agrupada por fecha

## Propósito
Documento de Tarea/Requisito generado a partir de **HU-048(SH)** (Épica 9: Informes y Consultas). Define la consulta de tareas agrupadas por fecha: sección "Tareas por Fecha" accesible para empleado, supervisor y cliente; filtros de período; resultados filtrados por rol (empleado solo sus tareas, supervisor todas, cliente solo donde es el cliente); grupos expandibles con detalle y total general; orden cronológico.

## Ubicación
- **TR:** `docs/hu-tareas/TR-048(SH)-consulta-agrupada-por-fecha.md`
- **HU:** `docs/hu-historias/HU-048(SH)-consulta-agrupada-por-fecha.md`

## Contenido principal
- **Backend:** Nuevo endpoint GET `/api/v1/reports/by-date` con query params fecha_desde, fecha_hasta; filtros automáticos por rol (empleado/supervisor/cliente); validación 1305.
- **Frontend:** Nueva página Tareas por Fecha (ruta ej. `/informes/tareas-por-fecha`) accesible según rol; filtros de período; accordion por fecha (fecha, total horas, cantidad tareas); detalle expandible con columnas como consulta detallada; total general; orden cronológico.
- **Dependencias:** HU-044 (Consulta Detallada); reutilización de lógica de filtros por rol y validación de período.

## Códigos de error
- **1305:** Período inválido (fecha_desde > fecha_hasta).

## Generación
Generado aplicando el **prompt correspondiente a la historia HU-048** según la regla `.cursor/rules/16-prompt-dispatcher.md` (PARTE A – Generación de TR desde HU), clasificación HU SIMPLE.

## Próximos pasos
Para implementar: **Ejecutá la TR TR-048(SH).md** (PARTE B del dispatcher).
