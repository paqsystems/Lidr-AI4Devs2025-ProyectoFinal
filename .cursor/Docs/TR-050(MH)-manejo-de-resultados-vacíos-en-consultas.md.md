# Documentación: TR-050(MH)-manejo-de-resultados-vacíos-en-consultas.md

## Descripción
Tarea de implementación (TR) generada a partir de la historia de usuario HU-050(MH) "Manejo de resultados vacíos en consultas". Clasificación: HU Simple. Define el comportamiento cuando no hay resultados en las pantallas de consulta (Consulta Detallada, Tareas por Cliente): mensaje informativo en lugar de tabla/lista vacía, botón exportar deshabilitado cuando aplica, filtros automáticos por rol aplicados antes de evaluar vacío.

## Ubicación
`docs/hu-tareas/TR-050(MH)-manejo-de-resultados-vacíos-en-consultas.md`

## Secciones principales
1. HU Refinada (título, narrativa, contexto, in/out scope)
2. Criterios de Aceptación (AC-01 a AC-06) y escenarios Gherkin
3. Reglas de Negocio (RN-01 a RN-05)
4. Impacto en Datos (ninguno)
5. Contratos de API (sin cambios)
6. Cambios Frontend (ConsultaDetalladaPage, TareasPorClientePage, estado vacío)
7. Plan de Tareas (T1–T7: frontend, tests E2E, docs)
8. Estrategia de Tests
9. Riesgos y Edge Cases
10. Checklist Final
11. Trazabilidad (Archivos creados/modificados, Comandos, Notas, Pendientes)

## Dependencias
- HU-044 (Consulta Detallada), HU-046 (Tareas por Cliente). No nuevas APIs ni migraciones.

## Generado
- Fecha: 2026-01-31
- Prompt: "Aplicá el prompt correspondiente a la historia HU-050" (dispatcher 16-prompt-dispatcher.md, HU Simple, PROMPTS/04 - Prompts-HU-a-Tareas.md).
- Regla: .cursor/rules/13-user-story-to-task-breakdown.md
