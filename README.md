# Lidr-AI4Devs2025-ProyectoFinal
Proyecto Final del Master de Lidr AI4Devs

# Reglas para Cursor — BackEnd Laravel (Sanctum) — Sistema de Partes de Atención

Este paquete contiene **solo reglas y especificaciones**. **NO** debe implementarse código todavía.

## Dónde colocar cada archivo en tu repo (recomendado)

### Reglas para Cursor (primario)
Copiar a:
- `/.cursor/rules/00-backend-policy.md`
- `/.cursor/rules/01-api-contract.md`
- `/.cursor/rules/02-security-sessions-tokens.md`
- `/.cursor/rules/03-data-access-orm-sql.md`
- `/.cursor/rules/04-ticketing-domain.md`

> Si tu instalación de Cursor usa un único archivo `.cursorrules`, concatená el contenido de los archivos anteriores en ese archivo (manteniendo el orden).

### Documentación del repositorio (referencia humana)
Copiar a:
- `/docs/api/CONTRATO_BASE.md`
- `/docs/backend/PLAYBOOK_BACKEND_LARAVEL.md`
- `/docs/api/TICKETING_API_SPEC.md`

## Orden recomendado de lectura para Cursor
1. 00-backend-policy.md
2. 01-api-contract.md
3. 02-security-sessions-tokens.md
4. 03-data-access-orm-sql.md
5. 04-ticketing-domain.md

Luego usar `/docs/*` como material ampliado.

---

## Alcance Funcional del MVP

El alcance funcional del MVP está definido formalmente en el documento:

📄 `docs/historias-y-tickets.md`

Dicho documento contiene:
- Historias de usuario clasificadas como MUST-HAVE y SHOULD-HAVE
- Criterios de aceptación detallados
- Reglas de negocio explícitas
- Tickets técnicos derivados (backend, frontend, testing e infraestructura)

El desarrollo del MVP se enfoca exclusivamente en las historias clasificadas como MUST-HAVE.

---

## Flujo End-to-End Prioritario

El flujo E2E prioritario del MVP es:

1. Autenticación de empleado
2. Registro de una tarea diaria
3. Visualización de tareas propias
4. Consulta agrupada por cliente
5. Visualización del dashboard principal

Este flujo está cubierto por las historias:
- HU-001
- HU-028
- HU-033
- HU-044
- HU-046
- HU-051

Y validado mediante tests E2E automatizados.

---

## Gestión del alcance (MUST vs SHOULD)

Las historias SHOULD-HAVE:
- No son necesarias para considerar completo el MVP
- Representan mejoras, optimizaciones o funcionalidades avanzadas
- Quedan documentadas como roadmap futuro

El MVP se considera funcionalmente completo cuando todas las historias MUST-HAVE están implementadas y validadas.

## Checklist de Validación del MVP

### Autenticación
- [ ] Login de empleado (HU-001)
- [ ] Logout funcional (HU-003)

### Gestión base (Supervisor)
- [ ] ABM de Clientes (HU-008 a HU-012)
- [ ] ABM de Tipos de Cliente (HU-014 a HU-017)
- [ ] ABM de Empleados/Asistentes (HU-018 a HU-021)
- [ ] ABM de Tipos de Tarea con reglas de genérico y por defecto (HU-023 a HU-026)

### Registro de tareas
- [ ] Carga de tarea diaria (HU-028)
- [ ] Validación de duración en tramos de 15 minutos (HU-035)
- [ ] Advertencia de fecha futura (HU-036)
- [ ] Filtrado dinámico de tipos de tarea por cliente (HU-037)
- [ ] Edición y eliminación de tareas propias (HU-029, HU-030)
- [ ] Edición y eliminación de tareas por supervisor (HU-031, HU-032)

### Visualización
- [ ] Listado de tareas propias (HU-033)
- [ ] Listado de todas las tareas (supervisor) (HU-034)

### Informes
- [ ] Consulta detallada de tareas (HU-044)
- [ ] Consulta agrupada por cliente (HU-046)
- [ ] Manejo de resultados vacíos (HU-050)

### Dashboard
- [ ] Dashboard principal funcional (HU-051)
- [ ] Resumen de dedicación por cliente (HU-052)

### Calidad técnica
- [ ] Tests unitarios backend
- [ ] Tests de integración backend
- [ ] Al menos un test E2E del flujo principal
- [ ] CI/CD básico configurado
- [ ] Documentación de API disponible
