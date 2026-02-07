# Documentación: TR-047(SH) – Consulta agrupada por tipo de tarea

## Propósito
Documento de Tarea/Requisito generado a partir de **HU-047(SH)** (Épica 9: Informes y Consultas). Define la consulta de tareas agrupadas por tipo de tarea: sección "Tareas por Tipo" solo para supervisores, mismos filtros que consulta detallada, grupos expandibles (accordion) con detalle de tareas y total general.

## Ubicación
- **TR:** `docs/hu-tareas/TR-047(SH)-consulta-agrupada-por-tipo-de-tarea.md`
- **HU:** `docs/hu-historias/HU-047(SH)-consulta-agrupada-por-tipo-de-tarea.md`

## Contenido principal
- **Backend:** Nuevo endpoint GET `/api/v1/reports/by-task-type` con query params fecha_desde, fecha_hasta, tipo_cliente_id, cliente_id, usuario_id; validación 1305; solo supervisor (403 si no).
- **Frontend:** Nueva página Tareas por Tipo (ruta ej. `/informes/tareas-por-tipo`) con SupervisorRoute; filtros como consulta detallada; accordion por tipo de tarea (descripción, total horas, cantidad tareas); detalle expandible con columnas como consulta detallada; total general.
- **Dependencias:** HU-044 (Consulta Detallada); reutilización de lógica de filtros y validación de período.

## Códigos de error
- **1305:** Período inválido (fecha_desde > fecha_hasta).
- **403:** Usuario no supervisor.

## Generación
Generado aplicando el **prompt correspondiente a la historia HU-047** según la regla `.cursor/rules/16-prompt-dispatcher.md` (PARTE A – Generación de TR desde HU), clasificación HU SIMPLE.

## Próximos pasos
Para implementar: **Ejecutá la TR TR-047(SH).md** (PARTE B del dispatcher).
