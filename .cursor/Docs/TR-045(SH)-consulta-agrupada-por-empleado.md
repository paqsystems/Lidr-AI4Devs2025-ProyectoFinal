# Documentación: TR-045(SH) – Consulta agrupada por empleado

## Propósito
Documento de Tarea/Requisito generado a partir de **HU-045(SH)** (Épica 9: Informes y Consultas). Define la consulta de tareas agrupadas por empleado: sección "Tareas por Empleado" solo para supervisores, mismos filtros que consulta detallada, grupos expandibles (accordion) con detalle de tareas y total general.

## Ubicación
- **TR:** `docs/hu-tareas/TR-045(SH)-consulta-agrupada-por-empleado.md`
- **HU:** `docs/hu-historias/HU-045(SH)-consulta-agrupada-por-empleado.md`

## Contenido principal
- **Backend:** Nuevo endpoint GET `/api/v1/reports/by-employee` con query params fecha_desde, fecha_hasta, tipo_cliente_id, cliente_id, usuario_id; validación 1305; solo supervisor (403 si no).
- **Frontend:** Nueva página Tareas por Empleado (ruta ej. `/informes/tareas-por-empleado`) con SupervisorRoute; filtros como consulta detallada; accordion por empleado (nombre, total horas, cantidad tareas); detalle expandible con columnas como consulta detallada; total general.
- **Dependencias:** HU-044 (Consulta Detallada); reutilización de lógica de filtros y validación de período.

## Códigos de error
- **1305:** Período inválido (fecha_desde > fecha_hasta).
- **403:** Usuario no supervisor.

## Próximos pasos
Para implementar: **Ejecutá la TR TR-045(SH).md** (PARTE B del dispatcher).
