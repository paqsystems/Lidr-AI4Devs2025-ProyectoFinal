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

## Entrada #1

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
