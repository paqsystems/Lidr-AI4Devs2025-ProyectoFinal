# Documentación: TR-042(SH) – Procesamiento masivo de tareas (cerrar/reabrir)

## Propósito
Documento de Tarea/Requisito generado a partir de **HU-042(SH)** (Épica 8: Proceso Masivo de Tareas). Define el procesamiento masivo que invierte el estado `cerrado` de las tareas seleccionadas: botón "Procesar", confirmación opcional, endpoint atómico y mensaje de éxito.

## Ubicación
- **TR:** `docs/hu-tareas/TR-042(SH)-procesamiento-masivo-de-tareas-cerrarreabrir.md`
- **HU:** `docs/hu-historias/HU-042(SH)-procesamiento-masivo-de-tareas-cerrarreabrir.md`

## Contenido principal
- **Backend:** POST /api/v1/tasks/bulk-toggle-close con body `{ "task_ids": [1,2,3] }`. Invertir `cerrado` en transacción (atómico). Solo supervisor (403 si no).
- **Frontend:** Botón "Procesar" (habilitado con selección); opcional diálogo de confirmación; loading; mensaje "Se procesaron X registros"; actualización de la lista.
- Validación de selección no vacía: TR-043 (frontend deshabilita botón; backend 422 si task_ids vacío).
- Plan de tareas: endpoint + frontend + tests + specs.

## Dependencias
- HU-041 (selección múltiple). TR-043 (validación de selección).
