# Documentación: `frontend/src/features/tipoCliente/services/index.ts`

## Propósito
Barrel (punto de entrada) del módulo de servicios del feature **tipoCliente**. Permite que el feature exporte todo el servicio mediante `export * from './services'` en `tipoCliente/index.ts`, sin depender de la ruta interna del archivo del servicio.

## Contenido
- Re-exporta todo lo público de `tipoCliente.service.ts`:
  - Interfaces: `TipoClienteListItem`, `TiposClienteListParams`, `TiposClienteListResult`, `GetTipoClienteResult`, `CreateTipoClienteBody`, `UpdateTipoClienteBody`
  - Constante: `ERROR_TIENE_CLIENTES`
  - Funciones: `getTiposClienteList`, `getTipoCliente`, `createTipoCliente`, `updateTipoCliente`, `deleteTipoCliente`

## Relación con el error resuelto
Vite fallaba al resolver `"./services"` desde `tipoCliente/index.ts` porque existía la carpeta `services/` con `tipoCliente.service.ts` pero **no** un `services/index.ts`. En resolución de módulos, `./services` apunta a `services/index.ts` (o `services.ts`), no a un archivo concreto dentro de la carpeta. Crear este barrel corrige el error de importación.

## Convención del proyecto
Otros features (por ejemplo `clients`) ya usan el mismo patrón: carpeta `services/` con un `index.ts` que re-exporta el servicio.
