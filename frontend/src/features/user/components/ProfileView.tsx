/**
 * Component: ProfileView
 *
 * Vista del perfil de usuario.
 * Muestra información del usuario autenticado y opción para cambiar contraseña.
 *
 * @see TR-006(MH)-visualización-de-perfil-de-usuario.md
 * @see TR-005(SH)-cambio-de-contraseña-usuario-autenticado.md
 */

import React, { useEffect, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import TextBox from 'devextreme-react/text-box';
import Button from 'devextreme-react/button';
import { getProfile, changePassword, updateProfile, UserProfile } from '../services/user.service';
import './ProfileView.css';

/**
 * Componente ProfileView
 */
const MIN_PASSWORD_LENGTH = 8;

export function ProfileView(): React.ReactElement {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null);
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showEditForm, setShowEditForm] = useState(false);
  const [editNombre, setEditNombre] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const [editFieldErrors, setEditFieldErrors] = useState<Record<string, string>>({});

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

  const handleChangePasswordClick = () => {
    setShowChangePassword(true);
    setCurrentPassword('');
    setNewPassword('');
    setNewPasswordConfirm('');
    setChangePasswordError(null);
    setChangePasswordSuccess(false);
    setFieldErrors({});
  };

  const handleChangePasswordCancel = () => {
    setShowChangePassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setNewPasswordConfirm('');
    setChangePasswordError(null);
    setFieldErrors({});
  };

  const handleEditProfileClick = () => {
    setShowEditForm(true);
    setEditNombre(profile?.nombre ?? '');
    setEditEmail(profile?.email ?? '');
    setEditError(null);
    setEditSuccess(false);
    setEditFieldErrors({});
  };

  const handleEditProfileCancel = () => {
    setShowEditForm(false);
    setEditNombre('');
    setEditEmail('');
    setEditError(null);
    setEditSuccess(false);
    setEditFieldErrors({});
  };

  const handleEditProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEditError(null);
    setEditFieldErrors({});
    if (!editNombre.trim()) {
      setEditFieldErrors((prev) => ({ ...prev, nombre: 'El nombre es obligatorio.' }));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (editEmail.trim() && !emailRegex.test(editEmail.trim())) {
      setEditFieldErrors((prev) => ({ ...prev, email: 'El email no tiene un formato válido.' }));
      return;
    }
    setEditLoading(true);
    const result = await updateProfile(editNombre.trim(), editEmail.trim() || null);
    setEditLoading(false);
    if (result.success && result.profile) {
      setEditSuccess(true);
      setProfile(result.profile);
      setTimeout(() => {
        setShowEditForm(false);
        setEditSuccess(false);
      }, 2000);
    } else {
      setEditError(result.errorMessage ?? 'Error al actualizar el perfil');
      if (result.validationErrors) {
        const map: Record<string, string> = {};
        for (const [key, messages] of Object.entries(result.validationErrors)) {
          if (Array.isArray(messages) && messages[0]) map[key] = messages[0];
        }
        setEditFieldErrors(map);
      }
    }
  };

  const handleChangePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setChangePasswordError(null);
    setFieldErrors({});

    if (!currentPassword.trim()) {
      setFieldErrors((prev) => ({ ...prev, current_password: 'La contraseña actual es requerida.' }));
      return;
    }
    if (!newPassword.trim()) {
      setFieldErrors((prev) => ({ ...prev, password: 'La nueva contraseña es requerida.' }));
      return;
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setFieldErrors((prev) => ({
        ...prev,
        password: `La nueva contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`,
      }));
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setFieldErrors((prev) => ({ ...prev, password_confirmation: 'La confirmación de contraseña no coincide.' }));
      return;
    }

    setChangePasswordLoading(true);
    const result = await changePassword(currentPassword, newPassword, newPasswordConfirm);
    setChangePasswordLoading(false);

    if (result.success) {
      setChangePasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');
      setTimeout(() => {
        setShowChangePassword(false);
        setChangePasswordSuccess(false);
      }, 2000);
    } else {
      setChangePasswordError(result.errorMessage ?? 'Error al cambiar la contraseña');
      if (result.validationErrors) {
        const map: Record<string, string> = {};
        for (const [key, messages] of Object.entries(result.validationErrors)) {
          if (Array.isArray(messages) && messages[0]) map[key] = messages[0];
        }
        setFieldErrors(map);
      }
    }
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
        <Button
          text="← Volver"
          type="normal"
          onClick={handleBack}
          elementAttr={{ 'data-testid': 'user.profile.backButton', 'aria-label': 'Volver al dashboard' }}
        />
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

        <section className="profile-actions">
          <Button
            text="Editar perfil"
            type="normal"
            onClick={handleEditProfileClick}
            elementAttr={{ 'data-testid': 'user.profile.editLink', 'aria-label': 'Editar perfil' }}
          />
          <Button
            text="Cambiar contraseña"
            type="normal"
            onClick={handleChangePasswordClick}
            elementAttr={{ 'data-testid': 'profile.changePasswordLink', 'aria-label': 'Cambiar contraseña' }}
          />
        </section>

        {showEditForm && (
          <section className="profile-edit-section" data-testid="user.profile.editForm">
            <h2>Editar perfil</h2>
            {editSuccess && (
              <div className="profile-edit-success" role="alert" data-testid="user.profile.editSuccess">
                Perfil actualizado correctamente.
              </div>
            )}
            {editError && (
              <div className="profile-edit-error" role="alert" data-testid="user.profile.editError">
                {editError}
              </div>
            )}
            <form onSubmit={handleEditProfileSubmit} className="profile-edit-form" noValidate>
              <div className="profile-form-row">
                <label className="profile-form-label">
                  Código de usuario (no modificable)
                  <TextBox value={profile.user_code} readOnly elementAttr={{ 'data-testid': 'user.profile.editCode' }} />
                </label>
              </div>
              <label className="profile-form-label">
                Nombre
                <TextBox value={editNombre} onValueChanged={(e) => setEditNombre(e.value ?? '')} elementAttr={{ 'data-testid': 'user.profile.editNombre' }} />
                {editFieldErrors.nombre && (
                  <span id="profile-edit-nombre-error" className="profile-form-error" role="alert">
                    {editFieldErrors.nombre}
                  </span>
                )}
              </label>
              <label className="profile-form-label">
                Email
                <TextBox value={editEmail} onValueChanged={(e) => setEditEmail(e.value ?? '')} mode="email" elementAttr={{ 'data-testid': 'user.profile.editEmail' }} />
                {editFieldErrors.email && (
                  <span id="profile-edit-email-error" className="profile-form-error" role="alert">
                    {editFieldErrors.email}
                  </span>
                )}
              </label>
              <div className="profile-edit-buttons">
                <Button text="Cancelar" type="normal" onClick={handleEditProfileCancel} disabled={editLoading} elementAttr={{ 'data-testid': 'user.profile.editCancel' }} />
                <Button text={editLoading ? 'Guardando...' : 'Guardar'} type="default" useSubmitBehavior disabled={editLoading} elementAttr={{ 'data-testid': 'user.profile.editSubmit' }} />
              </div>
            </form>
          </section>
        )}

        {showChangePassword && (
          <section className="profile-change-password-section" data-testid="profile.changePassword.form">
            <h2>Cambiar contraseña</h2>
            {changePasswordSuccess && (
              <div className="profile-change-password-success" role="alert" data-testid="profile.changePassword.success">
                Contraseña actualizada correctamente.
              </div>
            )}
            {changePasswordError && (
              <div className="profile-change-password-error" role="alert" data-testid="profile.changePassword.error">
                {changePasswordError}
              </div>
            )}
            <form onSubmit={handleChangePasswordSubmit} className="profile-change-password-form" noValidate>
              <label className="profile-form-label">
                Contraseña actual
                <TextBox value={currentPassword} onValueChanged={(e) => setCurrentPassword(e.value ?? '')} mode="password" elementAttr={{ 'data-testid': 'profile.currentPassword' }} />
                {fieldErrors.current_password && (
                  <span id="profile-current-password-error" className="profile-form-error" role="alert">
                    {fieldErrors.current_password}
                  </span>
                )}
              </label>
              <label className="profile-form-label">
                Nueva contraseña
                <TextBox value={newPassword} onValueChanged={(e) => setNewPassword(e.value ?? '')} mode="password" elementAttr={{ 'data-testid': 'profile.newPassword' }} />
                {fieldErrors.password && (
                  <span id="profile-password-error" className="profile-form-error" role="alert">
                    {fieldErrors.password}
                  </span>
                )}
              </label>
              <label className="profile-form-label">
                Confirmar nueva contraseña
                <TextBox value={newPasswordConfirm} onValueChanged={(e) => setNewPasswordConfirm(e.value ?? '')} mode="password" elementAttr={{ 'data-testid': 'profile.newPasswordConfirm' }} />
                {fieldErrors.password_confirmation && (
                  <span id="profile-password-confirm-error" className="profile-form-error" role="alert">
                    {fieldErrors.password_confirmation}
                  </span>
                )}
              </label>
              <div className="profile-change-password-buttons">
                <Button text="Cancelar" type="normal" onClick={handleChangePasswordCancel} disabled={changePasswordLoading} elementAttr={{ 'data-testid': 'profile.changePasswordCancel' }} />
                <Button text={changePasswordLoading ? 'Guardando...' : 'Guardar'} type="default" useSubmitBehavior disabled={changePasswordLoading} elementAttr={{ 'data-testid': 'profile.changePasswordSubmit' }} />
              </div>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}

export default ProfileView;
