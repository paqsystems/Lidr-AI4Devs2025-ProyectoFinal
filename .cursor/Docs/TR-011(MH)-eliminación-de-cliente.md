# Documentación: TR-011(MH)-eliminación-de-cliente.md

## Descripción
Plan de tareas (Task Report) para la implementación de la **eliminación de cliente** por supervisores. HU SIMPLE: verificación de que el cliente no tenga tareas asociadas (error 2112 si tiene); modal de confirmación con código y nombre; DELETE al confirmar; solo supervisores; integridad referencial.

## Ubicación
`docs/hu-tareas/TR-011(MH)-eliminación-de-cliente.md`

## HU Relacionada
`docs/hu-historias/HU-011(MH)-eliminación-de-cliente.md`

## Origen
- **Prompt:** PROMPTS/04 - Prompts-HU-a-Tareas.md (HU Simple).
- **Regla:** `.cursor/rules/13-user-story-to-task-breakdown.md`.
- **Clasificación:** HU SIMPLE.

## Resumen de Tareas

| ID | Tipo | Descripción | Estimación |
|----|------|-------------|------------|
| T1 | Backend | ClienteService::delete() – verificar tareas asociadas (2112), luego DELETE | M |
| T2 | Backend | DELETE /api/v1/clientes/{id} – 200, 422 (2112), 403, 404 | M |
| T3 | Backend | Tests unitarios regla "no eliminar si tiene tareas" | M |
| T4 | Backend | Tests integración DELETE /clientes/{id} | M |
| T5 | Frontend | Servicio deleteCliente(id) | S |
| T6 | Frontend | Modal confirmación (código, nombre, Cancelar, Confirmar) | M |
| T7 | Frontend | Integración botón Eliminar + modal + API | M |
| T8 | Tests | E2E Playwright eliminar cliente sin tareas | M |
| T9 | Tests | E2E cliente con tareas → mensaje 2112 (opcional) | S |
| T10| Frontend | Tests unit (Vitest) deleteCliente | S |
| T11| Docs | Actualizar specs/endpoints/clientes-delete.md | S |
| T12| Docs | Registrar en ia-log.md | S |

**Total:** 12 tareas (3S + 7M).

## Dependencias
- HU-010 (edición de cliente).
- HU-008 (listado de clientes).

## Endpoints Definidos
- `DELETE /api/v1/clientes/{id}` – Eliminar cliente. Solo supervisores. Verificar que no existan tareas en PQ_PARTES_registro_tarea con cliente_id = id; si existen → 422 (2112). Si no existen → 200, cliente eliminado. 403 (3101), 404 (4003).

## Especificaciones de Referencia
- `specs/endpoints/clientes-delete.md` – Contrato DELETE eliminación de cliente.
- `specs/errors/domain-error-codes.md` – Códigos 2112, 3101, 4003.

## Generado
- Fecha: 2026-01-31
- Regla aplicada: `.cursor/rules/13-user-story-to-task-breakdown.md`
- Prompt: PROMPTS/04 - Prompts-HU-a-Tareas.md (HU Simple)

## Implementación (TR-011)

### Backend
- `backend/app/Services/ClienteService.php` – delete(id): verifica RegistroTarea::where('cliente_id', $id)->exists(); si existe lanza ERROR_TIENE_TAREAS (2112); si no existe elimina el cliente. Constante ERROR_TIENE_TAREAS = 2112.
- `backend/app/Http/Controllers/Api/V1/ClienteController.php` – destroy(id) DELETE /api/v1/clientes/{id}; 200, 422 (2112), 403, 404.
- Ruta DELETE `/api/v1/clientes/{id}` en `backend/routes/api.php`.
- Tests: `ClienteControllerTest` – test_destroy_supervisor_sin_tareas_retorna_200, test_destroy_cliente_con_tareas_retorna_422, test_destroy_id_inexistente_retorna_404, test_destroy_empleado_retorna_403. **Todos los tests TR-011 pasan.**

### Frontend
- `frontend/src/features/clients/services/client.service.ts` – deleteCliente(id), DeleteClienteResult, ERROR_TIENE_TAREAS.
- `frontend/src/features/clients/components/ClientesPage.tsx` – estado clienteToDelete, deleteLoading, deleteError, successMessage; botón "Eliminar" por fila (data-testid clientes.row.{id}.delete); modal de confirmación (clientes.delete.modal, clientes.delete.code, clientes.delete.nombre, clientes.delete.confirm, clientes.delete.cancel); al confirmar llama deleteCliente(id), éxito: cierra modal y recarga listado, mensaje de éxito 3s; error 2112: se muestra en modal.
- `frontend/src/features/clients/components/ClientesPage.css` – .clientes-page-btn-delete, .clientes-page-success, .clientes-delete-modal-overlay, .clientes-delete-modal, .clientes-delete-modal-btn-cancel.
- Tests unit: `client.service.test.ts` – deleteCliente 200, 422 (2112), 404. **Todos pasan.**

### Comandos
- Backend: `php artisan test --filter=ClienteControllerTest`
- Frontend unit: `npm run test:run` (en frontend/)
