# Documentación: TR-009(MH)-creación-de-cliente.md

## Descripción
Plan de tareas (Task Report) para la implementación de la **creación de cliente** por supervisores. HU SIMPLE: formulario con código (único), nombre, tipo de cliente, email opcional, opción "Habilitar acceso al sistema" (creación de User + cliente con user_id), validaciones y regla de tipos de tarea (al menos un genérico o tipo asignado).

## Ubicación
`docs/hu-tareas/TR-009(MH)-creación-de-cliente.md`

## HU Relacionada
`docs/hu-historias/HU-009(MH)-creación-de-cliente.md`

## Origen
- **Prompt:** PROMPTS/04 - Prompts-HU-a-Tareas.md (HU Simple).
- **Regla:** `.cursor/rules/13-user-story-to-task-breakdown.md`.
- **Clasificación:** HU SIMPLE.

## Resumen de Tareas

| ID | Tipo | Descripción | Estimación |
|----|------|-------------|------------|
| T1 | Backend | ClienteService::create() – validaciones, User + Cliente si habilitar_acceso, regla 2116 | L |
| T2 | Backend | ClienteController::store() – POST /api/v1/clientes; 201, 422, 409, 403 | M |
| T3 | Backend | Tests unitarios servicio creación | M |
| T4 | Backend | Tests integración POST /clientes | M |
| T5 | Frontend | Servicio client.service.ts createCliente() | S |
| T6 | Frontend | ClientesNuevaPage – formulario con todos los campos y habilitar acceso | M |
| T7 | Frontend | Integración formulario con API | M |
| T8 | Tests | E2E Playwright creación cliente (sin acceso) | M |
| T9 | Tests | E2E creación con acceso y validación duplicado | S |
| T10 | Frontend | Tests unit (Vitest) servicio creación | S |
| T11 | Docs | Actualizar specs/endpoints/clientes-create.md | S |
| T12 | Docs | Registrar en ia-log.md | S |

**Total:** 12 tareas (4S + 6M + 1L).

## Dependencias
- HU-008 (listado de clientes).
- HU-014 (tipos de cliente).
- HU-023 (tipos de tarea para regla genéricos/asignados).

## Endpoints Definidos
- `POST /api/v1/clientes` – Crear cliente. Body: code, nombre, tipo_cliente_id, email, password (si habilitar_acceso), habilitar_acceso, activo, inhabilitado. Solo supervisores. 201, 422 (1105, 1106, 1107, 1108, 1104, 2116), 409 (4101, 4102), 403 (3101).

## Especificaciones de Referencia
- `specs/endpoints/clientes-create.md` – Contrato POST creación de cliente.
- `specs/models/cliente-model.md` – Modelo PQ_PARTES_cliente.
- `specs/errors/domain-error-codes.md` – Códigos 1104, 1105, 1106, 1107, 1108, 2116, 3101, 4101, 4102.

## Generado
- Fecha: 2026-01-31
- Regla aplicada: `.cursor/rules/13-user-story-to-task-breakdown.md`
- Prompt: PROMPTS/04 - Prompts-HU-a-Tareas.md (HU Simple)

## Implementación (TR-009)

### Backend
- `backend/app/Services/ClienteService.php` – create() con validaciones, User + Cliente si habilitar_acceso, regla 2116 (tipos genéricos antes de crear).
- `backend/app/Http/Controllers/Api/V1/ClienteController.php` – store() POST /api/v1/clientes; 201, 422, 409, 403.
- Migración `2026_01_31_000001_fix_clientes_user_id_unique_sqlserver.php`: índice único filtrado en user_id (SQL Server) para permitir múltiples clientes con user_id NULL.
- Tests: `backend/tests/Feature/Api/V1/ClienteControllerTest.php` – 14 tests (listado TR-008 + creación TR-009). **Todos pasan.**

### Frontend
- `frontend/src/features/clients/services/client.service.ts` – createCliente(), tipos CreateClienteBody, CreateClienteResult, ClienteCreadoItem.
- `frontend/src/features/clients/components/ClientesNuevaPage.tsx` – formulario creación en /clientes/nueva con data-testid.
- `frontend/src/features/clients/components/ClientesNuevaPage.css` – estilos.
- Ruta `/clientes/nueva` en App.tsx (SupervisorRoute).
- Tests unit: `frontend/src/features/clients/services/client.service.test.ts` – createCliente 201, 422, 409, 403. **Todos pasan.**
- E2E: `frontend/tests/e2e/clientes-create.spec.ts` – acceso formulario y creación sin acceso. **Requieren backend y frontend en ejecución** para pasar.

### Comandos
- Backend: `php artisan test --filter=ClienteControllerTest`
- Frontend unit: `npm run test:run` (en frontend/)
- E2E: `npm run test:e2e -- --grep "TR-009"` (con app levantada)
