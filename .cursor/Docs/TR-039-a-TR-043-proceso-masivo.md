# Documentación: TR-039 a TR-043 (Proceso Masivo de Tareas)

## Origen
Generados aplicando el **prompt correspondiente a las historias HU-039 a HU-043** según la regla `.cursor/rules/16-prompt-dispatcher.md` (PARTE A – Generación de TR desde HU).

- Clasificación: **HU Simple** para todas.
- Fuente de verdad para descomposición: `.cursor/rules/13-user-story-to-task-breakdown.md`.
- Regla HU Simple vs Compleja: `.cursor/rules/16-hu-simple-vs-hu-compleja.md`.

## Archivos generados

| TR   | HU   | Título                                      | Ruta |
|------|------|---------------------------------------------|------|
| TR-039 | HU-039 | Acceso al proceso masivo de tareas          | `docs/hu-tareas/TR-039(SH)-acceso-al-proceso-masivo-de-tareas.md` |
| TR-040 | HU-040 | Filtrado de tareas para proceso masivo      | `docs/hu-tareas/TR-040(SH)-filtrado-de-tareas-para-proceso-masivo.md` |
| TR-041 | HU-041 | Selección múltiple de tareas                | `docs/hu-tareas/TR-041(SH)-selección-múltiple-de-tareas.md` |
| TR-042 | HU-042 | Procesamiento masivo cerrar/reabrir         | `docs/hu-tareas/TR-042(SH)-procesamiento-masivo-de-tareas-cerrarreabrir.md` |
| TR-043 | HU-043 | Validación de selección para procesamiento  | `docs/hu-tareas/TR-043(SH)-validación-de-selección-para-procesamiento.md` |

## Resumen de alcance

- **TR-039:** Ruta/menú Proceso Masivo solo para supervisores; 403 si no supervisor. Reutiliza GET /api/v1/tasks/all.
- **TR-040:** Filtros fecha_desde/hasta, cliente, empleado, estado; validación 1305 (fecha_desde ≤ fecha_hasta); "Aplicar Filtros"; total de tareas.
- **TR-041:** Checkbox por fila, "Seleccionar todos", "Deseleccionar todos", contador "X tareas seleccionadas" en tiempo real.
- **TR-042:** POST /api/v1/tasks/bulk-toggle-close; invertir `cerrado` atómicamente; botón Procesar; confirmación opcional; mensaje "Se procesaron X registros".
- **TR-043:** Botón Procesar deshabilitado sin selección; mensaje "Debe seleccionar al menos una tarea"; validación backend 422 si task_ids vacío.

## Códigos de error referenciados

- **1305:** Rango de fechas inválido (TR-040) — ya en `specs/errors/domain-error-codes.md`.
- **Selección vacía (TR-043):** Definir código (ej. 1210) en domain-error-codes o usar 1000.

## Próximos pasos

Para **ejecutar** cada TR (implementación): usar el comando definido en la PARTE B del dispatcher:
> Ejecutá la TR TR-xxx.md

y el archivo de prompt `PROMPTS/05-Ejecucion-de-una-TR.md` (o equivalente).

Orden sugerido de ejecución: TR-039 → TR-040 → TR-041 → TR-042 → TR-043 (las validaciones de TR-043 pueden implementarse junto con TR-042).
