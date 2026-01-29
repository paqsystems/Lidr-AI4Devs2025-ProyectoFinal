/**
 * Component: Dashboard
 * 
 * Página principal del sistema después del login.
 * Muestra información básica del usuario autenticado.
 * 
 * @see TR-001(MH)-login-de-empleado.md
 * @see TR-003(MH)-logout.md
 * @see TR-006(MH)-visualización-de-perfil-de-usuario.md
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData } from '../shared/utils/tokenStorage';
import { logout } from '../features/auth/services/auth.service';
import './Dashboard.css';

/**
 * Componente Dashboard
 */
export function Dashboard(): React.ReactElement {
  const navigate = useNavigate();
  const user = getUserData();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  /**
   * Maneja el cierre de sesión
   * - Deshabilita el botón durante la petición
   * - Llama al API de logout
   * - Redirige a login al completar
   */
  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      await logout();
    } finally {
      // Siempre redirigir, incluso si hubo error
      // (comportamiento fail-safe del servicio)
      navigate('/login');
    }
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="dashboard-container" data-testid="app.dashboard">
      <header className="dashboard-header">
        <h1>Sistema de Registro de Tareas</h1>
        <div className="user-info">
          <span className="user-name">{user.nombre}</span>
          {user.esSupervisor && (
            <span className="supervisor-badge" data-testid="app.supervisorBadge">
              Supervisor
            </span>
          )}
          <button 
            onClick={handleLogout}
            className="logout-button"
            data-testid="app.logoutButton"
            disabled={isLoggingOut}
            aria-label="Cerrar sesión"
          >
            {isLoggingOut ? 'Cerrando...' : 'Cerrar Sesión'}
          </button>
        </div>
      </header>
      
      <main className="dashboard-main">
        <div className="welcome-card">
          <h2>Bienvenido, {user.nombre}</h2>
          <p>Código de usuario: <strong>{user.userCode}</strong></p>
          <p>Tipo: <strong>{user.tipoUsuario === 'usuario' ? 'Empleado' : 'Cliente'}</strong></p>
          {user.esSupervisor && (
            <p className="supervisor-text">Tiene permisos de supervisor</p>
          )}
          <div className="welcome-card-actions">
            <button
              onClick={() => navigate('/perfil')}
              className="profile-link-button"
              data-testid="app.profileLink"
              aria-label="Ver mi perfil"
            >
              Ver Mi Perfil
            </button>
            {/* Solo mostrar botón de cargar tarea para empleados */}
            {user.tipoUsuario === 'usuario' && (
              <button
                onClick={() => navigate('/tareas/nueva')}
                className="profile-link-button"
                data-testid="app.createTaskLink"
                aria-label="Cargar nueva tarea"
              >
                Cargar Tarea
              </button>
            )}
          </div>
        </div>
        
        <div className="dashboard-placeholder">
          <p>El contenido del dashboard se implementará en historias posteriores.</p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
