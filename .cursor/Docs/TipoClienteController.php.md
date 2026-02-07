# TipoClienteController.php

## Ubicación
`backend/app/Http/Controllers/Api/V1/TipoClienteController.php`

## Propósito
Controlador API para ABM de tipos de cliente (TR-014 a TR-017). Solo supervisores; 403 (3101) si no.

## Endpoints
- **GET /api/v1/tipos-cliente**: sin query `page` → lista simple (selector); con `page` → listado paginado (resultado: items, total, page, page_size). Query: page, page_size, search, activo, inhabilitado, sort, sort_dir.
- **GET /api/v1/tipos-cliente/{id}**: 200 o 404 (4003).
- **POST /api/v1/tipos-cliente**: body code, descripcion, activo, inhabilitado. 201, 422 (validación), 409 (código duplicado 4102).
- **PUT /api/v1/tipos-cliente/{id}**: body descripcion, activo, inhabilitado. 200, 404, 422.
- **DELETE /api/v1/tipos-cliente/{id}**: 200, 404, 422 (código 2115 si tiene clientes).

## Referencias
- TR-014 a TR-017; TipoClienteService.
