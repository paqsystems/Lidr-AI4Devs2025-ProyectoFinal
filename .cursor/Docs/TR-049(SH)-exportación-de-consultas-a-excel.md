# Documentación: TR-049(SH) – Exportación de consultas a Excel

## Propósito
Documento de Tarea/Requisito generado a partir de **HU-049(SH)** (Épica 9: Informes y Consultas). Define la exportación de resultados de consultas a Excel (XLSX): botón "Exportar a Excel" en cada consulta (detallada, por empleado, por cliente, por tipo, por fecha); habilitado solo con resultados; mensaje "No hay datos para exportar" cuando no hay datos; datos respetando permisos por rol; archivo con nombre descriptivo; horas en decimal y fechas formateadas.

## Ubicación
- **TR:** `docs/hu-tareas/TR-049(SH)-exportación-de-consultas-a-excel.md`
- **HU:** `docs/hu-historias/HU-049(SH)-exportación-de-consultas-a-excel.md`

## Contenido principal
- **Backend (opcional):** Endpoint GET de exportación que devuelve archivo XLSX con mismos filtros que los reportes; o implementación 100% en frontend a partir de datos ya cargados.
- **Frontend:** Botón "Exportar a Excel" en consulta detallada y en cada consulta agrupada (por empleado, cliente, tipo, fecha); habilitado solo si hay resultados; mensaje "No hay datos para exportar" y botón deshabilitado si no hay datos; generación/descarga de XLSX (nombre descriptivo, horas decimal, fechas formateadas; consulta detallada: todas las columnas; agrupada: totales y detalle).
- **Dependencias:** HU-044, HU-045, HU-046, HU-047, HU-048 (todas las pantallas de consulta).

## Reglas de negocio
- Los datos exportados respetan los mismos filtros automáticos que las consultas en pantalla (por rol).
- Botón deshabilitado si no hay resultados.

## Generación
Generado aplicando el **prompt correspondiente a la historia HU-049** según la regla `.cursor/rules/16-prompt-dispatcher.md` (PARTE A – Generación de TR desde HU), clasificación HU SIMPLE.

## Próximos pasos
Para implementar: **Ejecutá la TR TR-049(SH).md** (PARTE B del dispatcher).
