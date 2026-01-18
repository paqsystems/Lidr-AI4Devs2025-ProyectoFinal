# Infraestructura y Despliegue – MVP

## Objetivo
Disponer de una URL pública accesible para evaluación del MVP.

---

## Entorno
- Un solo entorno productivo.
- Base de datos administrada por el proveedor.

---

## CI/CD (básico)
Pipeline simple:
1. Instalación de dependencias
2. Ejecución de tests
3. Generación de documentación Swagger/OpenAPI (`php artisan l5-swagger:generate`)
4. Build de frontend
5. Deploy automático

---

## Gestión de secretos
- Variables de entorno:
  - DATABASE_URL
  - JWT_SECRET
- Uso de .env.example
- Nunca versionar secretos reales

---

## Despliegue
Opciones válidas:
- Backend: Render / Fly.io / Railway
- Frontend: Vercel / Netlify
- DB: Postgres administrado

---

## Acceso
- URL pública documentada.
- Usuario de prueba disponible para el evaluador.
