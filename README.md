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

---

## Documentación Técnica

### Producto
📄 Ver `docs/producto.md` para la descripción completa del producto, público objetivo y características principales.

### Arquitectura
📄 Ver `docs/arquitectura.md` para la arquitectura del sistema (Frontend, Backend, Base de Datos) y decisiones clave.

### Modelo de Datos
📄 Ver `docs/modelo-datos.md` para el modelo completo con entidades, relaciones y restricciones.

📄 Ver `specs/models/` para especificaciones detalladas de cada modelo:
- `usuario-model.md` - Modelo de Usuario (Empleado/Asistente)
- `registro-tarea-model.md` - Modelo de Registro de Tarea
- `cliente-model.md` - Modelo de Cliente
- `tipo-cliente-model.md` - Modelo de Tipo de Cliente
- `tipo-tarea-model.md` - Modelo de Tipo de Tarea
- `cliente-tipo-tarea-model.md` - Modelo de asociación Cliente-TipoTarea

### API

La API REST está documentada mediante especificaciones detalladas en `specs/endpoints/`. 

**Base URL:** `/api/v1`

**Autenticación:** Bearer Token (Sanctum)

**Formato de Respuesta:** Todas las respuestas siguen el formato estándar definido en `specs/contracts/response-envelope.md`:
```json
{
  "error": 0,
  "respuesta": "mensaje legible",
  "resultado": {}
}
```

#### Endpoints Principales

**Autenticación:**
- `POST /api/v1/auth/login` - Autenticación de usuario
- `POST /api/v1/auth/logout` - Cerrar sesión

**Gestión de Clientes (Solo Supervisores):**
- `GET /api/v1/clientes` - Listar clientes
- `POST /api/v1/clientes` - Crear cliente
- `GET /api/v1/clientes/{id}` - Obtener cliente
- `PUT /api/v1/clientes/{id}` - Actualizar cliente
- `DELETE /api/v1/clientes/{id}` - Eliminar cliente
- `GET /api/v1/clientes/{id}/tipos-tarea` - Listar tipos de tarea asignados
- `POST /api/v1/clientes/{id}/tipos-tarea` - Asignar tipo de tarea
- `DELETE /api/v1/clientes/{id}/tipos-tarea/{tipo_tarea_id}` - Desasignar tipo de tarea

**Gestión de Tipos de Cliente (Solo Supervisores):**
- `GET /api/v1/tipos-cliente` - Listar tipos de cliente
- `POST /api/v1/tipos-cliente` - Crear tipo de cliente
- `GET /api/v1/tipos-cliente/{id}` - Obtener tipo de cliente
- `PUT /api/v1/tipos-cliente/{id}` - Actualizar tipo de cliente
- `DELETE /api/v1/tipos-cliente/{id}` - Eliminar tipo de cliente

**Gestión de Asistentes/Empleados (Solo Supervisores):**
- `GET /api/v1/asistentes` - Listar asistentes
- `POST /api/v1/asistentes` - Crear asistente
- `GET /api/v1/asistentes/{id}` - Obtener asistente
- `PUT /api/v1/asistentes/{id}` - Actualizar asistente
- `DELETE /api/v1/asistentes/{id}` - Eliminar asistente

**Gestión de Tipos de Tarea (Solo Supervisores):**
- `GET /api/v1/tipos-tarea` - Listar tipos de tarea
- `POST /api/v1/tipos-tarea` - Crear tipo de tarea
- `GET /api/v1/tipos-tarea/{id}` - Obtener tipo de tarea
- `PUT /api/v1/tipos-tarea/{id}` - Actualizar tipo de tarea
- `DELETE /api/v1/tipos-tarea/{id}` - Eliminar tipo de tarea

**Registro de Tareas:**
- `POST /api/v1/tareas` - Crear registro de tarea
- `GET /api/v1/tareas` - Listar tareas (filtrado automático por rol)
- `GET /api/v1/tareas/{id}` - Obtener tarea
- `PUT /api/v1/tareas/{id}` - Actualizar tarea
- `DELETE /api/v1/tareas/{id}` - Eliminar tarea
- `GET /api/v1/tareas/tipos-disponibles?cliente_id={id}` - Obtener tipos de tarea disponibles para un cliente

**Proceso Masivo (Solo Supervisores):**
- `GET /api/v1/tareas/proceso-masivo` - Listar tareas para proceso masivo
- `POST /api/v1/tareas/proceso-masivo` - Procesar tareas masivamente (cerrar/reabrir)

**Informes y Consultas:**
- `GET /api/v1/informes/detalle` - Consulta detallada de tareas
- `GET /api/v1/informes/por-asistente` - Consulta agrupada por asistente
- `GET /api/v1/informes/por-cliente` - Consulta agrupada por cliente
- `GET /api/v1/informes/por-tipo` - Consulta agrupada por tipo de tarea
- `GET /api/v1/informes/por-fecha` - Consulta agrupada por fecha
- `GET /api/v1/informes/exportar` - Exportar informe a Excel

**Dashboard:**
- `GET /api/v1/dashboard/resumen` - Resumen ejecutivo del dashboard
- `GET /api/v1/dashboard/por-cliente` - Resumen por cliente
- `GET /api/v1/dashboard/por-asistente` - Resumen por asistente

**Documentación completa:** Ver `specs/endpoints/` para especificaciones detalladas de cada endpoint.

**Códigos de error:** Ver `specs/errors/domain-error-codes.md` para el catálogo completo de códigos de error.

**Reglas de validación:** Ver `specs/rules/validation-rules.md` para validaciones de formato y tipo.

**Reglas de negocio:** Ver `specs/rules/business-rules.md` para reglas específicas del dominio.

### Historias de Usuario

📄 Ver `docs/historias-y-tickets.md` para el catálogo completo de historias de usuario.

**Resumen:**
- **Total de historias:** 55 (HU-001 a HU-055)
- **MUST-HAVE:** 25 historias (imprescindibles para el MVP)
- **SHOULD-HAVE:** 30 historias (mejoras y funcionalidades avanzadas)

**Historias que cubren el flujo E2E prioritario:**
- HU-001: Autenticación de empleado
- HU-028: Registro de tarea diaria
- HU-033: Visualización de tareas propias
- HU-044: Consulta detallada de tareas
- HU-046: Consulta agrupada por cliente
- HU-051: Dashboard principal

### Tickets de Trabajo

📄 Ver `docs/historias-y-tickets.md` (sección "Tickets Técnicos Derivados") para el catálogo completo de tickets técnicos.

**Resumen:**
- **Total de tickets:** 33 (TK-001 a TK-033)
- **Categorías:**
  - Migraciones y Modelos (TK-001)
  - Endpoints de Autenticación (TK-002)
  - Endpoints de Gestión (TK-003 a TK-014)
  - Servicios API Frontend (TK-015)
  - Componentes UI (TK-016 a TK-019)
  - Tests (TK-020 a TK-025)
  - Proceso Masivo (TK-026, TK-027)
  - Informes (TK-028, TK-029, TK-030)
  - Dashboard (TK-031, TK-032)
  - Optimizaciones (TK-033)

Cada ticket técnico referencia las historias de usuario relacionadas y está clasificado según su prioridad (MUST-HAVE o SHOULD-HAVE).

### Pull Requests

Los cambios de la **Entrega 1 - Documentación Técnica** se encuentran en la rama  `feature-entrega1-[INICIALES]`.

**Pull Request:** Se creará un PR hacia `main` con todos los artefactos de documentación técnica.

**Contenido del PR:**
- Documentación de producto
- Arquitectura del sistema
- Modelo de datos completo
- 55 historias de usuario con criterios de aceptación
- 33 tickets técnicos derivados
- 41 especificaciones de endpoints de API
- Reglas de negocio y validaciones
- Especificaciones de modelos backend
- Documentación de estructura de frontend

---

## Estructura del Repositorio

```
├── backend/              # Backend Laravel
│   ├── app/Models/       # Modelos Eloquent
│   └── database/         # Migraciones
├── frontend/             # Frontend React
│   └── src/
│       ├── shared/       # Componentes UI base e i18n
│       └── features/     # Features del dominio
├── docs/                 # Documentación del proyecto
│   ├── producto.md       # Descripción del producto
│   ├── arquitectura.md   # Arquitectura del sistema
│   ├── modelo-datos.md   # Modelo de datos
│   ├── historias-y-tickets.md  # Historias y tickets
│   └── ...
├── specs/                # Especificaciones técnicas
│   ├── endpoints/        # Especificaciones de endpoints (41 archivos)
│   ├── models/           # Especificaciones de modelos (6 archivos)
│   ├── rules/            # Reglas de validación y negocio
│   ├── contracts/        # Contratos de API
│   ├── errors/           # Códigos de error
│   └── flows/            # Flujos E2E
└── README.md             # Este archivo
```

---

## Referencias

- **Consignas del MVP:** `.cursor/consignas.md`
- **Contexto del proyecto:** `PROJECT_CONTEXT.md`
- **Reglas para el agente IA:** `AGENTS.md`
- **Registro de uso de IA:** `docs/ia-log.md`
- **Prompts utilizados:** `prompts.md`