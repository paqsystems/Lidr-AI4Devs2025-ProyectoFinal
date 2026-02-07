# Documentación: ProcesoMasivoPage.tsx

## Propósito
Página de **Proceso Masivo de Tareas** (TR-039 a TR-043). Solo accesible para supervisores. Permite filtrar tareas por rango de fechas, cliente, empleado y estado (Todos/Abiertos/Cerrados), seleccionar múltiples tareas con checkboxes y procesarlas en lote (invertir estado cerrado/abierto).

## Ubicación
- **Componente:** `frontend/src/features/tasks/components/ProcesoMasivoPage.tsx`
- **Estilos:** `frontend/src/features/tasks/components/ProcesoMasivoPage.css`
- **Ruta:** `/tareas/proceso-masivo` (protegida por SupervisorRoute en App.tsx)

## Funcionalidad
- **TR-039:** Acceso solo supervisores; enlace "Proceso Masivo" en Dashboard.
- **TR-040:** Filtros fecha desde/hasta, cliente, empleado, estado; botón "Aplicar Filtros"; total de tareas filtradas; validación 1305 en backend si fecha_desde > fecha_hasta.
- **TR-041:** Checkbox por fila, "Seleccionar todos", "Deseleccionar todos", contador "X tareas seleccionadas".
- **TR-042:** Botón "Procesar" (habilitado con al menos una selección); modal de confirmación; llamada POST bulk-toggle-close; mensaje "Se procesaron X registros"; recarga de lista.
- **TR-043:** Botón "Procesar" deshabilitado cuando no hay selección; mensaje de error si backend devuelve 422 (1212).

## Dependencias
- `getAllTasks`, `bulkToggleClose` de `task.service`
- `ClientSelector`, `EmployeeSelector`, `TaskPagination`, `TaskTotals`, `Modal`
- `t()` (i18n)

## data-testid
- procesoMasivo.page, procesoMasivo.filtros, procesoMasivo.filtroFechaDesde, procesoMasivo.filtroFechaHasta, procesoMasivo.filtroCliente, procesoMasivo.filtroEmpleado, procesoMasivo.filtroEstado, procesoMasivo.aplicarFiltros, procesoMasivo.total, procesoMasivo.seleccionarTodos, procesoMasivo.deseleccionarTodos, procesoMasivo.contadorSeleccionadas, procesoMasivo.checkboxTarea.{id}, procesoMasivo.procesar, procesoMasivo.procesando, procesoMasivo.mensajeExito, procesoMasivo.mensajeError, procesoMasivo.confirmModal.
