# tipoCliente.service.ts

## Ubicación
`frontend/src/features/tipoCliente/services/tipoCliente.service.ts`

## Propósito
Cliente API para ABM de tipos de cliente: listado paginado, obtener por ID, crear, actualizar, eliminar. Usado por TiposClientePage, TiposClienteNuevaPage, TiposClienteEditarPage.

## Funciones
- **getTiposClienteList(params)**: page, page_size, search, activo, inhabilitado, sort, sort_dir. Devuelve success, data (items), pagination.
- **getTipoCliente(id)**: GET /tipos-cliente/{id}.
- **createTipoCliente(body)**: code, descripcion, activo, inhabilitado.
- **updateTipoCliente(id, body)**: descripcion, activo, inhabilitado.
- **deleteTipoCliente(id)**: DELETE; error 2115 cuando tiene clientes asociados.

## Constante
- `ERROR_TIENE_CLIENTES = 2115`

## Referencias
- TR-014 a TR-017; backend TipoClienteController.
