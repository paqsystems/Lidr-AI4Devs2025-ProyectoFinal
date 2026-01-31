# Tareas generadas – HU 08 a 12 (Gestión de Clientes)

**Fecha de generación:** 2026-01-31  
**Origen:** PROMPTS/09 - Generaciòn HU a TR masivo Clientes.md  
**Alcance:** Análisis y planificación exclusivamente. No se ejecutan tareas, no se escribe código, no se modifican otros archivos.

**Historias procesadas:** HU-008, HU-009, HU-010, HU-011, HU-012 (Épica 3: Gestión de Clientes – ABM).

**Criterio aplicado:** Determinación automática SIMPLE vs COMPLEJA según reglas del proyecto (tabla paginada con múltiples filtros y búsqueda → COMPLEJA). HU-008 reclasificada en esta aplicación del prompt.

---

## Resumen de clasificación

| Clasificación | Cantidad | HUs |
|---------------|----------|-----|
| **HU COMPLEJA** | 1 | HU-008 **[REVISAR_SIMPLICIDAD]** |
| **HU SIMPLE** | 4 | HU-009, HU-010, HU-011, HU-012 |

---

## HU-008(MH) – Listado de clientes

**Clasificación:** COMPLEJA **[REVISAR_SIMPLICIDAD]**  
**Motivo:** Tabla con paginación, búsqueda por código o nombre, y múltiples filtros (tipo de cliente, estado activo/inactivo, inhabilitado sí/no). Según criterio del proyecto: "tabla paginada con múltiples filtros y búsqueda" → HU COMPLEJA.

**Sub-historias lógicas (refinamiento):**
1. Acceso a la sección "Clientes" solo para supervisores (ruta /clientes protegida).
2. Tabla de clientes con columnas: código, nombre, tipo de cliente, estado (activo/inactivo), inhabilitado (sí/no); total de clientes mostrado.
3. Búsqueda por código o nombre (campo único de búsqueda).
4. Filtros: tipo de cliente, estado (activo/inactivo), inhabilitado (sí/no); aplicación de filtros y paginación.
5. Diferenciación visual de clientes inhabilitados (indicador opcional).

**Tareas técnicas por capa:**

| Capa | Tareas |
|------|--------|
| **Base de Datos** | Reutilizar tablas PQ_PARTES_CLIENTES, PQ_PARTES_TIPO_CLIENTE. Verificar índices para búsqueda (code, nombre) y filtros (tipo_cliente_id, activo, inhabilitado). |
| **Backend** | Endpoint GET /api/v1/clients con query params: page, per_page, busqueda (código o nombre), tipo_cliente_id, activo, inhabilitado. Autorización solo supervisor (403 si no). Respuesta paginada + total de clientes. |
| **Frontend** | Pantalla "Clientes" (ruta /clientes). Tabla con columnas: código, nombre, tipo de cliente, estado (activo/inactivo), inhabilitado (sí/no). Filtros, búsqueda, paginación. Acciones: crear, editar, eliminar. Ruta protegida por SupervisorRoute. Indicador visual para clientes inhabilitados. data-testid en elementos clave. |
| **QA / Testing** | Unit: servicio de listado con filtros y búsqueda. Integration: GET /clients como supervisor (200) y como empleado (403). E2E: login supervisor → Clientes → filtrar/buscar y ver lista; ver total y diferenciación de inhabilitados. |

**Dependencias:** HU-001 (autenticación).  
**Coherencia MVP:** Sí. ABM de clientes es base para asociar tareas.

---

## HU-009(MH) – Creación de cliente

**Clasificación:** SIMPLE  

**Tareas técnicas por capa:**

| Capa | Tareas |
|------|--------|
| **Base de Datos** | USERS (existente), PQ_PARTES_CLIENTES con user_id opcional (FK a USERS). PQ_PARTES_CLIENTE_TIPO_TAREA para asignación (HU-012). Sin nuevas migraciones si ya existen. |
| **Backend** | POST /api/v1/clients. Validaciones: code obligatorio y único, nombre obligatorio, tipo_cliente_id obligatorio y existente/activo/no inhabilitado, email formato válido y único si se envía. Si habilitar_acceso: validar code único en USERS, contraseña obligatoria; crear User, luego cliente con user_id y code coincidente. Códigos error 422 (validación), 409 (conflicto). Solo supervisor. |
| **Frontend** | Pantalla /clientes/nueva: formulario con todos los campos (código, nombre, tipo cliente, email, habilitar acceso al sistema, contraseña condicional, activo, inhabilitado). Validaciones en UI. Redirección al listado tras éxito. data-testid. |
| **QA / Testing** | Unit: validaciones y lógica de creación en dos tablas cuando se habilita acceso. Integration: POST con y sin acceso al sistema; errores de validación (código duplicado, email duplicado). E2E: supervisor → Clientes → Crear cliente → llenar y guardar. |

**Dependencias:** HU-008 (listado), HU-014 (tipos de cliente deben existir), HU-023 (tipos de tarea para regla).  
**Coherencia MVP:** Sí. Creación de clientes necesaria para poder asociar tareas.

---

## HU-010(MH) – Edición de cliente

**Clasificación:** SIMPLE  

**Tareas técnicas por capa:**

| Capa | Tareas |
|------|--------|
| **Backend** | GET /api/v1/clients/{id} (datos para edición). PUT /api/v1/clients/{id}. Validaciones: nombre obligatorio, tipo_cliente existente y activo, email formato y único si se proporciona. Código no modificable. Si cambia contraseña: actualizar USERS.password_hash. Si cambia activo o inhabilitado: actualizar USERS (si tiene user_id) y PQ_PARTES_CLIENTES. Regla de tipos de tarea igual que en creación. Solo supervisor. |
| **Frontend** | Pantalla /clientes/:id/editar: formulario con datos actuales, código en solo lectura. Campos editables: nombre, tipo cliente, email, activo, inhabilitado; opción cambiar contraseña si tiene acceso; opción habilitar/deshabilitar acceso. data-testid. |
| **QA / Testing** | Unit: actualización y sincronización USERS cuando aplica. Integration: PUT con cambios de estado y contraseña. E2E: editar cliente y guardar; ver cambios en listado. |

**Dependencias:** HU-009.  
**Coherencia MVP:** Sí.

---

## HU-011(MH) – Eliminación de cliente

**Clasificación:** SIMPLE  

**Tareas técnicas por capa:**

| Capa | Tareas |
|------|--------|
| **Backend** | DELETE /api/v1/clients/{id}. Verificar que no existan registros en PQ_PARTES_REGISTRO_TAREA con cliente_id = id; si existen, retornar error 2112. Solo supervisor. |
| **Frontend** | Modal de confirmación mostrando código y nombre del cliente. Botón eliminar en listado o detalle. Tras confirmar, llamar DELETE y recargar lista o redirigir al listado. data-testid. |
| **QA / Testing** | Unit: regla "no eliminar si tiene tareas asociadas". Integration: DELETE con tareas (2112) y sin tareas (200). E2E: eliminar cliente sin tareas y ver confirmación y desaparición del listado. |

**Dependencias:** HU-010.  
**Coherencia MVP:** Sí. Mantiene integridad referencial.

---

## HU-012(MH) – Asignación de tipos de tarea a cliente

**Clasificación:** SIMPLE  

**Tareas técnicas por capa:**

| Capa | Tareas |
|------|--------|
| **Base de Datos** | Tabla PQ_PARTES_CLIENTE_TIPO_TAREA (cliente_id, tipo_tarea_id). Migración si no existe. |
| **Backend** | GET /api/v1/clients/{id}/task-types: tipos asignados al cliente y tipos disponibles no genéricos (is_generico = false). PUT o POST para actualizar asignación (ej. PUT /api/v1/clients/{id}/task-types con body { tipo_tarea_ids: number[] }). Validar que los tipos existan y estén activos/no inhabilitados. Solo supervisor. |
| **Frontend** | En edición o detalle de cliente: sección "Tipos de tarea": lista de tipos no genéricos con checkboxes o multi-select para asignar/desasignar, botón guardar. data-testid. |
| **QA / Testing** | Unit: asignación y validación de tipos activos. Integration: GET y PUT task-types por cliente. E2E: asignar tipos a un cliente y guardar; ver cambios reflejados. |

**Dependencias:** HU-010, HU-023 (tipos de tarea).  
**Coherencia MVP:** Sí. Necesaria para la regla "cliente debe tener al menos un tipo genérico disponible o un tipo asignado".

---

## Notas y criterios aplicados

- **Clasificación:** HU-008 tratada como **HU COMPLEJA** por criterio del proyecto: tabla paginada con múltiples filtros y búsqueda (docs/tareas-generadas-hu-Must Have.md). Descomposición en sub-historias lógicas aplicada; etiqueta **[REVISAR_SIMPLICIDAD]** por si el alcance puede reducirse en una segunda iteración. HU-009 a HU-012 se mantienen como HU SIMPLE.
- **Coherencia con MVP:** Todas son MUST-HAVE y coherentes con el MVP (gestión de clientes para poder asociar tareas).
- **Orden sugerido de implementación:** HU-008 → HU-009 → HU-010 → HU-011 → HU-012 (listado y creación como base; asignación de tipos tras edición).

Este documento es exclusivamente de análisis y planificación.
