# 02 — Seguridad (Sanctum) — obligatorio, OWASP-aligned

## 1) Estándares adoptados
- OWASP API Security Top 10
- OWASP ASVS (nivel 2 recomendado)
- NIST 800-63 (principios de autenticación digital)
- Buenas prácticas de SDLC (seguridad por diseño)

## 2) Autenticación con Laravel Sanctum
### Modalidades posibles
- Tokens personales (PAT) para integraciones/clients (mobile, terceros, etc.)
- SPA con cookies (si se usa sesión/cookie; requiere CSRF)

### Regla del proyecto (API)
- Todas las APIs requieren autenticación vía Sanctum, salvo endpoints públicos explícitos (login/health).
- En cada request autenticado debe existir identidad (user) comprobable.
- Los tokens deben poder revocarse.

### Requisitos mínimos
- Definir política de expiración/rotación de tokens.
- Si se usan abilities/scopes: cada token debe tener abilities mínimas.
- No confiar en el frontend para permisos.

## 3) Autorización (BOLA / Function Level)
- Implementar policies/gates por acción.
- Validar pertenencia del recurso (BOLA): un usuario no accede/modifica tickets ajenos.
- Prohibido “autorizar” solo por estar logueado.

## 4) Input validation & sanitización
- Validar **antes** de persistir (FormRequest).
- Limitar tamaños máximos (strings, arrays, payload).
- Sanitizar campos de texto si aceptan HTML/markdown (definir estrategia).

## 5) Anti-inyección (SQL/Command/Template)
- Prohibido concatenar SQL con input del usuario.
- Usar bindings/params en Query Builder/DB::select.
- `whereRaw` solo con bindings y sin interpolación.
- Campos dinámicos (sort/filter) solo por whitelist.

## 6) Rate limiting / brute force
- Rate limit global y por endpoints sensibles (login, búsquedas pesadas).
- Responder 429 manteniendo `error/respuesta/resultado`.

## 7) Errores y logs seguros
- Nunca exponer stacktrace en producción.
- No loguear: tokens, passwords, connection strings, datos sensibles.
- Usar correlation id por request (`X-Request-Id` generado o recibido).

## 8) TLS y headers
- TLS obligatorio en producción.
- Definir headers de seguridad a nivel infra (HSTS, nosniff, frame-options, etc.).

## 9) Adjuntos
- Validar MIME real, tamaño máximo, extensiones.
- Almacenar fuera del webroot.
- Servir por endpoints autorizados o URLs firmadas.

## 10) CSRF (si se usa modo SPA con cookies)
- Proteger con CSRF tokens y SameSite.
- Separar claramente APIs cookie-based vs token-based.

---
