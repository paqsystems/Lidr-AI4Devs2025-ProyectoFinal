# Documentación: PersonalAccessToken

## Propósito

Modelo personalizado que extiende `Laravel\Sanctum\PersonalAccessToken` para agregar compatibilidad con SQL Server.

## Archivo

- **Ubicación:** `backend/app/Models/PersonalAccessToken.php`

## Problema Resuelto

La tabla `personal_access_tokens` de Sanctum también sufre el problema de formato de fecha con milisegundos en SQL Server:

```
SQLSTATE[22007]: La conversión del tipo de datos nvarchar en datetime 
produjo un valor fuera de intervalo
```

## Solución

1. **Modelo personalizado:** Se creó `App\Models\PersonalAccessToken` que extiende el modelo de Sanctum y agrega `$dateFormat`.

2. **Registro en AppServiceProvider:** Se registra el modelo personalizado con Sanctum:

```php
Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);
```

## Código

```php
class PersonalAccessToken extends SanctumPersonalAccessToken
{
    protected $dateFormat = 'Y-m-d H:i:s';
}
```

## Referencias

- [Regla 20 - SQL Server DateTime Format](./20-sql-server-datetime-format.md)
- [Laravel Sanctum - Custom Models](https://laravel.com/docs/10.x/sanctum#overriding-default-models)

## Historial

| Fecha | Cambio |
|-------|--------|
| 2026-01-27 | Creación del modelo |
