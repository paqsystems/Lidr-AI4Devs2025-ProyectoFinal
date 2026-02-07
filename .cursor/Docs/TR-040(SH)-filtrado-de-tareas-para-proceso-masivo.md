# Documentación: TR-040(SH) – Filtrado de tareas para proceso masivo

## Propósito
Documento de Tarea/Requisito generado a partir de **HU-040(SH)** (Épica 8: Proceso Masivo de Tareas). Define el filtrado de tareas en la pantalla de proceso masivo: rango de fechas, cliente, empleado y estado (Cerrados/Abiertos/Todos), con validación de rango de fechas (código 1305).

## Ubicación
- **TR:** `docs/hu-tareas/TR-040(SH)-filtrado-de-tareas-para-proceso-masivo.md`
- **HU:** `docs/hu-historias/HU-040(SH)-filtrado-de-tareas-para-proceso-masivo.md`

## Contenido principal
- Filtros: fecha_desde, fecha_hasta, cliente_id, usuario_id (empleado), cerrado (estado).
- Validación: fecha_desde <= fecha_hasta; si no → 422 con código **1305** (rango de fechas inválido).
- Reutilización/extensión de GET /api/v1/tasks/all con query params.
- Frontend: controles de filtro, botón "Aplicar Filtros", total de tareas filtradas.
- Plan de tareas: backend (filtros + 1305), frontend (controles + total), tests, docs.

## Códigos de error
- **1305:** Rango de fechas inválido (fecha_desde > fecha_hasta). Definido en `specs/errors/domain-error-codes.md`.

## Dependencias
- HU-039 (acceso al proceso masivo). TR-034 (GET tasks/all).
