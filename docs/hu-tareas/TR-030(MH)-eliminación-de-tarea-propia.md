# TR-030(MH) – Eliminación de Tarea Propia

| Campo              | Valor                                      |
|--------------------|--------------------------------------------|
| HU relacionada     | HU-030(MH)-eliminación-de-tarea-propia      |
| Épica              | Épica 7: Registro de Tareas                |
| Prioridad          | MUST-HAVE                                  |
| Roles              | Empleado                                   |
| Dependencias       | HU-028 (Carga de Tarea Diaria)             |
| Clasificación      | HU SIMPLE                                  |
| Última actualización | 2026-01-28                               |
| Estado             | 📋 PENDIENTE                               |

---

## 1) HU Refinada

### Título
Eliminación de Tarea Propia

### Narrativa
**Como** empleado  
**Quiero** eliminar una tarea que registré incorrectamente  
**Para** mantener la precisión de los registros

### Contexto/Objetivo
Los empleados necesitan poder eliminar tareas registradas incorrectamente. Esta funcionalidad permite eliminar tareas propias no cerradas, con diálogo de confirmación para evitar eliminaciones accidentales.

### Suposiciones explícitas
- El usuario ya está autenticado como empleado
- La tarea existe y pertenece al usuario autenticado
- La tabla `PQ_PARTES_REGISTRO_TAREA` ya existe
- Existe lista de tareas desde donde se accede a la eliminación

### In Scope
- Acceso a eliminación desde lista de tareas
- Validación de permisos (solo tareas propias)
- Validación de estado (no cerrada)
- Diálogo de confirmación con información de la tarea
- Eliminación física del registro en BD
- Mensaje de confirmación
- Actualización de lista después de eliminar

### Out of Scope
- Eliminación de tareas cerradas
- Eliminación de tareas de otros usuarios
- Eliminación lógica (soft delete)
- Historial de eliminaciones
- Recuperación de tareas eliminadas

---

## 2) Criterios de Aceptación (AC)

- **AC-01**: El empleado puede acceder a la opción de eliminar desde la lista de sus tareas
- **AC-02**: Solo puede eliminar tareas propias (`usuario_id` coincide con usuario autenticado)
- **AC-03**: El sistema valida que la tarea no esté cerrada (`cerrado = false`)
- **AC-04**: Si la tarea está cerrada, se muestra error 2111 y no se permite eliminación
- **AC-05**: Se muestra diálogo de confirmación antes de eliminar
- **AC-06**: El diálogo muestra información de la tarea: fecha, cliente, tipo, duración
- **AC-07**: El usuario debe confirmar explícitamente la eliminación
- **AC-08**: Al confirmar, se elimina el registro de la base de datos
- **AC-09**: Se muestra mensaje de confirmación después de eliminar
- **AC-10**: La tarea desaparece de la lista inmediatamente

### Escenarios Gherkin

```gherkin
Feature: Eliminación de Tarea Propia

  Scenario: Empleado elimina tarea propia exitosamente
    Given el empleado "JPEREZ" está autenticado
    And existe una tarea con id=1, usuario_id=JPEREZ, cerrado=false
    When accede a eliminar la tarea id=1
    Then se muestra diálogo de confirmación con información de la tarea
    When confirma la eliminación
    Then se elimina el registro de la BD
    And se muestra mensaje de confirmación
    And la tarea desaparece de la lista

  Scenario: Empleado cancela eliminación
    Given el empleado "JPEREZ" está autenticado
    And existe una tarea con id=1, usuario_id=JPEREZ, cerrado=false
    When accede a eliminar la tarea id=1
    Then se muestra diálogo de confirmación
    When cancela la eliminación
    Then el diálogo se cierra
    And la tarea permanece en la lista

  Scenario: Empleado no puede eliminar tarea cerrada
    Given el empleado "JPEREZ" está autenticado
    And existe una tarea con id=1, usuario_id=JPEREZ, cerrado=true
    When intenta eliminar la tarea id=1
    Then se muestra error 2111
    And no se permite la eliminación

  Scenario: Empleado no puede eliminar tarea de otro usuario
    Given el empleado "JPEREZ" está autenticado
    And existe una tarea con id=1, usuario_id=MGARCIA, cerrado=false
    When intenta eliminar la tarea id=1
    Then se muestra error 403
    And no se permite la eliminación
```

---

## 3) Reglas de Negocio

1. **RN-01**: Solo el autor puede eliminar su tarea (`usuario_id` debe coincidir con usuario autenticado)
2. **RN-02**: Una tarea cerrada (`cerrado = true`) no se puede eliminar
3. **RN-03**: Código de error 2111: "No se puede eliminar una tarea cerrada"
4. **RN-04**: Código de error 403: "No tiene permisos para eliminar esta tarea"
5. **RN-05**: Se requiere confirmación explícita del usuario antes de eliminar
6. **RN-06**: La eliminación es física (DELETE FROM), no lógica

### Permisos por Rol
- **Empleado**: Solo puede eliminar sus propias tareas no cerradas
- **Supervisor**: Puede eliminar cualquier tarea (ver TR-032)

---

## 4) Impacto en Datos

### Tablas Afectadas
- `PQ_PARTES_REGISTRO_TAREA`: Eliminación física de registro

### Cambios en Datos
- No se requieren nuevas columnas ni migraciones
- Se elimina registro completo de la tabla

### Seed Mínimo para Tests
```php
// En TestTasksSeeder o similar:
- Tarea eliminable: id=1, usuario_id=JPEREZ, cerrado=false
- Tarea cerrada: id=2, usuario_id=JPEREZ, cerrado=true
- Tarea de otro usuario: id=3, usuario_id=MGARCIA, cerrado=false
```

---

## 5) Contratos de API

### Endpoint: DELETE `/api/v1/tasks/{id}`

**Descripción:** Eliminar una tarea existente.

**Autenticación:** Requerida (Bearer token)

**Autorización:** 
- Empleado: Solo puede eliminar sus propias tareas no cerradas
- Supervisor: Puede eliminar cualquier tarea no cerrada

**Response 200 OK:**
```json
{
  "error": 0,
  "respuesta": "Tarea eliminada correctamente",
  "resultado": {}
}
```

**Response 404 Not Found:**
```json
{
  "error": 4040,
  "respuesta": "Tarea no encontrada",
  "resultado": null
}
```

**Response 2111 Bad Request (Tarea cerrada):**
```json
{
  "error": 2111,
  "respuesta": "No se puede eliminar una tarea cerrada",
  "resultado": null
}
```

**Response 403 Forbidden:**
```json
{
  "error": 4030,
  "respuesta": "No tiene permisos para eliminar esta tarea",
  "resultado": null
}
```

---

## 6) Cambios Frontend

### Pantallas/Componentes Afectados
- **TaskList**: Agregar botón "Eliminar" por cada tarea
- **DeleteTaskModal**: Nuevo componente modal de confirmación
- **task.service.ts**: Agregar función `deleteTask(id)`

### Estados UI
- **Loading**: Eliminando tarea
- **Error**: Error al eliminar (tarea no encontrada, cerrada, sin permisos)
- **Success**: Tarea eliminada exitosamente
- **Modal**: Diálogo de confirmación visible/oculto

### Validaciones en UI
- Validar que tarea no esté cerrada antes de mostrar botón eliminar
- Validar permisos antes de mostrar botón eliminar
- Mostrar información de la tarea en el diálogo de confirmación

### Accesibilidad Mínima
- `data-testid="task.delete.button"` en botón eliminar
- `data-testid="task.delete.modal"` en modal de confirmación
- `data-testid="task.delete.confirm"` en botón confirmar
- `data-testid="task.delete.cancel"` en botón cancelar
- Labels y roles ARIA apropiados

---

## 7) Plan de Tareas / Tickets

| ID | Tipo | Descripción | DoD | Dependencias | Estimación |
|----|------|-------------|-----|--------------|------------|
| T1 | Backend | TaskService::delete() | Lógica de negocio, validación permisos y estado | TR-028 | M |
| T2 | Backend | TaskController::destroy() | Endpoint DELETE /tasks/{id} | T1 | S |
| T3 | Backend | Tests unitarios TaskService::delete() | 4+ tests (éxito, cerrada, sin permisos, no encontrada) | T1 | M |
| T4 | Backend | Tests integración TaskController | 4+ tests (DELETE) | T2 | M |
| T5 | Frontend | Servicio task.service.ts::deleteTask() | Función para eliminar tarea | TR-028 | S |
| T6 | Frontend | DeleteTaskModal componente | Modal de confirmación con información | TR-028 | M |
| T7 | Frontend | TaskList botón eliminar | Agregar botón por tarea, abrir modal | TR-033 | S |
| T8 | Frontend | Manejo de errores | Mostrar errores 2111, 403, 404 | T6 | S |
| T9 | Tests | E2E Playwright eliminación exitosa | Flujo completo: lista → eliminar → confirmar → verificar | T6, T7 | M |
| T10 | Tests | E2E Playwright tarea cerrada | Verificar error 2111 | T6 | S |
| T11 | Tests | E2E Playwright sin permisos | Verificar error 403 | T6 | S |
| T12 | Tests | Frontend unit tests (Vitest) | Tests para task.service.ts deleteTask() (mock API, errores 2111/403/404) | T5 | S |
| T13 | Docs | Actualizar docs/backend/tareas.md | Documentar endpoint DELETE | T2 | S |
| T14 | Docs | Registrar en ia-log.md | Entrada de implementación | T13 | S |

**Total:** 14 tareas (8S + 5M + 1L implícito)

---

## 8) Estrategia de Tests

### Unit Tests (TaskService)
- `delete_exitoso_elimina_tarea`
- `delete_falla_tarea_cerrada_retorna_error_2111`
- `delete_falla_sin_permisos_retorna_error_403`
- `delete_falla_tarea_no_encontrada_retorna_error_404`

### Integration Tests (TaskController)
- `destroy_exitoso_elimina_tarea`
- `destroy_falla_tarea_no_encontrada_retorna_404`
- `destroy_falla_tarea_cerrada_retorna_2111`
- `destroy_falla_sin_permisos_retorna_403`

### Frontend unit tests (Vitest)
- Tests para `task.service.ts`: `deleteTask(id)` con mock de fetch, manejo de respuestas 200/2111/403/404.

### E2E Tests (Playwright)
- **Flujo completo**: Login → Lista tareas → Click eliminar → Confirmar → Verificar eliminación
- **Cancelar**: Login → Lista tareas → Click eliminar → Cancelar → Verificar que tarea permanece
- **Tarea cerrada**: Login → Lista tareas → Intentar eliminar tarea cerrada → Verificar error 2111
- **Sin permisos**: Login → Intentar eliminar tarea de otro usuario → Verificar error 403

---

## 9) Riesgos y Edge Cases

- **Permisos**: Usuario intenta eliminar tarea de otro usuario (validar en backend)
- **Estado**: Tarea se cierra mientras se está eliminando (validar antes de eliminar)
- **Concurrencia**: Dos usuarios intentando eliminar la misma tarea simultáneamente (manejar 404 si ya fue eliminada)
- **Datos relacionados**: Si en el futuro hay relaciones con otras tablas, considerar cascada o restricción

---

## 10) Checklist Final

- [ ] AC cumplidos
- [ ] Backend: TaskService::delete() implementado
- [ ] Backend: Endpoint DELETE implementado
- [ ] Backend: Códigos de error 2111 y 403 implementados
- [ ] Frontend: DeleteTaskModal componente implementado
- [ ] Frontend: TaskList botón eliminar implementado
- [ ] Frontend: Manejo de errores implementado
- [ ] Unit tests TaskService ok
- [ ] Integration tests TaskController ok
- [ ] Frontend unit tests (Vitest) task.service ok
- [ ] ≥1 E2E Playwright ok (sin waits ciegos)
- [ ] Docs actualizadas
- [ ] IA log actualizado

---

## Archivos creados/modificados

*(Se completará durante la implementación)*

### Tests unitarios frontend (Vitest) (al implementar)
- `frontend/src/features/tasks/services/task.service.test.ts` – Tests para deleteTask() (mock API, errores 2111/403/404).

## Comandos ejecutados

*(Se completará durante la implementación)*

## Notas y decisiones

*(Se completará durante la implementación)*

## Pendientes / follow-ups

*(Se completará durante la implementación)*
