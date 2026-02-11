# Pull Request: Migración MySQL, correcciones build frontend y menú lateral (HU-056)

## Descripción

Este PR incorpora la migración de SQL Server a MySQL, las correcciones del build del frontend para deploy y la implementación del menú lateral de navegación (HU-056).

---

## Cambios principales

### 1. Migración a MySQL
- Configuración de base de datos para MySQL (túnel SSH)
- Migración `personal_access_tokens` adaptada a Schema Builder
- Migración `fix_clientes_user_id_unique_sqlserver` compatible con ambos motores
- Seeders y tests actualizados: reemplazo de `GETDATE()` por `now()`
- Documentación en `docs/version-mysql.md` (túnel SSH, checklist, troubleshooting)
- Nueva regla `.cursor/rules/20-mysql-datetime-format.md`

### 2. Correcciones build frontend (deploy Vercel)
- Creación de `vite-env.d.ts` (tipos Vite, módulos CSS)
- Exclusión de tests en `tsconfig.json`
- `TaskPagination`: prop opcional `testIdPrefix`, props `total`/`perPage` opcionales
- `task.service.ts`: corrección de comparaciones number vs string
- `empleado.service.ts`: tipado de headers como `Record<string, string>`
- Eliminación de imports no usados (`Sidebar`, `EmpleadosPage`)
- E2E: cast correcto a `HTMLFormElement` en `task-create.spec.ts`
- Nueva regla `.cursor/rules/22-frontend-build-typescript.md`

### 3. HU-056 – Menú lateral de navegación
- Nuevo componente `Sidebar` con navegación según rol
- Integración en `AppLayout`
- Actualización de `Dashboard`

### 4. Documentación y trazabilidad
- `docs/ia-log.md`: entrada de migración MySQL
- `PROMPTS/Prompts-PAQ.md`: Prompt 12
- Referencias cruzadas en normas de frontend

---

## Archivos relevantes

| Área | Archivos principales |
|------|----------------------|
| Backend | Migraciones, seeders, tests |
| Frontend | `vite-env.d.ts`, `Sidebar.tsx`, `TaskPagination.tsx`, `task.service.ts`, `empleado.service.ts` |
| Docs | `version-mysql.md`, `deploy-ci-cd.md` |
| Reglas | `20-mysql-datetime-format.md`, `22-frontend-build-typescript.md` |

---

## Verificación

- [x] `npm run build` en frontend pasa correctamente
- [x] Migraciones ejecutadas con MySQL
- [x] Seeders ejecutados
- [x] Documentación actualizada

---

## Notas para reviewers

1. **MySQL**: Requiere túnel SSH para conectarse; consultar `docs/version-mysql.md`.
2. **Frontend**: El build incorpora checklist pre-deploy en la regla 22.
3. **Credenciales**: `backend/.env` no se incluye en el commit (referencia en `.env.example`).
