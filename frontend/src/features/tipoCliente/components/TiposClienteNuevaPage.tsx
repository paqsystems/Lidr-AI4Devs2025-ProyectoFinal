/**
 * TiposClienteNuevaPage – Formulario de creación de tipo de cliente. TR-015(MH).
 * Usa TextBox, CheckBox y Button de DevExtreme.
 *
 * @see TR-057(SH)-migración-de-controles-a-devextreme.md
 */
import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import TextBox from 'devextreme-react/text-box';
import CheckBox from 'devextreme-react/check-box';
import Button from 'devextreme-react/button';
import { createTipoCliente } from '../services/tipoCliente.service';
import './TiposClientePage.css';

export function TiposClienteNuevaPage(): React.ReactElement {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [activo, setActivo] = useState(true);
  const [inhabilitado, setInhabilitado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    const err: Record<string, string> = {};
    if (!code.trim()) err.code = 'El código es obligatorio.';
    if (!descripcion.trim()) err.descripcion = 'La descripción es obligatoria.';
    if (Object.keys(err).length > 0) {
      setFieldErrors(err);
      return;
    }
    setLoading(true);
    const result = await createTipoCliente({ code: code.trim(), descripcion: descripcion.trim(), activo, inhabilitado });
    setLoading(false);
    if (result.success) {
      navigate('/tipos-cliente');
    } else {
      setError(result.errorMessage ?? 'Error al crear tipo de cliente');
    }
  };

  return (
    <div className="tipos-cliente-page">
      <header className="tipos-cliente-page-header">
        <h1 className="tipos-cliente-page-title">Nuevo tipo de cliente</h1>
      </header>
      <form onSubmit={handleSubmit} className="tipos-cliente-form" data-testid="tipoClienteCrear.form">
        {error && <div className="tipos-cliente-page-error" role="alert">{error}</div>}
        <div className="tipos-cliente-form-group">
          <label htmlFor="code" className="tipos-cliente-form-label">Código</label>
          <TextBox
            value={code}
            onValueChanged={(e) => setCode(e.value ?? '')}
            disabled={loading}
            maxLength={50}
            elementAttr={{ 'data-testid': 'tipoClienteCrear.code' }}
          />
          {fieldErrors.code && <span className="field-error">{fieldErrors.code}</span>}
        </div>
        <div className="tipos-cliente-form-group">
          <label htmlFor="descripcion" className="tipos-cliente-form-label">Descripción</label>
          <TextBox
            value={descripcion}
            onValueChanged={(e) => setDescripcion(e.value ?? '')}
            disabled={loading}
            maxLength={255}
            elementAttr={{ 'data-testid': 'tipoClienteCrear.descripcion' }}
          />
          {fieldErrors.descripcion && <span className="field-error">{fieldErrors.descripcion}</span>}
        </div>
        <div className="tipos-cliente-form-group checkbox">
          <CheckBox text="Activo" value={activo} onValueChanged={(e) => setActivo(e.value ?? true)} disabled={loading} />
        </div>
        <div className="tipos-cliente-form-group checkbox">
          <CheckBox text="Inhabilitado" value={inhabilitado} onValueChanged={(e) => setInhabilitado(e.value ?? false)} disabled={loading} />
        </div>
        <div className="tipos-cliente-form-actions">
          <Button text="Cancelar" type="normal" onClick={() => navigate('/tipos-cliente')} elementAttr={{ 'data-testid': 'tipoClienteCrear.cancel' }} />
          <Button text={loading ? 'Guardando...' : 'Guardar'} type="default" useSubmitBehavior={true} disabled={loading} elementAttr={{ 'data-testid': 'tipoClienteCrear.submit' }} />
        </div>
      </form>
    </div>
  );
}
