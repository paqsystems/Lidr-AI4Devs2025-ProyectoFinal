# Registro del Uso de IA

Este documento registra el uso consciente y controlado de herramientas de IA
durante el desarrollo del MVP.

# EJEMPLO
## Entrada #x
Fecha: 2026-01-18
Etapa: Backend – API tareas
Herramienta: Cursor + ChatGPT
Prompt: “Generar endpoint REST para registrar tareas diarias”
Resultado IA: CRUD inicial de tareas
Ajuste humano: Simplifiqué validaciones y eliminé estados no usados
Motivo: Mantener alcance MVP

# ENTREGA 1
---

## Entrada #1

### Fecha
2026-01-17

### Etapa del proyecto
Definición de contexto, alcance del MVP y documentación base

### Herramientas de IA utilizadas
- ChatGPT (asistente de diseño y revisión)
- Cursor IDE (generación inicial de archivos)

### Prompt o instrucción utilizada
Definir y alinear el contexto del proyecto, el alcance del MVP y los artefactos
de documentación requeridos, corrigiendo desalineaciones entre lo generado por
el IDE y el objetivo real del sistema.

### Resultado generado por IA
- Definición clara del producto como sistema de registro de tareas para consultorías.
- Revisión crítica de archivos generados automáticamente por el IDE.
- Propuesta y redacción de archivos de contexto y definición:
  - PROJECT_CONTEXT.md
  - AGENTS.md
  - Reescritura de documentación en /docs (producto, historias, arquitectura,
    modelo de datos, testing y deploy).

### Ajustes humanos realizados
- Se descartó el enfoque inicial orientado a integraciones (Jira, MCP, Playwright).
- Se redujo el alcance al flujo E2E mínimo necesario para el MVP.
- Se priorizó simplicidad y coherencia por sobre sobre–ingeniería.
- Se validó que toda la documentación reflejara un único producto consistente.

### Motivo del ajuste
Alinear el proyecto con las consignas del trabajo práctico, evitar dispersión
funcional y asegurar que el MVP sea realizable, defendible y evaluable dentro
del alcance previsto.

## Entrada #2

## Registro de Uso de IA — Generación de Specs y Revisión Humana (Iteración X)

### Fecha
2026-01-17

### Tarea
Generación de las especificaciones funcionales y técnicas (enfoque SDD) para el MVP “Sistema de Partes”, incluyendo:
- Definición del flujo E2E prioritario
- Especificaciones de endpoints
- Reglas de validación
- Códigos de error de dominio
- Contrato de respuesta de la API (response envelope)

### Aporte de la IA
El asistente de IA fue utilizado para:
- Proponer la estructura general de la carpeta `/specs`.
- Generar todos los documentos iniciales de especificación, incluyendo:
  - Flujo E2E principal
  - Specs de endpoints (autenticación, partes, reportes)
  - Reglas de validación
  - Códigos de error de dominio
  - Contrato estándar de respuesta de la API
- Alinear las especificaciones con principios de Spec-Driven Design (SDD) y buenas prácticas REST.

Todas las especificaciones fueron generadas **a partir de mis directivas funcionales y arquitectónicas**, no de manera autónoma.

### Revisión e Intervención Humana
Durante la revisión manual de las especificaciones generadas, detecté una inconsistencia de diseño:

- El flujo de autenticación y las especificaciones relacionadas utilizaban **login basado en correo electrónico**.
- La regla de negocio prevista para esta aplicación es un **login basado en código de usuario** (identificador interno), y no por email.

Esta discrepancia fue identificada durante la validación humana de las specs, antes de iniciar cualquier desarrollo.

### Decisión Humana y Ajuste
A partir de esta detección, instruí a la IA para que:
- Modificara el modelo de autenticación para utilizar **código de usuario** en lugar de correo electrónico.
- Actualizara **todas las especificaciones afectadas**, incluyendo:
  - `auth-login.md`
  - Referencias dentro del flujo E2E
  - Reglas de validación asociadas a la autenticación
  - Casos de error vinculados al login
- Garantizara la coherencia del cambio en todo el conjunto de specs.

Este ajuste refleja una **decisión de diseño tomada por el humano**, basada en conocimiento del dominio y en la experiencia real de uso de sistemas similares.

### Resultado
- Las especificaciones finales reflejan correctamente el mecanismo de autenticación definido.
- El cambio fue aplicado de forma consistente en todos los documentos.
- No se había generado código antes de esta corrección, evitando retrabajo.

### Reflexión
Este proceso evidencia el rol de la IA como **acelerador en la generación de especificaciones**, mientras que:
- Las decisiones arquitectónicas,
- La corrección respecto del dominio,
- Y la validación final  
permanecen bajo responsabilidad humana.

Las propuestas de la IA fueron revisadas críticamente y ajustadas cuando fue necesario.

## Entrada #3

### Fecha
2025-01-20

### Etapa del proyecto
Especificación de pantallas y procesos - Definición de UI

### Herramientas de IA utilizadas
- Cursor IDE (generación de especificaciones técnicas)

### Prompt o instrucción utilizada
Proporcionar al asistente de IA el menú de procesos con las pantallas de datos y solicitar que genere una definición contextual detallada de todas las pantallas y procesos del sistema, incluyendo elementos UI, validaciones, integraciones con API, test IDs y notas de implementación.

### Resultado generado por IA
- Generación completa del archivo `specs/ui/screen-specifications.md` con:
  - Estructura de navegación y menú principal
  - Procesos de usuario documentados (Gestión de Archivos, Carga de Tareas, Proceso Masivo, Consultas)
  - Especificaciones detalladas de cada pantalla:
    - Elementos UI con tipos y descripciones
    - Test IDs para todos los controles
    - Validaciones frontend
    - Estados de UI (loading, empty, error, success)
    - Integración con endpoints API
    - Notas de implementación
  - Convenciones técnicas (formato de horas, test IDs, accesibilidad)
  - Referencias a endpoints existentes y nuevos endpoints necesarios

### Ajustes humanos realizados
- Revisión completa de la estructura generada
- Ajuste de la organización del contenido para mejor legibilidad
- Verificación de coherencia con las especificaciones de endpoints existentes
- Validación de que los test IDs sigan las convenciones del proyecto
- Confirmación de que los permisos de supervisor estén correctamente documentados
- Verificación de que los flujos de usuario sean lógicos y completos

### Motivo del ajuste
Asegurar que las especificaciones de pantallas sean coherentes con el resto de la documentación del proyecto, que sigan las convenciones establecidas (test IDs, accesibilidad, formato de respuesta API) y que proporcionen suficiente detalle técnico para la implementación del frontend sin ambigüedades.

## Entrega 4 – Generación y validación de historias de usuario y tickets técnicos

### Objetivo
Definir el conjunto completo de historias de usuario (User Stories) y tickets técnicos del MVP, cubriendo:
- Todos los roles del sistema (Cliente, Empleado, Empleado Supervisor)
- Funcionalidades del lado del usuario y del lado de la empresa/aplicación
- Clasificación de alcance MUST-HAVE vs SHOULD-HAVE
- Trazabilidad entre funcionalidades, backend, frontend, testing e infraestructura

### Uso de IA
Se utilizó IA (Cursor / ChatGPT) para:
- Generar un catálogo exhaustivo de historias de usuario organizadas por épicas
- Clasificar cada historia como MUST-HAVE o SHOULD-HAVE
- Definir criterios de aceptación detallados
- Incorporar reglas de negocio explícitas
- Derivar tickets técnicos alineados con las historias (backend, frontend, tests, CI/CD, documentación)

### Prompt / Instrucción dada a la IA
Se solicitó explícitamente:
- Generar el archivo `docs/historias-y-tickets.md`
- Considerar tres roles: Cliente, Empleado y Empleado Supervisor
- Incluir historias del lado del usuario y del lado de la aplicación cuando corresponda
- Aplicar reglas de negocio específicas (tipos de tarea genéricos / por defecto, asociaciones cliente–tipo de tarea, validaciones de duración, etc.)
- Clasificar cada historia como MUST-HAVE o SHOULD-HAVE
- Generar una tabla resumen y tickets técnicos derivados

### Resultado generado por la IA
La IA generó:
- Un documento estructurado por épicas
- 55 historias de usuario con criterios de aceptación detallados
- Tabla resumen de historias
- 33 tickets técnicos derivados, cubriendo:
  - Base de datos
  - Backend (API, validaciones, reglas de negocio)
  - Frontend (componentes, UX)
  - Testing (unitarios, integración y E2E)
  - CI/CD, logging y documentación

### Revisión y control humano
El resultado fue revisado manualmente para:
- Verificar consistencia funcional y técnica
- Validar alineación con el alcance real del MVP
- Confirmar que las reglas de negocio definidas previamente estuvieran correctamente reflejadas
- Ajustar criterios de prioridad (MUST vs SHOULD)
- Evaluar exhaustividad sin sobredimensionar el MVP

No se detectaron inconsistencias críticas.  
Se validó que el documento es apto como:
- Base de implementación
- Checklist de validación del MVP
- Insumo para documentación final del proyecto

### Decisión final
El documento `docs/historias-y-tickets.md` se adopta como:
- Fuente única de verdad funcional del MVP
- Referencia para validar la completitud del desarrollo
- Insumo directo para el README final del proyecto

---

## Entrada #4

### Fecha
2025-01-20

### Etapa del proyecto
Rediseño de arquitectura de autenticación y actualización de documentación

### Herramientas de IA utilizadas
- Cursor IDE (generación y actualización de documentación técnica)

### Prompt o instrucción utilizada
1. **Cambio arquitectónico:** Introducir una tabla `USERS` (sin prefijo PQ_PARTES_) como tabla central de autenticación. Después del login exitoso, determinar si es un login de cliente (PQ_PARTES_CLIENTES) o de usuario (PQ_PARTES_USUARIOS), y conservar los valores de tipo de usuario, user_code, cliente_id/usuario_id y es_supervisor durante todo el ciclo del proceso.

2. **Actualización de documentación:** Actualizar todas las historias de usuario y tickets técnicos afectados por el cambio de autenticación.

3. **Revisión de permisos:** Revisar historias de Épicas 9 (Informes y consultas) y 10 (Dashboard) para asegurar que contemplen explícitamente que:
   - Los clientes solo pueden ver tareas donde `cliente_id` coincide con su `cliente_id`
   - Los empleados NO supervisores solo pueden ver tareas donde `usuario_id` coincide con su `usuario_id`

### Resultado generado por IA

#### Cambio arquitectónico de autenticación:
- **Modelo de datos actualizado:**
  - Agregada tabla `USERS` (sin prefijo PQ_PARTES_) con campos: `id`, `code`, `password_hash`, `activo`, `inhabilitado`
  - Actualizada tabla `PQ_PARTES_USUARIOS`: agregado `user_id` (FK → User, obligatorio), eliminado `password_hash`
  - Actualizada tabla `PQ_PARTES_CLIENTES`: agregado `user_id` (FK → User, opcional), eliminado `password_hash`
  - Documentado flujo de autenticación: validación contra `USERS`, determinación de tipo (cliente/usuario), obtención de datos adicionales
  - Documentados valores a conservar durante el ciclo: `tipo_usuario`, `user_code`, `usuario_id`/`cliente_id`, `es_supervisor`

- **Documentación técnica actualizada:**
  - `docs/modelo-datos.md`: Nueva estructura con tabla `USERS` y flujo de autenticación completo
  - `database/modelo-datos.dbml`: Actualizado con tabla `User` y relaciones
  - `specs/endpoints/auth-login.md`: Endpoint actualizado con nuevo flujo y ejemplos de respuesta
  - `specs/flows/e2e-core-flow.md`: Flujo E2E actualizado con nuevos valores de autenticación
  - `architecture/api-to-data-mapping.md`: Mapeo API actualizado con operaciones en `USERS`

- **Historias de usuario actualizadas (6):**
  - HU-001 (Login empleado): Flujo contra `USERS`, determinación de tipo, valores a conservar
  - HU-002 (Login cliente): Mismo flujo que HU-001
  - HU-009 (Creación cliente): Creación en `USERS` si se habilita acceso al sistema
  - HU-010 (Edición cliente): Sincronización de estados y contraseñas con `USERS`
  - HU-019 (Creación asistente): Creación simultánea en `USERS`
  - HU-020 (Edición asistente): Sincronización de estados y contraseñas con `USERS`

- **Tickets técnicos actualizados (5):**
  - TK-001: Migración de `USERS`, actualización de modelos y relaciones
  - TK-002: Endpoint unificado de login, determinación de tipo, middleware
  - TK-003: Creación/sincronización con `USERS` en gestión de clientes
  - TK-005: Creación/sincronización con `USERS` en gestión de asistentes
  - TK-016: Middleware para conservar valores de autenticación

- **Supuestos y Definiciones actualizados:**
  - Agregada entidad `User` en Entidades Principales
  - Actualizadas entidades `Usuario` y `Cliente` (eliminado `password_hash`, agregado `user_id`)
  - Actualizados Supuestos Adicionales con nuevo flujo de autenticación

#### Revisión de permisos de visualización:
- **Historias actualizadas en Épica 9 (7 historias):**
  - HU-044: Aclarado que "Empleado" se refiere a "Empleado (NO supervisor)"
  - HU-046: Agregados filtros automáticos según rol en notas de reglas de negocio
  - HU-048: Agregados filtros automáticos según rol en criterios de aceptación y notas
  - HU-049: Agregado que los datos exportados respetan permisos del usuario
  - HU-050: Agregado que los filtros automáticos se aplican antes de verificar resultados vacíos

- **Historias actualizadas en Épica 10 (5 historias):**
  - HU-051: Aclarado que "Empleado" se refiere a "Empleado (NO supervisor)" y agregados filtros automáticos
  - HU-052: Agregados filtros automáticos según permisos en criterios de aceptación y notas
  - HU-054: Aclarado que gráficos respetan permisos según rol
  - HU-055: Agregado que actualizaciones automáticas respetan filtros según rol

- **Reglas de permisos documentadas:**
  - Clientes: Solo tareas donde `cliente_id` coincide con su `cliente_id`
  - Empleados (NO supervisores): Solo tareas donde `usuario_id` coincide con su `usuario_id`
  - Supervisores: Todas las tareas de todos los usuarios

### Ajustes humanos realizados

1. **Análisis previo:**
   - Se generó archivo `docs/ANALISIS-HISTORIAS-AUTENTICACION.md` con análisis detallado de cambios necesarios
   - Se revisó y confirmó el análisis antes de proceder con las actualizaciones

2. **Validación de cambios:**
   - Se verificó que todos los cambios fueran consistentes entre documentos
   - Se aseguró que las referencias cruzadas entre documentos estuvieran actualizadas
   - Se validó que el flujo de autenticación fuera completo y coherente

3. **Eliminación de archivos temporales:**
   - Se eliminó `docs/ANALISIS-HISTORIAS-AUTENTICACION.md` después de aplicar los cambios

4. **Revisión de permisos:**
   - Se identificaron historias que no especificaban explícitamente los filtros por rol
   - Se agregaron aclaraciones en todas las historias afectadas para evitar ambigüedades

### Motivo del ajuste

1. **Cambio arquitectónico:**
   - Centralizar la autenticación en una única tabla `USERS` simplifica el modelo y permite un mejor control de acceso
   - Separar la autenticación de las entidades de negocio (Usuario/Cliente) permite mayor flexibilidad
   - Conservar valores de autenticación durante el ciclo del proceso es necesario para autorización y auditoría

2. **Documentación de permisos:**
   - Asegurar que todas las historias especifiquen explícitamente los filtros por rol evita ambigüedades en la implementación
   - Garantizar que clientes y empleados NO supervisores solo vean sus propios datos es un requisito de seguridad y privacidad
   - Documentar estos permisos en cada historia facilita la implementación y testing

### Archivos modificados

- `docs/modelo-datos.md`
- `database/modelo-datos.dbml`
- `specs/endpoints/auth-login.md`
- `specs/flows/e2e-core-flow.md`
- `architecture/api-to-data-mapping.md`
- `docs/historias-y-tickets.md` (múltiples actualizaciones)

### Archivos eliminados

- `docs/ANALISIS-HISTORIAS-AUTENTICACION.md` (archivo temporal de análisis)