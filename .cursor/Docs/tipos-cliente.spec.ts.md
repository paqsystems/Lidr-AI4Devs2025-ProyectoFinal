# tipos-cliente.spec.ts

## Ubicación
`frontend/tests/e2e/tipos-cliente.spec.ts`

## Propósito
Tests E2E Playwright para tipos de cliente (TR-014 a TR-017): listado (supervisor accede, ve tabla/filtros, empleado redirigido), creación, edición, eliminación.

## Escenarios
- Supervisor accede a /tipos-cliente y ve la lista.
- Supervisor ve tabla o vacío, total, filtros.
- Empleado sin permisos redirigido al acceder a /tipos-cliente.
- Supervisor puede crear tipo (nuevo → formulario → submit → listado).
- Supervisor puede editar tipo (listado → editar → formulario → submit → listado).
- Supervisor puede eliminar tipo (listado → eliminar → modal confirmar).

## Usuarios
- SUPERVISOR: MGARCIA / password456
- EMPLEADO: JPEREZ / password123

## Referencias
- TR-014, TR-015, TR-016, TR-017.
