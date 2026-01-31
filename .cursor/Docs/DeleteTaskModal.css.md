# DeleteTaskModal.css

## Ubicación
`frontend/src/features/tasks/components/DeleteTaskModal.css`

## Propósito
Estilos del modal de confirmación de eliminación de tarea (TR-030): overlay, contenido, título, descripción, bloque de información de la tarea, mensaje de error y botones.

## Clases principales
- **delete-task-modal-overlay**: Overlay fijo a pantalla completa, centrado, z-index 1000.
- **delete-task-modal-content**: Contenedor del diálogo (fondo blanco, sombra, max-width 420px).
- **delete-task-modal-title** / **delete-task-modal-desc**: Título y texto de confirmación.
- **delete-task-modal-info**: Bloque con fecha, cliente, tipo, duración (dl/dt/dd).
- **delete-task-modal-error**: Mensaje de error (fondo rojo claro, texto rojo).
- **delete-task-modal-actions**: Contenedor de botones (flex-end).
- **delete-task-modal-btn-cancel** / **delete-task-modal-btn-confirm**: Botón secundario y primario (rojo para confirmar).

## TR relacionada
TR-030(MH) – Eliminación de Tarea Propia.
