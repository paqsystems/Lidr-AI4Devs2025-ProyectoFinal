# Testing – Estrategia del MVP

## Objetivo
Garantizar que el flujo E2E principal funcione correctamente y que la lógica
de negocio básica sea confiable, sin sobre–dimensionar la estrategia de testing.

---

## Tipos de Tests

### Tests Unitarios
**Propósito:** Validar funciones y lógica de negocio aislada.

**Cobertura esperada:**
- Funciones críticas (validaciones, reglas de negocio).
- No se persigue cobertura total, sino cobertura significativa.

**Ejemplos:**
- Validación de duración > 0.
- Validación de fecha no futura.
- Asociación correcta usuario–tarea.

---

### Tests de Integración
**Propósito:** Verificar la interacción entre API y base de datos.

**Ejemplos:**
- Crear tarea y persistirla.
- Listar tareas de un usuario.
- Evitar acceso a tareas de otros usuarios.

---

### Test End-to-End (E2E)
**Propósito:** Validar el flujo principal desde la perspectiva del usuario.

**Flujo cubierto:**
Login → Registro de tarea → Visualización de tareas.

**Herramienta sugerida:**
- Playwright o Cypress (una sola herramienta).

---

## Alcance del Testing
- Se prioriza el flujo E2E.
- No se incluyen tests de carga.
- No se incluyen pruebas de seguridad avanzadas.
- No se automatiza visual regression.

---

## Estructura de Tests (Ejemplo)

### Backend
backend/
tests/
unit/
integration/


### Frontend
frontend/
tests/
unit/
e2e/

---

## Criterios de Aceptación de Tests
- Todos los tests pasan localmente.
- El test E2E del flujo principal pasa en CI.
- Los tests documentados pueden ejecutarse siguiendo instrucciones claras.

---

## Integración con CI/CD
El pipeline debe:
1. Ejecutar tests unitarios.
2. Ejecutar tests de integración.
3. Ejecutar al menos un test E2E.

---

## Notas
- El alcance de tests es coherente con un MVP.
- La estrategia puede ampliarse en etapas posteriores.
- Las decisiones de testing forman parte del diseño del producto.

