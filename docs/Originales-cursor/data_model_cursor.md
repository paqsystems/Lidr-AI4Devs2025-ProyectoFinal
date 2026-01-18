
# Modelo de Datos del Dominio

## Descripción General

Este documento define el modelo de datos del dominio para el MVP del sistema de registro de tareas. El modelo está diseñado para ser simple, normalizado y enfocado en el flujo E2E principal.

---

## Entidades del Dominio

### Usuario

Representa a un empleado o consultor que registra tareas en el sistema.

**Campos:**

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | INTEGER (PK, AUTO_INCREMENT) | NOT NULL, UNIQUE | Identificador único del usuario |
| `nombre` | VARCHAR(100) | NOT NULL | Nombre completo del usuario |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Email del usuario (usado para login) |
| `password_hash` | VARCHAR(255) | NOT NULL | Hash de la contraseña (bcrypt/argon2) |
| `activo` | BOOLEAN | NOT NULL, DEFAULT true | Indica si el usuario está activo |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Fecha de creación del registro |

**Índices:**
- PRIMARY KEY (`id`)
- UNIQUE INDEX (`email`)
- INDEX (`activo`) - Para consultas de usuarios activos

**Validaciones de Negocio:**
- El email debe tener formato válido
- La contraseña debe cumplir políticas de seguridad (mínimo 8 caracteres)
- El nombre no puede estar vacío

---

### Cliente

Representa a un cliente para el cual se registran tareas.

**Campos:**

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | INTEGER (PK, AUTO_INCREMENT) | NOT NULL, UNIQUE | Identificador único del cliente |
| `nombre` | VARCHAR(200) | NOT NULL | Nombre del cliente |
| `activo` | BOOLEAN | NOT NULL, DEFAULT true | Indica si el cliente está activo |

**Índices:**
- PRIMARY KEY (`id`)
- INDEX (`activo`) - Para consultas de clientes activos

**Validaciones de Negocio:**
- El nombre no puede estar vacío
- No se pueden eliminar clientes con tareas registradas (soft delete mediante `activo`)

---

### TipoTarea

Representa los tipos de tareas que se pueden registrar (ej: "Desarrollo", "Reunión", "Análisis", etc.).

**Campos:**

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | INTEGER (PK, AUTO_INCREMENT) | NOT NULL, UNIQUE | Identificador único del tipo de tarea |
| `descripcion` | VARCHAR(100) | NOT NULL | Descripción del tipo de tarea |
| `activo` | BOOLEAN | NOT NULL, DEFAULT true | Indica si el tipo está activo |

**Índices:**
- PRIMARY KEY (`id`)
- INDEX (`activo`) - Para consultas de tipos activos

**Validaciones de Negocio:**
- La descripción no puede estar vacía
- No se pueden eliminar tipos con tareas registradas (soft delete mediante `activo`)

---

### RegistroTarea

Representa el registro de una tarea realizada por un usuario para un cliente.

**Campos:**

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | INTEGER (PK, AUTO_INCREMENT) | NOT NULL, UNIQUE | Identificador único del registro |
| `usuario_id` | INTEGER (FK) | NOT NULL | Referencia al usuario que registra la tarea |
| `cliente_id` | INTEGER (FK) | NOT NULL | Referencia al cliente |
| `tipo_tarea_id` | INTEGER (FK) | NOT NULL | Referencia al tipo de tarea |
| `fecha` | DATE | NOT NULL | Fecha en que se realizó la tarea |
| `duracion_minutos` | INTEGER | NOT NULL | Duración de la tarea en minutos |
| `observacion` | TEXT | NULL | Observaciones opcionales sobre la tarea |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Fecha de creación del registro |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Fecha de última actualización |

**Índices:**
- PRIMARY KEY (`id`)
- FOREIGN KEY (`usuario_id`) REFERENCES `Usuario`(`id`)
- FOREIGN KEY (`cliente_id`) REFERENCES `Cliente`(`id`)
- FOREIGN KEY (`tipo_tarea_id`) REFERENCES `TipoTarea`(`id`)
- INDEX (`usuario_id`, `fecha`) - Para consultas de tareas por usuario y fecha
- INDEX (`cliente_id`, `fecha`) - Para consultas de tareas por cliente y fecha
- INDEX (`fecha`) - Para filtros por fecha

**Validaciones de Negocio:**
- `duracion_minutos` debe ser mayor a 0
- `fecha` no puede ser futura (debe ser <= fecha actual)
- El usuario solo puede modificar/eliminar sus propios registros (validación a nivel de aplicación)
- Todos los campos obligatorios deben estar presentes

**Constraints:**
```sql
CHECK (duracion_minutos > 0)
CHECK (fecha <= CURRENT_DATE)
```

---

## Diagrama de Relaciones

```
┌─────────────┐
│   Usuario   │
│─────────────│
│ id (PK)     │
│ nombre      │
│ email       │
│ password_   │
│   hash      │
│ activo      │
│ created_at  │
└──────┬──────┘
       │
       │ 1
       │
       │ N
┌──────▼──────────────────┐
│   RegistroTarea         │
│─────────────────────────│
│ id (PK)                 │
│ usuario_id (FK) ────────┼──┐
│ cliente_id (FK) ────────┼──┼──┐
│ tipo_tarea_id (FK) ─────┼──┼──┼──┐
│ fecha                   │  │  │  │
│ duracion_minutos        │  │  │  │
│ observacion             │  │  │  │
│ created_at              │  │  │  │
│ updated_at              │  │  │  │
└──────┬──────────────────┘  │  │  │
       │                     │  │  │
       │ N                   │  │  │
       │                     │  │  │
┌──────▼──────┐      ┌───────▼──▼──▼──┐
│   Cliente   │      │  TipoTarea     │
│─────────────│      │────────────────│
│ id (PK)     │      │ id (PK)        │
│ nombre      │      │ descripcion    │
│ activo      │      │ activo          │
└─────────────┘      └────────────────┘
```

**Relaciones:**
- `Usuario` 1 → N `RegistroTarea` (un usuario puede tener múltiples registros)
- `Cliente` 1 → N `RegistroTarea` (un cliente puede tener múltiples registros)
- `TipoTarea` 1 → N `RegistroTarea` (un tipo puede tener múltiples registros)

---

## Esquema SQL (Ejemplo PostgreSQL)

```sql
-- Tabla Usuario
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_usuario_activo ON usuario(activo);

-- Tabla Cliente
CREATE TABLE cliente (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX idx_cliente_activo ON cliente(activo);

-- Tabla TipoTarea
CREATE TABLE tipo_tarea (
    id SERIAL PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX idx_tipo_tarea_activo ON tipo_tarea(activo);

-- Tabla RegistroTarea
CREATE TABLE registro_tarea (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuario(id),
    cliente_id INTEGER NOT NULL REFERENCES cliente(id),
    tipo_tarea_id INTEGER NOT NULL REFERENCES tipo_tarea(id),
    fecha DATE NOT NULL,
    duracion_minutos INTEGER NOT NULL CHECK (duracion_minutos > 0),
    observacion TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_registro_usuario_fecha ON registro_tarea(usuario_id, fecha);
CREATE INDEX idx_registro_cliente_fecha ON registro_tarea(cliente_id, fecha);
CREATE INDEX idx_registro_fecha ON registro_tarea(fecha);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_registro_tarea_updated_at 
    BEFORE UPDATE ON registro_tarea
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

---

## Consideraciones de Implementación

### Soft Delete

Las entidades `Usuario`, `Cliente` y `TipoTarea` utilizan el campo `activo` para implementar soft delete, permitiendo mantener la integridad referencial sin eliminar físicamente los registros.

### Seguridad de Contraseñas

- Las contraseñas deben almacenarse como hash (bcrypt, argon2, scrypt)
- Nunca almacenar contraseñas en texto plano
- Implementar políticas de contraseña segura

### Validación de Fechas

- La validación de fecha no futura debe implementarse tanto a nivel de base de datos como de aplicación
- Considerar zona horaria del usuario para validaciones de fecha

### Integridad Referencial

- Las claves foráneas deben tener restricciones ON DELETE/UPDATE apropiadas
- Considerar CASCADE para casos específicos o RESTRICT para prevenir eliminaciones accidentales

### Optimización de Consultas

Los índices están diseñados para optimizar:
- Consultas de tareas por usuario y rango de fechas
- Consultas de tareas por cliente y rango de fechas
- Resúmenes de dedicación por cliente

---

## Consultas Comunes

### Obtener tareas de un usuario

```sql
SELECT rt.*, c.nombre as cliente_nombre, tt.descripcion as tipo_tarea
FROM registro_tarea rt
JOIN cliente c ON rt.cliente_id = c.id
JOIN tipo_tarea tt ON rt.tipo_tarea_id = tt.id
WHERE rt.usuario_id = ? AND rt.fecha BETWEEN ? AND ?
ORDER BY rt.fecha DESC;
```

### Resumen de dedicación por cliente

```sql
SELECT 
    c.nombre as cliente,
    SUM(rt.duracion_minutos) as total_minutos,
    SUM(rt.duracion_minutos) / 60.0 as total_horas
FROM registro_tarea rt
JOIN cliente c ON rt.cliente_id = c.id
WHERE rt.usuario_id = ? AND rt.fecha BETWEEN ? AND ?
GROUP BY c.id, c.nombre
ORDER BY total_minutos DESC;
```

---

## Decisiones de Diseño

1. **Normalización**: El modelo está normalizado en 3NF para evitar redundancias
2. **Soft Delete**: Uso de campo `activo` en lugar de eliminación física
3. **Timestamps**: Uso de `created_at` y `updated_at` para trazabilidad
4. **Índices**: Optimizados para consultas frecuentes del flujo E2E
5. **Simplicidad**: Modelo minimalista acorde al alcance del MVP

---

## Notas

- Este modelo está diseñado específicamente para el MVP
- Puede evolucionar en versiones futuras según necesidades
- Las validaciones de negocio deben implementarse tanto a nivel de base de datos como de aplicación
- Considerar migraciones de datos para cambios futuros en el esquema

