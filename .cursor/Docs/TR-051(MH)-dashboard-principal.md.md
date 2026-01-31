# Documentación: TR-051(MH)-dashboard-principal.md

## Descripción
Tarea de implementación (TR) generada a partir de la historia de usuario HU-051(MH) "Dashboard principal". Clasificación: HU Compleja. Define el dashboard como página de inicio post-login con KPIs (total horas, cantidad tareas, promedio opcional), selector de período (mes actual por defecto), top clientes, top empleados (solo supervisor), distribución por tipo (solo cliente). Backend GET /api/v1/dashboard; frontend Dashboard con bloques por rol.

## Ubicación
`docs/hu-tareas/TR-051(MH)-dashboard-principal.md`

## Secciones principales
1. HU Refinada 2. Criterios de Aceptación (AC-01 a AC-12) y Gherkin 3. Reglas de Negocio 4. Impacto en Datos 5. Contratos de API (GET /api/v1/dashboard) 6. Cambios Frontend 7. Plan de Tareas (T1–T15) 8. Estrategia de Tests 9. Riesgos y Edge Cases 10. Checklist Final + Trazabilidad

## Dependencias
- HU-001, HU-044. No nuevas tablas.

## Generado
- Fecha: 2026-01-31
- Prompt: "Aplicá el prompt correspondiente a la historia HU-051(MH)" (dispatcher, HU Compleja).
- Regla: .cursor/rules/13-user-story-to-task-breakdown.md
