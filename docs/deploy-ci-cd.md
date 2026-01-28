# Infraestructura y Despliegue – MVP

## Objetivo
Disponer de una URL pública accesible para evaluación del MVP.

---

## Base de Datos y Migraciones

### Requisitos
- **Motor:** SQL Server 2019 (o superior)
- **Base de datos:** `Lidr`
- **Driver Laravel:** `sqlsrv` (extensión PHP para SQL Server)

### Configuración de Conexión (.env)

```env
DB_CONNECTION=sqlsrv
DB_HOST=192.168.41.2
DB_PORT=1433
DB_DATABASE=Lidr
DB_USERNAME=Axoft
DB_PASSWORD=Axoft
```

### Estructura de Tablas

| Tabla | Descripción |
|-------|-------------|
| `USERS` | Autenticación centralizada (sin prefijo) |
| `PQ_PARTES_USUARIOS` | Empleados que cargan tareas |
| `PQ_PARTES_CLIENTES` | Clientes para los cuales se registran tareas |
| `PQ_PARTES_TIPOS_CLIENTE` | Catálogo de tipos de cliente |
| `PQ_PARTES_TIPOS_TAREA` | Catálogo de tipos de tarea |
| `PQ_PARTES_REGISTRO_TAREA` | Registros de tareas (tabla principal) |
| `PQ_PARTES_CLIENTE_TIPO_TAREA` | Asociación N:M Cliente-TipoTarea |

### Comandos de Migración

```bash
# Ejecutar migraciones (crear tablas)
php artisan migrate

# Ejecutar seeders (datos iniciales)
php artisan db:seed

# Recrear BD completa desde cero con datos
php artisan migrate:fresh --seed

# Rollback de todas las migraciones
php artisan migrate:reset

# Ver estado de migraciones
php artisan migrate:status
```

### Orden de Migraciones

Las migraciones se ejecutan en el siguiente orden (por dependencias):

1. `create_users_table` - Tabla USERS
2. `create_tipos_cliente_table` - PQ_PARTES_TIPOS_CLIENTE
3. `create_tipos_tarea_table` - PQ_PARTES_TIPOS_TAREA
4. `create_usuarios_table` - PQ_PARTES_USUARIOS (depende de USERS)
5. `create_clientes_table` - PQ_PARTES_CLIENTES (depende de USERS, TIPOS_CLIENTE)
6. `create_registro_tarea_table` - PQ_PARTES_REGISTRO_TAREA
7. `create_cliente_tipo_tarea_table` - PQ_PARTES_CLIENTE_TIPO_TAREA

### Datos de Seed

Los seeders crean los siguientes datos mínimos para testing:

**Usuarios de autenticación (USERS):**
| Code | Password | Descripción |
|------|----------|-------------|
| ADMIN | admin123 | Usuario supervisor |
| CLI001 | cliente123 | Usuario cliente |
| EMP001 | empleado123 | Usuario empleado |

**Empleados (PQ_PARTES_USUARIOS):**
| Code | Nombre | Supervisor |
|------|--------|------------|
| ADMIN | Administrador del Sistema | Sí |
| EMP001 | Empleado Demo | No |

**Tipos de Cliente (PQ_PARTES_TIPOS_CLIENTE):**
| Code | Descripción |
|------|-------------|
| CORP | Corporativo |
| PYME | Pequeña y Mediana Empresa |

**Tipos de Tarea (PQ_PARTES_TIPOS_TAREA):**
| Code | Descripción | Genérico | Default |
|------|-------------|----------|---------|
| GENERAL | Tarea General | Sí | Sí |
| SOPORTE | Soporte Técnico | Sí | No |
| DESARROLLO | Desarrollo de Software | No | No |

**Clientes (PQ_PARTES_CLIENTES):**
| Code | Nombre | Tipo | Con acceso |
|------|--------|------|------------|
| CLI001 | Cliente Demo S.A. | CORP | Sí |
| CLI002 | Empresa PyME Ejemplo | PYME | No |

### Troubleshooting

**Error: Driver SQL Server no encontrado**
```bash
# Linux/Mac
sudo pecl install sqlsrv pdo_sqlsrv

# Windows
# Habilitar extensión en php.ini:
# extension=sqlsrv
# extension=pdo_sqlsrv
```

**Error: Conexión rechazada**
- Verificar que SQL Server permite conexiones remotas
- Verificar firewall (puerto 1433)
- Verificar credenciales en `.env`

**Error: Timeout en migraciones**
- Aumentar `DB_TIMEOUT` en `.env` o en `config/database.php`

---

## Entorno
- Un solo entorno productivo.
- Base de datos administrada por el proveedor.

---

## CI/CD (básico)
Pipeline simple:
1. Instalación de dependencias
2. Ejecución de tests
3. Generación de documentación Swagger/OpenAPI (`php artisan l5-swagger:generate`)
4. Build de frontend
5. Deploy automático

---

## Gestión de secretos
- Variables de entorno:
  - DATABASE_URL
  - JWT_SECRET
- Uso de .env.example
- Nunca versionar secretos reales

---

## Despliegue
Opciones válidas:
- Backend: Render / Fly.io / Railway
- Frontend: Vercel / Netlify
- DB: Postgres administrado

---

## Acceso
- URL pública documentada.
- Usuario de prueba disponible para el evaluador.
