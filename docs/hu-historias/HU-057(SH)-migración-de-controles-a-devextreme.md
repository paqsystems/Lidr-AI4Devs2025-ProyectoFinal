# HU-057 – Migración de controles del frontend a DevExpress

## Épica
Épica 11: Experiencia de Usuario y Presentación

**Rol:** Desarrollador  
**Clasificación:** SHOULD-HAVE  
**Historia:** Como desarrollador quiero modificar todos los controles del frontend a controles DevExpress para darle una presentación más sofisticada al proyecto.

**Criterios de aceptación:**
- Los controles nativos HTML (inputs, selects, botones, tablas, etc.) se reemplazan por componentes DevExtreme equivalentes en todas las pantallas del frontend.
- Se utilizan componentes DevExtreme apropiados según el tipo de control:
  - **Formularios:** TextBox, NumberBox, DateBox, SelectBox, CheckBox, TextArea.
  - **Botones:** Button (tipos default, success, danger, etc.).
  - **Listados y tablas:** DataGrid con Column, paginación, ordenamiento y filtrado.
  - **Navegación:** TreeView o List para menús cuando aplique.
  - **Calendarios y fechas:** DateBox, DateRangeBox.
- Se mantiene la funcionalidad existente (validaciones, eventos, integración con API).
- Los estilos y temas DevExtreme se aplican de forma consistente en toda la aplicación (tema `dx.light` o el definido en refinamiento).
- Los componentes DevExtreme se importan desde `devextreme-react` siguiendo la documentación oficial.
- Se preservan los `data-testid` y atributos de accesibilidad necesarios para pruebas E2E y accesibilidad.
- La migración se realiza de forma incremental por módulo o pantalla, sin romper el flujo E2E principal.

**Notas de reglas de negocio:**
- DevExtreme ya está integrado en el proyecto (paquetes `devextreme` y `devextreme-react`).
- El tema por defecto es `dx.light.css`; se puede evaluar en refinamiento el uso de temas Material o dark.
- Los criterios de aceptación de cada historia funcional afectada deben seguir cumpliéndose tras la migración.

**Dependencias:** Integración previa de DevExtreme en el frontend (paquetes instalados y estilos configurados).

**Ámbitos sugeridos para la migración (orden de prioridad):**
1. Formularios de login, registro y recuperación de contraseña.
2. Formularios de carga y edición de tareas.
3. Listados de tareas, clientes, empleados, tipos de cliente y tipos de tarea.
4. Formularios de ABM (clientes, empleados, tipos).
5. Dashboard, informes y consultas.
6. Header, menú lateral y componentes de navegación.

---
