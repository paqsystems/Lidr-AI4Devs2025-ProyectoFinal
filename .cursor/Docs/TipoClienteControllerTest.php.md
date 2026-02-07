# TipoClienteControllerTest.php

## Ubicación
`backend/tests/Feature/Api/V1/TipoClienteControllerTest.php`

## Propósito
Tests de integración del TipoClienteController (TR-014 a TR-017): listado con/sin page, 403 empleado, 401 sin token, show 200/404, store 201/409/422, update 200/404, destroy 200/404/422 (2115 con clientes).

## Casos
- index sin page → 200 array; index con page → 200 paginado; index empleado → 403; index sin token → 401.
- show 200, show 404.
- store 201, store código duplicado 409, store sin descripcion 422.
- update 200, update 404.
- destroy sin clientes 200 (crea tipo y lo elimina), destroy con clientes 422 código 2115, destroy 404.

## Referencias
- TR-014 a TR-017; TipoClienteController, TipoClienteService.
