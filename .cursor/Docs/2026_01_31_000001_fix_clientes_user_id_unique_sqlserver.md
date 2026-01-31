# Documentación: 2026_01_31_000001_fix_clientes_user_id_unique_sqlserver.php

## Descripción
Migración que corrige el índice único sobre `user_id` en la tabla `PQ_PARTES_CLIENTES` para entornos SQL Server. En SQL Server, un UNIQUE sobre una columna nullable trata múltiples NULL como duplicados, impidiendo insertar más de un cliente sin acceso (user_id NULL). Esta migración reemplaza el índice único por uno filtrado (solo filas con user_id IS NOT NULL), permitiendo muchos clientes con user_id NULL.

## Ubicación
`backend/database/migrations/2026_01_31_000001_fix_clientes_user_id_unique_sqlserver.php`

## Relación
- TR-009(MH)-creación-de-cliente – Creación de cliente sin acceso (user_id NULL).

## up()
- Si el driver es `sqlsrv`: elimina el índice `idx_clientes_user_id` y crea un índice único filtrado `WHERE [user_id] IS NOT NULL`.
- Otros drivers (MySQL/SQLite): no hace nada (el UNIQUE nullable ya permite múltiples NULL).

## down()
- Restaura el índice único sin filtro (comportamiento original).

## Comando
`php artisan migrate` (o `php artisan migrate --force` en producción).
