# Documentación: TR-043(SH) – Validación de selección para procesamiento

## Propósito
Documento de Tarea/Requisito generado a partir de **HU-043(SH)** (Épica 8: Proceso Masivo de Tareas). Define la validación doble (frontend y backend) para que no se pueda procesar sin tareas seleccionadas: botón "Procesar" deshabilitado y 422 con mensaje "Debe seleccionar al menos una tarea".

## Ubicación
- **TR:** `docs/hu-tareas/TR-043(SH)-validación-de-selección-para-procesamiento.md`
- **HU:** `docs/hu-historias/HU-043(SH)-validación-de-selección-para-procesamiento.md`

## Contenido principal
- **Frontend:** Botón "Procesar" deshabilitado cuando `selectedTasks.length === 0`; mostrar mensaje si backend devuelve 422.
- **Backend:** En POST bulk-toggle-close, si `task_ids` está vacío o ausente → 422 con mensaje "Debe seleccionar al menos una tarea". No ejecutar UPDATE.
- Código de error: documentar en domain-error-codes si se añade uno nuevo (ej. 1210 para "selección vacía"); en la TR se sugiere 1209 o nuevo.
- Plan de tareas: validación backend, asegurar disabled y mensaje en frontend, tests.

## Nota sobre código de error
- 1209 está ya usado (observación longitud). Para "selección vacía" conviene definir un código nuevo (ej. 1210) en `specs/errors/domain-error-codes.md` o usar 1000 (validación general).

## Dependencias
- HU-042 (procesamiento masivo). Esta TR refuerza la validación en ambos lados.
