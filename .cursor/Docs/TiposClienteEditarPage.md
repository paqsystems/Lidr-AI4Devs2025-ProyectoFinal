# TiposClienteEditarPage.tsx

## Ubicación
`frontend/src/features/tipoCliente/components/TiposClienteEditarPage.tsx`

## Propósito
Formulario de edición de tipo de cliente (TR-016): código en solo lectura; descripción, activo, inhabilitado editables. Carga con `getTipoCliente(id)`; envío con `updateTipoCliente(id, body)`. Redirección a `/tipos-cliente` al éxito.

## data-testid
tipoClienteEditar.form, tipoClienteEditar.code, tipoClienteEditar.descripcion, tipoClienteEditar.submit.

## Referencias
- TR-016; tipoCliente.service.ts; TiposClientePage.css.
