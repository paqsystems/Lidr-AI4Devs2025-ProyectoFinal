# Documentación: ReportController.php

## Descripción
Controlador de informes. Expone GET /api/v1/reports/detail (TR-044) para consulta detallada de tareas con filtros por rol, período, paginación y total_horas. Devuelve 422 con error 1305 si fecha_desde > fecha_hasta.

## Ubicación
`backend/app/Http/Controllers/Api/V1/ReportController.php`

## Endpoints
- GET /api/v1/reports/detail – Query: page, per_page, fecha_desde, fecha_hasta, tipo_cliente_id, cliente_id, usuario_id, ordenar_por, orden. Respuesta: data[], pagination, total_horas.

## Generado
- Fecha: 2026-01-30
- TR: TR-044(MH)-consulta-detallada-de-tareas.md
