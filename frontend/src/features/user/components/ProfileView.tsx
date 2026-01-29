/**
 * Component: ProfileView
 * 
 * Vista del perfil de usuario.
 * Muestra información del usuario autenticado en formato de solo lectura.
 * 
 * @see TR-006(MH)-visualización-de-perfil-de-usuario.md
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, UserProfile } from '../services/user.service';
import './ProfileView.css';

/**
 * Componente ProfileView
 */
export function ProfileView(): React.ReactElement {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  /**
   * Carga el perfil del usuario desde el API
   */
  const loadProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getProfile();

      if (result.success && result.profile) {
        setProfile(result.profile);
      } else {
        // Si no está autenticado, redirigir a login
        if (result.errorCode === 4001) {
          navigate('/login');
          return;
        }
        setError(result.errorMessage || 'Error al cargar el perfil');
      }
    } catch (err) {
      setError('Error inesperado al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja el click en el botón volver
   */
  const handleBack = () => {
    navigate('/');
  };

  /**
   * Formatea la fecha para mostrar
   */
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'No disponible';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return 'No disponible';
    }
  };

  /**
   * Obtiene el texto del tipo de usuario
   */
  const getTipoUsuarioText = (tipo: string): string => {
    switch (tipo) {
      case 'usuario':
        return 'Empleado';
      case 'cliente':
        return 'Cliente';
      default:
        return 'Desconocido';
    }
  };

  if (loading) {
    return (
      <div className="profile-container" data-testid="user.profile.container">
        <div className="profile-loading" data-testid="user.profile.loading">
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container" data-testid="user.profile.container">
        <div className="profile-error" data-testid="user.profile.error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-container" data-testid="user.profile.container">
        <div className="profile-error" data-testid="user.profile.error">
          <p>No se pudo cargar el perfil</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container" data-testid="user.profile.container">
      <header className="profile-header">
        <h1>Mi Perfil</h1>
        <button
          onClick={handleBack}
          className="profile-back-button"
          data-testid="user.profile.backButton"
          aria-label="Volver al dashboard"
        >
          ← Volver
        </button>
      </header>

      <main className="profile-main">
        <dl className="profile-details">
          <div className="profile-detail-item">
            <dt>Código de usuario:</dt>
            <dd data-testid="user.profile.code">{profile.user_code}</dd>
          </div>

          <div className="profile-detail-item">
            <dt>Nombre:</dt>
            <dd data-testid="user.profile.name">{profile.nombre}</dd>
          </div>

          <div className="profile-detail-item">
            <dt>Email:</dt>
            <dd data-testid="user.profile.email">
              {profile.email || 'No configurado'}
            </dd>
          </div>

          <div className="profile-detail-item">
            <dt>Tipo:</dt>
            <dd data-testid="user.profile.type">
              {getTipoUsuarioText(profile.tipo_usuario)}
              {profile.es_supervisor && (
                <span
                  className="supervisor-badge"
                  data-testid="user.profile.supervisorBadge"
                >
                  Supervisor
                </span>
              )}
            </dd>
          </div>

          <div className="profile-detail-item">
            <dt>Miembro desde:</dt>
            <dd data-testid="user.profile.createdAt">
              {formatDate(profile.created_at)}
            </dd>
          </div>
        </dl>
      </main>
    </div>
  );
}

export default ProfileView;
