/**
 * Component: EmpleadosNuevoPage
 *
 * Formulario de creación de empleado (solo supervisores). TR-019(MH).
 * Usa TextBox, CheckBox y Button de DevExtreme.
 *
 * @see TR-057(SH)-migración-de-controles-a-devextreme.md
 */

import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import TextBox from 'devextreme-react/text-box';
import CheckBox from 'devextreme-react/check-box';
import Button from 'devextreme-react/button';
import { createEmpleado, CreateEmpleadoBody } from '../services/empleado.service';
import './EmpleadosNuevoPage.css';

type FormState = 'initial' | 'loading' | 'error' | 'success';

export function EmpleadosNuevoPage(): React.ReactElement {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [supervisor, setSupervisor] = useState(false);
  const [activo, setActivo] = useState(true);
  const [inhabilitado, setInhabilitado] = useState(false);

  const [formState, setFormState] = useState<FormState>('initial');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setFieldErrors({});

    // Validaciones frontend
    if (!password || password.length < 8) {
      setFieldErrors((prev) => ({
        ...prev,
        password: 'La contraseña es obligatoria y debe tener al menos 8 caracteres.',
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

    setFormState('loading');
    const body: CreateEmpleadoBody = {
      code: code.trim(),
      nombre: nombre.trim(),
      email: email.trim() || null,
      password: password,
      supervisor,
      activo,
      inhabilitado,
    };
    const result = await createEmpleado(body);
    setFormState(result.success ? 'success' : 'error');
    if (result.success) {
      setSuccessMessage('Empleado creado correctamente.');
      setTimeout(() => navigate('/empleados'), 1500);
      return;
    }
    setErrorMessage(result.errorMessage || 'Error al crear empleado');
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

  return (
    <div className="empleados-nueva-page" data-testid="empleados.create.page">
      <header className="empleados-nueva-header">
        <h1 className="empleados-nueva-title">Crear empleado</h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="empleados-nueva-form"
        data-testid="empleados.create.form"
        noValidate
      >
        <div className="empleados-nueva-field">
          <label className="empleados-nueva-label">Código <span className="empleados-nueva-required">*</span></label>
          <TextBox value={code} onValueChanged={(e) => setCode(e.value ?? '')} maxLength={50} elementAttr={{ 'data-testid': 'empleados.create.code' }} />
          {fieldErrors.code && <span className="empleados-nueva-error" role="alert">{fieldErrors.code}</span>}
        </div>

        <div className="empleados-nueva-field">
          <label className="empleados-nueva-label">Nombre <span className="empleados-nueva-required">*</span></label>
          <TextBox value={nombre} onValueChanged={(e) => setNombre(e.value ?? '')} maxLength={255} elementAttr={{ 'data-testid': 'empleados.create.nombre' }} />
          {fieldErrors.nombre && <span className="empleados-nueva-error" role="alert">{fieldErrors.nombre}</span>}
        </div>

        <div className="empleados-nueva-field">
          <label className="empleados-nueva-label">Email</label>
          <TextBox value={email} onValueChanged={(e) => setEmail(e.value ?? '')} mode="email" elementAttr={{ 'data-testid': 'empleados.create.email' }} />
          {fieldErrors.email && <span className="empleados-nueva-error" role="alert">{fieldErrors.email}</span>}
        </div>

        <div className="empleados-nueva-field">
          <label className="empleados-nueva-label">Contraseña <span className="empleados-nueva-required">*</span></label>
          <TextBox value={password} onValueChanged={(e) => setPassword(e.value ?? '')} mode="password" elementAttr={{ 'data-testid': 'empleados.create.password' }} />
          {fieldErrors.password && <span className="empleados-nueva-error" role="alert">{fieldErrors.password}</span>}
          <span className="empleados-nueva-hint">Mínimo 8 caracteres.</span>
        </div>

        <div className="empleados-nueva-field">
          <label className="empleados-nueva-label">Confirmar contraseña <span className="empleados-nueva-required">*</span></label>
          <TextBox value={passwordConfirm} onValueChanged={(e) => setPasswordConfirm(e.value ?? '')} mode="password" elementAttr={{ 'data-testid': 'empleados.create.passwordConfirm' }} />
          {fieldErrors.passwordConfirm && <span className="empleados-nueva-error" role="alert">{fieldErrors.passwordConfirm}</span>}
        </div>

        <div className="empleados-nueva-field empleados-nueva-checkbox-row">
          <CheckBox text="Supervisor" value={supervisor} onValueChanged={(e) => setSupervisor(e.value ?? false)} elementAttr={{ 'data-testid': 'empleados.create.supervisor' }} />
        </div>

        <div className="empleados-nueva-field empleados-nueva-checkbox-row">
          <CheckBox text="Activo" value={activo} onValueChanged={(e) => setActivo(e.value ?? true)} elementAttr={{ 'data-testid': 'empleados.create.activo' }} />
        </div>

        <div className="empleados-nueva-field empleados-nueva-checkbox-row">
          <CheckBox text="Inhabilitado" value={inhabilitado} onValueChanged={(e) => setInhabilitado(e.value ?? false)} elementAttr={{ 'data-testid': 'empleados.create.inhabilitado' }} />
        </div>

        {errorMessage && (
          <div className="empleados-nueva-form-error" data-testid="empleados.create.error" role="alert">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="empleados-nueva-form-success" data-testid="empleados.create.success" role="status">
            {successMessage}
          </div>
        )}

        <div className="empleados-nueva-actions">
          <Button text={formState === 'loading' ? 'Guardando...' : 'Guardar'} type="default" useSubmitBehavior={true} disabled={formState === 'loading'} elementAttr={{ 'data-testid': 'empleados.create.submit' }} />
          <Button text="Cancelar" type="normal" onClick={handleCancel} disabled={formState === 'loading'} elementAttr={{ 'data-testid': 'empleados.create.cancel' }} />
        </div>
      </form>
    </div>
  );
}

export default EmpleadosNuevoPage;
