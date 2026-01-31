# Documentación: TR-010(MH)-edición-de-cliente.md

## Descripción
Plan de tareas (Task Report) para la implementación de la **edición de cliente** por supervisores. HU SIMPLE: formulario con datos actuales, código en solo lectura; edición de nombre, tipo de cliente, email, activo, inhabilitado; opción cambiar contraseña y habilitar/deshabilitar acceso cuando el cliente tiene user_id; sincronización USERS y PQ_PARTES_cliente; regla de tipos de tarea (2116).

## Ubicación
`docs/hu-tareas/TR-010(MH)-edición-de-cliente.md`

## HU Relacionada
`docs/hu-historias/HU-010(MH)-edición-de-cliente.md`

## Origen
- **Prompt:** PROMPTS/04 - Prompts-HU-a-Tareas.md (HU Simple).
- **Regla:** `.cursor/rules/13-user-story-to-task-breakdown.md`.
- **Clasificación:** HU SIMPLE.

## Resumen de Tareas

| ID | Tipo | Descripción | Estimación |
|----|------|-------------|------------|
| T1 | Backend | GET /api/v1/clientes/{id} – datos para edición | S |
| T2 | Backend | ClienteService::update() – validaciones, actualización cliente y USERS | L |
| T3 | Backend | PUT /api/v1/clientes/{id} – 200, 422, 409, 403, 404 | M |
| T4 | Backend | Tests unitarios servicio update | M |
| T5 | Backend | Tests integración GET y PUT /clientes/{id} | M |
| T6 | Frontend | Servicio getCliente(id), updateCliente(id, body) | S |
| T7 | Frontend | ClientesEditarPage – formulario con código solo lectura | M |
| T8 | Frontend | Integración formulario con API | M |
| T9 | Tests | E2E Playwright editar cliente y ver cambios en listado | M |
| T10| Tests | E2E cambio contraseña y estado | S |
| T11| Frontend | Tests unit (Vitest) servicio | S |
| T12| Docs | Actualizar specs clientes-get y clientes-update | S |
| T13| Docs | Registrar en ia-log.md | S |

**Total:** 13 tareas (4S + 7M + 1L).

## Dependencias
- HU-009 (creación de cliente).
- HU-008 (listado de clientes).

## Endpoints Definidos
- `GET /api/v1/clientes/{id}` – Obtener cliente para edición. Solo supervisores. 200, 403, 404 (4003).
- `PUT /api/v1/clientes/{id}` – Actualizar cliente. Body: nombre, tipo_cliente_id, email, password, activo, inhabilitado, habilitar_acceso. Código no modificable. Solo supervisores. 200, 422 (1106, 1107, 1108, 1104, 2116), 409 (4102), 403 (3101), 404 (4003).

## Especificaciones de Referencia
- `specs/endpoints/clientes-get.md` – Contrato GET cliente por id.
- `specs/endpoints/clientes-update.md` – Contrato PUT actualización de cliente.
- `specs/errors/domain-error-codes.md` – Códigos 1104, 1106, 1107, 1108, 2116, 3101, 4003, 4102.

## Generado
- Fecha: 2026-01-31
- Regla aplicada: `.cursor/rules/13-user-story-to-task-breakdown.md`
- Prompt: PROMPTS/04 - Prompts-HU-a-Tareas.md (HU Simple)

## Implementación (TR-010)

### Backend
- `backend/app/Services/ClienteService.php` – getById(id), update(id, data). update: validaciones, sincronización USERS (password, activo, inhabilitado), deshabilitar acceso (user_id = null), habilitar acceso (crear User y vincular), regla 2116.
- `backend/app/Http/Controllers/Api/V1/ClienteController.php` – show(id) GET /api/v1/clientes/{id}, update(id) PUT /api/v1/clientes/{id}; 200, 422, 409, 403, 404.
- Rutas: GET y PUT `/api/v1/clientes/{id}` en `backend/routes/api.php`.
- Tests: `ClienteControllerTest` – test_show_supervisor_retorna_200, test_show_id_inexistente_retorna_404, test_show_empleado_retorna_403, test_update_supervisor_retorna_200, test_update_id_inexistente_retorna_404, test_update_nombre_vacio_retorna_422. **Todos los tests TR-010 pasan.** (Nota: test_store_supervisor_crea_cliente_sin_acceso_201 de TR-009 puede fallar con 500 si no está aplicada la migración del índice user_id en SQL Server.)

### Frontend
- `frontend/src/features/clients/services/client.service.ts` – getCliente(id), updateCliente(id, body); tipos ClienteDetalleItem, GetClienteResult, UpdateClienteBody, UpdateClienteResult, ClienteActualizadoItem.
- `frontend/src/features/clients/components/ClientesEditarPage.tsx` – formulario edición en /clientes/:id/editar; código solo lectura; carga con getCliente(id); submit con updateCliente(id, body); opción contraseña y habilitar/deshabilitar acceso según tiene_acceso; data-testid clientes.edit.*.
- Ruta `/clientes/:id/editar` en App.tsx (SupervisorRoute).
- En ClientesPage: columna "Acciones" con botón "Editar" por fila que navega a /clientes/:id/editar.
- Tests unit: `client.service.test.ts` – getCliente 200/404, updateCliente 200/422. **Todos pasan.**

### Comandos
- Backend: `php artisan test --filter=ClienteControllerTest`
- Frontend unit: `npm run test:run` (en frontend/)
