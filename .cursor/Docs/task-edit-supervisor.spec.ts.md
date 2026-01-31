# task-edit-supervisor.spec.ts

## Ubicación
`frontend/tests/e2e/task-edit-supervisor.spec.ts`

## Propósito
Tests E2E para **TR-031(MH) – Edición de Tarea (Supervisor)**. Verifica que un usuario con rol supervisor (MGARCIA) pueda:
- Ver el selector de empleado en el formulario de edición de tarea.
- Editar cualquier tarea y guardar cambios.

## Dependencias
- Login como supervisor: usuario `MGARCIA`, contraseña `password456`.
- Lista de tareas con filtros (fecha desde/hasta) y botón Aplicar.
- Backend con seeders TestUsersSeeder (MGARCIA supervisor) y tareas de prueba.

## Escenarios
1. **debe mostrar selector de empleado en formulario de edición (supervisor)**  
   Login MGARCIA → /tareas → aplicar filtros → clic Editar en primera tarea → comprueba que la URL es `/tareas/:id/editar`, que existe `task.edit.form`, `task.edit.employeeSelector` y `task.form.employeeSelect`.

2. **debe actualizar tarea al guardar (supervisor puede editar cualquier tarea)**  
   Mismo flujo hasta formulario de edición → rellena observación "Editado por supervisor TR-031" → submit → comprueba mensaje de éxito y redirección a `/tareas`.

## data-testid usados
- `auth.login.form`, `auth.login.usuarioInput`, `auth.login.passwordInput`, `auth.login.submitButton`
- `app.dashboard`
- `task.list.container`, `task.list.filters.apply`, `task.list.loading`, `task.list.edit.*`
- `task.edit.form`, `task.edit.employeeSelector`, `task.form.employeeSelect`
- `task.form.successMessage`

## Ejecución
```bash
cd frontend
npx playwright test task-edit-supervisor.spec.ts --project=chromium
```

## Referencia
- TR-031(MH)-edición-de-tarea-supervisor.md
