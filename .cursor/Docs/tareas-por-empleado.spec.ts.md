# Documentación: tareas-por-empleado.spec.ts (E2E)

## Propósito
Tests E2E con Playwright para el flujo **Tareas por Empleado** (TR-045). Verifican que solo supervisores acceden a la pantalla, pueden aplicar filtros, ver grupos y total general, expandir un grupo para ver el detalle y colapsarlo; y que un empleado no supervisor no ve el enlace y es redirigido a `/` si accede por URL.

## Ubicación
- `frontend/tests/e2e/tareas-por-empleado.spec.ts`

## Requisitos para ejecutar
- **Backend** Laravel en marcha (ej. `php artisan serve` → http://127.0.0.1:8000).
- **Frontend** en marcha (ej. `npm run dev`). Playwright puede arrancarlo con `webServer` si está configurado.
- Usuarios de prueba: supervisor MGARCIA / password456, empleado JPEREZ / password123 (según seeders).

## Tests incluidos

| Test | Descripción |
|------|-------------|
| supervisor puede acceder a tareas por empleado y ver filtros y total general | Login supervisor → navega a /informes/tareas-por-empleado → ve página, título, filtros y total general |
| supervisor aplica filtros y ve grupos o estado vacío | Fecha desde/hasta 2026-01-01 a 2026-01-31, Aplicar Filtros → ve grupos o mensaje vacío y total general |
| supervisor expande un grupo, ve detalle y colapsa | Si hay grupos, clic en el primer accordion → tabla visible → clic de nuevo → tabla oculta |
| empleado no supervisor no ve enlace y al acceder por URL es redirigido a / | Login empleado → enlace "Tareas por Empleado" no visible → goto /informes/tareas-por-empleado → URL final es / |

## Comandos
```bash
# Solo tareas por empleado (Chromium)
npx playwright test tareas-por-empleado.spec.ts --project=chromium

# Todos los E2E
npm run test:e2e
```

## data-testid utilizados
- auth.login.*, app.tareasPorEmpleadoLink
- tareasPorEmpleado.page, tareasPorEmpleado.filtros, tareasPorEmpleado.filtroFechaDesde, tareasPorEmpleado.filtroFechaHasta, tareasPorEmpleado.aplicarFiltros
- tareasPorEmpleado.totalGeneral, tareasPorEmpleado.loading, tareasPorEmpleado.empty, tareasPorEmpleado.grupos
- tareasPorEmpleado.grupo.{usuario_id}, tareasPorEmpleado.grupoExpandir.{usuario_id}, tareasPorEmpleado.tabla.{usuario_id}, tareasPorEmpleado.mensajeError

## Referencias
- TR-045(SH): Consulta agrupada por empleado
- HU-045(SH): docs/hu-historias/HU-045(SH)-consulta-agrupada-por-empleado.md
