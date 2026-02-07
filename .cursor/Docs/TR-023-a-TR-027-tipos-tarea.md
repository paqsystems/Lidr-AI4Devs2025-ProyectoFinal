# Documentación: TR-023 a TR-027 (Tipos de Tarea)

## Origen
Generados aplicando el **prompt correspondiente a las historias HU-023 a HU-027** según la regla `.cursor/rules/16-prompt-dispatcher.md` (PARTE A – Generación de TR desde HU).

- Clasificación: **HU Simple** (ABM análogo a tipos de cliente).
- Fuente de verdad para descomposición: `.cursor/rules/13-user-story-to-task-breakdown.md`.
- Prompts utilizados: sección HU Simple de `.cursor/rules/16-hu-simple-vs-hu-compleja.md` (reemplazo de placeholder `[HU]` por contenido de cada HU).

## Archivos generados

| TR | HU | Título | Ruta |
|----|-----|--------|------|
| TR-023 | HU-023 | Listado de tipos de tarea | `docs/hu-tareas/TR-023(MH)-listado-de-tipos-de-tarea.md` |
| TR-024 | HU-024 | Creación de tipo de tarea | `docs/hu-tareas/TR-024(MH)-creación-de-tipo-de-tarea.md` |
| TR-025 | HU-025 | Edición de tipo de tarea | `docs/hu-tareas/TR-025(MH)-edición-de-tipo-de-tarea.md` |
| TR-026 | HU-026 | Eliminación de tipo de tarea | `docs/hu-tareas/TR-026(MH)-eliminación-de-tipo-de-tarea.md` |
| TR-027 | HU-027 | Visualización de detalle de tipo de tarea | `docs/hu-tareas/TR-027(SH)-visualización-de-detalle-de-tipo-de-tarea.md` |

## Resumen de alcance

- **TR-023:** GET /api/v1/tipos-tarea (listado ABM paginado con búsqueda y filtros; sin page = selector). Frontend: sección Tipos de Tarea, tabla, Crear/Editar/Eliminar.
- **TR-024:** POST /api/v1/tipos-tarea. Validaciones: código único, descripción obligatoria, regla único por defecto (código 2117). Frontend: formulario creación con por defecto → genérico forzado.
- **TR-025:** GET/PUT /api/v1/tipos-tarea/{id}. Código solo lectura en edición; mismas reglas que creación (2117). Frontend: formulario edición.
- **TR-026:** DELETE /api/v1/tipos-tarea/{id}. Verificación tareas y clientes asociados; 422 con código 2114 si está en uso. Frontend: modal confirmación y mensaje 2114.
- **TR-027:** Pantalla detalle /tipos-tarea/:id con datos del tipo, clientes asociados (si no genérico), enlaces Editar/Eliminar. Reutiliza/amplía GET tipo.

## Códigos de error referenciados

- **2114:** No se puede eliminar tipo de tarea en uso (RegistroTarea o ClienteTipoTarea) — TR-026.
- **2117:** Solo puede haber un tipo de tarea por defecto — TR-024, TR-025.

Ambos están documentados en `specs/errors/domain-error-codes.md`.

## Próximos pasos

Para **ejecutar** cada TR (implementación): usar el comando definido en la PARTE B del dispatcher:  
> Ejecutá la TR TR-xxx.md  

y el archivo de prompt `PROMPTS/05-Ejecucion-de-una-TR.md` (o equivalente en `docs/prompts/`).
