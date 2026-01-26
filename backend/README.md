# Backend - Laravel

Backend del sistema de registro de tareas desarrollado con Laravel (PHP).

## Estructura

```
backend/
├── app/
│   └── Models/          # Modelos Eloquent
├── database/
│   └── migrations/      # Migraciones de base de datos
└── tests/               # Tests PHPUnit del backend
    ├── Unit/           # Tests unitarios (lógica de negocio, servicios)
    └── Feature/        # Tests de integración (API + base de datos)
```

## Modelos Implementados

- ✅ `Usuario.php` - Modelo de usuario con autenticación
- ✅ `RegistroTarea.php` - Modelo de registro de tareas
- ⏳ `Cliente.php` - Pendiente
- ⏳ `TipoCliente.php` - Pendiente
- ⏳ `TipoTarea.php` - Pendiente
- ⏳ `ClienteTipoTarea.php` - Pendiente

## Especificaciones

- **Modelos:** Ver `specs/models/` para especificaciones detalladas
- **Endpoints:** Ver `specs/endpoints/` para especificaciones de API
- **Reglas:** Ver `specs/rules/` para reglas de negocio y validación
- **Playbook:** Ver `docs/backend/PLAYBOOK_BACKEND_LARAVEL.md`

## Testing

**Estructura de Tests:**
- Tests unitarios: `backend/tests/Unit/` - Lógica de negocio, servicios
- Tests de integración: `backend/tests/Feature/` - API + base de datos

**Ejecutar Tests:**
```bash
cd backend
php artisan test              # Todos los tests
php artisan test --filter Unit    # Solo tests unitarios
php artisan test --filter Feature # Solo tests de integración
```

**Documentación:** Ver `docs/testing.md` para la estrategia completa de testing.

## Convenciones

- **ORM:** Usar exclusivamente Eloquent ORM
- **Prefijo de tablas:** `PQ_PARTES_`
- **Autenticación:** Laravel Sanctum (Bearer Token)
- **Formato de respuesta:** Ver `specs/contracts/response-envelope.md`

