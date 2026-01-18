# CONTRATO BASE DE APIs — Sistema de Partes (Laravel + Sanctum)

Este documento amplía el contrato base definido en `/.cursor/rules/01-api-contract.md`.

## Principios
- Respuesta uniforme: `error/respuesta/resultado`.
- JSON UTF-8.
- Versionado en ruta: `/api/v1`.

## Paginación/filtros
- `page`, `page_size`, `sort`, `sort_dir`, filtros por querystring.
- Whitelist en campos dinámicos.

## Errores
- No exponer detalles internos.
- Mapear excepciones a `error` 9999 en producción.

---
