/**
 * TiposClienteEditarPage – Formulario de edición de tipo de cliente. TR-016(MH).
 * Usa TextBox, CheckBox y Button de DevExtreme.
 *
 * @see TR-057(SH)-migración-de-controles-a-devextreme.md
 */
import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TextBox from 'devextreme-react/text-box';
import CheckBox from 'devextreme-react/check-box';
import Button from 'devextreme-react/button';
import { getTipoCliente, updateTipoCliente } from '../services/tipoCliente.service';
import './TiposClientePage.css';

export function TiposClienteEditarPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tipoId = id ? parseInt(id, 10) : NaN;
  const [code, setCode] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [activo, setActivo] = useState(true);
  const [inhabilitado, setInhabilitado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const loadTipo = useCallback(async (tid: number) => {
    setLoading(true);
    setError('');
    const result = await getTipoCliente(tid);
    setLoading(false);
    if (result.success && result.data) {
      setCode(result.data.code);
      setDescripcion(result.data.descripcion);
      setActivo(result.data.activo);
      setInhabilitado(result.data.inhabilitado);
    } else {
      setError(result.errorMessage ?? 'Error al cargar tipo de cliente');
    }
  }, []);

  useEffect(() => {
    if (Number.isNaN(tipoId)) {
      setError('ID inválido');
      setLoading(false);
      return;
    }
    loadTipo(tipoId);
  }, [tipoId, loadTipo]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    if (!descripcion.trim()) {
      setFieldErrors({ descripcion: 'La descripción es obligatoria.' });
      return;
    }
    setSaving(true);
    const result = await updateTipoCliente(tipoId, { descripcion: descripcion.trim(), activo, inhabilitado });
    setSaving(false);
    if (result.success) {
      navigate('/tipos-cliente');
    } else {
      setError(result.errorMessage ?? 'Error al actualizar');
    }
  };

  if (loading) {
    return <div className="tipos-cliente-page"><p className="tipos-cliente-page-loading">Cargando...</p></div>;
  }

  if (error && !code) {
    return (
      <div className="tipos-cliente-page">
        <p className="tipos-cliente-page-error">{error}</p>
        <Button text="Volver" type="normal" onClick={() => navigate('/tipos-cliente')} />
      </div>
    );
  }

  return (
    <div className="tipos-cliente-page">
      <header className="tipos-cliente-page-header">
        <h1 className="tipos-cliente-page-title">Editar tipo de cliente</h1>
      </header>
      <form onSubmit={handleSubmit} className="tipos-cliente-form" data-testid="tipoClienteEditar.form">
        {error && <div className="tipos-cliente-page-error" role="alert">{error}</div>}
        <div className="tipos-cliente-form-group">
          <label className="tipos-cliente-form-label">Código</label>
          <TextBox value={code} readOnly disabled elementAttr={{ 'data-testid': 'tipoClienteEditar.code' }} />
        </div>
        <div className="tipos-cliente-form-group">
          <label htmlFor="descripcion" className="tipos-cliente-form-label">Descripción</label>
          <TextBox
            value={descripcion}
            onValueChanged={(e) => setDescripcion(e.value ?? '')}
            disabled={saving}
            maxLength={255}
            elementAttr={{ 'data-testid': 'tipoClienteEditar.descripcion' }}
          />
          {fieldErrors.descripcion && <span className="field-error">{fieldErrors.descripcion}</span>}
        </div>
        <div className="tipos-cliente-form-group checkbox">
          <CheckBox text="Activo" value={activo} onValueChanged={(e) => setActivo(e.value ?? true)} disabled={saving} />
        </div>
        <div className="tipos-cliente-form-group checkbox">
          <CheckBox text="Inhabilitado" value={inhabilitado} onValueChanged={(e) => setInhabilitado(e.value ?? false)} disabled={saving} />
        </div>
        <div className="tipos-cliente-form-actions">
          <Button text="Cancelar" type="normal" onClick={() => navigate('/tipos-cliente')} elementAttr={{ 'data-testid': 'tipoClienteEditar.cancel' }} />
          <Button text={saving ? 'Guardando...' : 'Guardar'} type="default" useSubmitBehavior={true} disabled={saving} elementAttr={{ 'data-testid': 'tipoClienteEditar.submit' }} />
        </div>
      </form>
    </div>
  );
}
