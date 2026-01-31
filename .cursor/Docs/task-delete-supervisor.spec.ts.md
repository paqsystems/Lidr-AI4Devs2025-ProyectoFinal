# task-delete-supervisor.spec.ts

## Ubicación
`frontend/tests/e2e/task-delete-supervisor.spec.ts`

## Propósito
Tests E2E para **TR-032(MH) – Eliminación de Tarea (Supervisor)**. Verifica que un usuario supervisor (MGARCIA) pueda:
- Ver el modal de eliminación con información del empleado propietario (task.delete.employee).
- Eliminar cualquier tarea (incluida de otro empleado) tras confirmar.

## Dependencias
- Login como supervisor: usuario `MGARCIA`, contraseña `password456`.
- Lista de tareas con filtros; el API debe devolver `empleado` en cada ítem (backend listTasks con relación usuario).

## Escenarios
1. **debe mostrar modal con información del empleado al eliminar (supervisor)**  
   Login MGARCIA → /tareas → aplicar filtros → clic Eliminar en primera tarea → comprueba que el modal tiene task.delete.modal y task.delete.employee → Cancelar.

2. **debe eliminar tarea de otro al confirmar (supervisor)**  
   Mismo flujo → clic Eliminar → Confirmar → espera DELETE 200 → comprueba que el modal se cierra, aparece deleteSuccess y la fila desaparece.

## data-testid usados
- `auth.login.form`, `auth.login.usuarioInput`, `auth.login.passwordInput`, `auth.login.submitButton`
- `app.dashboard`
- `task.list.container`, `task.list.filters.apply`, `task.list.loading`, `task.list.delete.*`
- `task.delete.modal`, `task.delete.employee`, `task.delete.confirm`, `task.delete.cancel`
- `task.list.deleteSuccess`, `task.list.row.{id}`

## Ejecución
```bash
cd frontend
npx playwright test task-delete-supervisor.spec.ts --project=chromium
```

## Referencia
- TR-032(MH)-eliminación-de-tarea-supervisor.md
