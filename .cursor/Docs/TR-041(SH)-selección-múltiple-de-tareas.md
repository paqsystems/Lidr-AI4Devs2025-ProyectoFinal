# Documentación: TR-041(SH) – Selección múltiple de tareas

## Propósito
Documento de Tarea/Requisito generado a partir de **HU-041(SH)** (Épica 8: Proceso Masivo de Tareas). Define la selección múltiple en la tabla de proceso masivo: checkbox por fila, "Seleccionar todos", "Deseleccionar todos" y contador de tareas seleccionadas en tiempo real.

## Ubicación
- **TR:** `docs/hu-tareas/TR-041(SH)-selección-múltiple-de-tareas.md`
- **HU:** `docs/hu-historias/HU-041(SH)-selección-múltiple-de-tareas.md`

## Contenido principal
- Checkbox por fila; estado de selección en frontend (array/set de ids).
- Acciones: "Seleccionar todos" y "Deseleccionar todos" (sobre tareas visibles).
- Contador: "X tareas seleccionadas" actualizado en tiempo real.
- Sin nuevos endpoints; la selección es solo UI hasta TR-042 (Procesar).
- Plan de tareas: frontend (checkboxes + contador + botones), E2E, docs.

## Dependencias
- HU-040 (filtrado). La tabla ya muestra tareas filtradas.
