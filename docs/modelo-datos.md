# Modelo de Datos – MVP

## Entidades principales

### Usuario (Empleado/Asistente/Agente)
- id (PK)
- code (único) - Código de usuario para autenticación
- nombre
- email (único)
- password_hash
- supervisor (boolean) - Indica si el usuario es supervisor
- activo
- inhabilitado (boolean, default: false) - Indica si el usuario está inhabilitado
- created_at

**Nota:** Representa a los empleados/asistentes/agentes que cargan las tareas al sistema.

**Permisos según tipo de usuario:**
- **Usuario normal (`supervisor = false`):** Puede crear, editar y eliminar solo sus propias tareas. Solo ve sus propias tareas.
- **Supervisor (`supervisor = true`):** Puede ver todas las tareas de todos los usuarios. Puede crear, editar y eliminar tareas de cualquier usuario. Al crear una tarea, puede seleccionar el usuario (por defecto aparece él mismo).

---

### Cliente
- id (PK)
- nombre (obligatorio) - Descripción/nombre del cliente
- tipo_cliente_id (FK → TipoCliente, obligatorio)
- code (único, obligatorio) - Código del cliente (también usado para autenticación si tiene acceso al sistema)
- email (único, opcional) - Email del cliente (usado para autenticación si aplica)
- password_hash (opcional) - Hash de contraseña (si el cliente tiene acceso al sistema)
- activo
- inhabilitado (boolean, default: false) - Indica si el cliente está inhabilitado
- created_at
- updated_at

**Nota:** Representa a los clientes para los cuales se registran tareas. Si tienen `code` y `password_hash`, pueden autenticarse y consultar las tareas relacionadas con ellos (solo lectura).

---

### TipoTarea
- id (PK)
- code (único, obligatorio) - Código del tipo de tarea
- descripcion (obligatorio)
- is_generico (boolean) - Indica si el tipo de tarea es genérico (disponible para todos los clientes)
- is_default (boolean) - Indica si este tipo de tarea es el predeterminado del sistema
- activo
- inhabilitado (boolean, default: false) - Indica si el tipo de tarea está inhabilitado

---

### RegistroTarea
- id (PK)
- usuario_id (FK → Usuario)
- cliente_id (FK → Cliente)
- tipo_tarea_id (FK → TipoTarea)
- fecha
- duracion_minutos
- sin_cargo (boolean, default: false) - Indica si la tarea es sin cargo para el cliente
- presencial (boolean, default: false) - Indica si la tarea es presencial (en el cliente)
- observacion (obligatorio) - Descripción de la tarea
- cerrado (boolean, default: false) - Indica si la tarea está cerrada (no se puede modificar ni eliminar)
- created_at
- updated_at

---

### TipoCliente
- id (PK)
- code (único, obligatorio) - Código del tipo de cliente
- descripcion (obligatorio)
- activo
- inhabilitado (boolean, default: false) - Indica si el tipo de cliente está inhabilitado
- created_at
- updated_at

**Nota:** Catálogo de tipos de cliente (ej: "Corporativo", "PyME", "Startup", "Gobierno", etc.)

---

### ClienteTipoTarea (Tabla de asociación)
- id (PK)
- cliente_id (FK → Cliente)
- tipo_tarea_id (FK → TipoTarea)
- created_at
- updated_at

**Nota:** Relación muchos-a-muchos entre Cliente y TipoTarea. Permite asignar tipos de tarea específicos a clientes (cuando el tipo NO es genérico).

## Relaciones
- Usuario 1 → N RegistroTarea
- Cliente 1 → N RegistroTarea
- Cliente N → 1 TipoCliente (tipo_cliente_id, obligatorio)
- TipoCliente 1 → N Cliente
- TipoTarea 1 → N RegistroTarea
- Cliente N → M TipoTarea (a través de ClienteTipoTarea)

---

## Restricciones
- duracion_minutos > 0 y debe ser múltiplo de 15 (tramos de 15 minutos: 15, 30, 45, 60, ..., 1440)
- duracion_minutos <= 1440 (máximo 24 horas)
- fecha ≤ fecha actual (advertencia si es futura, no bloquea)
- observacion no puede estar vacía (obligatorio)
- **Permisos de usuario normal (`supervisor = false`):**
  - Solo puede modificar (crear/editar/eliminar) sus propios registros
  - Solo puede ver sus propias tareas
- **Permisos de supervisor (`supervisor = true`):**
  - Puede ver todas las tareas de todos los usuarios
  - Puede crear, editar y eliminar tareas de cualquier usuario
  - Al crear una tarea, puede seleccionar el usuario (por defecto aparece él mismo)
- El cliente solo puede consultar (lectura) las tareas donde `cliente_id` coincide con su `id`
- `tipo_cliente_id` en `Cliente` es obligatorio (NOT NULL)
- `code` en `Cliente` es obligatorio (NOT NULL)
- Si un cliente tiene `code`, también debe tener `password_hash` (autenticación completa o ninguna)
- **Tarea cerrada:** Una tarea con `cerrado = true` no se puede modificar ni eliminar
- **Validaciones de estado:** Todas las validaciones que verifican `activo = true` también deben verificar `inhabilitado = false`:
  - Usuario debe estar activo y no inhabilitado para autenticarse
  - Cliente debe estar activo y no inhabilitado para crear/editar tareas
  - TipoTarea debe estar activo y no inhabilitado para crear/editar tareas
  - TipoCliente debe estar activo y no inhabilitado para listar
- **Regla de tipo de tarea por defecto:** Solo puede haber un TipoTarea con `is_default = true` en todo el sistema, y si `is_default = true` entonces `is_generico = true` (forzado)
- **Regla de cliente:** Al crear/actualizar un cliente, debe existir al menos un tipo de tarea genérico O el cliente debe tener al menos un tipo de tarea asignado
- **Integridad referencial:** No se puede eliminar Cliente, Usuario, TipoTarea o TipoCliente si están referenciados en otras tablas

---

## Decisiones de diseño
- No se implementa facturación en el MVP.
- El modelo prioriza simplicidad y trazabilidad.
- **Autenticación dual:** Los empleados (tabla `Usuario`) y los clientes (tabla `Cliente`) pueden autenticarse, pero con permisos diferentes:
  - **Empleados:** Pueden crear, editar y eliminar tareas
  - **Clientes:** Solo pueden consultar (lectura) las tareas donde son el cliente asociado
- **Rol de Supervisor:** Los usuarios con `supervisor = true` tienen permisos ampliados:
  - Pueden ver todas las tareas de todos los usuarios
  - Pueden crear, editar y eliminar tareas de cualquier usuario
  - Al crear una tarea, pueden seleccionar el usuario propietario (por defecto aparece él mismo)

## Notas sobre campos de TipoTarea

### is_generico (genérico)
- **Significado:** Indica si el tipo de tarea está disponible para todos los clientes del sistema.
- **Valor `true`:** El tipo de tarea es genérico y puede ser usado por cualquier cliente.
- **Valor `false`:** El tipo de tarea es específico y solo está disponible para clientes que tengan una asociación explícita en la tabla `ClienteTipoTarea`.
- **Reglas de negocio (pendientes):** 
  - TODO: Implementar regla de visibilidad al crear tarea (mostrar genéricos + asociados al cliente). SI

### is_default (porDefecto)
- **Significado:** Indica si este tipo de tarea es el predeterminado del sistema.
- **Valor `true`:** Este tipo de tarea se considera el predeterminado.
- **Valor `false`:** Este tipo de tarea no es el predeterminado.
- **Reglas de negocio (pendientes):**
  - TODO: Implementar regla que solo un TipoTarea puede tener `is_default = true` en todo el sistema.
