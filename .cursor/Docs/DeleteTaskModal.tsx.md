# DeleteTaskModal.tsx

## Ubicación
`frontend/src/features/tasks/components/DeleteTaskModal.tsx`

## Propósito
Componente modal de confirmación para eliminar una tarea (TR-030). Muestra información de la tarea (fecha, cliente, tipo, duración) y botones Confirmar / Cancelar.

## TR relacionada
TR-030(MH) – Eliminación de Tarea Propia.

## Props
- **task** (`TaskListItem | null`): Tarea a eliminar; si es `null` el modal no se renderiza.
- **loading** (boolean, opcional): Indica si la petición DELETE está en curso (deshabilita botones).
- **errorMessage** (string, opcional): Mensaje de error a mostrar (2111, 4030, 4040).
- **onConfirm** (función): Callback al hacer clic en Eliminar.
- **onCancel** (función): Callback al hacer clic en Cancelar.

## data-testid
- `task.delete.modal` – Contenedor del modal.
- `task.delete.confirm` – Botón confirmar eliminación.
- `task.delete.cancel` – Botón cancelar.
- `task.delete.error` – Bloque de mensaje de error.

## Accesibilidad
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`.
- Botones con `aria-label` para lectores de pantalla.

## Dependencias
- `TaskListItem` desde `../services/task.service`.
- `t` desde `../../../shared/i18n`.
- Estilos: `./DeleteTaskModal.css`.
