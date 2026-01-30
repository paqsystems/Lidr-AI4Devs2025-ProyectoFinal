# TR-032(MH) – Eliminación de Tarea (Supervisor)

| Campo              | Valor                                      |
|--------------------|--------------------------------------------|
| HU relacionada     | HU-032(MH)-eliminación-de-tarea-supervisor  |
| Épica              | Épica 7: Registro de Tareas                |
| Prioridad          | MUST-HAVE                                  |
| Roles              | Empleado Supervisor                        |
| Dependencias       | HU-028 (Carga de Tarea Diaria)             |
| Clasificación      | HU SIMPLE                                  |
| Última actualización | 2026-01-28                               |
| Estado             | 📋 PENDIENTE                               |

---

## 1) HU Refinada

### Título
Eliminación de Tarea (Supervisor)

### Narrativa
**Como** supervisor  
**Quiero** eliminar cualquier tarea del sistema  
**Para** mantener la precisión de los registros

### Contexto/Objetivo
Los supervisores necesitan poder eliminar cualquier tarea del sistema. Esta funcionalidad permite eliminar cualquier tarea no cerrada, con diálogo de confirmación que incluye información del empleado propietario.

### Suposiciones explícitas
- El usuario ya está autenticado como supervisor (`es_supervisor = true`)
- La tarea existe
- La tabla `PQ_PARTES_REGISTRO_TAREA` ya existe
- Existe lista de tareas desde donde se accede a la eliminación

### In Scope
- Acceso a eliminación desde lista de tareas (cualquier tarea)
- Validación de estado (no cerrada)
- Diálogo de confirmación con información de la tarea y empleado
- Eliminación física del registro en BD
- Mensaje de confirmación
- Actualización de lista después de eliminar

### Out of Scope
- Eliminación de tareas cerradas
- Eliminación lógica (soft delete)
- Historial de eliminaciones
- Notificaciones al empleado propietario

---

## 2) Criterios de Aceptación (AC)

- **AC-01**: El supervisor puede acceder a la opción de eliminar cualquier tarea desde la lista de tareas
- **AC-02**: El sistema valida que la tarea no esté cerrada (`cerrado = false`)
- **AC-03**: Si la tarea está cerrada, se muestra error 2111 y no se permite eliminación
- **AC-04**: Se muestra diálogo de confirmación antes de eliminar
- **AC-05**: El diálogo muestra información de la tarea: fecha, cliente, tipo, duración, empleado
- **AC-06**: El usuario debe confirmar explícitamente la eliminación
- **AC-07**: Al confirmar, se elimina el registro de la base de datos
- **AC-08**: Se muestra mensaje de confirmación después de eliminar
- **AC-09**: La tarea desaparece de la lista inmediatamente

### Escenarios Gherkin

```gherkin
Feature: Eliminación de Tarea (Supervisor)

  Scenario: Supervisor elimina tarea exitosamente
    Given el supervisor "MGARCIA" está autenticado
    And existe una tarea con id=1, usuario_id=JPEREZ, cerrado=false
    When accede a eliminar la tarea id=1
    Then se muestra diálogo de confirmación con información de la tarea y empleado
    When confirma la eliminación
    Then se elimina el registro de la BD
    And se muestra mensaje de confirmación
    And la tarea desaparece de la lista

  Scenario: Supervisor no puede eliminar tarea cerrada
    Given el supervisor "MGARCIA" está autenticado
    And existe una tarea con id=1, cerrado=true
    When intenta eliminar la tarea id=1
    Then se muestra error 2111
    And no se permite la eliminación
```

---

## 3) Reglas de Negocio

1. **RN-01**: El supervisor puede eliminar cualquier tarea del sistema
2. **RN-02**: Una tarea cerrada (`cerrado = true`) no se puede eliminar
3. **RN-03**: Código de error 2111: "No se puede eliminar una tarea cerrada"
4. **RN-04**: Se requiere confirmación explícita del usuario antes de eliminar
5. **RN-05**: La eliminación es física (DELETE FROM), no lógica

### Permisos por Rol
- **Supervisor**: Puede eliminar cualquier tarea no cerrada
- **Empleado**: Solo puede eliminar sus propias tareas (ver TR-030)

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
- Tarea cerrada: id=2, cerrado=true
- Supervisor: MGARCIA (es_supervisor=true)
```

---

## 5) Contratos de API

### Endpoint: DELETE `/api/v1/tasks/{id}`

**Descripción:** Eliminar una tarea existente (supervisor puede eliminar cualquier tarea).

**Autenticación:** Requerida (Bearer token)

**Autorización:** 
- Supervisor: Puede eliminar cualquier tarea no cerrada
- Empleado: Solo puede eliminar sus propias tareas (ver TR-030)

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

---

## 6) Cambios Frontend

### Pantallas/Componentes Afectados
- **TaskList**: Agregar botón "Eliminar" por cada tarea (visible para supervisores en todas las tareas)
- **DeleteTaskModal**: Reutilizar componente de TR-030, mostrar información del empleado
- **task.service.ts**: Reutilizar función `deleteTask(id)` de TR-030

### Estados UI
- **Loading**: Eliminando tarea
- **Error**: Error al eliminar (tarea no encontrada, cerrada)
- **Success**: Tarea eliminada exitosamente
- **Modal**: Diálogo de confirmación visible/oculto con información del empleado

### Validaciones en UI
- Validar que tarea no esté cerrada antes de mostrar botón eliminar
- Mostrar información de la tarea y empleado en el diálogo de confirmación

### Accesibilidad Mínima
- `data-testid="task.delete.button"` en botón eliminar
- `data-testid="task.delete.modal"` en modal de confirmación
- `data-testid="task.delete.employee"` en información del empleado
- Labels y roles ARIA apropiados

---

## 7) Plan de Tareas / Tickets

| ID | Tipo | Descripción | DoD | Dependencias | Estimación |
|----|------|-------------|-----|--------------|------------|
| T1 | Backend | TaskService::delete() extender | Validar permisos supervisor | TR-028, TR-030 | S |
| T2 | Backend | TaskController::destroy() | Validar permisos supervisor en endpoint | TR-030 | S |
| T3 | Backend | Tests unitarios TaskService::delete() supervisor | 2+ tests (supervisor elimina cualquier tarea) | T1 | S |
| T4 | Backend | Tests integración TaskController supervisor | 2+ tests (DELETE por supervisor) | T2 | S |
| T5 | Frontend | TaskList botón eliminar supervisor | Mostrar botón para todas las tareas si es supervisor | TR-030, TR-033 | S |
| T6 | Frontend | DeleteTaskModal mostrar empleado | Agregar información del empleado en modal | TR-030 | S |
| T7 | Tests | E2E Playwright eliminación supervisor | Flujo completo: supervisor elimina tarea de otro | T5 | M |
| T8 | Tests | E2E Playwright tarea cerrada | Verificar error 2111 | T5 | S |
| T9 | Tests | Frontend unit tests (Vitest) | Tests para task.service.ts deleteTask (mismo que TR-030; ampliar si hay lógica específica supervisor) | TR-030 | S |
| T10 | Docs | Actualizar docs/backend/tareas.md | Documentar permisos supervisor | T2 | S |
| T11 | Docs | Registrar en ia-log.md | Entrada de implementación | T10 | S |

**Total:** 11 tareas (9S + 1M + 1L implícito)

---

## 8) Estrategia de Tests

### Unit Tests (TaskService)
- `delete_supervisor_puede_eliminar_cualquier_tarea`
- `delete_falla_tarea_cerrada_retorna_error_2111`

### Integration Tests (TaskController)
- `destroy_supervisor_exitoso_elimina_cualquier_tarea`
- `destroy_falla_tarea_cerrada_retorna_2111`

### Frontend unit tests (Vitest)
- Reutilizar/ampliar tests de `task.service.ts` deleteTask (TR-030); añadir casos específicos de supervisor si el servicio expone lógica distinta.

### E2E Tests (Playwright)
- **Flujo completo**: Login supervisor → Lista tareas → Eliminar tarea de otro → Confirmar → Verificar eliminación
- **Tarea cerrada**: Login supervisor → Intentar eliminar tarea cerrada → Verificar error 2111

---

## 9) Riesgos y Edge Cases

- **Estado**: Tarea se cierra mientras se está eliminando (validar antes de eliminar)
- **Concurrencia**: Dos supervisores intentando eliminar la misma tarea simultáneamente (manejar 404 si ya fue eliminada)
- **Permisos**: Validar que solo supervisores puedan eliminar tareas de otros usuarios

---

## 10) Checklist Final

- [ ] AC cumplidos
- [ ] Backend: TaskService::delete() extendido para supervisores
- [ ] Backend: Endpoint DELETE con permisos supervisor implementado
- [ ] Frontend: TaskList botón eliminar supervisor implementado
- [ ] Frontend: DeleteTaskModal con información del empleado implementado
- [ ] Unit tests TaskService ok
- [ ] Integration tests TaskController ok
- [ ] Frontend unit tests (Vitest) ok cuando aplique
- [ ] ≥1 E2E Playwright ok (sin waits ciegos)
- [ ] Docs actualizadas
- [ ] IA log actualizado

---

## Archivos creados/modificados

*(Se completará durante la implementación)*

### Tests unitarios frontend (Vitest) (al implementar)
- `frontend/src/features/tasks/services/task.service.test.ts` – Ampliar tests de deleteTask() para casos supervisor (reutilizar TR-030).

## Comandos ejecutados

*(Se completará durante la implementación)*

## Notas y decisiones

*(Se completará durante la implementación)*

## Pendientes / follow-ups

*(Se completará durante la implementación)*
