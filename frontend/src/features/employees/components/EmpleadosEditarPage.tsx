/**
 * Component: EmpleadosEditarPage
 *
 * Formulario de edición de empleado (solo supervisores). TR-020(MH).
 * Ruta: /empleados/:id/editar. Código solo lectura; campos editables: nombre, email,
 * supervisor, activo, inhabilitado; opción cambiar contraseña (opcional).
 *
 * @see TR-020(MH)-edición-de-empleado.md
 */

import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TextBox from 'devextreme-react/text-box';
import CheckBox from 'devextreme-react/check-box';
import Button from 'devextreme-react/button';
import { getEmpleado, updateEmpleado, UpdateEmpleadoBody, EmpleadoItem } from '../services/empleado.service';
import './EmpleadosNuevoPage.css';

type FormState = 'initial' | 'loading' | 'loadError' | 'saving' | 'error' | 'success';

export function EmpleadosEditarPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const empleadoId = id ? parseInt(id, 10) : NaN;

  const [empleado, setEmpleado] = useState<EmpleadoItem | null>(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [supervisor, setSupervisor] = useState(false);
  const [activo, setActivo] = useState(true);
  const [inhabilitado, setInhabilitado] = useState(false);

  const [formState, setFormState] = useState<FormState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const loadEmpleado = useCallback(async (eid: number) => {
    setFormState('loading');
    setErrorMessage('');
    const result = await getEmpleado(eid);
    if (result.success && result.data) {
      const e = result.data;
      setEmpleado(e);
      setNombre(e.nombre);
      setEmail(e.email ?? '');
      setSupervisor(e.supervisor);
      setActivo(e.activo);
      setInhabilitado(e.inhabilitado);
      setPassword('');
      setPasswordConfirm('');
      setShowChangePassword(false);
      setFormState('initial');
    } else {
      setFormState('loadError');
      setErrorMessage(result.errorMessage ?? 'Error al cargar empleado');
    }
  }, []);

  useEffect(() => {
    if (!Number.isNaN(empleadoId) && empleadoId > 0) {
      loadEmpleado(empleadoId);
    } else {
      setFormState('loadError');
      setErrorMessage('ID de empleado inválido');
    }
  }, [empleadoId, loadEmpleado]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (Number.isNaN(empleadoId) || empleadoId <= 0 || !empleado) return;
    setErrorMessage('');
    setFieldErrors({});

    // Validaciones frontend
    if (!nombre.trim()) {
      setFieldErrors((prev) => ({
        ...prev,
        nombre: 'El nombre es obligatorio.',
      }));
      return;
    }
    if (showChangePassword && password) {
      if (password.length < 8) {
        setFieldErrors((prev) => ({
          ...prev,
          password: 'La contraseña debe tener al menos 8 caracteres.',
        }));
        return;
      }
      if (password !== passwordConfirm) {
        setFieldErrors((prev) => ({
          ...prev,
          passwordConfirm: 'Las contraseñas no coinciden.',
        }));
        return;
      }
    }

    setFormState('saving');
    const body: UpdateEmpleadoBody = {
      nombre: nombre.trim(),
      email: email.trim() || null,
      password: showChangePassword && password ? password : undefined,
      supervisor,
      activo,
      inhabilitado,
    };
    const result = await updateEmpleado(empleadoId, body);
    setFormState(result.success ? 'success' : 'error');
    if (result.success) {
      setSuccessMessage('Empleado actualizado correctamente.');
      setTimeout(() => navigate('/empleados'), 1500);
      return;
    }
    setErrorMessage(result.errorMessage ?? 'Error al actualizar empleado');
    if (result.validationErrors) {
      const map: Record<string, string> = {};
      for (const [key, messages] of Object.entries(result.validationErrors)) {
        if (Array.isArray(messages) && messages[0]) map[key] = messages[0];
      }
      setFieldErrors(map);
    }
  };

  const handleCancel = () => {
    navigate('/empleados');
  };

  if (formState === 'loading') {
    return (
      <div className="empleados-nueva-page" data-testid="empleados.edit.page">
        <p>Cargando empleado...</p>
      </div>
    );
  }

  if (formState === 'loadError' || !empleado) {
    return (
      <div className="empleados-nueva-page" data-testid="empleados.edit.page">
        <div className="empleados-nueva-error" role="alert">
          {errorMessage || 'Error al cargar empleado'}
        </div>
        <Button text="Volver al listado" type="normal" onClick={handleCancel} />
      </div>
    );
  }

  return (
    <div className="empleados-nueva-page" data-testid="empleados.edit.page">
      <header className="empleados-nueva-header">
        <h1 className="empleados-nueva-title">Editar empleado</h1>
      </header>

      {successMessage && (
        <div className="empleados-nueva-success" role="alert" data-testid="empleados.edit.success">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="empleados-nueva-error" role="alert" data-testid="empleados.edit.error">
          {errorMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="empleados-nueva-form"
        data-testid="empleados.edit.form"
        noValidate
      >
        <div className="empleados-nueva-field">
          <label className="empleados-nueva-label">Código</label>
          <TextBox value={empleado.code} readOnly disabled elementAttr={{ 'data-testid': 'empleados.edit.code' }} />
        </div>

        <div className="empleados-nueva-field">
          <label className="empleados-nueva-label">Nombre <span className="empleados-nueva-required">*</span></label>
          <TextBox value={nombre} onValueChanged={(e) => setNombre(e.value ?? '')} maxLength={255} elementAttr={{ 'data-testid': 'empleados.edit.nombre' }} />
          {fieldErrors.nombre && <span className="empleados-nueva-error" role="alert">{fieldErrors.nombre}</span>}
        </div>

        <div className="empleados-nueva-field">
          <label className="empleados-nueva-label">Email</label>
          <TextBox value={email} onValueChanged={(e) => setEmail(e.value ?? '')} maxLength={255} mode="email" elementAttr={{ 'data-testid': 'empleados.edit.email' }} />
          {fieldErrors.email && <span className="empleados-nueva-error" role="alert">{fieldErrors.email}</span>}
        </div>

        <div className="empleados-nueva-field">
          <CheckBox
            text="Cambiar contraseña"
            value={showChangePassword}
            onValueChanged={(e) => {
              const checked = e.value ?? false;
              setShowChangePassword(checked);
              if (!checked) {
                setPassword('');
                setPasswordConfirm('');
                setFieldErrors((prev) => {
                  const next = { ...prev };
                  delete next.password;
                  delete next.passwordConfirm;
                  return next;
                });
              }
            }}
            elementAttr={{ 'data-testid': 'empleados.edit.showChangePassword' }}
          />
        </div>

        {showChangePassword && (
          <>
            <div className="empleados-nueva-field">
              <label className="empleados-nueva-label">Nueva contraseña</label>
              <TextBox value={password} onValueChanged={(e) => setPassword(e.value ?? '')} mode="password" elementAttr={{ 'data-testid': 'empleados.edit.password' }} />
              {fieldErrors.password && <span className="empleados-nueva-error" role="alert">{fieldErrors.password}</span>}
            </div>
            <div className="empleados-nueva-field">
              <label className="empleados-nueva-label">Confirmar contraseña</label>
              <TextBox value={passwordConfirm} onValueChanged={(e) => setPasswordConfirm(e.value ?? '')} mode="password" elementAttr={{ 'data-testid': 'empleados.edit.passwordConfirm' }} />
              {fieldErrors.passwordConfirm && <span className="empleados-nueva-error" role="alert">{fieldErrors.passwordConfirm}</span>}
            </div>
          </>
        )}

        <div className="empleados-nueva-field">
          <CheckBox text="Supervisor" value={supervisor} onValueChanged={(e) => setSupervisor(e.value ?? false)} elementAttr={{ 'data-testid': 'empleados.edit.supervisor' }} />
        </div>

        <div className="empleados-nueva-field">
          <CheckBox text="Activo" value={activo} onValueChanged={(e) => setActivo(e.value ?? true)} elementAttr={{ 'data-testid': 'empleados.edit.activo' }} />
        </div>

        <div className="empleados-nueva-field">
          <CheckBox text="Inhabilitado" value={inhabilitado} onValueChanged={(e) => setInhabilitado(e.value ?? false)} elementAttr={{ 'data-testid': 'empleados.edit.inhabilitado' }} />
        </div>

        <div className="empleados-nueva-actions">
          <Button text={formState === 'saving' ? 'Guardando...' : 'Guardar'} type="default" useSubmitBehavior={true} disabled={formState === 'saving'} elementAttr={{ 'data-testid': 'empleados.edit.submit' }} />
          <Button text="Cancelar" type="normal" onClick={handleCancel} elementAttr={{ 'data-testid': 'empleados.edit.cancel' }} />
        </div>
      </form>
    </div>
  );
}
