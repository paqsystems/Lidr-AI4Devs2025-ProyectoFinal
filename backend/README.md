# Backend - Laravel

Backend del sistema de registro de tareas desarrollado con Laravel (PHP).

## Estructura

```
backend/
├── app/
│   └── Models/          # Modelos Eloquent
├── database/
│   └── migrations/      # Migraciones de base de datos
└── tests/               # Tests del backend
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

## Convenciones

- **ORM:** Usar exclusivamente Eloquent ORM
- **Prefijo de tablas:** `PQ_PARTES_`
- **Autenticación:** Laravel Sanctum (Bearer Token)
- **Formato de respuesta:** Ver `specs/contracts/response-envelope.md`

