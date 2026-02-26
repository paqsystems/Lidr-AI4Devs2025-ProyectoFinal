/**
 * Component: LoginForm
 *
 * Formulario de login para empleados.
 * Usa controles DevExtreme (TextBox, Button).
 *
 * @see TR-001(MH)-login-de-empleado.md
 * @see TR-057(SH)-migración-de-controles-a-devextreme.md
 */

import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import TextBox from 'devextreme-react/text-box';
import Button from 'devextreme-react/button';
import { login } from '../services/auth.service';
import './LoginForm.css';

type FormState = 'initial' | 'loading' | 'error' | 'success';

interface ValidationErrors {
  usuario?: string;
  password?: string;
}

export function LoginForm(): React.ReactElement {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [formState, setFormState] = useState<FormState>('initial');
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    if (!usuario.trim()) errors.usuario = 'El código de usuario es requerido';
    if (!password) errors.password = 'La contraseña es requerida';
    else if (password.length < 8) errors.password = 'La contraseña debe tener al menos 8 caracteres';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setValidationErrors({});
    if (!validateForm()) {
      setFormState('error');
      return;
    }
    setFormState('loading');
    try {
      const result = await login(usuario, password);
      if (result.success) {
        setFormState('success');
        navigate('/');
      } else {
        setFormState('error');
        setErrorMessage(result.errorMessage || 'Credenciales inválidas');
      }
    } catch {
      setFormState('error');
      setErrorMessage('Error de conexión. Intente nuevamente.');
    }
  };

  const isLoading = formState === 'loading';

  return (
    <div className="login-container">
      <form
        onSubmit={handleSubmit}
        data-testid="auth.login.form"
        className="login-form"
        aria-busy={isLoading}
      >
        <h1 className="login-title">Iniciar Sesión</h1>

        {formState === 'error' && errorMessage && (
          <div
            className="login-error"
            data-testid="auth.login.errorMessage"
            role="alert"
            aria-live="polite"
          >
            {errorMessage}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="usuario" className="form-label">
            Código de Usuario
          </label>
          <TextBox
            value={usuario}
            onValueChanged={(e) => setUsuario(e.value ?? '')}
            disabled={isLoading}
            inputAttr={{
              'data-testid': 'auth.login.usuarioInput',
              'aria-label': 'Código de usuario',
              'aria-invalid': !!validationErrors.usuario,
              id: 'usuario',
              name: 'usuario',
              autoComplete: 'username',
            }}
          />
          {validationErrors.usuario && (
            <span id="usuario-error" className="field-error" role="alert">
              {validationErrors.usuario}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Contraseña
          </label>
          <TextBox
            value={password}
            onValueChanged={(e) => setPassword(e.value ?? '')}
            mode="password"
            disabled={isLoading}
            inputAttr={{
              'data-testid': 'auth.login.passwordInput',
              'aria-label': 'Contraseña',
              'aria-invalid': !!validationErrors.password,
              id: 'password',
              name: 'password',
              autoComplete: 'current-password',
            }}
          />
          {validationErrors.password && (
            <span id="password-error" className="field-error" role="alert">
              {validationErrors.password}
            </span>
          )}
        </div>

        <div className="form-group form-group-forgot">
          <Link
            to="/forgot-password"
            className="forgot-password-link"
            data-testid="auth.forgotPasswordLink"
            aria-label="Recuperar contraseña"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <div className="form-group form-group-button">
          <Button
            text={isLoading ? 'Autenticando...' : 'Iniciar Sesión'}
            type="default"
            useSubmitBehavior
            disabled={isLoading}
            elementAttr={{ 'data-testid': 'auth.login.submitButton' }}
            width="100%"
            aria-label="Iniciar sesión"
          />
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
