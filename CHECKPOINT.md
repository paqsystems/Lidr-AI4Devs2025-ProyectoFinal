# Checkpoint del Proyecto - Sistema de Registro de Tareas

**Fecha:** 2025-01-20  
**Estado:** Documentación de especificaciones completada  
**Última actualización:** Agregado Tipo de Cliente (TipoCliente)

---

## 📋 Resumen Ejecutivo

El proyecto está en fase de **especificación completa**. Se ha definido toda la documentación técnica necesaria para el MVP del Sistema de Registro de Tareas, incluyendo endpoints, validaciones, flujos E2E, y mapeo API-DB.

---

## ✅ Estado de Documentación

### 📁 Especificaciones de Endpoints (`/specs/endpoints/`)

| Archivo | Estado | Última Actualización |
|---------|--------|---------------------|
| `auth-login.md` | ✅ Completo | 2025-01-20 - Cambio a código de usuario |
| `time-entries-create.md` | ✅ Completo | 2025-01-20 - Campos `sin_cargo` y `presencial` agregados |
| `time-entries-list.md` | ✅ Completo | 2025-01-20 - Campos `sin_cargo`, `presencial` y `tipo_cliente` agregados |
| `time-entries-update.md` | ✅ Completo | 2025-01-20 - Campos `sin_cargo` y `presencial` agregados |
| `reports-time-summary.md` | ✅ Completo | 2025-01-20 - Campo `tipo_cliente` agregado |
| `client-types-list.md` | ✅ Completo | 2025-01-20 - Nuevo endpoint para listar tipos de cliente |

### 📁 Contratos y Reglas (`/specs/`)

| Archivo | Estado | Descripción |
|---------|--------|-------------|
| `contracts/response-envelope.md` | ✅ Completo | Formato estándar de respuesta API |
| `rules/validation-rules.md` | ✅ Completo | Reglas de validación por entidad |
| `errors/domain-error-codes.md` | ✅ Completo | Catálogo de códigos de error |
| `flows/e2e-core-flow.md` | ✅ Completo | Flujo E2E: Login → Registro → Resumen |

### 📁 Arquitectura (`/architecture/`)

| Archivo | Estado | Descripción |
|---------|--------|-------------|
| `api-to-data-mapping.md` | ✅ Completo | Mapeo API → Operaciones DB |

### 📁 Documentación General (`/docs/`)

| Archivo | Estado | Notas |
|---------|--------|-------|
| `consignas-mvp.md` | ✅ Completo | Alcance y entregables del MVP |
| `producto.md` | ✅ Completo | Visión del producto |
| `historias-y-tickets.md` | ✅ Completo | Historias de usuario |
| `arquitectura.md` | ✅ Completo | Arquitectura del sistema |
| `modelo-datos.md` | ✅ Completo | Actualizado con `code`, `sin_cargo`/`presencial` y `TipoCliente` |
| `testing.md` | ✅ Completo | Estrategia de testing |
| `deploy-ci-cd.md` | ✅ Completo | Estrategia de despliegue |
| `domain/DATA_MODEL.md` | ✅ Completo | Modelo de datos lógico detallado |

---

## 🔄 Cambios Recientes Implementados

### 1. Autenticación por Código de Usuario (2025-01-20)

**Cambio:** Reemplazo de autenticación por email a código de usuario.

**Archivos Actualizados:**
- ✅ `specs/endpoints/auth-login.md` - Request/Response actualizados
- ✅ `architecture/api-to-data-mapping.md` - Consultas DB actualizadas
- ✅ `specs/flows/e2e-core-flow.md` - Flujo actualizado
- ✅ `specs/rules/validation-rules.md` - Validaciones actualizadas

**Índices DB:**
- `idx_usuario_code` (UNIQUE) - Búsqueda por código de usuario

### 2. Campos Nuevos en Registros de Tarea (2025-01-20)

**Campos Agregados:**
- `sin_cargo` (boolean) - Indica si la tarea es sin cargo para el cliente
- `presencial` (boolean) - Indica si la tarea es presencial (en el cliente)

**Archivos Actualizados:**
- ✅ `specs/endpoints/time-entries-create.md` - Request/Response actualizados
- ✅ `specs/endpoints/time-entries-list.md` - Response actualizado
- ✅ `specs/endpoints/time-entries-update.md` - Request/Response actualizados
- ✅ `architecture/api-to-data-mapping.md` - Operaciones DB actualizadas

**Validaciones:**
- Ambos campos son booleanos
- En creación: requeridos, default: `false`
- En actualización: opcionales

---

## 📊 Consistencia entre Archivos

### ✅ Verificaciones Completadas

1. **Autenticación:**
   - ✅ Todos los archivos usan `code` en lugar de `email`
   - ✅ Índices DB consistentes (`idx_usuario_code`)
   - ✅ Validaciones alineadas

2. **Campos de Tareas:**
   - ✅ `sin_cargo` y `presencial` presentes en todos los endpoints
   - ✅ Tipos de datos consistentes (boolean)
   - ✅ Defaults consistentes (false)
   - ✅ Mapeo API-DB actualizado

3. **Códigos de Error:**
   - ✅ Referencias consistentes en todos los endpoints
   - ✅ Catálogo completo en `domain-error-codes.md`

4. **Formato de Respuesta:**
   - ✅ Todos los endpoints siguen el envelope estándar
   - ✅ Estructura consistente en todos los responses

---

## ⚠️ Pendientes / Áreas a Revisar

### 1. Modelo de Datos (`docs/modelo-datos.md`)

**Estado:** ✅ Completado (2025-01-20)

**Cambios Aplicados:**
- ✅ Campo `code` agregado a entidad Usuario
- ✅ Campos `sin_cargo` y `presencial` agregados a entidad RegistroTarea
- ✅ Nueva entidad `TipoCliente` creada
- ✅ Campo `tipo_cliente_id` (nullable) agregado a entidad `Cliente`

### 2. Modelo de Datos Lógico (`docs/domain/DATA_MODEL.md`)

**Estado:** ⚠️ Revisar si necesita actualización

**Nota:** Este archivo es lógico/conceptual. Verificar si los nuevos campos deben documentarse aquí.

**Prioridad:** Baja

### 3. Documentación de Base de Datos

**Estado:** ⚠️ Pendiente

**Necesario:**
- Especificar migraciones SQL/Laravel
- Definir índices físicos
- Documentar estructura de tablas con prefijo `PQ_PARTES_`

**Prioridad:** Alta (antes de implementación)

---

## 🎯 Próximos Pasos Recomendados

### Fase 1: Completar Documentación (Inmediato)
1. ✅ Actualizar `docs/modelo-datos.md` con campos nuevos
2. ⏳ Crear especificación de migraciones de base de datos
3. ⏳ Documentar estructura física de tablas

### Fase 2: Implementación Backend (Siguiente)
1. ⏳ Crear modelos Eloquent
2. ⏳ Crear migraciones Laravel
3. ⏳ Implementar controladores
4. ⏳ Implementar validaciones
5. ⏳ Implementar autenticación Sanctum

### Fase 3: Implementación Frontend (Posterior)
1. ⏳ Crear componentes de login
2. ⏳ Crear formulario de registro de tareas
3. ⏳ Crear vista de listado
4. ⏳ Crear vista de resumen

### Fase 4: Testing (Paralelo)
1. ⏳ Tests unitarios de validaciones
2. ⏳ Tests de integración API-DB
3. ⏳ Test E2E del flujo completo

---

## 📈 Métricas de Progreso

### Documentación
- **Endpoints especificados:** 5/5 (100%)
- **Contratos definidos:** 1/1 (100%)
- **Reglas de validación:** 1/1 (100%)
- **Flujos E2E:** 1/1 (100%)
- **Mapeo API-DB:** 1/1 (100%)

### Implementación
- **Backend:** 0% (no iniciado)
- **Frontend:** 0% (no iniciado)
- **Tests:** 0% (no iniciado)
- **Deploy:** 0% (no iniciado)

---

## 🔍 Notas Técnicas Importantes

### Autenticación
- **Mecanismo:** Laravel Sanctum (tokens personales)
- **Credenciales:** Código de usuario + contraseña
- **Índice:** `idx_usuario_code` (UNIQUE) en `PQ_PARTES_usuario`

### Campos Booleanos
- **Tipo DB:** `BOOLEAN` o `TINYINT(1)`
- **Default:** `false` en creación
- **Cast en Eloquent:** `(bool)` en responses

### Convenciones de Nombres
- **Tablas:** Prefijo `PQ_PARTES_`
- **Índices:** Prefijo `idx_`
- **Campos:** snake_case
- **API:** RESTful, versión `/api/v1/`

---

## 📝 Decisiones de Diseño Registradas

1. **Autenticación por código:** Decisión de diseño para uso interno/empresarial
2. **Campos booleanos:** `sin_cargo` y `presencial` para control operativo
3. **Validación de fecha:** Advertencia (no bloqueo) para fechas futuras
4. **Índices:** Uso de `LEFT JOIN` en lugar de subqueries para existencia
5. **Tipo de Cliente:** Nueva entidad `TipoCliente` para clasificar clientes (Corporativo, Individual, ONG, Gobierno, Otro). El campo `tipo_cliente_id` en `Cliente` es **obligatorio** (NOT NULL)
6. **Autenticación Dual:** Tanto empleados (tabla `Usuario`) como clientes (tabla `Cliente`) pueden autenticarse:
   - **Empleados:** Pueden crear, editar y eliminar tareas
   - **Clientes:** Solo pueden consultar (lectura) las tareas donde son el cliente asociado
   - Los clientes tienen campos opcionales `code`, `email` y `password_hash` para autenticación
7. **Rol de Supervisor:** Campo booleano `supervisor` en tabla `Usuario`:
   - **Usuarios normales (`supervisor = false`):** Solo ven y gestionan sus propias tareas
   - **Supervisores (`supervisor = true`):** Pueden ver todas las tareas, crear/editar/eliminar tareas de cualquier usuario, y al crear una tarea pueden seleccionar el usuario propietario (por defecto aparece él mismo)
8. **Campo Inhabilitado:** Atributo booleano `inhabilitado` (default: false) agregado a las tablas:
   - `Usuario` (Empleado/Asistente/Agente)
   - `Cliente`
   - `TipoTarea`
   - `TipoCliente`
   - **Propósito:** Permite marcar registros como inhabilitados sin eliminarlos del sistema
   - **Validaciones:** Todos los endpoints que validan `activo = true` también validan `inhabilitado = false`

---

**Última actualización:** 2025-01-20  
**Cambios recientes:** 
- Agregado campo `inhabilitado` a Usuario, Cliente, TipoTarea y TipoCliente
- Homogeneización de extensiones: conversión de archivos `.mdc` a `.md` en `.cursor/rules/`
- Eliminación de archivos duplicados en reglas de Cursor
- Actualización de reglas de documentación de código: obligatoriedad de documentar TODAS las clases, métodos y propiedades
- Actualización de checklist de documentación y manual del programador
- **Estandarización de nomenclatura:** Reemplazo de "asistente" y "agente" por "empleado" en toda la documentación. Renombrados endpoints y archivos de especificación (`asistentes-*.md` → `empleados-*.md`, rutas API actualizadas)

