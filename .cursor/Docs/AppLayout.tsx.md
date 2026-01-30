# Documentación: `frontend/src/app/AppLayout.tsx`

## Propósito

Layout común para **todas las pantallas autenticadas**. Renderiza un header fijo (título de la app, botón Volver/Panel, nombre de usuario, badge Supervisor, Cerrar sesión) y un `<Outlet />` donde React Router inyecta la ruta hija (Dashboard, Perfil, Lista de tareas, etc.).

Garantiza que el **header no desaparezca** al navegar entre /, /perfil, /tareas, /tareas/nueva (según `docs/frontend/frontend-specifications.md` y TR-033-update punto 8).

## Uso

- En `App.tsx`, la ruta `/` está envuelta en `<ProtectedRoute><AppLayout /></ProtectedRoute>` con rutas anidadas: `index` → Dashboard, `perfil` → ProfileView, `tareas` → TaskList, `tareas/nueva` → TaskForm.
- No se usa directamente; es el contenedor de las rutas protegidas.

## Elementos del header

- **Título:** "Sistema de Registro de Tareas".
- **Botón Volver/Panel:** `data-testid="app.volverButton"`. Navega a `/`. En `/` muestra "Panel", en el resto "Volver".
- **Nombre de usuario**, **badge Supervisor** (si aplica), **Cerrar sesión** (`data-testid="app.logoutButton"`, `app.supervisorBadge`).

## Archivos relacionados

- `app/AppLayout.css` – Estilos del layout y del header.
- `app/App.tsx` – Rutas anidadas que usan `AppLayout`.
- `app/Dashboard.tsx` – Solo contenido; ya no incluye header.
