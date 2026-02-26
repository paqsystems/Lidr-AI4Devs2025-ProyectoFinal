/**
 * Component: AppLayout
 *
 * Layout con header común y menú lateral (TR-056) para todas las pantallas autenticadas.
 *
 * @see docs/frontend/frontend-specifications.md (Layout general y navegación)
 * @see docs/hu-historias/HU-056(SH)-menú-lateral-de-navegación.md
 */

import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Button from 'devextreme-react/button';
import { getUserData } from '../shared/utils/tokenStorage';
import { logout } from '../features/auth/services/auth.service';
import { t } from '../shared/i18n';
import { Sidebar } from './Sidebar';
import './AppLayout.css';

export function AppLayout(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserData();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          <Button
            icon="menu"
            type="normal"
            className="app-layout-menu-toggle"
            onClick={() => setIsSidebarOpen((v) => !v)}
            elementAttr={{ 'data-testid': 'app.sidebarToggle', 'aria-label': t('app.layout.menuAria', 'Abrir o cerrar menú lateral'), 'aria-expanded': String(isSidebarOpen) }}
          />
          <h1 className="app-layout-title">{t('app.layout.title', 'Sistema de Registro de Tareas')}</h1>
          <Button
            text={isPanel ? t('app.layout.panel', 'Panel') : t('app.layout.volver', 'Volver')}
            type="normal"
            className="app-layout-volver"
            onClick={handleVolver}
            elementAttr={{ 'data-testid': 'app.volverButton', 'aria-label': t('app.layout.volverAria', 'Volver al panel del usuario') }}
          />
        </div>
        <div className="app-layout-user-info">
          <span className="app-layout-user-name">{user.nombre}</span>
          {user.esSupervisor && (
            <span className="app-layout-supervisor-badge" data-testid="app.supervisorBadge">
              {t('app.layout.supervisor', 'Supervisor')}
            </span>
          )}
          <Button
            text={isLoggingOut ? t('app.layout.loggingOut', 'Cerrando...') : t('app.layout.logout', 'Cerrar Sesión')}
            type="normal"
            className="app-layout-logout"
            onClick={handleLogout}
            disabled={isLoggingOut}
            elementAttr={{ 'data-testid': 'app.logoutButton', 'aria-label': t('app.layout.logoutAria', 'Cerrar sesión') }}
          />
        </div>
      </header>
      <div className="app-layout-body">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="app-layout-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
