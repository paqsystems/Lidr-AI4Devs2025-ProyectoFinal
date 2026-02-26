# Infraestructura y Despliegue – MVP

## Objetivo
Disponer de una URL pública accesible para evaluación del MVP.

---

## Base de Datos y Migraciones

### Requisitos (SQL Server / MSSQL)
- **Motor:** SQL Server 2019+ (recomendado)
- **Base de datos:** Configurada según entorno (ej: `Lidr`)
- **Driver Laravel:** `sqlsrv` (extensión PHP pdo_sqlsrv)
- **Conexión directa:** No se requiere túnel SSH (a diferencia de MySQL remoto)

### Configuración de Conexión (.env)

```env
DB_CONNECTION=sqlsrv
DB_HOST=PAQ-GAUSS\SQLEXPRESS_AXOFT,2544
DB_PORT=
DB_DATABASE=Lidr
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
DB_TRUST_SERVER_CERTIFICATE=true
```

**Nota:** Para instancia nombrada con puerto explícito use el formato `SERVIDOR\INSTANCIA,puerto`. La variable `DB_TRUST_SERVER_CERTIFICATE=true` es requerida en muchos entornos SQL Server. Ver `docs/migracion-mysql-a-mssql.md` para más detalles.

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

**Error: Could not find driver (pdo_sqlsrv)**
- Instalar Microsoft ODBC Driver for SQL Server
- Instalar extensión PHP `pdo_sqlsrv` (compatible con la versión de PHP)
- Reiniciar servidor web o PHP-FPM

**Error: Conexión rechazada**
- Verificar que SQL Server está en ejecución
- Verificar formato de host: `SERVIDOR\INSTANCIA,puerto` para instancia nombrada
- Verificar firewall (puerto 1433 por defecto, o el configurado)
- Verificar credenciales en `.env`
- Verificar que la base de datos existe en el servidor SQL Server

**Error: Trust Server Certificate**
- Agregar `DB_TRUST_SERVER_CERTIFICATE=true` en `.env`

**Error: Timeout en migraciones**
- Verificar conexión de red
- Aumentar timeout en `config/database.php` si es necesario

---

## Entorno
- Un solo entorno productivo.
- Base de datos administrada por el proveedor.

---

## CI/CD (básico)

Pipeline con **GitHub Actions** en `.github/workflows/ci.yml`.

### Disparadores
- Actualmente: solo **manual** (`workflow_dispatch`). No se ejecuta en push/PR para no bloquear merge.
- Para habilitar automático: descomentar `push` y `pull_request` en `ci.yml`

### Jobs del pipeline

| Job      | Descripción                                                  |
|----------|---------------------------------------------------------------|
| backend  | Tests Laravel (PHPUnit) con MySQL 8.0 como servicio            |
| frontend | Tests unitarios (Vitest) + build (Vite)                       |
| swagger  | Generación de documentación OpenAPI (`php artisan l5-swagger:generate`) |
| e2e      | Tests E2E (Playwright, Chromium) con backend y frontend      |

### Orden de ejecución
1. **backend** y **frontend** en paralelo
2. **swagger** tras backend
3. **e2e** tras backend y frontend (inicia backend con `php artisan serve`, Playwright inicia el frontend)

### Requisitos para CI
- **PHP:** 8.2 (shivammathur/setup-php)
- **Node.js:** 20
- **MySQL:** 8.0 (servicio de contenedor)
- **Composer** y **npm** con cache

### Ejecución local del pipeline
No es necesario instalar nada extra: GitHub Actions usa runners con PHP, Node, MySQL, etc. Solo asegúrate de que los tests pasen localmente:
```bash
# Backend
cd backend && php artisan test

# Frontend (unit + E2E)
cd frontend && npm run test:all
```

### Deploy automático
**No implementado.** El despliegue se realiza manualmente. Ver sección "Despliegue" más abajo para opciones de plataforma.

---

## Gestión de secretos
- Variables de entorno:
  - DATABASE_URL
  - JWT_SECRET
- Uso de .env.example
- Nunca versionar secretos reales

---

## Frontend en Vercel
- **vercel.json:** `frontend/vercel.json` con rewrites para SPA (todas las rutas → index.html)
- Sin esto, URLs como `/login` devuelven 404 al abrirlas directamente

## Despliegue
Opciones válidas:
- Backend: Render / Fly.io / Railway
- Frontend: Vercel / Netlify
- DB: MySQL/MariaDB administrado (ej: AWS RDS, DigitalOcean, PlanetScale)

---

## Acceso
- URL pública documentada.
- Usuario de prueba disponible para el evaluador.
