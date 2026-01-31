# Documentación: TR-046(MH)-consulta-agrupada-por-cliente.md

## Descripción
Plan de tareas (Task Report) para la implementación de la **Consulta Agrupada por Cliente** (HU-046). Permite a empleado, supervisor y cliente consultar tareas agrupadas por cliente en un período, con grupos expandibles (accordion), detalle de tareas por grupo, total general y orden por dedicación (mayor a menor).

## Ubicación
`docs/hu-tareas/TR-046(MH)-consulta-agrupada-por-cliente.md`

## HU Relacionada
`docs/hu-historias/HU-046(MH)-consulta-agrupada-por-cliente.md`

## Clasificación
- **HU COMPLEJA** [REVISAR_SIMPLICIDAD]
- Épica 9: Informes y Consultas
- Roles: Empleado / Empleado Supervisor / Cliente

## Resumen de Tareas

| ID | Tipo     | Descripción | Estimación |
|----|----------|-------------|------------|
| T1 | Backend  | ReportService::reportByClient() con agregación por cliente_id, filtros por rol, orden, totales; validación 1305 | L |
| T2 | Backend  | Endpoint GET /api/v1/reports/by-client (fecha_desde, fecha_hasta) | M |
| T3 | Backend  | Tests unitarios servicio reportByClient | M |
| T4 | Backend  | Tests integración endpoint by-client por rol | M |
| T5 | Frontend | Servicio getReportByClient() (report.service.ts) | S |
| T6 | Frontend | TareasPorClientePage / ResumenPorClientePage (ruta protegida tres roles) | M |
| T7 | Frontend | Filtros período y botón aplicar | S |
| T8 | Frontend | Accordion por cliente con detalle expandible (tabla tareas) | M |
| T9 | Frontend | Total general de horas y tareas | S |
| T10| Frontend | Estado vacío y error (HU-050, 1305) | S |
| T11| Tests    | E2E Playwright supervisor → filtrar → expandir | M |
| T12| Tests    | E2E Playwright empleado/cliente | M |
| T13| Tests    | Frontend unit (Vitest) getReportByClient | S |
| T14| Docs     | Documentar GET /reports/by-client y 1305 | S |
| T15| Docs     | Registrar en ia-log.md | S |

**Total:** 15 tareas (6S + 7M + 1L).

## Dependencias
- **HU-044** (Consulta Detallada): lógica de filtros por rol y validación período se reutiliza.
- HU-001 (autenticación).
- Reglas de negocio 8.1 y 8.2 (docs/reglas-negocio.md).

## Endpoints Definidos
- `GET /api/v1/reports/by-client`  
  Query: fecha_desde, fecha_hasta.  
  Respuesta: grupos (cliente_id, nombre, tipo_cliente?, total_horas, cantidad_tareas, tareas[]), total_general_horas, total_general_tareas.  
  Errores: 1305 (período inválido), 403 si aplica.

## Reglas de Negocio Aplicables
- RN-01 a RN-07 en TR-046 (agrupación por cliente_id, filtros por rol, totalización decimal, orden por dedicación, validación 1305).
- Reglas 8.1 y 8.2 en docs/reglas-negocio.md.

## Generado
- Fecha: 2026-01-30
- Prompt aplicado: PROMPTS/08 - Generación HU a TR masivo (MH).md + flujo HU COMPLEJA (regla 13 y 16-hu-simple-vs-hu-compleja.md)
- Regla: `.cursor/rules/13-user-story-to-task-breakdown.md`
