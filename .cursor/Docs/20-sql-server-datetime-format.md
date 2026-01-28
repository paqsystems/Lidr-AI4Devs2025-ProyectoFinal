# Documentación: Regla 20 - Formato de Fechas SQL Server

## Propósito

Esta regla establece el estándar obligatorio para el manejo de fechas en el proyecto cuando se trabaja con SQL Server.

## Archivo de Regla

- **Ubicación:** `.cursor/rules/20-sql-server-datetime-format.md`
- **Tipo:** Regla técnica obligatoria
- **Alcance:** Backend (Laravel + SQL Server)

## Origen

Esta regla surge del error encontrado durante la implementación de TR-001(MH) Login de Empleado:

```
SQLSTATE[22007]: La conversión del tipo de datos nvarchar en datetime 
produjo un valor fuera de intervalo
```

El problema ocurre porque Laravel genera timestamps con milisegundos que SQL Server no acepta.

## Puntos Clave

1. **Configuración global:** `config/database.php` con `date_format`
2. **Modelos:** Propiedad `$dateFormat` en cada modelo
3. **Inserciones directas:** Usar `DB::raw('GETDATE()')` en lugar de `now()`
4. **Seeders y Tests:** Misma regla que inserciones directas

## Impacto

- **Archivos afectados:** Todos los modelos, seeders, tests y código que interactúe con fechas
- **Migraciones:** No requieren cambios (usan tipos estándar de Laravel)
- **Frontend:** No afectado (las fechas se serializan correctamente en JSON)

## Referencias

- [TR-001(MH) - Login de Empleado](../../docs/hu-tareas/TR-001(MH)-login-de-empleado.md)
- [Laravel Database Configuration](https://laravel.com/docs/10.x/database)
- [SQL Server GETDATE()](https://docs.microsoft.com/en-us/sql/t-sql/functions/getdate-transact-sql)

## Historial

| Fecha | Cambio |
|-------|--------|
| 2026-01-27 | Creación de la regla |
