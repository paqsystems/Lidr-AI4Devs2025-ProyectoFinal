# Testing

## Estrategia de Testing

Este documento describe la estrategia de testing para el proyecto, incluyendo tipos de tests, herramientas y mejores prácticas.

## Tipos de Tests

### Tests Unitarios

**Propósito:** Probar funciones y métodos individuales de forma aislada.

**Cobertura Objetivo:** 80% mínimo

**Herramientas:**
- Backend: Jest / Mocha / pytest
- Frontend: Jest / Vitest

**Ejemplos:**
- Validación de datos
- Transformación de datos
- Lógica de negocio
- Utilidades

### Tests de Integración

**Propósito:** Probar la interacción entre componentes y servicios.

**Cobertura Objetivo:** Funcionalidades críticas

**Herramientas:**
- Backend: Jest / Mocha / pytest
- Frontend: Testing Library

**Ejemplos:**
- Integración con MCP servers
- Integración con APIs externas
- Flujos completos de usuario

### Tests End-to-End (E2E)

**Propósito:** Probar flujos completos desde la perspectiva del usuario.

**Cobertura Objetivo:** Flujos críticos principales

**Herramientas:**
- Playwright
- Cypress

**Ejemplos:**
- Login y autenticación
- Consulta de issues de Jira
- Ejecución de consultas SQL
- Automatización web

### Tests de Carga

**Propósito:** Validar el rendimiento bajo carga.

**Herramientas:**
- k6
- Artillery
- JMeter

**Escenarios:**
- Múltiples usuarios concurrentes
- Consultas pesadas a bases de datos
- Integraciones con servicios externos

## Estructura de Tests

### Backend

```
backend/
├── src/
└── tests/
    ├── unit/
    │   ├── services/
    │   ├── utils/
    │   └── models/
    ├── integration/
    │   ├── api/
    │   ├── mcp/
    │   └── database/
    └── e2e/
        └── flows/
```

### Frontend

```
frontend/
├── src/
└── tests/
    ├── unit/
    │   ├── components/
    │   ├── services/
    │   └── utils/
    ├── integration/
    │   └── components/
    └── e2e/
        └── flows/
```

## Configuración de Tests

### Backend - Jest (Ejemplo Node.js)

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js'
  ],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ]
};
```

### Frontend - Vitest (Ejemplo)

```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});
```

## Mocks y Fixtures

### Mocks de MCP Servers

```javascript
// tests/mocks/mcpJira.js
export const mockJiraIssue = {
  key: 'PROJ-123',
  summary: 'Test Issue',
  status: 'In Progress',
  // ...
};
```

### Fixtures de Base de Datos

```javascript
// tests/fixtures/database.js
export const testDatabaseConfig = {
  host: 'localhost',
  port: 3306,
  database: 'test_db',
  // ...
};
```

## Criterios de Aceptación

### Cobertura de Código

- **Mínimo:** 70% de cobertura total
- **Objetivo:** 80% de cobertura total
- **Crítico:** 100% en funciones de seguridad y autenticación

### Tests Requeridos

- [ ] Tests unitarios para todas las funciones críticas
- [ ] Tests de integración para todas las APIs
- [ ] Tests E2E para flujos principales
- [ ] Tests de carga para endpoints críticos

## CI/CD Integration

### Pipeline de Tests

```yaml
# Ejemplo GitHub Actions
- name: Run Unit Tests
  run: npm run test:unit

- name: Run Integration Tests
  run: npm run test:integration

- name: Run E2E Tests
  run: npm run test:e2e

- name: Generate Coverage Report
  run: npm run test:coverage
```

## Mejores Prácticas

### Naming Conventions

- Tests descriptivos: `describe('UsuarioService', () => { ... })`
- Casos claros: `it('debe retornar error cuando el email es inválido', () => { ... })`

### Arrange-Act-Assert (AAA)

```javascript
it('debe crear un usuario correctamente', () => {
  // Arrange
  const usuarioData = { email: 'test@example.com', nombre: 'Test' };
  
  // Act
  const usuario = crearUsuario(usuarioData);
  
  // Assert
  expect(usuario.email).toBe(usuarioData.email);
});
```

### Tests Independientes

- Cada test debe ser independiente
- No depender del orden de ejecución
- Limpiar datos después de cada test

### Tests Rápidos

- Tests unitarios deben ser rápidos (< 100ms)
- Tests de integración pueden ser más lentos pero controlados
- Tests E2E pueden tomar más tiempo pero deben optimizarse

## Herramientas Adicionales

### Linting

- ESLint para JavaScript/TypeScript
- Prettier para formato de código

### Coverage

- Istanbul / c8 para cobertura
- Codecov para reportes en línea

### Visual Regression

- Percy
- Chromatic

## Checklist de Testing

### Antes de Commit

- [ ] Todos los tests pasan localmente
- [ ] Cobertura de código no disminuye
- [ ] Nuevos tests para nueva funcionalidad
- [ ] Tests actualizados para cambios en código existente

### Antes de Deploy

- [ ] Todos los tests pasan en CI/CD
- [ ] Tests E2E pasan en entorno de staging
- [ ] Reporte de cobertura generado
- [ ] Sin regresiones identificadas

## Notas

- Actualizar este documento conforme se implementen los tests
- Documentar decisiones importantes sobre testing
- Mantener ejemplos actualizados con el código

