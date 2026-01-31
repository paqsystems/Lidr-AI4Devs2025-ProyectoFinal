# Tareas generadas – Historias Must-Have pendientes (HU → TR)

**Fecha de generación:** 2026-01-30  
**Origen:** PROMPTS/08 - Generaciòn HU a TR masivo (MH).md  
**Alcance:** Análisis y planificación exclusivamente. No se ejecutan tareas ni se escribe código.

**Historias procesadas (en orden):**  
Informes: HU-044, HU-046, HU-050 → Dashboard: HU-051, HU-052 → Gestión Clientes: HU-008 a HU-012 → Gestión Tipos Cliente: HU-014 a HU-017 → Gestión Empleados: HU-018 a HU-021 → Gestión Tipos de Tarea: HU-023 a HU-026.

---

## Resumen de clasificación

| Clasificación | Cantidad | HUs |
|---------------|----------|-----|
| **HU SIMPLE** | 12 | HU-050, HU-010, HU-011, HU-012, HU-015, HU-016, HU-017, HU-020, HU-021, HU-024, HU-025, HU-026 |
| **HU COMPLEJA** | 10 | HU-044, HU-046, HU-051, HU-052, HU-008, HU-009, HU-014, HU-018, HU-019, HU-023 |

Las HU marcadas como COMPLEJAS por criterio conservador incluyen la etiqueta **[REVISAR_SIMPLICIDAD]** por si el alcance puede reducirse en una segunda iteración.

---

## 1. Informes

### HU-044(MH) – Consulta detallada de tareas

**Clasificación:** COMPLEJA **[REVISAR_SIMPLICIDAD]**  
**Motivo:** Tabla con filtros según rol (empleado/supervisor/cliente), múltiples filtros (período, tipo cliente, cliente, empleado), ordenamiento por columnas, paginación, total de horas. Varios criterios de aceptación y lógica de permisos por rol.

**Sub-historias lógicas (refinamiento):**
1. Acceso a sección "Consulta Detallada" según rol.
2. Tabla de tareas con columnas: empleado (si supervisor), cliente, fecha, tipo tarea, horas, sin cargo, presencial, descripción.
3. Filtros (período, tipo cliente, cliente, empleado) con aplicación por botón y filtros automáticos según rol.
4. Ordenamiento por columnas y paginación.
5. Total de horas del período filtrado.

**Tareas técnicas por capa:**

| Capa | Tareas |
|------|--------|
| **Base de Datos** | Reutilizar tablas existentes (PQ_PARTES_REGISTRO_TAREA, clientes, usuarios, tipos). Verificar índices para filtros y ordenamiento. |
| **Backend** | Endpoint GET consulta detallada (ej. GET /api/v1/reports/detail o /api/v1/tasks/report) con query params: fecha_desde, fecha_hasta, tipo_cliente_id, cliente_id, usuario_id, ordenar_por, orden, page, per_page. Aplicar filtros según rol (empleado: usuario_id; supervisor: sin filtro usuario; cliente: cliente_id). Respuesta paginada con total_horas. Validación período (fecha_desde <= fecha_hasta). Códigos error 1305, 403. |
| **Frontend** | Pantalla "Consulta Detallada" (ruta protegida por rol). Filtros (período, tipo cliente, cliente, empleado según rol). Tabla con columnas indicadas, ordenamiento por cabeceras, paginación. Estado vacío y mensaje de "sin resultados" (alineado con HU-050). data-testid en filtros y tabla. |
| **QA / Testing** | Unit: servicio de consulta con filtros por rol. Integration: endpoint con empleado/supervisor/cliente, filtros y paginación. E2E: login como supervisor → Consulta Detallada → aplicar filtros → ver tabla y total. |

**Dependencias:** HU-001 (autenticación), HU-033, HU-034 (listas base).  
**Coherencia MVP:** Sí. Es base para informes y para HU-046, HU-050, HU-051.

---

### HU-046(MH) – Consulta agrupada por cliente

**Clasificación:** COMPLEJA **[REVISAR_SIMPLICIDAD]**  
**Motivo:** Sección con filtros de período, agrupación por cliente, bloques expandibles (accordion), detalle de tareas por grupo, totales generales, ordenamiento por dedicación.

**Sub-historias lógicas:**
1. Acceso a "Tareas por Cliente" / "Resumen por Cliente".
2. Filtros de período (fecha desde, fecha hasta).
3. Resultados agrupados por cliente: nombre, tipo cliente (opcional), total horas, cantidad tareas.
4. Cada grupo expandible: al expandir, detalle de tareas (fecha, tipo, horas, empleado si supervisor, descripción).
5. Total general de horas y tareas. Orden: mayor a menor dedicación.

**Tareas técnicas por capa:**

| Capa | Tareas |
|------|--------|
| **Base de Datos** | Consultas de agregación sobre PQ_PARTES_REGISTRO_TAREA agrupando por cliente_id. Sin nuevas tablas. |
| **Backend** | Endpoint GET reporte agrupado por cliente (ej. GET /api/v1/reports/by-client) con params: fecha_desde, fecha_hasta. Filtros automáticos por rol (cliente/empleado/supervisor). Respuesta: lista de grupos { cliente_id, nombre, tipo_cliente?, total_horas, cantidad_tareas, tareas[] } ordenada por total_horas desc. |
| **Frontend** | Pantalla "Tareas por Cliente". Filtros período y botón aplicar. Lista/accordion por cliente con totales; al expandir, tabla de tareas del cliente. Total general. Estados loading/empty/error. data-testid. |
| **QA / Testing** | Unit: agregación y filtros por rol. Integration: endpoint por rol. E2E: supervisor → Resumen por Cliente → filtrar → expandir un cliente y ver detalle. |

**Dependencias:** HU-044 (consulta base y filtros por rol).  
**Coherencia MVP:** Sí. Informe clave para dedicación por cliente.

---

### HU-050(MH) – Manejo de resultados vacíos en consultas

**Clasificación:** SIMPLE  
**Motivo:** Un único comportamiento: cuando no hay resultados, mostrar mensaje informativo, no tabla vacía, deshabilitar exportar; mensaje claro que sugiera ajustar filtros.

**Tareas técnicas por capa:**

| Capa | Tareas |
|------|--------|
| **Backend** | En endpoints de consulta (detallada y agrupada), si resultados vacíos tras filtros automáticos por rol: retornar lista vacía y total 0; opcionalmente flag o mensaje en envelope. No obligatorio cambiar contrato si ya se devuelve array vacío. |
| **Frontend** | En pantallas de consulta (detallada y por cliente): si datos.length === 0, mostrar mensaje "No se encontraron tareas para los filtros seleccionados" en lugar de tabla; deshabilitar botón exportar si existe. Mensaje visible y accesible. |
| **QA / Testing** | Unit: componente muestra mensaje cuando lista vacía. E2E: aplicar filtros que no devuelvan resultados y verificar mensaje y ausencia de tabla vacía. |

**Dependencias:** HU-044 (pantallas donde aplicar el comportamiento).  
**Coherencia MVP:** Sí. Mejora UX de informes.

---

## 2. Dashboard

### HU-051(MH) – Dashboard principal

**Clasificación:** COMPLEJA **[REVISAR_SIMPLICIDAD]**  
**Motivo:** Vista según rol (empleado/supervisor/cliente), período por defecto y selector, KPIs (horas, cantidad tareas, promedio opcional), gráficos opcionales, responsive. Muchos criterios y variantes por rol.

**Sub-historias lógicas:**
1. Dashboard como página de inicio post-login; acceso desde menú.
2. Contenido según rol: empleado (sus tareas), supervisor (todas), cliente (tareas donde es cliente).
3. Período por defecto (mes actual) y selector para cambiar período.
4. KPIs: total horas, cantidad tareas, promedio por día (opcional).
5. Visualizaciones básicas (opcional): distribución por cliente, evolución en el tiempo.
6. Diseño responsive.

**Tareas técnicas por capa:**

| Capa | Tareas |
|------|--------|
| **Backend** | Endpoint GET dashboard (ej. GET /api/v1/dashboard) con params: fecha_desde, fecha_hasta (default mes actual). Respuesta según rol: total_horas, cantidad_tareas, promedio_opcional, top_clientes, top_empleados (solo supervisor), distribución_por_tipo (cliente). Filtros automáticos por rol. |
| **Frontend** | Página Dashboard (ya existe parcialmente). Bloques: selector de período, KPIs (tarjetas), opcional gráficos (barras/pie por cliente, línea por tiempo). Contenido condicional por rol. Estados loading/error. data-testid. Responsive. |
| **QA / Testing** | Unit: cálculo de KPIs y filtros por rol. Integration: endpoint dashboard por rol. E2E: login empleado → dashboard con sus datos; login supervisor → dashboard con totales y top. |

**Dependencias:** HU-001, HU-044 (consultas base).  
**Coherencia MVP:** Sí. Vista ejecutiva prioritaria.

---

### HU-052(MH) – Resumen de dedicación por cliente en dashboard

**Clasificación:** COMPLEJA **[REVISAR_SIMPLICIDAD]**  
**Motivo:** Criterio conservador: sección con lista/tabla, totales, top N, navegación a detalle; puede simplificarse como una sola sección del dashboard.

**Sub-historias lógicas:**
1. Sección "Dedicación por Cliente" en el dashboard.
2. Lista/tabla con clientes y totales (horas, cantidad tareas, % opcional), ordenada por horas desc, top N (ej. 5 o 10).
3. Total general de horas. Filtros automáticos por rol.
4. Clic en cliente → redirección a consulta por cliente (o detalle).

**Tareas técnicas por capa:**

| Capa | Tareas |
|------|--------|
| **Backend** | Puede incluirse en el mismo endpoint de dashboard (HU-051) o GET /api/v1/dashboard/dedication-by-client con período. Respuesta: lista de { cliente_id, nombre, total_horas, cantidad_tareas, porcentaje? } ordenada desc, limit N. Filtros por rol. |
| **Frontend** | Bloque "Dedicación por Cliente" en Dashboard: tabla o lista top N, total general, enlaces a detalle por cliente. data-testid. |
| **QA / Testing** | Incluir en tests de dashboard: verificación de sección y datos por rol. E2E: dashboard con sección dedicación y al menos un cliente. |

**Dependencias:** HU-051.  
**Coherencia MVP:** Sí. Complemento directo del dashboard.

---

## 3. Gestión Clientes (Épica)

### HU-008(MH) – Listado de clientes

**Clasificación:** COMPLEJA **[REVISAR_SIMPLICIDAD]**  
**Motivo:** Tabla paginada, búsqueda por código/nombre, filtros (tipo cliente, estado, inhabilitado), total; patrón similar a TR-033/034.

**Sub-historias lógicas:**
1. Acceso a sección "Clientes" (solo supervisor).
2. Tabla: código, nombre, tipo cliente, estado (activo/inactivo), inhabilitado (sí/no).
3. Paginación, búsqueda por código o nombre.
4. Filtros: tipo cliente, estado, inhabilitado. Total de clientes.
5. Indicador visual para inhabilitados (opcional).

**Tareas técnicas por capa:**

| Capa | Tareas |
|------|--------|
| **Base de Datos** | Tablas existentes PQ_PARTES_CLIENTES, PQ_PARTES_TIPO_CLIENTE. Índices para búsqueda y filtros si no existen. |
| **Backend** | GET /api/v1/clients con query: page, per_page, busqueda, tipo_cliente_id, activo, inhabilitado. Solo supervisor (403 si no). Respuesta paginada + total. |
| **Frontend** | Pantalla Clientes: tabla, filtros, búsqueda, paginación, acciones (crear, editar, eliminar). Rutas /clientes, protegida por SupervisorRoute. data-testid. |
| **QA / Testing** | Unit: servicio listado con filtros. Integration: GET clients como supervisor y 403 como empleado. E2E: login supervisor → Clientes → filtrar y ver lista. |

**Dependencias:** HU-001.  
**Coherencia MVP:** Sí. ABM clientes es base para tareas.

---

### HU-009(MH) – Creación de cliente

**Clasificación:** COMPLEJA **[REVISAR_SIMPLICIDAD]**  
**Motivo:** Formulario con muchos campos (código, nombre, tipo cliente, email, acceso sistema, contraseña, activo, inhabilitado), validaciones múltiples, creación en dos tablas (USERS + PQ_PARTES_CLIENTES) cuando se habilita acceso.

**Sub-historias lógicas:**
1. Formulario de creación con todos los campos y validaciones.
2. Regla tipos de tarea: al menos un tipo genérico o tipos asignados (puede ser post-creación o en TR-012).
3. Si "habilitar acceso": crear USERS y vincular user_id en PQ_PARTES_CLIENTES; validar code único en USERS.
4. Confirmación y redirección al listado.

**Tareas técnicas por capa:**

| Capa | Tareas |
|------|--------|
| **Base de Datos** | USERS (existente), PQ_PARTES_CLIENTES con user_id opcional. PQ_PARTES_CLIENTE_TIPO_TAREA para asignación (puede ser en HU-012). |
| **Backend** | POST /api/v1/clients. Validaciones: code único, nombre, tipo_cliente_id existente y activo, email formato y único si se envía. Si habilitar_acceso: crear User, luego cliente con user_id. Códigos 422, 409. Solo supervisor. |
| **Frontend** | Pantalla /clientes/nueva: formulario con todos los campos, checkbox "Habilitar acceso" (muestra contraseña). Validaciones en UI. Redirección tras éxito. data-testid. |
| **QA / Testing** | Unit: validaciones y creación en dos tablas. Integration: POST con y sin acceso, errores de validación. E2E: supervisor → Crear cliente → llenar y guardar. |

**Dependencias:** HU-008, HU-014 (tipos de cliente), HU-023 (tipos de tarea para regla; en HU se cita HU-020 pero corresponde a tipos de tarea: HU-023/024).  
**Coherencia MVP:** Sí.

---

### HU-010(MH) – Edición de cliente

**Clasificación:** SIMPLE  
**Motivo:** Un flujo de edición: cargar datos, modificar nombre/tipo/email/activo/inhabilitado y opcionalmente contraseña o acceso; sincronizar USERS si aplica.

**Tareas técnicas por capa:**

| Capa | Tareas |
|------|--------|
| **Backend** | GET /api/v1/clients/{id}, PUT /api/v1/clients/{id}. Validaciones como creación (nombre, tipo, email). Si cambia contraseña: actualizar USERS.password_hash. Si cambia activo/inhabilitado: actualizar USERS y PQ_PARTES_CLIENTES. Solo supervisor. |
| **Frontend** | Pantalla /clientes/:id/editar: formulario con datos actuales, código readonly. Campos editables y opción cambiar contraseña si tiene acceso. data-testid. |
| **QA / Testing** | Unit: actualización y sincronización USERS. Integration: PUT con cambios de estado y contraseña. E2E: editar cliente y guardar. |

**Dependencias:** HU-009.  
**Coherencia MVP:** Sí.

---

### HU-011(MH) – Eliminación de cliente

**Clasificación:** SIMPLE  
**Motivo:** Verificar ausencia de tareas asociadas, diálogo de confirmación, DELETE y actualización de listado.

**Tareas técnicas por capa:**

| Capa | Tareas |
|------|--------|
| **Backend** | DELETE /api/v1/clients/{id}. Verificar que no existan tareas con cliente_id; si existen, error 2112. Solo supervisor. |
| **Frontend** | Modal de confirmación (código y nombre). Botón eliminar en listado/detalle. Tras confirmar, llamar DELETE y recargar lista. data-testid. |
| **QA / Testing** | Unit: regla "no eliminar si tiene tareas". Integration: DELETE con y sin tareas (2112). E2E: eliminar cliente sin tareas y ver confirmación. |

**Dependencias:** HU-010.  
**Coherencia MVP:** Sí.

---

### HU-012(MH) – Asignación de tipos de tarea a cliente

**Clasificación:** SIMPLE  
**Motivo:** Una pantalla o pestaña de gestión: listar tipos no genéricos, asignar/desasignar múltiples, guardar en ClienteTipoTarea.

**Tareas técnicas por capa:**

| Capa | Tareas |
|------|--------|
| **Base de Datos** | Tabla PQ_PARTES_CLIENTE_TIPO_TAREA (cliente_id, tipo_tarea_id). Migración si no existe. |
| **Backend** | GET /api/v1/clients/{id}/task-types (tipos asignados y disponibles no genéricos). PUT/POST para asignar/desasignar (ej. PUT /api/v1/clients/{id}/task-types con body lista de tipo_tarea_id). Validar tipos activos. Solo supervisor. |
| **Frontend** | En edición o detalle de cliente: sección "Tipos de tarea": lista disponibles, checkboxes o multi-select para asignar/desasignar, guardar. data-testid. |
| **QA / Testing** | Unit: asignación y validación tipos activos. Integration: GET y PUT task-types. E2E: asignar tipos a un cliente y guardar. |

**Dependencias:** HU-010, HU-023 (tipos de tarea; en HU se cita HU-020, se asume referencia a tipos de tarea).  
**Coherencia MVP:** Sí. Necesaria para regla de "al menos un tipo genérico o asignado".

---

## 4. Gestión Tipos Cliente

### HU-014(MH) – Listado de tipos de cliente

**Clasificación:** COMPLEJA **[REVISAR_SIMPLICIDAD]**  
**Motivo:** Tabla paginada, búsqueda, filtros por estado e inhabilitado, total; patrón de listado ABM.

**Sub-historias lógicas:**
1. Sección "Tipos de Cliente" (solo supervisor).
2. Tabla: código, descripción, estado, inhabilitado. Paginación, búsqueda por código o descripción.
3. Filtros estado e inhabilitado. Total. Diferenciación visual de inhabilitados.

**Tareas técnicas por capa:**

| Capa | Tareas |
|------|--------|
| **Backend** | GET /api/v1/client-types con page, per_page, busqueda, activo, inhabilitado. Solo supervisor. |
| **Frontend** | Pantalla Tipos de Cliente: tabla, filtros, búsqueda, paginación, acciones crear/editar/eliminar. Ruta /clientes/tipos o similar. data-testid. |
| **QA / Testing** | Integration: GET como supervisor y 403 empleado. E2E: listar y filtrar tipos de cliente. |

**Dependencias:** HU-001.  
**Coherencia MVP:** Sí.

---

### HU-015(MH) – Creación de tipo de cliente

**Clasificación:** SIMPLE  
**Motivo:** Formulario con código, descripción, activo, inhabilitado; validaciones estándar.

**Tareas técnicas por capa:**

| Capa | Tareas |
|------|--------|
| **Backend** | POST /api/v1/client-types. code único, descripción obligatoria. Solo supervisor. |
| **Frontend** | Formulario /clientes/tipos/nueva. data-testid. |
| **QA / Testing** | Integration: POST éxito y 422 por código duplicado. E2E: crear tipo de cliente. |

**Dependencias:** HU-014.  
**Coherencia MVP:** Sí.

---

### HU-016(MH) – Edición de tipo de cliente

**Clasificación:** SIMPLE  
**Motivo:** Formulario de edición; código readonly; descripción, activo, inhabilitado editables.

**Tareas técnicas por capa:**

| Capa | Tareas |
|------|--------|
| **Backend** | GET /api/v1/client-types/{id}, PUT /api/v1/client-types/{id}. Solo supervisor. |
| **Frontend** | Pantalla edición tipo de cliente. data-testid. |
| **QA / Testing** | Integration: PUT. E2E: editar tipo y guardar. |

**Dependencias:** HU-015.  
**Coherencia MVP:** Sí.

---

### HU-017(MH) – Eliminación de tipo de cliente

**Clasificación:** SIMPLE  
**Motivo:** Verificar que no tenga clientes asociados; diálogo; DELETE. Código 2115.

**Tareas técnicas por capa:**

| Capa | Tareas |
|------|--------|
| **Backend** | DELETE /api/v1/client-types/{id}. Si tiene clientes asociados, error 2115. Solo supervisor. |
| **Frontend** | Modal confirmación. data-testid. |
| **QA / Testing** | Integration: DELETE con y sin clientes (2115). E2E: eliminar tipo sin clientes. |

**Dependencias:** HU-016.  
**Coherencia MVP:** Sí.

---

## 5. Gestión Empleados

### HU-018(MH) – Listado de empleados

**Clasificación:** COMPLEJA **[REVISAR_SIMPLICIDAD]**  
**Motivo:** Tabla paginada, búsqueda por código/nombre/email, filtros (supervisor, estado, inhabilitado), total.

**Sub-historias lógicas:**
1. Sección "Empleados" (solo supervisor).
2. Tabla: código, nombre, email, supervisor (sí/no), estado, inhabilitado. Paginación y búsqueda.
3. Filtros: supervisor, estado, inhabilitado. Total. Diferenciación de inhabilitados.

**Tareas técnicas por capa:**

| Capa | Tareas |
|------|--------|
| **Backend** | GET /api/v1/employees (o /users/employees) con page, per_page, busqueda, es_supervisor, activo, inhabilitado. Solo supervisor. Listar PQ_PARTES_USUARIOS con relación USERS. |
| **Frontend** | Pantalla Empleados: tabla, filtros, búsqueda, paginación, acciones. Ruta /empleados. data-testid. |
| **QA / Testing** | Integration: GET como supervisor y 403 empleado. E2E: listar y filtrar empleados. |

**Dependencias:** HU-001.  
**Coherencia MVP:** Sí. Requerido para TR-031 (selector de empleado).

---

### HU-019(MH) – Creación de empleado

**Clasificación:** COMPLEJA **[REVISAR_SIMPLICIDAD]**  
**Motivo:** Formulario con código, nombre, email, contraseña, confirmación, supervisor, activo, inhabilitado; creación en USERS + PQ_PARTES_USUARIOS; muchas validaciones.

**Sub-historias lógicas:**
1. Formulario con todos los campos y validaciones (code único en USERS y en empleados, contraseña y confirmación).
2. Al guardar: crear USERS (code, password_hash, activo, inhabilitado), luego PQ_PARTES_USUARIOS (user_id, code, nombre, email, es_supervisor, etc.).
3. Confirmación y redirección.

**Tareas técnicas por capa:**

| Capa | Tareas |
|------|--------|
| **Backend** | POST /api/v1/employees. Validaciones: code único (USERS y tabla empleados), nombre, email formato y único, contraseña no vacía y coincidencia. Crear User primero, luego empleado con user_id. Solo supervisor. |
| **Frontend** | Pantalla /empleados/nuevo. Formulario completo. data-testid. |
| **QA / Testing** | Unit: creación en dos tablas. Integration: POST éxito y 422 por code duplicado. E2E: crear empleado. |

**Dependencias:** HU-018.  
**Coherencia MVP:** Sí.

---

### HU-020(MH) – Edición de empleado

**Clasificación:** SIMPLE  
**Motivo:** Formulario de edición; código readonly; nombre, email, supervisor, activo, inhabilitado, contraseña opcional; sincronizar USERS.

**Tareas técnicas por capa:**

| Capa | Tareas |
|------|--------|
| **Backend** | GET /api/v1/employees/{id}, PUT /api/v1/employees/{id}. Actualizar PQ_PARTES_USUARIOS y USERS (password_hash si se envía, activo/inhabilitado). Solo supervisor. |
| **Frontend** | Pantalla /empleados/:id/editar. data-testid. |
| **QA / Testing** | Integration: PUT con cambio de contraseña y estado. E2E: editar empleado. |

**Dependencias:** HU-019.  
**Coherencia MVP:** Sí.

---

### HU-021(MH) – Eliminación de empleado

**Clasificación:** SIMPLE  
**Motivo:** Verificar que no tenga tareas asociadas; diálogo; DELETE. Código 2113.

**Tareas técnicas por capa:**

| Capa | Tareas |
|------|--------|
| **Backend** | DELETE /api/v1/employees/{id}. Si tiene tareas, error 2113. Eliminar empleado y User asociado (o marcar inhabilitado según política). Solo supervisor. |
| **Frontend** | Modal confirmación. data-testid. |
| **QA / Testing** | Integration: DELETE con y sin tareas (2113). E2E: eliminar empleado sin tareas. |

**Dependencias:** HU-020.  
**Coherencia MVP:** Sí.

---

## 6. Gestión Tipos de Tarea

### HU-023(MH) – Listado de tipos de tarea

**Clasificación:** COMPLEJA **[REVISAR_SIMPLICIDAD]**  
**Motivo:** Tabla paginada, búsqueda, filtros (genérico, por defecto, estado, inhabilitado), total, destacar tipo por defecto.

**Sub-historias lógicas:**
1. Sección "Tipos de Tarea" (solo supervisor).
2. Tabla: código, descripción, genérico, por defecto, estado, inhabilitado. Paginación y búsqueda.
3. Filtros: genérico, por defecto, estado, inhabilitado. Total. Destacar tipo por defecto.

**Tareas técnicas por capa:**

| Capa | Tareas |
|------|--------|
| **Backend** | GET /api/v1/task-types con page, per_page, busqueda, is_generico, is_default, activo, inhabilitado. Solo supervisor. |
| **Frontend** | Pantalla Tipos de Tarea: tabla, filtros, búsqueda, paginación, acciones. Ruta /tareas/tipos o similar. data-testid. |
| **QA / Testing** | Integration: GET como supervisor y 403 empleado. E2E: listar y filtrar tipos de tarea. |

**Dependencias:** HU-001.  
**Coherencia MVP:** Sí. Base para TR-028 (selector de tipo en carga de tarea).

---

### HU-024(MH) – Creación de tipo de tarea

**Clasificación:** SIMPLE  
**Motivo:** Formulario con código, descripción, genérico, por defecto, activo, inhabilitado; regla "solo un por defecto" y "por defecto ⇒ genérico".

**Tareas técnicas por capa:**

| Capa | Tareas |
|------|--------|
| **Backend** | POST /api/v1/task-types. code único, descripción. Si is_default true: validar que no exista otro con is_default; forzar is_generico true. Error 2117 si ya hay otro por defecto. Solo supervisor. |
| **Frontend** | Formulario creación. Si "por defecto" se marca, "genérico" se marca y deshabilita. data-testid. |
| **QA / Testing** | Unit: regla un solo por defecto. Integration: POST con por defecto y 2117 si ya existe. E2E: crear tipo de tarea. |

**Dependencias:** HU-023.  
**Coherencia MVP:** Sí.

---

### HU-025(MH) – Edición de tipo de tarea

**Clasificación:** SIMPLE  
**Motivo:** Formulario edición; código readonly; reglas por defecto y genérico como en creación.

**Tareas técnicas por capa:**

| Capa | Tareas |
|------|--------|
| **Backend** | GET /api/v1/task-types/{id}, PUT /api/v1/task-types/{id}. Validar único por defecto al marcar. Solo supervisor. |
| **Frontend** | Pantalla edición tipo de tarea. data-testid. |
| **QA / Testing** | Integration: PUT cambiando por defecto. E2E: editar tipo. |

**Dependencias:** HU-024.  
**Coherencia MVP:** Sí.

---

### HU-026(MH) – Eliminación de tipo de tarea

**Clasificación:** SIMPLE  
**Motivo:** Verificar que no tenga tareas ni clientes asociados (ClienteTipoTarea); diálogo; DELETE. Código 2114.

**Tareas técnicas por capa:**

| Capa | Tareas |
|------|--------|
| **Backend** | DELETE /api/v1/task-types/{id}. Si tiene tareas (RegistroTarea) o clientes (ClienteTipoTarea), error 2114. Solo supervisor. |
| **Frontend** | Modal confirmación. data-testid. |
| **QA / Testing** | Integration: DELETE con y sin referencias (2114). E2E: eliminar tipo sin referencias. |

**Dependencias:** HU-025.  
**Coherencia MVP:** Sí.

---

## Dependencias entre TRs (orden sugerido)

1. **Catálogos base (supervisor):** TR-014 (listado tipos cliente), TR-015 a TR-017; TR-018 (listado empleados), TR-019 a TR-021; TR-023 (listado tipos tarea), TR-024 a TR-026.  
   Luego **Clientes:** TR-008, TR-009, TR-010, TR-011, TR-012 (depende de TR-023 para tipos de tarea).
2. **Informes:** TR-044 (consulta detallada), TR-046 (agrupada por cliente), TR-050 (resultados vacíos).
3. **Dashboard:** TR-051 (dashboard principal), TR-052 (dedicación por cliente).

**Nota:** En las HUs se citan dependencias HU-020 para "tipos de tarea"; en el modelo de numeración, HU-020 es Edición de empleado. Se asume que la dependencia correcta para tipos de tarea es HU-023 (listado) / HU-024 (creación).

---

## Coherencia con MVP y entregables

- Todas las HUs son MUST-HAVE y están alineadas con el flujo E2E y los entregables del MVP (docs/consignas-mvp.md, docs/producto.md).
- Los listados ABM (clientes, tipos cliente, empleados, tipos tarea) permiten al supervisor mantener catálogos necesarios para la carga de tareas (TR-028) y para informes.
- HU-044, HU-046, HU-050, HU-051 y HU-052 cubren informes y dashboard requeridos en el catálogo de historias.

---

## Notas y decisiones

- **HU SIMPLE vs COMPLEJA:** Se consideró COMPLEJA cuando hay tabla paginada con múltiples filtros y búsqueda, o cuando hay creación/edición en dos tablas (USERS + entidad) o muchos criterios de aceptación. En caso de duda se optó por COMPLEJA y se marcó [REVISAR_SIMPLICIDAD].
- **Rutas API:** Se usaron ejemplos (e.g. /api/v1/clients, /api/v1/reports/detail); el proyecto puede definir convención exacta (singular/plural, versionado).
- **HU-012 dependencia:** En la HU figura HU-020 (edición empleado); para "tipos de tarea" se asume HU-023/HU-024. Corregir en HU si procede.
- **Documentación:** Cada TR generado (cuando se ejecute la generación de archivos TR-008, TR-009, etc.) deberá incluir las secciones de trazabilidad indicadas en la regla 13 (Archivos creados/modificados, Comandos ejecutados, Notas y decisiones, Pendientes/follow-ups).

---

## Pendientes / follow-ups

- Generar archivos individuales TR-008 a TR-026, TR-044, TR-046, TR-050, TR-051, TR-052 en `docs/hu-tareas/` cuando se ejecute el flujo HU→TR por cada historia (según regla 13 y prompts HU SIMPLE / HU COMPLEJA).
- Revisar HUs marcadas [REVISAR_SIMPLICIDAD] para evaluar si pueden tratarse como SIMPLE reduciendo alcance.
- Definir convención exacta de rutas de API (clientes, empleados, tipos, reportes, dashboard) y documentar en OpenAPI o specs.
