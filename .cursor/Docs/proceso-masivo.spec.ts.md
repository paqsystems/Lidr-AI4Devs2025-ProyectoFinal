# Documentación: proceso-masivo.spec.ts (E2E)

## Propósito
Tests E2E con Playwright para el flujo de **Proceso Masivo de Tareas** (TR-039 a TR-043). Verifican acceso solo supervisores, filtros, validación 1305, selección múltiple, contador, botón Procesar deshabilitado/habilitado y flujo de procesamiento con confirmación.

## Ubicación
- `frontend/tests/e2e/proceso-masivo.spec.ts`

## Requisitos para ejecutar
- **Backend** Laravel en marcha (ej. `php artisan serve` → http://127.0.0.1:8000).
- **Frontend** en marcha (ej. `npm run dev`). Playwright puede arrancarlo con `webServer` si no se reutiliza servidor.
- Usuarios de prueba: supervisor MGARCIA / password456, empleado JPEREZ / password123 (según seeders).

## Tests incluidos

| Test | TR | Descripción |
|------|-----|-------------|
| supervisor puede acceder a /tareas/proceso-masivo | TR-039 | Login supervisor → navega a proceso-masivo → ve página, título y filtros |
| empleado es redirigido al acceder a proceso-masivo | TR-039 | Login empleado → navega a proceso-masivo → redirección a / |
| supervisor puede aplicar filtros y ver total | TR-040 | Fecha desde/hasta, Aplicar Filtros, visible total |
| fecha_desde > fecha_hasta muestra error 1305 | TR-040 | Fechas inválidas → mensaje de error visible |
| contador y seleccionar/deseleccionar todos | TR-041 | Contador visible; si hay tabla, seleccionar todos habilita Procesar, deseleccionar vuelve a 0 |
| botón Procesar deshabilitado sin selección | TR-043 | Sin checkboxes marcados → Procesar disabled |
| seleccionar, Procesar y confirmar muestra éxito | TR-042 | Checkbox → Procesar → modal confirmar → mensaje "Se procesaron X registros" |

## Comandos
```bash
# Solo proceso masivo (Chromium)
npx playwright test proceso-masivo.spec.ts --project=chromium

# Todos los E2E
npm run test:e2e
```

## data-testid utilizados
- auth.login.*, procesoMasivo.page, procesoMasivo.filtros, procesoMasivo.filtroFechaDesde/Hasta, procesoMasivo.aplicarFiltros, procesoMasivo.total, procesoMasivo.mensajeError, procesoMasivo.contadorSeleccionadas, procesoMasivo.seleccionarTodos, procesoMasivo.deseleccionarTodos, procesoMasivo.procesar, procesoMasivo.tabla, procesoMasivo.empty, procesoMasivo.loading, procesoMasivo.confirmModal-overlay, procesoMasivo.confirmarProcesar, procesoMasivo.mensajeExito.
