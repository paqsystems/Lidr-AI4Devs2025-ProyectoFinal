# Documentación: 03-data-access-orm-sql.md

## Ubicación
`.cursor/rules/03-data-access-orm-sql.md`

## Propósito
Este archivo define las reglas obligatorias para el acceso a datos en el backend Laravel, incluyendo:
- Uso exclusivo de herramientas nativas de Laravel (Eloquent, Migrations, Seeders, Factories)
- Convenciones para Migrations y Modelos Eloquent
- Reglas para queries complejas
- Anti-patrones de consultas (prohibición de subqueries en WHERE para verificar existencia)
- Prevención de SQL injection
- Optimización de performance

## Contenido Principal

### Herramientas Nativas
- Confirmación explícita: NO usar PSL/Prisma, solo herramientas nativas de Laravel
- Eloquent ORM, Laravel Migrations, Seeders, Factories

### Migrations
- Definición con Schema Builder
- Convenciones de nomenclatura
- Versionado y reversibilidad

### Modelos Eloquent
- Estructura estándar (fillable, casts, relaciones)
- Scopes reutilizables
- Convenciones obligatorias

### Anti-patrones Prohibidos
- **Regla crítica:** NO usar subqueries en WHERE para verificar existencia
- Obligatorio usar LEFT JOIN + verificación de NULL
- Ejemplos de código correcto e incorrecto

### Performance y Seguridad
- Prevención de N+1 queries
- Anti-SQL injection
- Optimización de índices

## Relación con Otros Documentos
- Complementa `docs/backend/PLAYBOOK_BACKEND_LARAVEL.md`
- Referenciado desde `.cursor/rules/00-backend-policy.md`
- Alineado con `docs/domain/DATA_MODEL.md`

## Uso
Este documento debe ser consultado por:
- Desarrolladores del backend para implementar acceso a datos
- Revisores de código para validar cumplimiento de reglas
- Arquitectos para definir estrategias de consultas

## Mantenimiento
- Actualizar cuando se identifiquen nuevos anti-patrones
- Mantener ejemplos actualizados con el código
- Documentar excepciones cuando sea necesario

