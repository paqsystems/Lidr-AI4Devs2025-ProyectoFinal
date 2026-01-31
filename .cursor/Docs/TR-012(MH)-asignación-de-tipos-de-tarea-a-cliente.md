# Documentación: TR-012(MH)-asignación-de-tipos-de-tarea-a-cliente.md

## Descripción
Plan de tareas (Task Report) para la implementación de la **asignación de tipos de tarea a cliente** por supervisores. HU SIMPLE: el cliente solo usa los tipos asignados (no genéricos) más los genéricos al registrar tareas; un tipo no genérico puede estar asignado a varios clientes. Sección en edición/detalle de cliente con lista de tipos no genéricos (checkboxes o multi-select), guardar en PQ_PARTES_cliente_tipo_tarea; regla 2116 (al menos un genérico o un asignado); 2118 (no asignar tipo genérico).

## Ubicación
`docs/hu-tareas/TR-012(MH)-asignación-de-tipos-de-tarea-a-cliente.md`

## HU Relacionada
`docs/hu-historias/HU-012(MH)-asignación-de-tipos-de-tarea-a-cliente.md`

## Origen
- **Prompt:** PROMPTS/04 - Prompts-HU-a-Tareas.md (HU Simple).
- **Regla:** `.cursor/rules/13-user-story-to-task-breakdown.md`.
- **Clasificación:** HU SIMPLE.

## Resumen de Tareas

| ID | Tipo | Descripción | Estimación |
|----|------|-------------|------------|
| T1 | Base de Datos | Migración PQ_PARTES_cliente_tipo_tarea | S |
| T2 | Backend | GET /api/v1/clientes/{id}/tipos-tarea – tipos asignados | S |
| T3 | Backend | ClienteTipoTareaService::updateTiposTarea() – validaciones, 2116, 2118 | M |
| T4 | Backend | PUT /api/v1/clientes/{id}/tipos-tarea – body tipo_tarea_ids | M |
| T5 | Backend | Tests unitarios servicio asignación | M |
| T6 | Backend | Tests integración GET y PUT tipos-tarea | M |
| T7 | Frontend | Servicio getTiposTareaCliente, updateTiposTareaCliente | S |
| T8 | Frontend | Sección Tipos de tarea en edición/detalle cliente | M |
| T9 | Frontend | Integración con API y mensaje 2116 | M |
| T10| Tests | E2E Playwright asignar tipos a cliente | M |
| T11| Tests | E2E desasignar y 2116 (opcional) | S |
| T12| Frontend | Tests unit (Vitest) servicio | S |
| T13| Docs | Actualizar specs clientes-tipos-tarea | S |
| T14| Docs | Registrar en ia-log.md | S |

**Total:** 14 tareas (4S + 8M).

## Dependencias
- HU-010 (edición de cliente).
- HU-023 (tipos de tarea).

## Endpoints Definidos
- `GET /api/v1/clientes/{id}/tipos-tarea` – Listar tipos asignados al cliente. Solo supervisores. 200, 403, 404 (4003).
- `PUT /api/v1/clientes/{id}/tipos-tarea` – Actualizar asignación. Body: `{ tipo_tarea_ids: number[] }`. Solo supervisores. 200, 422 (2116, 2118, 4007, 4205), 403 (3101), 404 (4003).

## Especificaciones de Referencia
- `specs/endpoints/clientes-tipos-tarea-list.md` – GET tipos asignados.
- `specs/endpoints/clientes-tipos-tarea-assign.md` – POST asignar uno (alternativa).
- `specs/endpoints/clientes-tipos-tarea-unassign.md` – DELETE desasignar uno (alternativa); 2116.
- `specs/models/cliente-tipo-tarea-model.md` – Tabla pivot PQ_PARTES_cliente_tipo_tarea.
- `specs/errors/domain-error-codes.md` – 2116, 2118, 3101, 4003, 4007, 4205.

## Implementación (TR-012)

### Archivos modificados/creados
- **Backend:** `ClienteService.php` (getTiposTareaCliente, updateTiposTareaCliente), `ClienteController.php` (tiposTarea GET, updateTiposTarea PUT), `api.php` (rutas GET/PUT clientes/{id}/tipos-tarea).
- **Frontend:** `client.service.ts` (getTiposTareaCliente, updateTiposTareaCliente, getTiposTareaParaAsignacion), `ClientesEditarPage.tsx` (sección Tipos de tarea con checkboxes y Guardar tipos de tarea), `ClientesNuevaPage.css` (estilos sección).
- **Tests:** `ClienteControllerTest.php` (9 tests TR-012), `client.service.test.ts` (getTiposTareaCliente, updateTiposTareaCliente, getTiposTareaParaAsignacion).
- **Docs:** `docs/hu-tareas/TR-012(MH)-asignación-de-tipos-de-tarea-a-cliente.md` (checklist y archivos afectados).

### Validación PUT
- Request: `tipo_tarea_ids` con `present|array` (permite array vacío). Códigos: 2116 (sin tipos), 2118 (tipo genérico), 4007 (tipo no encontrado), 4205 (tipo inactivo).

## Generado
- Fecha: 2026-01-31
- Regla aplicada: `.cursor/rules/13-user-story-to-task-breakdown.md`
- Prompt: PROMPTS/04 - Prompts-HU-a-Tareas.md (HU Simple)
