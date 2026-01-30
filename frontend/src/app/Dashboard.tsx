/**
 * Component: Dashboard
 *
 * Página principal del sistema después del login.
 * Muestra información básica del usuario autenticado.
 * El header se renderiza en AppLayout (común a todas las pantallas).
 *
 * @see TR-001(MH)-login-de-empleado.md
 * @see TR-003(MH)-logout.md
 * @see TR-006(MH)-visualización-de-perfil-de-usuario.md
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData } from '../shared/utils/tokenStorage';
import './Dashboard.css';

/**
 * Componente Dashboard (contenido; header en AppLayout)
 */
export function Dashboard(): React.ReactElement {
  const navigate = useNavigate();
  const user = getUserData();

  if (!user) {
    return <div className="dashboard-loading">Cargando...</div>;
  }

  return (
    <div className="dashboard-container" data-testid="app.dashboard">
      <div className="dashboard-main">
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
            {/* Solo mostrar enlaces de tareas para empleados */}
            {user.tipoUsuario === 'usuario' && (
              <>
                <button
                  onClick={() => navigate('/tareas')}
                  className="profile-link-button"
                  data-testid="app.myTasksLink"
                  aria-label="Ver mis tareas"
                >
                  Mis Tareas
                </button>
                <button
                  onClick={() => navigate('/tareas/nueva')}
                  className="profile-link-button"
                  data-testid="app.createTaskLink"
                  aria-label="Cargar nueva tarea"
                >
                  Cargar Tarea
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="dashboard-placeholder">
          <p>El contenido del dashboard se implementará en historias posteriores.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
