/**
 * Component: AppLayout
 *
 * Layout con header común para todas las pantallas autenticadas.
 * El header permanece visible en todas las rutas (dashboard, perfil, tareas, etc.).
 *
 * @see docs/frontend/frontend-specifications.md (Layout general y navegación)
 * @see TR-033(MH)-visualización-de-lista-de-tareas-propias-update.md (botón Volver)
 */

import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { getUserData } from '../shared/utils/tokenStorage';
import { logout } from '../features/auth/services/auth.service';
import { t } from '../shared/i18n';
import './AppLayout.css';

export function AppLayout(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserData();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleVolver = () => {
    navigate('/');
  };

  const isPanel = location.pathname === '/';

  if (!user) {
    return <div className="app-layout-loading">{t('app.layout.loading', 'Cargando...')}</div>;
  }

  return (
    <div className="app-layout" data-testid="app.layout">
      <header className="app-layout-header" role="banner">
        <div className="app-layout-header-left">
          <h1 className="app-layout-title">{t('app.layout.title', 'Sistema de Registro de Tareas')}</h1>
          <button
            type="button"
            onClick={handleVolver}
            className="app-layout-volver"
            data-testid="app.volverButton"
            aria-label={t('app.layout.volverAria', 'Volver al panel del usuario')}
          >
            {isPanel ? t('app.layout.panel', 'Panel') : t('app.layout.volver', 'Volver')}
          </button>
        </div>
        <div className="app-layout-user-info">
          <span className="app-layout-user-name">{user.nombre}</span>
          {user.esSupervisor && (
            <span className="app-layout-supervisor-badge" data-testid="app.supervisorBadge">
              {t('app.layout.supervisor', 'Supervisor')}
            </span>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="app-layout-logout"
            data-testid="app.logoutButton"
            disabled={isLoggingOut}
            aria-label={t('app.layout.logoutAria', 'Cerrar sesión')}
          >
            {isLoggingOut ? t('app.layout.loggingOut', 'Cerrando...') : t('app.layout.logout', 'Cerrar Sesión')}
          </button>
        </div>
      </header>
      <main className="app-layout-main">
        <Outlet />
      </main>
    </div>
  );
}
