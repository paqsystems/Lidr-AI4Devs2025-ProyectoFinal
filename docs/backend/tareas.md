# Documentación de API de Tareas

## Descripción General

El módulo de tareas permite a los empleados registrar tareas diarias realizadas para clientes específicos. Los supervisores pueden registrar tareas para otros empleados.

## Endpoints Disponibles

### 1. Crear Registro de Tarea

```
POST /api/v1/tasks
```

**Autenticación:** Requerida (Bearer token de Sanctum)

**Autorización:**
- Empleado: Solo puede crear tareas para sí mismo (`usuario_id` debe ser el del usuario autenticado o no enviarse)
- Supervisor: Puede crear tareas para cualquier empleado activo

#### Request Body

```json
{
  "fecha": "2026-01-28",
  "cliente_id": 1,
  "tipo_tarea_id": 2,
  "duracion_minutos": 120,
  "sin_cargo": false,
  "presencial": true,
  "observacion": "Desarrollo de feature X",
  "usuario_id": null
}
```

**Campos:**
- `fecha` (string, requerido): Fecha en formato YMD (YYYY-MM-DD)
- `cliente_id` (integer, requerido): ID del cliente
- `tipo_tarea_id` (integer, requerido): ID del tipo de tarea
- `duracion_minutos` (integer, requerido): Duración en minutos (múltiplo de 15, máximo 1440)
- `sin_cargo` (boolean, opcional): Indica si es sin cargo (default: false)
- `presencial` (boolean, opcional): Indica si es presencial (default: false)
- `observacion` (string, requerido): Descripción de la tarea
- `usuario_id` (integer, opcional): ID del empleado (solo para supervisores, null = usuario actual)

#### Response 201 Created

```json
{
  "error": 0,
  "respuesta": "Tarea registrada correctamente",
  "resultado": {
    "id": 1,
    "usuario_id": 1,
    "cliente_id": 1,
    "tipo_tarea_id": 2,
    "fecha": "2026-01-28",
    "duracion_minutos": 120,
    "sin_cargo": false,
    "presencial": true,
    "observacion": "Desarrollo de feature X",
    "cerrado": false,
    "created_at": "2026-01-28T10:30:00+00:00",
    "updated_at": "2026-01-28T10:30:00+00:00"
  }
}
```

#### Response 422 Unprocessable Entity

```json
{
  "error": 4220,
  "respuesta": "Errores de validación",
  "resultado": {
    "errors": {
      "fecha": ["La fecha es obligatoria"],
      "duracion_minutos": ["La duración debe ser múltiplo de 15 minutos"],
      "observacion": ["La observación es obligatoria"]
    }
  }
}
```

#### Response 403 Forbidden

```json
{
  "error": 4003,
  "respuesta": "No tiene permisos para asignar tareas a otros empleados",
  "resultado": {}
}
```

#### Response 401 Unauthorized

```json
{
  "error": 4001,
  "respuesta": "No autenticado",
  "resultado": {}
}
```

---

### 2. Obtener Lista de Clientes Activos

```
GET /api/v1/tasks/clients
```

**Autenticación:** Requerida (Bearer token de Sanctum)

**Autorización:** Cualquier empleado autenticado

#### Response 200 OK

```json
{
  "error": 0,
  "respuesta": "Clientes obtenidos correctamente",
  "resultado": [
    {
      "id": 1,
      "code": "CLI001",
      "nombre": "Empresa ABC S.A."
    },
    {
      "id": 2,
      "code": "CLI002",
      "nombre": "Corporación XYZ"
    }
  ]
}
```

**Nota:** Solo retorna clientes con `activo = true` y `inhabilitado = false`.

---

### 3. Obtener Tipos de Tarea Disponibles

```
GET /api/v1/tasks/task-types?cliente_id=1
```

**Autenticación:** Requerida (Bearer token de Sanctum)

**Autorización:** Cualquier empleado autenticado

**Query Parameters:**
- `cliente_id` (opcional): Si se proporciona, retorna tipos genéricos + tipos asignados al cliente. Si no se proporciona, retorna solo tipos genéricos.

#### Response 200 OK

```json
{
  "error": 0,
  "respuesta": "Tipos de tarea obtenidos correctamente",
  "resultado": [
    {
      "id": 1,
      "code": "DESARROLLO",
      "descripcion": "Desarrollo de software",
      "is_generico": true
    },
    {
      "id": 2,
      "code": "ESPECIAL",
      "descripcion": "Tarea especial para cliente",
      "is_generico": false
    }
  ]
}
```

**Nota:** 
- Si `cliente_id` se proporciona, retorna tipos genéricos (`is_generico = true`) + tipos asignados al cliente específico.
- Si `cliente_id` no se proporciona, retorna solo tipos genéricos.

---

### 4. Obtener Lista de Empleados Activos

```
GET /api/v1/tasks/employees
```

**Autenticación:** Requerida (Bearer token de Sanctum)

**Autorización:** Solo supervisores

#### Response 200 OK

```json
{
  "error": 0,
  "respuesta": "Empleados obtenidos correctamente",
  "resultado": [
    {
      "id": 1,
      "code": "JPEREZ",
      "nombre": "Juan Pérez"
    },
    {
      "id": 2,
      "code": "MGARCIA",
      "nombre": "María García"
    }
  ]
}
```

#### Response 403 Forbidden (si no es supervisor)

```json
{
  "error": 4003,
  "respuesta": "Solo los supervisores pueden acceder a esta información",
  "resultado": {}
}
```

**Nota:** Solo retorna empleados con `activo = true` y `inhabilitado = false`.

---

## Reglas de Negocio

### Validación de Fecha

- **Formato:** YMD (YYYY-MM-DD)
- **Obligatoria:** Sí
- **Futura:** Se muestra advertencia pero NO se bloquea el guardado

### Validación de Cliente

- Debe existir en `PQ_PARTES_CLIENTES`
- Debe tener `activo = true` y `inhabilitado = false`

### Validación de Tipo de Tarea

- Debe existir en `PQ_PARTES_TIPOS_TAREA`
- Debe tener `activo = true` y `inhabilitado = false`
- Debe ser:
  - Genérico (`is_generico = true`), O
  - Asignado al cliente seleccionado (existe registro en `PQ_PARTES_CLIENTE_TIPO_TAREA`)

### Validación de Duración

- Obligatoria y mayor a cero
- Debe ser múltiplo de 15 minutos (15, 30, 45, 60, ..., 1440)
- Máximo: 1440 minutos (24 horas)

### Validación de Observación

- Obligatoria y no puede estar vacía (después de trim)

### Permisos de Asignación

- **Empleado normal:** Solo puede crear tareas para sí mismo (`usuario_id` debe ser null o del usuario autenticado)
- **Supervisor:** Puede crear tareas para cualquier empleado activo

---

## Códigos de Error

| Código | HTTP | Descripción |
|--------|------|-------------|
| 0 | 200/201 | Operación exitosa |
| 4001 | 401 | No autenticado |
| 4003 | 403 | No tiene permisos |
| 4220 | 422 | Errores de validación |
| 4201 | 422 | Cliente inactivo o inhabilitado |
| 4202 | 422 | Tipo de tarea inactivo o inhabilitado |
| 4203 | 422 | Empleado inactivo o inhabilitado |
| 4204 | 422 | Tipo de tarea no disponible para el cliente |
| 9999 | 500 | Error inesperado del servidor |

---

## Estructura de Archivos

### Backend

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/V1/
│   │   │       └── TaskController.php
│   │   └── Requests/
│   │       └── Api/V1/
│   │           └── CreateTaskRequest.php
│   └── Services/
│       └── TaskService.php
├── routes/
│   └── api.php
└── tests/
    ├── Unit/
    │   └── Services/
    │       └── TaskServiceTest.php
    └── Feature/
        └── Api/V1/
            └── TaskControllerTest.php
```

### Frontend

```
frontend/src/
├── features/
│   └── tasks/
│       ├── components/
│       │   ├── TaskForm.tsx
│       │   ├── ClientSelector.tsx
│       │   ├── TaskTypeSelector.tsx
│       │   └── EmployeeSelector.tsx
│       └── services/
│           └── task.service.ts
└── shared/
    └── utils/
        └── dateUtils.ts
```

---

## Referencias

- **TR:** TR-028(MH)-carga-de-tarea-diaria.md
- **HU:** HU-028(MH)-carga-de-tarea-diaria.md
- **Modelo de Datos:** docs/modelo-datos.md
