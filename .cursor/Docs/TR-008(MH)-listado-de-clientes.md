# Documentación: TR-008(MH)-listado-de-clientes.md

## Descripción
Plan de tareas (Task Report) para la implementación del **listado de clientes** para supervisores. HU COMPLEJA: tabla paginada con búsqueda, múltiples filtros (tipo de cliente, estado activo/inactivo, inhabilitado) y diferenciación visual de clientes inhabilitados.

## Ubicación
`docs/hu-tareas/TR-008(MH)-listado-de-clientes.md`

## HU Relacionada
`docs/hu-historias/HU-008(MH)-listado-de-clientes.md`

## Origen
- **Prompt:** PROMPTS/04 - Prompts-HU-a-Tareas.md, sección **HU Complejas** (Paso 2).
- **Regla:** `.cursor/rules/13-user-story-to-task-breakdown.md`.
- **Clasificación:** HU COMPLEJA **[REVISAR_SIMPLICIDAD]** (tabla paginada + filtros + búsqueda).

## Resumen de Tareas

| ID | Tipo | Descripción | Estimación |
|----|------|-------------|------------|
| T1 | Base de Datos | Verificar índices PQ_PARTES_cliente (búsqueda y filtros) | S |
| T2 | Backend | ClientService/ClienteService::list() con búsqueda, filtros, paginación, total | M |
| T3 | Backend | ClienteController GET /api/v1/clientes; 403 si no supervisor | M |
| T4 | Backend | Tests unitarios servicio listado | M |
| T5 | Backend | Tests integración GET /clientes (200/403/401) | M |
| T6 | Frontend | Servicio client.service.ts getClientes() | S |
| T7 | Frontend | ClientesPage (listado, ruta /clientes, SupervisorRoute) | M |
| T8 | Frontend | Tabla y columnas; indicador visual inhabilitados | M |
| T9 | Frontend | Búsqueda y filtros | M |
| T10 | Frontend | Paginación y total | S |
| T11 | Frontend | Acciones crear/editar/eliminar (enlaces a HU-009/010/011) | S |
| T12 | Tests | E2E Playwright listado supervisor | M |
| T13 | Tests | E2E empleado no accede (403/redirección) | S |
| T14 | Frontend | Tests unit (Vitest) servicio listado | S |
| T15 | Docs | Especificación GET /api/v1/clientes (o referenciar specs) | S |
| T16 | Docs | Registrar en ia-log.md | S |

**Total:** 16 tareas (6S + 8M + 2L implícitos).

## Dependencias
- HU-001 (autenticación).
- Tablas PQ_PARTES_cliente y PQ_PARTES_tipo_cliente existentes.

## Endpoints Definidos
- `GET /api/v1/clientes` – Listado paginado con query params: page, page_size, search, tipo_cliente_id, activo, inhabilitado, sort, sort_dir. Solo supervisores; 403 (3101) si no supervisor.

## Especificaciones de Referencia
- `specs/endpoints/clientes-list.md` – Contrato GET listado de clientes.
- `specs/models/cliente-model.md` – Modelo y tabla PQ_PARTES_cliente.

## Generado
- Fecha: 2026-01-31
- Regla aplicada: `.cursor/rules/13-user-story-to-task-breakdown.md`
- Prompt: PROMPTS/04 - Prompts-HU-a-Tareas.md (HU Complejas, Paso 2)
