# tareas-generadas-hu-Must Have.md

## Ubicación
`docs/tareas-generadas-hu-Must Have.md`

## Propósito
Registro del resultado del prompt **PROMPTS/08 - Generaciòn HU a TR masivo (MH).md**: análisis y planificación de 22 historias Must-Have pendientes de conversión a tareas (TR). No incluye ejecución de tareas ni generación de código.

## Contenido
- **Resumen:** 12 HU SIMPLE, 10 HU COMPLEJA (estas últimas con etiqueta [REVISAR_SIMPLICIDAD]).
- **Por cada HU (en orden):**
  - Clasificación SIMPLE o COMPLEJA y motivo.
  - Si COMPLEJA: sub-historias lógicas.
  - Tareas técnicas por capa: Base de Datos, Backend, Frontend, QA/Testing.
  - Dependencias entre TRs.
  - Coherencia con MVP.
- **Secciones finales:** Dependencias entre TRs (orden sugerido), coherencia con MVP, notas y decisiones, pendientes/follow-ups.

## Historias cubiertas (orden del documento)
1. Informes: HU-044, HU-046, HU-050  
2. Dashboard: HU-051, HU-052  
3. Gestión Clientes: HU-008, HU-009, HU-010, HU-011, HU-012  
4. Gestión Tipos Cliente: HU-014, HU-015, HU-016, HU-017  
5. Gestión Empleados: HU-018, HU-019, HU-020, HU-021  
6. Gestión Tipos de Tarea: HU-023, HU-024, HU-025, HU-026  

## Uso
- Sirve como plan para generar después los archivos TR individuales en `docs/hu-tareas/` (TR-008 a TR-026, TR-044, TR-046, TR-050, TR-051, TR-052) cuando se ejecute el flujo HU→TR por cada historia.
- Las HUs marcadas [REVISAR_SIMPLICIDAD] pueden revisarse para tratar como SIMPLE si se reduce alcance.

## Referencias
- PROMPTS/08 - Generaciòn HU a TR masivo (MH).md  
- .cursor/rules/16-hu-simple-vs-hu-compleja.md  
- .cursor/rules/13-user-story-to-task-breakdown.md  
