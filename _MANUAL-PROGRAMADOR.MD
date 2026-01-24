# Manual del Programador

**Versión:** 1.2  
**Última actualización:** 2025-01-20

---

## 📋 Tabla de Contenidos

1. [Objetivo Conceptual del Proyecto](#objetivo-conceptual-del-proyecto)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Ruta de Lectura para Entender el Diseño](#ruta-de-lectura-para-entender-el-diseño)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Convenciones y Reglas](#convenciones-y-reglas)
6. [Cómo Empezar a Trabajar](#cómo-empezar-a-trabajar)
7. [Referencias Importantes](#referencias-importantes)

---

## 🎯 Objetivo Conceptual del Proyecto

### ¿Qué es este proyecto?

Este es un **MVP web** para consultorías y empresas de servicios que permite a empleados/asistentes registrar las tareas realizadas diariamente, asociándolas a clientes y tipos de tarea, con el objetivo de analizar la dedicación y generar informes operativos y comerciales.

### Propósito Principal

El sistema permite:
- **Registrar tareas diarias** de forma simple (fecha, cliente, tipo de tarea, duración, observaciones)
- **Asociar tareas a clientes** y tipos de trabajo específicos
- **Visualizar la dedicación** por usuario y cliente
- **Generar informes** básicos de dedicación para análisis operativo y comercial

### Flujo E2E Prioritario

El flujo principal que debe funcionar completamente es:

```
Login → Registro de tarea diaria → Visualización de tareas / resumen
```

**Todo el desarrollo debe soportar este flujo.**

### Entidades Principales

- **Usuario** (Empleado/Asistente): Quienes cargan las tareas
- **Cliente**: Empresas o personas para quienes se realizan las tareas
- **Tipo de Cliente**: Clasificación de clientes (para segmentación)
- **Tipo de Tarea**: Categorías de trabajo (pueden ser genéricos o específicos por cliente)
- **Registro de Tarea**: Cada entrada de trabajo realizado

### Principios de Diseño

- ✅ **Simplicidad sobre sofisticación**: MVP funcional, no sobre-ingeniería
- ✅ **Valor completo del flujo E2E**: Priorizar que el flujo principal funcione de punta a punta
- ✅ **Validaciones claras**: Reglas de negocio explícitas y documentadas
- ✅ **Trazabilidad**: Auditoría básica de cambios
- ✅ **Testing enfocado**: Tests del flujo principal son prioritarios

### Qué NO es este proyecto

- ❌ No es una plataforma de automatización
- ❌ No es un integrador de Jira, MCP, Playwright u otras herramientas
- ❌ No es un ERP completo
- ❌ No incluye facturación ni reportes avanzados en el MVP

---

## 🛠️ Stack Tecnológico

### Backend

- **Framework:** Laravel (PHP)
- **Autenticación:** Laravel Sanctum (Bearer Token)
- **ORM:** Eloquent (nativo de Laravel)
- **Base de Datos:** SQL Server / PostgreSQL / MySQL
- **API:** REST con formato de respuesta estándar (envelope)
- **Testing:** PHPUnit

### Frontend

- **Framework:** React
- **Build Tool:** Vite (recomendado) o Webpack
- **State Management:** Context API o Redux/Zustand (según necesidad)
- **UI Library:** Tailwind CSS + shadcn/ui (Radix UI)
- **Testing:** Jest/Vitest (unitarios), Playwright (E2E)
- **Internacionalización:** i18n con función `t()` obligatoria

### Base de Datos

- **Sistema:** SQL Server / PostgreSQL / MySQL
- **Prefijo de tablas:** `PQ_PARTES_` (excepto la tabla USERS, para el login inicial )
- **Autenticación:** Por código de usuario (no email)

### Infraestructura y DevOps

- **CI/CD:** Pipeline básico configurado
- **Deploy:** Documentado en `docs/deploy-ci-cd.md`
- **Secrets:** Gestión de secretos documentada

### Herramientas de Desarrollo

- **IDE:** Cursor (con reglas específicas en `.cursor/`)
- **Control de Versiones:** Git
- **Documentación:** Markdown

---

## 📚 Ruta de Lectura para Entender el Diseño

### Fase 1: Contexto General (15 minutos)

Lee estos archivos en orden para entender el proyecto:

1. **`PROJECT_CONTEXT.md`** (raíz)
   - Contexto general del proyecto
   - Objetivos del MVP
   - Qué es y qué no es
   - Flujo E2E prioritario

2. **`README.md`** (raíz)
   - Información general del repositorio
   - Estructura básica
   - Checklist de validación del MVP

3. **`docs/README.md`** ⭐ **NUEVO**
   - Guía de navegación de la documentación
   - Estructura de carpetas de documentación
   - Referencias rápidas a documentos clave

### Fase 2: Diseño Funcional (30 minutos)

3. **`docs/producto.md`**
   - Objetivo del producto
   - Usuarios y roles
   - Funcionalidades del MVP
   - Alcance y no-alcance

4. **`docs/historias-y-tickets.md`**
   - **IMPORTANTE:** Este es el documento central de funcionalidades
   - Historias de usuario (MUST-HAVE y SHOULD-HAVE)
   - Criterios de aceptación
   - Reglas de negocio
   - Tickets técnicos derivados

5. **`specs/flows/e2e-core-flow.md`**
   - Flujo E2E detallado paso a paso
   - Casos de uso principales

### Fase 3: Diseño Técnico - Arquitectura (20 minutos)

6. **`docs/arquitectura.md`**
   - Arquitectura general del sistema
   - Decisiones de diseño
   - Componentes principales

7. **`docs/modelo-datos.md`**
   - Modelo de datos completo
   - Entidades y relaciones
   - Restricciones y validaciones

8. **`specs/rules/business-rules.md`**
   - Reglas de negocio específicas
   - Validaciones críticas

### Fase 4: Diseño Técnico - Backend (30 minutos)

9. **`backend/README.md`** ⭐ **NUEVO**
   - Estructura del backend
   - Modelos implementados
   - Convenciones y referencias

10. **`docs/backend/PLAYBOOK_BACKEND_LARAVEL.md`**
    - Guía de desarrollo backend
    - Convenciones Laravel
    - Estructura de código

11. **`docs/api/CONTRATO_BASE.md`**
    - Formato estándar de respuestas API
    - Manejo de errores
    - Convenciones de endpoints

12. **`specs/contracts/response-envelope.md`**
    - Formato de respuesta estándar
    - Códigos de error

13. **`specs/models/`** (todos los archivos)
    - Especificaciones de modelos backend
    - Relaciones Eloquent
    - Validaciones

14. **`specs/endpoints/README.md`** ⭐ **NUEVO**
    - Guía de navegación de especificaciones de endpoints
    - Organización por funcionalidad
    - Formato de especificaciones

15. **`specs/endpoints/`** (revisar según necesidad)
    - Especificaciones detalladas de cada endpoint
    - Request/Response
    - Validaciones

### Fase 5: Diseño Técnico - Frontend (30 minutos)

14. **`docs/frontend/frontend-specifications.md`**
    - Especificaciones generales del frontend
    - Estructura de carpetas
    - Convenciones de código

15. **`docs/frontend/ui-layer-wrappers.md`**
    - **CRÍTICO:** Reglas de UI Layer
    - Componentes reutilizables
    - Separación de responsabilidades

16. **`docs/frontend/i18n.md`**
    - Internacionalización obligatoria
    - Función `t()` con fallback
    - Convenciones de keys

17. **`docs/frontend/features/features-structure.md`**
    - Estructura de features
    - Organización de componentes

18. **`specs/ui/screen-specifications.md`**
    - Especificaciones de pantallas
    - Componentes UI

### Fase 6: Testing y Calidad (20 minutos)

19. **`docs/testing.md`**
    - Estrategia de testing
    - Tipos de tests (unit, integración, E2E)
    - Cómo ejecutar tests

20. **`specs/tests/`** (revisar según necesidad)
    - Especificaciones de tests
    - Casos de prueba documentados

### Fase 7.5: Navegación de Especificaciones (10 minutos) ⭐ **NUEVO**

21. **`specs/README.md`** ⭐ **NUEVO**
    - Guía completa de especificaciones técnicas
    - Organización por tipo de artefacto
    - Referencias rápidas a todas las especificaciones

### Fase 8: Reglas y Convenciones (15 minutos)

22. **`.cursor/consignas.md`**
    - Reglas del proyecto
    - Entregables obligatorios
    - Principios de desarrollo

23. **`docs/reglas-negocio.md`**
    - Reglas de negocio adicionales
    - Validaciones

---

## 📁 Estructura del Proyecto

```
Lidr-AI4Devs2025-ProyectoFinal/
├── backend/                    # Backend Laravel
│   ├── README.md              # ⭐ Guía del backend
│   ├── app/
│   │   ├── Models/            # Modelos Eloquent
│   │   ├── Http/
│   │   │   ├── Controllers/   # Controladores API
│   │   │   ├── Requests/      # Form Requests (validación)
│   │   │   └── Middleware/    # Middleware
│   │   └── ...
│   ├── database/
│   │   ├── migrations/        # Migraciones de BD
│   │   └── seeders/           # Seeders
│   └── tests/                 # Tests PHPUnit
│
├── frontend/                   # Frontend React
│   ├── src/
│   │   ├── shared/
│   │   │   ├── ui/            # UI Layer Wrappers (OBLIGATORIO)
│   │   │   └── i18n/          # Internacionalización
│   │   ├── features/          # Features del dominio
│   │   ├── pages/             # Páginas/vistas
│   │   ├── services/          # Servicios API
│   │   └── ...
│   └── tests/                 # Tests frontend
│
├── docs/                       # Documentación del proyecto
│   ├── README.md              # ⭐ Guía de navegación de documentación
│   ├── producto.md            # Definición del producto
│   ├── historias-y-tickets.md # Historias de usuario (CENTRAL)
│   ├── arquitectura.md        # Arquitectura del sistema
│   ├── modelo-datos.md        # Modelo de datos
│   ├── testing.md             # Estrategia de testing
│   ├── deploy-ci-cd.md        # Infraestructura y deploy
│   ├── backend/               # Documentación backend
│   ├── frontend/              # Documentación frontend
│   └── ...
│
├── specs/                      # Especificaciones técnicas
│   ├── README.md              # ⭐ Guía de navegación de especificaciones
│   ├── endpoints/             # Especificaciones de endpoints API
│   │   └── README.md          # ⭐ Guía de endpoints
│   ├── models/                # Especificaciones de modelos
│   ├── rules/                 # Reglas de negocio y validación
│   ├── flows/                 # Flujos E2E
│   ├── tests/                 # Especificaciones de tests
│   ├── ui/                    # Especificaciones UI
│   └── ...
│
├── .cursor/                    # Reglas para Cursor IDE
│   └── consignas.md           # Reglas del proyecto
│
├── PROJECT_CONTEXT.md          # Contexto general (LEER PRIMERO)
├── README.md                   # Información general del repo
└── MANUAL-PROGRAMADOR.MD       # Este documento
```

---

## 📝 Convenciones y Reglas

### Reglas Fundamentales

1. **Priorizar el flujo E2E**: Todo desarrollo debe soportar el flujo principal
2. **No sobre-ingeniería**: Simplicidad sobre sofisticación
3. **Evitar duplicidad de código**: DRY (Don't Repeat Yourself)
4. **Testing obligatorio**: Unit, integración y al menos 1 E2E del flujo principal
5. **Documentación de código obligatoria**: **TODAS las clases, métodos y propiedades deben documentarse** (sin excepciones)
   - Ver reglas detalladas en: `specs/governance/code-documentation-rules.md`
6. **Documentación actualizada**: Mantener docs sincronizadas con código

### Backend (Laravel)

- **Prefijo de tablas:** `PQ_PARTES_`
- **Autenticación:** Bearer Token (Sanctum)
- **Formato de respuesta:** Envelope estándar (ver `specs/contracts/response-envelope.md`)
- **Validación:** Form Requests en `app/Http/Requests/`
- **Modelos:** Eloquent en `app/Models/`
- **NO usar:** PSL/Prisma (usar herramientas nativas de Laravel)
- **Documentación:** PHPDoc obligatorio para todas las clases, métodos y propiedades
  - Usar `@param`, `@return`, `@throws` según corresponda
  - Ver ejemplos en: `specs/governance/code-documentation-rules.md`

### Frontend (React)

- **UI Layer Wrappers:** OBLIGATORIO en `src/shared/ui/`
  - Nadie importa librerías UI externas directamente en features
  - Todo componente visual reutilizable vive en `shared/ui/`
- **Internacionalización:** OBLIGATORIA
  - Todos los textos visibles usan `t()` con fallback obligatorio
  - Formato: `t("feature.scope.element", "Fallback text")`
- **Test IDs:** OBLIGATORIOS
  - Todos los controles interactivos tienen `data-testid`
  - Formato: `data-testid="feature.component.element"`
- **Separación CSS/JSX/JS:** Mantener separación clara
- **Accesibilidad:** Atributos ARIA obligatorios

### Base de Datos

- **Prefijo:** `PQ_PARTES_`
- **Autenticación:** Por código de usuario (campo `code`), no email
- **Soft Delete:** Según especificación en modelo de datos
- **Timestamps:** `created_at`, `updated_at` en todas las tablas

### Testing

- **Unitarios:** Lógica de dominio/servicios
- **Integración:** API + DB (o repositorio) con fixtures
- **E2E:** Al menos 1 caso del flujo principal (Playwright)
- **Cobertura:** Enfocada en el flujo principal

---

## 🚀 Cómo Empezar a Trabajar

### 1. Configuración del Entorno

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repo>
   cd Lidr-AI4Devs2025-ProyectoFinal
   ```

2. **Backend (Laravel)**
   ```bash
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate
   php artisan serve
   ```

3. **Frontend (React)**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Instalar Playwright (Tests E2E)**
   ```bash
   cd frontend
   npx playwright install        # Instalar navegadores
   npx playwright --version      # Verificar instalación
   ```

### 2. Leer la Documentación

Sigue la **Ruta de Lectura** descrita arriba. No saltes pasos.

**💡 Tip:** Empieza leyendo los README.md de las carpetas principales para tener una visión general:
- `docs/README.md` - Guía de navegación de documentación
- `specs/README.md` - Guía de navegación de especificaciones
- `backend/README.md` - Guía del backend

### 3. Entender el Flujo E2E

Lee y ejecuta el flujo E2E principal:
- `specs/flows/e2e-core-flow.md` - Flujo documentado paso a paso
- Ejecuta los tests E2E para ver el flujo en acción:
  ```bash
  cd frontend
  npm run test:e2e          # Ejecutar todos los tests
  npm run test:e2e:ui      # Con UI interactiva (recomendado para aprender)
  ```
- Revisa `frontend/tests/e2e/README.md` para convenciones de testing
- Revisa `.cursor/rules/06-playwright-testing-rules.md` para reglas obligatorias

### 4. Identificar tu Tarea

- Revisa `docs/historias-y-tickets.md` para entender qué debes implementar
- Identifica el ticket técnico correspondiente (TK-XXX)
- **Para endpoints:** Revisa `specs/endpoints/README.md` primero, luego la especificación específica
- **Para modelos:** Revisa `specs/models/` según corresponda
- **Para backend:** Consulta `backend/README.md` para ver qué modelos están implementados

### 5. Desarrollo

1. **Crear branch:** `git checkout -b feature/nombre-tarea`
2. **Implementar siguiendo:**
   - Especificaciones en `specs/`
   - Convenciones en este manual
   - Reglas en `.cursor/consignas.md`
3. **Escribir tests:**
   - Unitarios para lógica crítica
   - Integración para API
   - E2E si es parte del flujo principal (usar Playwright, ver `.cursor/rules/06-playwright-testing-rules.md`)
4. **Actualizar documentación** si es necesario
5. **Commit y Push:**
   ```bash
   git add .
   git commit -m "feat: descripción de la tarea"
   git push origin feature/nombre-tarea
   ```

### 6. Checklist Antes de Completar una Tarea

- [ ] Código implementado según especificaciones
- [ ] Tests escritos y pasando
- [ ] No hay duplicidad de código
- [ ] Documentación actualizada (si aplica)
- [ ] Código sigue convenciones del proyecto
- [ ] UI Layer wrappers usados correctamente (frontend)
- [ ] i18n implementado (frontend)
- [ ] Test IDs agregados (frontend) - Ver `.cursor/rules/03-i18n-and-testid.mdc`
- [ ] Tests E2E escritos si es parte del flujo principal - Ver `.cursor/rules/06-playwright-testing-rules.md`
- [ ] Formato de respuesta API correcto (backend)

---

## 📖 Referencias Importantes

### Documentos Clave

| Documento | Ubicación | Propósito |
|-----------|-----------|-----------|
| **📚 Guía de Documentación** | `docs/README.md` | ⭐ Navegación de toda la documentación |
| **📚 Guía de Especificaciones** | `specs/README.md` | ⭐ Navegación de especificaciones técnicas |
| **📚 Guía del Backend** | `backend/README.md` | ⭐ Estructura y convenciones del backend |
| **📚 Guía de Endpoints** | `specs/endpoints/README.md` | ⭐ Navegación de especificaciones de API |
| **Historias de Usuario** | `docs/historias-y-tickets.md` | Funcionalidades y tickets técnicos |
| **Flujo E2E** | `specs/flows/e2e-core-flow.md` | Flujo principal paso a paso |
| **Modelo de Datos** | `docs/modelo-datos.md` | Entidades y relaciones |
| **Arquitectura** | `docs/arquitectura.md` | Diseño del sistema |
| **Contrato API** | `docs/api/CONTRATO_BASE.md` | Formato de respuestas |
| **Playbook Backend** | `docs/backend/PLAYBOOK_BACKEND_LARAVEL.md` | Guía Laravel |
| **UI Layer** | `docs/frontend/ui-layer-wrappers.md` | Reglas de componentes UI |
| **i18n** | `docs/frontend/i18n.md` | Internacionalización |
| **Testing** | `docs/testing.md` | Estrategia de tests |

### Especificaciones Técnicas

- **📚 Guía general:** `specs/README.md` - ⭐ Empieza aquí para entender la organización
- **Endpoints API:** `specs/endpoints/` (ver `specs/endpoints/README.md` para guía)
- **Modelos Backend:** `specs/models/`
- **Reglas de Negocio:** `specs/rules/`
- **Tests:** `specs/tests/`
- **UI:** `specs/ui/`

### Reglas del Proyecto

- **Consignas:** `.cursor/consignas.md`
- **Reglas de Negocio:** `docs/reglas-negocio.md`
- **Business Rules:** `specs/rules/business-rules.md`

### Logs y Trazabilidad

- **IA Log:** `docs/ia-log.md` - Registro de uso de IA
- **Prompts:** `prompts.md` - Prompts clave utilizados

---

## ❓ Preguntas Frecuentes

### ¿Dónde encuentro las funcionalidades que debo implementar?

En `docs/historias-y-tickets.md`. Este es el documento central que define todas las funcionalidades del MVP.

### ¿Cómo sé qué es MUST-HAVE vs SHOULD-HAVE?

En `docs/historias-y-tickets.md`, cada historia está clasificada. El MVP se considera completo cuando todas las MUST-HAVE están implementadas.

### ¿Dónde están las especificaciones de los endpoints?

En `specs/endpoints/`. **Empieza por `specs/endpoints/README.md`** para ver la organización completa. Cada endpoint tiene su archivo con request, response, validaciones y ejemplos.

### ¿Cómo debo estructurar los componentes del frontend?

Lee `docs/frontend/ui-layer-wrappers.md` y `docs/frontend/features/features-structure.md`. La regla fundamental: componentes UI reutilizables en `src/shared/ui/`.

### ¿Debo usar i18n en todos los textos?

Sí, es obligatorio. Todos los textos visibles deben usar `t()` con fallback. Ver `docs/frontend/i18n.md`.

### ¿Cómo manejo los errores en la API?

El formato estándar está en `specs/contracts/response-envelope.md` y `docs/api/CONTRATO_BASE.md`. Todas las respuestas siguen el formato envelope.

### ¿Dónde están las reglas de negocio?

En `specs/rules/business-rules.md` y `docs/reglas-negocio.md`.

### ¿Cómo ejecuto los tests?

Ver `docs/testing.md` para instrucciones detalladas. En general:
- Backend: `php artisan test`
- Frontend unitarios: `npm test` o `npm run test:watch`
- Frontend E2E (Playwright): 
  ```bash
  cd frontend
  npm run test:e2e          # Todos los tests
  npm run test:e2e:ui      # Con UI interactiva
  npm run test:e2e:headed  # Ver navegador
  ```
- Ver `frontend/tests/e2e/README.md` para más detalles

---

## 🔄 Actualizaciones del Manual

Este documento se actualiza de forma específica cuando se indique. Las actualizaciones se registran en la sección de versión al inicio del documento.

**Última actualización:** 2025-01-20  
**Versión:** 1.2

**Cambios en v1.1:**
- Agregadas instrucciones de instalación de Playwright
- Actualizada sección de testing con comandos E2E
- Referencias a reglas de Playwright en `.cursor/rules/06-playwright-testing-rules.md`

**Cambios en v1.2:**
- Agregadas referencias a README.md de carpetas principales (docs/, specs/, backend/, specs/endpoints/)
- Nueva fase en Ruta de Lectura para navegación de especificaciones
- Actualizada sección de Referencias Importantes con guías de navegación

---

## 📞 Contacto y Soporte

Si tienes dudas después de leer este manual:

1. Revisa nuevamente la **Ruta de Lectura** para asegurarte de haber leído todo
2. Consulta los documentos específicos en `docs/` y `specs/`
3. Revisa el código existente como referencia
4. Consulta con el equipo de desarrollo

---

**¡Bienvenido al proyecto! 🚀**

