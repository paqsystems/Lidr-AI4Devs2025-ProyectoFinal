# TR-057(SH) – Migración de controles del frontend a DevExpress

| Campo                | Valor                                                       |
|----------------------|-------------------------------------------------------------|
| HU relacionada       | HU-057(SH)-migración-de-controles-a-devextreme              |
| Épica                | Épica 11: Experiencia de Usuario y Presentación             |
| Prioridad            | SHOULD-HAVE                                                 |
| Roles                | Desarrollador                                               |
| Dependencias         | Integración previa de DevExtreme (paquetes instalados)       |
| Clasificación        | HU COMPLEJA                                                 |
| Última actualización | 2026-02-22                                                  |
| Estado               | 🔄 EN PROGRESO (T2–T6 parcial)                               |

---

## 1) HU Refinada

### Título
Migración de controles del frontend a DevExpress

### Narrativa
**Como** desarrollador  
**Quiero** modificar todos los controles del frontend a controles DevExpress  
**Para** darle una presentación más sofisticada al proyecto

### Contexto/Objetivo
Reemplazar los controles nativos HTML y componentes actuales (TextField, Button, Modal, selects, tablas) por componentes DevExtreme en todas las pantallas del frontend. La migración es incremental por módulo, manteniendo la funcionalidad existente (validaciones, eventos, integración con API) y preservando data-testid para pruebas E2E.

### Suposiciones explícitas
- DevExtreme y devextreme-react ya están instalados y configurados (tema dx.light.css, clase dx-viewport en body).
- Los criterios de aceptación de cada historia funcional afectada deben seguir cumpliéndose tras la migración.
- No se modifican contratos de API ni lógica de negocio; solo la capa de presentación.
- El orden de migración sigue la prioridad definida en la HU (login → tareas → listados → ABM → dashboard/informes → navegación).

### In Scope
- Formularios: TextBox, NumberBox, DateBox, SelectBox, CheckBox, TextArea.
- Botones: Button (tipos default, success, danger).
- Listados y tablas: DataGrid con Column, paginación, ordenamiento y filtrado.
- Navegación: TreeView o List para menús cuando aplique.
- Calendarios y fechas: DateBox, DateRangeBox.
- Estilos y temas DevExtreme consistentes en toda la aplicación.
- Preservar data-testid y atributos de accesibilidad.
- Migración incremental sin romper el flujo E2E principal.

### Out of Scope
- Cambios en backend o base de datos.
- Cambio de tema (dx.light por defecto; Material/dark en refinamiento futuro).
- Migración de componentes que no tengan equivalente DevExtreme sin evaluación previa.

---

## 2) Criterios de Aceptación (AC)

- **AC-01**: Los controles nativos HTML (input, select, button, table) se reemplazan por componentes DevExtreme equivalentes en todas las pantallas.
- **AC-02**: Formularios usan TextBox, NumberBox, DateBox, SelectBox, CheckBox, TextArea según el tipo de dato.
- **AC-03**: Botones usan componente Button de DevExtreme con tipos apropiados (default, success, danger).
- **AC-04**: Listados y tablas usan DataGrid con Column, paginación, ordenamiento y filtrado.
- **AC-05**: Se mantiene la funcionalidad existente (validaciones, eventos, integración con API).
- **AC-06**: Los estilos y temas DevExtreme se aplican de forma consistente (tema dx.light).
- **AC-07**: Los componentes se importan desde devextreme-react siguiendo la documentación oficial.
- **AC-08**: Se preservan data-testid y atributos de accesibilidad para pruebas E2E.
- **AC-09**: La migración se realiza de forma incremental; el flujo E2E principal no se rompe en ningún momento.
- **AC-10**: Los criterios de aceptación de las historias funcionales afectadas siguen cumpliéndose tras la migración.

### Escenarios Gherkin

```gherkin
Feature: Controles DevExpress

  Scenario: Formulario de login usa controles DevExpress
    Given el usuario accede a la pantalla de login
    Then los campos de código y contraseña son componentes DevExtreme (TextBox)
    And el botón de envío es un Button de DevExtreme

  Scenario: Listado de tareas usa DataGrid
    Given el empleado está autenticado
    When accede al listado de tareas
    Then la tabla es un DataGrid de DevExtreme
    And tiene paginación, ordenamiento y filtrado

  Scenario: Formulario de carga de tarea usa controles DevExpress
    Given el empleado accede a "Nueva tarea"
    Then los campos de fecha, cliente, tipo, duración y observación son componentes DevExtreme
    And el botón Guardar es un Button de DevExtreme

  Scenario: E2E principal sigue funcionando tras migración
    Given la migración de un módulo está completa
    When se ejecutan los tests E2E del flujo principal
    Then todos los tests pasan
```

---

## 3) Reglas de Negocio

1. **RN-01**: DevExtreme ya está integrado; no se instalan paquetes adicionales salvo que se requiera un componente específico.
2. **RN-02**: El tema por defecto es dx.light.css; evaluar Material o dark en refinamiento.
3. **RN-03**: Los criterios de aceptación de cada historia funcional afectada deben seguir cumpliéndose tras la migración.
4. **RN-04**: Se preservan data-testid en elementos clave para pruebas E2E.

### Permisos por Rol
- No aplica; la migración es técnica y no introduce nuevos permisos. Los permisos existentes por rol (empleado, supervisor, cliente) se mantienen.

---

## 4) Impacto en Datos

- **Tablas afectadas:** Ninguna.
- **Cambios en datos:** Ninguno. La migración es exclusivamente de capa de presentación (frontend).

---

## 5) Contratos de API

- **Cambios:** Ninguno. Los endpoints existentes se consumen igual; solo cambia la forma de renderizar los datos en el frontend.

---

## 6) Cambios Frontend

### Pantallas/Componentes Afectados (orden de prioridad)

| Prioridad | Módulo | Componentes principales |
|-----------|--------|--------------------------|
| 1 | Auth | LoginForm, ForgotPasswordPage, ResetPasswordPage |
| 2 | Tasks | TaskForm, TaskEditPage, TaskList, TaskListAll, TaskFilters, ProcesoMasivoPage |
| 3 | Listados | TaskList, TaskListAll, ClientesPage, EmpleadosPage, TiposClientePage, TiposTareaPage, ConsultaDetalladaPage, TareasPorClientePage, TareasPorEmpleadoPage, TareasPorTipoPage, TareasPorFechaPage |
| 4 | ABM | ClientesNuevaPage, ClientesEditarPage, EmpleadosNuevoPage, EmpleadosEditarPage, TiposClienteNuevaPage, TiposClienteEditarPage, TiposTareaNuevaPage, TiposTareaEditarPage |
| 5 | Dashboard e informes | Dashboard, componentes de consultas |
| 6 | Navegación | AppLayout, Sidebar, Header, Modal, DeleteTaskModal |

### Mapeo de controles

| Control actual | Componente DevExtreme |
|----------------|----------------------|
| input text/password | TextBox |
| input number | NumberBox |
| input date / date picker | DateBox |
| select | SelectBox |
| checkbox | CheckBox |
| textarea | TextArea |
| button | Button |
| table / listado | DataGrid + Column |
| modal | Popup o Popover |
| menú lateral | TreeView o List |

### Estados UI
- Loading, error, empty: mantener los mismos estados; los componentes DevExtreme deben integrarse con la lógica existente (ej. LoadPanel para loading).

### Accesibilidad Mínima
- Preservar data-testid en elementos clave.
- Usar propiedades de accesibilidad de DevExtreme (label, hint, etc.).
- Verificar que los componentes DevExtreme cumplan requisitos básicos de accesibilidad.

---

## 7) Plan de Tareas / Tickets

| ID | Tipo     | Descripción | DoD | Dependencias | Estimación |
|----|----------|-------------|-----|--------------|------------|
| T1 | Frontend | Crear wrappers o adaptadores reutilizables para controles DevExpress (opcional) | Componentes que encapsulen TextBox, DateBox, SelectBox, Button con props unificadas. | — | M |
| T2 | Frontend | Migrar formularios de autenticación (Login, ForgotPassword, ResetPassword) | TextBox para código/contraseña; Button para envío; mantener validaciones y data-testid. | — | M |
| T3 | Frontend | Migrar TaskForm y TaskEditPage | DateBox, SelectBox, NumberBox, TextArea, Button; ClientSelector, TaskTypeSelector, EmployeeSelector con SelectBox. | T2 | L |
| T4 | Frontend | Migrar listados de tareas (TaskList, TaskListAll) | DataGrid con Column; paginación; ordenamiento; filtros con controles DevExpress. | T2 | L |
| T5 | Frontend | Migrar listados de clientes, empleados, tipos | DataGrid en ClientesPage, EmpleadosPage, TiposClientePage, TiposTareaPage. | T2 | L |
| T6 | Frontend | Migrar páginas de consultas e informes | DataGrid en ConsultaDetalladaPage, TareasPorClientePage, TareasPorEmpleadoPage, TareasPorTipoPage, TareasPorFechaPage; DateRangeBox para filtros de fecha. | T5 | L |
| T7 | Frontend | Migrar formularios ABM (clientes, empleados, tipos) | TextBox, SelectBox, CheckBox, Button en ClientesNuevaPage, ClientesEditarPage, EmpleadosNuevoPage, EmpleadosEditarPage, TiposClienteNuevaPage, TiposClienteEditarPage, TiposTareaNuevaPage, TiposTareaEditarPage. | T2 | L |
| T8 | Frontend | Migrar ProcesoMasivoPage | DataGrid con selección múltiple; CheckBox; Button; filtros. | T4 | M |
| T9 | Frontend | Migrar Dashboard y componentes de resumen | KPICard, listas, selectores de período con controles DevExpress. | T2 | M |
| T10 | Frontend | Migrar navegación (Sidebar, Header, Modal) | TreeView o List para menú lateral; Button en header; Popup para modales. | T2 | M |
| T11 | Frontend | Migrar ProfileView y componentes de usuario | TextBox, Button, validaciones. | T2 | S |
| T12 | Tests | Actualizar tests unitarios de componentes migrados | Los componentes que usan controles DevExpress deben tener tests que verifiquen el comportamiento. | T2–T11 | M |
| T13 | Tests | Verificar y actualizar tests E2E | Ajustar selectores si cambian; asegurar que data-testid se preserve; ejecutar flujo E2E principal. | T2–T11 | M |
| T14 | Docs | Actualizar frontend-specifications y ia-log | Documentar decisión de DevExpress; componentes utilizados; registro en ia-log. | T1 | S |

**Total:** 14 tareas.

---

## 8) Estrategia de Tests

- **Unit (frontend):** Componentes que usan controles DevExpress; verificar que las props se pasan correctamente; mocks de DevExtreme si es necesario.
- **Integration:** No aplica (no hay cambios en API).
- **E2E:** Flujo principal (login → carga tarea → listado → logout) debe seguir pasando tras cada fase de migración; preservar data-testid; evitar waits ciegos.

---

## 9) Riesgos y Edge Cases

- **Compatibilidad:** Algunos componentes DevExtreme pueden tener APIs diferentes; evaluar cada migración.
- **Performance:** DataGrid con muchos registros; considerar paginación del servidor si aplica.
- **Estilos:** Posible conflicto entre Tailwind/shadcn y DevExtreme; revisar especificidad CSS.
- **Tests E2E:** Cambios en estructura DOM pueden romper selectores; priorizar data-testid.

---

## 10) Checklist Final

- [ ] AC cumplidos
- [ ] Todos los formularios usan controles DevExpress
- [ ] Todos los listados usan DataGrid
- [ ] Botones y modales migrados
- [ ] Tema consistente (dx.light)
- [ ] data-testid preservados
- [ ] Tests unitarios actualizados
- [ ] Tests E2E pasan
- [ ] Documentación actualizada
- [ ] ia-log actualizado

---

## Archivos creados/modificados

**Frontend:**
- `frontend/src/features/auth/components/LoginForm.tsx` – TextBox, Button
- `frontend/src/features/clients/components/ClientesPage.tsx` – DataGrid, TextBox, SelectBox, Button (T5)
- `frontend/src/features/employees/components/EmpleadosPage.tsx` – DataGrid, TextBox, SelectBox, Button (T5)
- `frontend/src/features/tipoCliente/components/TiposClientePage.tsx` – DataGrid, TextBox, SelectBox, Button (T5)
- `frontend/src/features/tipoTarea/components/TiposTareaPage.tsx` – DataGrid, TextBox, SelectBox, Button (T5)
- `frontend/src/features/tasks/components/ConsultaDetalladaPage.tsx` – DataGrid, DateBox, SelectBox, Button (T6)
- `frontend/src/features/auth/components/LoginForm.css` – Ajustes para Button DevExtreme
- `frontend/src/features/auth/components/ForgotPasswordPage.tsx` – TextBox, Button
- `frontend/src/features/auth/components/ResetPasswordPage.tsx` – TextBox, Button
- `frontend/src/features/tasks/components/TaskForm.tsx` – DateBox, TextBox, TextArea, CheckBox, Button
- `frontend/src/features/tasks/components/ClientSelector.tsx` – SelectBox
- `frontend/src/features/tasks/components/TaskTypeSelector.tsx` – SelectBox
- `frontend/src/features/tasks/components/EmployeeSelector.tsx` – SelectBox

## Comandos ejecutados

- `npm run build` (frontend) – OK
- `npm run test:e2e -- --grep "login|auth"` – Parcial (algunos tests requieren backend)

## Notas y decisiones

- DevExtreme ya está integrado (devextreme@25.2.4, devextreme-react@25.2.4).
- Tema: dx.light.css.
- TextBox no tiene `validationMessage` en la API; se mantienen mensajes de error en spans debajo.
- SelectBox: para allowAll se usa id=-1 como "Todos"; placeholder para campos requeridos.
- DateBox: displayFormat="dd/MM/yyyy", value como Date, conversión interna a YMD.
- CheckBox: text prop para el label; data-testid en el contenedor.

## Pendientes / follow-ups

- T4–T11: Migrar listados (DataGrid), ABM, Dashboard, navegación.
- T12–T14: Tests unitarios, E2E, documentación.
- Verificar tests E2E con backend en ejecución (login, forgot-password).
- Evaluar tema Material o dark en refinamiento futuro.
- Considerar custom bundle de DevExtreme si el tamaño del bundle es un problema.
