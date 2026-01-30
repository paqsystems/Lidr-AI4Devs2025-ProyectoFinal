# Resumen de TRs Generados - HU-029 a HU-038

**Fecha de generación:** 2026-01-28  
**Método:** Generación masiva controlada mediante IA  
**Total de HU procesadas:** 10

---

## Clasificación de Complejidad

### HU SIMPLE (8)
- HU-029: Edición de tarea propia
- HU-030: Eliminación de tarea propia
- HU-031: Edición de tarea (supervisor)
- HU-032: Eliminación de tarea (supervisor)
- HU-035: Validación de duración en tramos de 15 minutos
- HU-036: Advertencia de fecha futura
- HU-037: Filtrado de tipos de tarea por cliente
- HU-038: Selección de empleado propietario (supervisor)

### HU COMPLEJA (2)
- HU-033: Visualización de lista de tareas propias **[REVISAR_SIMPLICIDAD]**
- HU-034: Visualización de lista de todas las tareas (supervisor) **[REVISAR_SIMPLICIDAD]**

**Nota:** HU-033 y HU-034 fueron clasificadas como COMPLEJAS por criterio conservador debido a la cantidad de funcionalidades requeridas (tabla, paginación, múltiples filtros, búsqueda, ordenamiento, totales). Podrían simplificarse si se reduce el alcance inicial.

---

## TRs Generados

### TR-029: Edición de tarea propia
- **Clasificación:** SIMPLE
- **Archivo:** `docs/hu-tareas/TR-029(MH)-edición-de-tarea-propia.md`
- **Dependencias:** TR-028 (carga de tarea diaria)
- **Resumen:** Permite a un empleado editar sus propias tareas no cerradas, reutilizando el formulario de creación con carga de datos existentes.

### TR-030: Eliminación de tarea propia
- **Clasificación:** SIMPLE
- **Archivo:** `docs/hu-tareas/TR-030(MH)-eliminación-de-tarea-propia.md`
- **Dependencias:** TR-028
- **Resumen:** Permite a un empleado eliminar sus propias tareas no cerradas, con diálogo de confirmación.

### TR-031: Edición de tarea (supervisor)
- **Clasificación:** SIMPLE
- **Archivo:** `docs/hu-tareas/TR-031(MH)-edición-de-tarea-supervisor.md`
- **Dependencias:** TR-028, TR-019 (gestión de usuarios)
- **Resumen:** Permite a un supervisor editar cualquier tarea no cerrada, incluyendo cambio de empleado propietario.

### TR-032: Eliminación de tarea (supervisor)
- **Clasificación:** SIMPLE
- **Archivo:** `docs/hu-tareas/TR-032(MH)-eliminación-de-tarea-supervisor.md`
- **Dependencias:** TR-028
- **Resumen:** Permite a un supervisor eliminar cualquier tarea no cerrada, con diálogo de confirmación.

### TR-033: Visualización de lista de tareas propias
- **Clasificación:** COMPLEJA **[REVISAR_SIMPLICIDAD]**
- **Archivo:** `docs/hu-tareas/TR-033(MH)-visualización-de-lista-de-tareas-propias.md`
- **Dependencias:** TR-028, TR-029, TR-030
- **Resumen:** Tabla paginada con filtros (fecha, cliente, tipo), búsqueda por texto, ordenamiento, totales y acciones de edición/eliminación.

### TR-034: Visualización de lista de todas las tareas (supervisor)
- **Clasificación:** COMPLEJA **[REVISAR_SIMPLICIDAD]**
- **Archivo:** `docs/hu-tareas/TR-034(MH)-visualización-de-lista-de-todas-las-tareas-supervisor.md`
- **Dependencias:** TR-028, TR-031, TR-032, TR-033
- **Resumen:** Similar a TR-033 pero mostrando todas las tareas de todos los usuarios, con filtro adicional por empleado.

### TR-035: Validación de duración en tramos de 15 minutos
- **Clasificación:** SIMPLE
- **Archivo:** `docs/hu-tareas/TR-035(MH)-validación-de-duración-en-tramos-de-15-minutos.md`
- **Dependencias:** TR-028 (ya parcialmente implementado)
- **Resumen:** Validación específica que ya está implementada en TR-028. Este TR documenta la regla de negocio y asegura cobertura completa de tests.

### TR-036: Advertencia de fecha futura
- **Clasificación:** SIMPLE
- **Archivo:** `docs/hu-tareas/TR-036(MH)-advertencia-de-fecha-futura.md`
- **Dependencias:** TR-028 (ya parcialmente implementado)
- **Resumen:** Advertencia visual que ya está implementada en TR-028. Este TR documenta la funcionalidad y asegura cobertura completa.

### TR-037: Filtrado de tipos de tarea por cliente
- **Clasificación:** SIMPLE
- **Archivo:** `docs/hu-tareas/TR-037(MH)-filtrado-de-tipos-de-tarea-por-cliente.md`
- **Dependencias:** TR-028 (ya parcialmente implementado)
- **Resumen:** Filtrado dinámico que ya está implementado en TR-028. Este TR documenta la funcionalidad y asegura cobertura completa.

### TR-038: Selección de empleado propietario (supervisor)
- **Clasificación:** SIMPLE
- **Archivo:** `docs/hu-tareas/TR-038(MH)-selección-de-empleado-propietario-supervisor.md`
- **Dependencias:** TR-028 (ya parcialmente implementado)
- **Resumen:** Selector de empleado que ya está implementado en TR-028. Este TR documenta la funcionalidad y asegura cobertura completa.

---

## Observaciones

### Funcionalidades ya implementadas parcialmente
Las siguientes HU tienen funcionalidades ya implementadas en TR-028:
- **HU-035:** Validación de duración en tramos de 15 minutos (ya implementada)
- **HU-036:** Advertencia de fecha futura (ya implementada)
- **HU-037:** Filtrado de tipos de tarea por cliente (ya implementada)
- **HU-038:** Selección de empleado propietario (ya implementada)

**Recomendación:** Los TRs correspondientes (TR-035 a TR-038) deben documentar la funcionalidad existente y asegurar cobertura completa de tests, pero no requieren implementación desde cero.

### Dependencias entre TRs
- TR-029, TR-030 dependen de TR-028
- TR-031, TR-032 dependen de TR-028 y TR-019
- TR-033 depende de TR-028, TR-029, TR-030
- TR-034 depende de TR-028, TR-031, TR-032, TR-033
- TR-035 a TR-038 documentan funcionalidades ya implementadas en TR-028

### Orden sugerido de implementación
1. TR-028 (ya implementado)
2. TR-029, TR-030 (edición/eliminación propias)
3. TR-031, TR-032 (edición/eliminación supervisor)
4. TR-033 (lista de tareas propias)
5. TR-034 (lista de todas las tareas)
6. TR-035 a TR-038 (documentación y validación de funcionalidades existentes)

---

## Estado de Generación

- [x] HU-029 → TR-029 generado ✅
- [x] HU-030 → TR-030 generado ✅
- [x] HU-031 → TR-031 generado ✅
- [x] HU-032 → TR-032 generado ✅
- [x] HU-033 → TR-033 generado ✅
- [x] HU-034 → TR-034 generado ✅
- [x] HU-035 → TR-035 generado ✅
- [x] HU-036 → TR-036 generado ✅
- [x] HU-037 → TR-037 generado ✅
- [x] HU-038 → TR-038 generado ✅

**Total:** 10/10 TRs generados ✅

**Fecha de finalización:** 2026-01-28

---

## Relevamiento de Dependencias

Se realizó un relevamiento completo de dependencias entre TR-029 y TR-038 y con el resto del proyecto. Detalle en:

**→ [docs/relevamiento-dependencias-TR-029-a-038.md](relevamiento-dependencias-TR-029-a-038.md)**

### Resumen del relevamiento

- **Entre TRs 029–038:** Todas las dependencias están cubiertas por TRs ya generados (TR-028, TR-029, TR-030, TR-031, TR-032, TR-033, TR-034).
- **Dependencias externas (HUs sin TR):**
  - **HU-019** (Creación de empleado) – Citada en TR-031 y TR-038. El selector de empleados usa GET /tasks/employees; con empleados por seed alcanza para el MVP. **TR-019 opcional** si se quiere alta de empleados desde la UI.
  - **HU-012** (Asignación de tipos de tarea a cliente) – Citada en TR-037 y TR-028. El filtrado por cliente ya está en TR-028; con seed alcanza. **TR-012 opcional** si se quiere asignar tipos a clientes desde la UI.
  - **HU-009** (Creación de cliente) y **HU-024** (Creación de tipo de tarea) – Dependencias de TR-028; con seed alcanza. **TR-009 y TR-024 opcionales** para gestión desde la UI.

**Conclusión:** No es obligatorio generar más TRs para cerrar la épica 7 con TR-029 a TR-038. Generar TR-012, TR-019, TR-009 o TR-024 solo amerita si el MVP requiere gestión completa desde la UI (clientes, empleados, tipos de tarea, asignaciones).

---

## Notas Finales

Este proceso de generación masiva fue realizado mediante IA de forma controlada, siguiendo las reglas establecidas en el proyecto:
- Determinación automática de complejidad (SIMPLE vs COMPLEJA)
- Uso de criterio conservador para ambigüedades
- Generación de TRs completos siguiendo la estructura estándar
- Verificación de coherencia con TRs ya implementadas
- Documentación de dependencias y orden sugerido

Todos los TRs generados están listos para ser revisados y, posteriormente, ejecutados según el orden sugerido.
