# Documentación: TR-044(MH)-consulta-detallada-de-tareas.md

## Descripción
Plan de tareas (Task Report) para la implementación de la **Consulta Detallada de Tareas** (HU-044). Permite a empleado, supervisor y cliente consultar un listado detallado de tareas con filtros según rol, ordenamiento, paginación y total de horas del período.

## Ubicación
`docs/hu-tareas/TR-044(MH)-consulta-detallada-de-tareas.md`

## HU Relacionada
`docs/hu-historias/HU-044(MH)-consulta-detallada-de-tareas.md`

## Clasificación
- **HU COMPLEJA** [REVISAR_SIMPLICIDAD]
- Épica 9: Informes y Consultas
- Roles: Empleado / Empleado Supervisor / Cliente

## Resumen de Tareas

| ID | Tipo     | Descripción | Estimación |
|----|----------|-------------|------------|
| T1 | Backend  | ReportService/TaskService::listDetailReport() con filtros por rol, período, total_horas; validación 1305 | L |
| T2 | Backend  | Endpoint GET /api/v1/reports/detail (o /tasks/report) con query params | M |
| T3 | Backend  | Tests unitarios servicio consulta detallada | M |
| T4 | Backend  | Tests integración endpoint por rol y filtros | M |
| T5 | Frontend | Servicio getDetailReport() (report.service.ts o task.service.ts) | S |
| T6 | Frontend | ConsultaDetalladaPage / DetalleTareasPage (ruta protegida tres roles) | M |
| T7 | Frontend | Filtros según rol (período, tipo cliente, cliente, empleado) + "Aplicar Filtros" | M |
| T8 | Frontend | Tabla con columnas indicadas, ordenamiento por cabeceras | M |
| T9 | Frontend | Paginación y total de horas | S |
| T10| Frontend | Estado vacío (HU-050) | S |
| T11| Tests    | E2E Playwright consulta detallada supervisor | M |
| T12| Tests    | E2E Playwright empleado/cliente | M |
| T13| Tests    | Frontend unit (Vitest) servicio consulta | S |
| T14| Docs     | Documentar GET /reports/detail y códigos 1305, 403 | S |
| T15| Docs     | Registrar en ia-log.md | S |

**Total:** 15 tareas (6S + 7M + 1L).

## Dependencias
- HU-001 (autenticación)
- HU-033 (lista de tareas propias)
- HU-034 (lista de todas las tareas supervisor)
- Reglas de negocio 8.1 y 8.2 (docs/reglas-negocio.md): validación período 1305, filtros automáticos por tipo de usuario

## Endpoints Definidos
- `GET /api/v1/reports/detail` (o `GET /api/v1/tasks/report`)  
  Query: page, per_page, fecha_desde, fecha_hasta, tipo_cliente_id, cliente_id, usuario_id, ordenar_por, orden.  
  Respuesta: data (array), pagination, total_horas (decimal).  
  Errores: 1305 (período inválido), 403 si aplica.

## Reglas de Negocio Aplicables
- RN-01 a RN-08 en TR-044 (filtros por rol, validación período 1305, horas decimal).
- Reglas 8.1 y 8.2 en docs/reglas-negocio.md.

## Generado
- Fecha: 2026-01-30
- Prompt aplicado: PROMPTS/08 - Generación HU a TR masivo (MH).md + flujo HU COMPLEJA (regla 13 y 16-hu-simple-vs-hu-compleja.md)
- Regla: `.cursor/rules/13-user-story-to-task-breakdown.md`
