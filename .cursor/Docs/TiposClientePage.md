# TiposClientePage (componente + estilos)

## Ubicación
- `frontend/src/features/tipoCliente/components/TiposClientePage.tsx`
- `frontend/src/features/tipoCliente/components/TiposClientePage.css`

## Propósito
Página de listado de tipos de cliente (TR-014): tabla con código, descripción, estado, inhabilitado; búsqueda; filtros activo/inhabilitado; paginación (TaskPagination); botones Crear, Editar, Eliminar. Modal de confirmación de eliminación y mensaje cuando el API devuelve 2115 (tiene clientes asociados).

## data-testid
tiposCliente.list, tiposCliente.crear, tiposCliente.busqueda, tiposCliente.filters, tiposCliente.filtroActivo, tiposCliente.filtroInhabilitado, tiposCliente.filters.apply, tiposCliente.loading, tiposCliente.tabla, tiposCliente.editar.{id}, tiposCliente.eliminar.{id}, tiposCliente.delete.modal, tiposCliente.deleteConfirm.

## Navegación
- Crear → `/tipos-cliente/nuevo`
- Editar → `/tipos-cliente/:id/editar`

## Referencias
- TR-014, TR-015, TR-016, TR-017; tipoCliente.service.ts.
