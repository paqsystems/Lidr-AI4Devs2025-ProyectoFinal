/**
 * Component: ClientesNuevaPage
 *
 * Formulario de creación de cliente (solo supervisores). TR-009(MH).
 * Usa TextBox, SelectBox, CheckBox y Button de DevExtreme.
 *
 * @see TR-057(SH)-migración-de-controles-a-devextreme.md
 */

import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import TextBox from 'devextreme-react/text-box';
import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import Button from 'devextreme-react/button';
import {
  createCliente,
  getTiposCliente,
  CreateClienteBody,
  TipoClienteItem,
} from '../services/client.service';
import './ClientesNuevaPage.css';

type FormState = 'initial' | 'loading' | 'error' | 'success';

export function ClientesNuevaPage(): React.ReactElement {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [nombre, setNombre] = useState('');
  const [tipoClienteId, setTipoClienteId] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [habilitarAcceso, setHabilitarAcceso] = useState(false);
  const [password, setPassword] = useState('');
  const [activo, setActivo] = useState(true);
  const [inhabilitado, setInhabilitado] = useState(false);

  const [tiposCliente, setTiposCliente] = useState<TipoClienteItem[]>([]);
  const [formState, setFormState] = useState<FormState>('initial');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const loadTiposCliente = useCallback(async () => {
    const result = await getTiposCliente();
    if (result.success && result.data) {
      setTiposCliente(result.data);
      if (result.data.length > 0 && tipoClienteId === null) {
        setTipoClienteId(result.data[0].id);
      }
    }
  }, [tipoClienteId]);

  useEffect(() => {
    loadTiposCliente();
  }, [loadTiposCliente]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setFieldErrors({});
    if (!tipoClienteId || tipoClienteId <= 0) {
      setFieldErrors((prev) => ({ ...prev, tipo_cliente_id: 'Seleccione un tipo de cliente.' }));
      return;
    }
    if (habilitarAcceso && (!password || password.length < 8)) {
      setFieldErrors((prev) => ({
        ...prev,
        password: 'La contraseña es obligatoria y debe tener al menos 8 caracteres.',
      }));
      return;
    }

    setFormState('loading');
    const body: CreateClienteBody = {
      code: code.trim(),
      nombre: nombre.trim(),
      tipo_cliente_id: tipoClienteId,
      email: email.trim() || null,
      habilitar_acceso: habilitarAcceso,
      password: habilitarAcceso ? password : undefined,
      activo,
      inhabilitado,
    };
    const result = await createCliente(body);
    setFormState(result.success ? 'success' : 'error');
    if (result.success) {
      setSuccessMessage('Cliente creado correctamente.');
      setTimeout(() => navigate('/clientes'), 1500);
      return;
    }
    setErrorMessage(result.errorMessage || 'Error al crear cliente');
    if (result.validationErrors) {
      const map: Record<string, string> = {};
      for (const [key, messages] of Object.entries(result.validationErrors)) {
        if (Array.isArray(messages) && messages[0]) map[key] = messages[0];
      }
      setFieldErrors(map);
    }
  };

  const handleCancel = () => {
    navigate('/clientes');
  };

  return (
    <div className="clientes-nueva-page" data-testid="clientes.create.page">
      <header className="clientes-nueva-header">
        <h1 className="clientes-nueva-title">Crear cliente</h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="clientes-nueva-form"
        data-testid="clientes.create.form"
        noValidate
      >
        <div className="clientes-nueva-field">
          <label htmlFor="clientes-create-code" className="clientes-nueva-label">
            Código <span className="clientes-nueva-required">*</span>
          </label>
          <TextBox
            value={code}
            onValueChanged={(e) => setCode(e.value ?? '')}
            maxLength={50}
            elementAttr={{ 'data-testid': 'clientes.create.code', 'aria-required': 'true', 'aria-invalid': !!fieldErrors.code }}
          />
          {fieldErrors.code && (
            <span id="clientes-create-code-error" className="clientes-nueva-error" role="alert">
              {fieldErrors.code}
            </span>
          )}
        </div>

        <div className="clientes-nueva-field">
          <label htmlFor="clientes-create-nombre" className="clientes-nueva-label">
            Nombre <span className="clientes-nueva-required">*</span>
          </label>
          <TextBox
            value={nombre}
            onValueChanged={(e) => setNombre(e.value ?? '')}
            maxLength={255}
            elementAttr={{ 'data-testid': 'clientes.create.nombre', 'aria-required': 'true', 'aria-invalid': !!fieldErrors.nombre }}
          />
          {fieldErrors.nombre && (
            <span className="clientes-nueva-error" role="alert">
              {fieldErrors.nombre}
            </span>
          )}
        </div>

        <div className="clientes-nueva-field">
          <label htmlFor="clientes-create-tipoCliente" className="clientes-nueva-label">
            Tipo de cliente <span className="clientes-nueva-required">*</span>
          </label>
          <SelectBox
            dataSource={tiposCliente}
            value={tipoClienteId}
            onValueChanged={(e) => setTipoClienteId(e.value ?? null)}
            displayExpr="descripcion"
            valueExpr="id"
            placeholder="Seleccione..."
            elementAttr={{ 'data-testid': 'clientes.create.tipoCliente', 'aria-required': 'true', 'aria-invalid': !!fieldErrors.tipo_cliente_id }}
          />
          {fieldErrors.tipo_cliente_id && (
            <span className="clientes-nueva-error" role="alert">
              {fieldErrors.tipo_cliente_id}
            </span>
          )}
        </div>

        <div className="clientes-nueva-field">
          <label htmlFor="clientes-create-email" className="clientes-nueva-label">
            Email
          </label>
          <TextBox
            value={email}
            onValueChanged={(e) => setEmail(e.value ?? '')}
            mode="email"
            elementAttr={{ 'data-testid': 'clientes.create.email', 'aria-invalid': !!fieldErrors.email }}
          />
          {fieldErrors.email && (
            <span className="clientes-nueva-error" role="alert">
              {fieldErrors.email}
            </span>
          )}
        </div>

        <div className="clientes-nueva-field clientes-nueva-checkbox-row">
          <CheckBox
            text="Habilitar acceso al sistema"
            value={habilitarAcceso}
            onValueChanged={(e) => setHabilitarAcceso(e.value ?? false)}
            elementAttr={{ 'data-testid': 'clientes.create.habilitarAcceso', 'aria-describedby': 'clientes-create-habilitar-desc' }}
          />
          <span id="clientes-create-habilitar-desc" className="clientes-nueva-hint">
            Si se marca, se creará un usuario con el mismo código y la contraseña indicada.
          </span>
        </div>

        {habilitarAcceso && (
          <div className="clientes-nueva-field">
            <label htmlFor="clientes-create-password" className="clientes-nueva-label">
              Contraseña <span className="clientes-nueva-required">*</span>
            </label>
            <TextBox
              value={password}
              onValueChanged={(e) => setPassword(e.value ?? '')}
              mode="password"
              elementAttr={{ 'data-testid': 'clientes.create.password', 'aria-required': 'true', 'aria-invalid': !!fieldErrors.password }}
            />
            {fieldErrors.password && (
              <span className="clientes-nueva-error" role="alert">
                {fieldErrors.password}
              </span>
            )}
            <span className="clientes-nueva-hint">Mínimo 8 caracteres.</span>
          </div>
        )}

        <div className="clientes-nueva-field clientes-nueva-checkbox-row">
          <CheckBox
            text="Activo"
            value={activo}
            onValueChanged={(e) => setActivo(e.value ?? true)}
            elementAttr={{ 'data-testid': 'clientes.create.activo' }}
          />
        </div>

        <div className="clientes-nueva-field clientes-nueva-checkbox-row">
          <CheckBox
            text="Inhabilitado"
            value={inhabilitado}
            onValueChanged={(e) => setInhabilitado(e.value ?? false)}
            elementAttr={{ 'data-testid': 'clientes.create.inhabilitado' }}
          />
        </div>

        {errorMessage && (
          <div className="clientes-nueva-form-error" data-testid="clientes.create.error" role="alert">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="clientes-nueva-form-success" data-testid="clientes.create.success" role="status">
            {successMessage}
          </div>
        )}

        <div className="clientes-nueva-actions">
          <Button
            text={formState === 'loading' ? 'Guardando...' : 'Guardar'}
            type="default"
            useSubmitBehavior={true}
            disabled={formState === 'loading'}
            elementAttr={{ 'data-testid': 'clientes.create.submit', 'aria-busy': formState === 'loading' ? 'true' : 'false' }}
          />
          <Button
            text="Cancelar"
            type="normal"
            onClick={handleCancel}
            disabled={formState === 'loading'}
            elementAttr={{ 'data-testid': 'clientes.create.cancel' }}
          />
        </div>
      </form>
    </div>
  );
}

export default ClientesNuevaPage;
