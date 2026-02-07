# TR-047 a TR-049 – Informes y consultas (agrupadas y exportación)

## Propósito
Documento resumen de los tickets TR-047, TR-048 y TR-049 generados a partir de las historias de usuario HU-047, HU-048 y HU-049 (Épica 9: Informes y Consultas).

## Generación
Generados aplicando el **prompt correspondiente a las historias HU-047 a HU-049** según la regla `.cursor/rules/16-prompt-dispatcher.md` (PARTE A – Generación de TR desde HU). Las tres HUs se clasificaron como **HU SIMPLE**; se usó la sección HU Simple del archivo `.cursor/rules/16-hu-simple-vs-hu-compleja.md` y la regla `13-user-story-to-task-breakdown.md` para la descomposición.

## Tickets generados

| Ticket | HU       | Título                              | Ubicación TR |
|--------|----------|-------------------------------------|----------------------------------------------|
| TR-047 | HU-047   | Consulta agrupada por tipo de tarea | `docs/hu-tareas/TR-047(SH)-consulta-agrupada-por-tipo-de-tarea.md` |
| TR-048 | HU-048   | Consulta agrupada por fecha         | `docs/hu-tareas/TR-048(SH)-consulta-agrupada-por-fecha.md` |
| TR-049 | HU-049   | Exportación de consultas a Excel    | `docs/hu-tareas/TR-049(SH)-exportación-de-consultas-a-excel.md` |

## Documentación en .cursor/Docs
- `.cursor/Docs/TR-047(SH)-consulta-agrupada-por-tipo-de-tarea.md`
- `.cursor/Docs/TR-048(SH)-consulta-agrupada-por-fecha.md`
- `.cursor/Docs/TR-049(SH)-exportación-de-consultas-a-excel.md`

## Dependencias
- **TR-047, TR-048:** Dependen de HU-044 (Consulta detallada).
- **TR-049:** Depende de HU-044, HU-045, HU-046, HU-047, HU-048 (todas las consultas donde se añade el botón Exportar).

## Próximos pasos
Para implementar cada uno: **Ejecutá la TR TR-0XX(SH).md** (PARTE B del dispatcher).
