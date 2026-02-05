# EmpleadosDetallePage.css

## Ubicación
`frontend/src/features/employees/components/EmpleadosDetallePage.css`

## Propósito
Estilos de la página de detalle de empleado (TR-022 SH). Incluye layout de la página, card de datos (dl/dt/dd), botones de acción y estilos del modal de eliminación (reutilizando nombres de clase de EmpleadosPage donde aplica).

## Clases principales
- `.empleados-detalle-page` – Contenedor principal.
- `.empleados-detalle-header`, `.empleados-detalle-title`, `.empleados-detalle-actions` – Cabecera y botones.
- `.empleados-detalle-btn-edit`, `.empleados-detalle-btn-delete`, `.empleados-detalle-btn-back` – Botones de acción.
- `.empleados-detalle-loading`, `.empleados-detalle-error` – Estados loading y error.
- `.empleados-detalle-card`, `.empleados-detalle-section-title`, `.empleados-detalle-dl`, `.empleados-detalle-row`, `.empleados-detalle-row dt`, `.empleados-detalle-row dd` – Card de datos.
- Modal: `.empleados-delete-modal-overlay`, `.empleados-delete-modal`, etc. (scoped bajo `.empleados-detalle-page`).

## Referencias
- `docs/hu-tareas/TR-022(SH)-visualización-de-detalle-de-empleado.md`
