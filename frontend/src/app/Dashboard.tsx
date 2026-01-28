/**
 * Component: Dashboard
 * 
 * Página principal del sistema después del login.
 * Muestra información básica del usuario autenticado.
 * 
 * @see TR-001(MH)-login-de-empleado.md
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, clearAuth } from '../shared/utils/tokenStorage';
import './Dashboard.css';

/**
 * Componente Dashboard
 */
export function Dashboard(): React.ReactElement {
  const navigate = useNavigate();
  const user = getUserData();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
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
            <span className="supervisor-badge">Supervisor</span>
          )}
          <button 
            onClick={handleLogout}
            className="logout-button"
            data-testid="app.logoutButton"
          >
            Cerrar Sesión
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
        </div>
        
        <div className="dashboard-placeholder">
          <p>El contenido del dashboard se implementará en historias posteriores.</p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
