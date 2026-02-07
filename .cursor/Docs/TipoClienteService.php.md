# TipoClienteService.php

## Ubicación
`backend/app/Services/TipoClienteService.php`

## Propósito
Servicio de dominio para el ABM de tipos de cliente (TR-014, TR-015, TR-016, TR-017): listado paginado con filtros, obtención por ID, creación, actualización y eliminación.

## Constantes de error
- `ERROR_FORBIDDEN` 3101
- `ERROR_NOT_FOUND` 4003
- `ERROR_CODE_DUPLICATE` 4102 (código ya existe)
- `ERROR_TIENE_CLIENTES` 2115 (no se puede eliminar: tiene clientes asociados)

## Métodos principales
- **listado(page, pageSize, search, activo, inhabilitado, sort, sortDir)**: devuelve array con `items`, `total`, `page`, `page_size`. Búsqueda en code/descripcion; filtros activo/inhabilitado opcionales.
- **getById(id)**: lanza excepción con código ERROR_NOT_FOUND si no existe.
- **create(data)**: valida código único; lanza con ERROR_CODE_DUPLICATE si duplicado.
- **update(id, data)**: solo descripcion, activo, inhabilitado; lanza ERROR_NOT_FOUND si no existe.
- **delete(id)**: no elimina si `$tipo->clientes()->exists()`; en ese caso lanza con ERROR_TIENE_CLIENTES.

## Referencias
- TR-014 a TR-017 (listado, creación, edición, eliminación de tipo de cliente).
