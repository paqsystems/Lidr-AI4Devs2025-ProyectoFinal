# UpdateTaskRequest.php

## Ubicación
`backend/app/Http/Requests/Api/V1/UpdateTaskRequest.php`

## Propósito
FormRequest que valida los datos del body para actualizar una tarea existente (PUT /api/v1/tasks/{id}). Mismas reglas que CreateTaskRequest excepto que no incluye `usuario_id` (no modificable en edición).

## Uso
- Usado por `TaskController::update(UpdateTaskRequest $request, int $id)`.
- Reglas: fecha (Y-m-d), cliente_id, tipo_tarea_id, duracion_minutos (múltiplo 15), sin_cargo, presencial, observacion.
- Código de error 4220 en validación fallida (failedValidation).

## Referencia
- TR-029(MH)-edición-de-tarea-propia.md
