/**
 * TiposTareaEditarPage – Formulario de edición de tipo de tarea. TR-025(MH).
 * Usa TextBox, CheckBox y Button de DevExtreme.
 *
 * @see TR-057(SH)-migración-de-controles-a-devextreme.md
 */
import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TextBox from 'devextreme-react/text-box';
import CheckBox from 'devextreme-react/check-box';
import Button from 'devextreme-react/button';
import { getTipoTarea, updateTipoTarea, ERROR_YA_HAY_POR_DEFECTO } from '../services/tipoTarea.service';
import './TiposTareaPage.css';

export function TiposTareaEditarPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tipoId = id ? parseInt(id, 10) : NaN;
  const [code, setCode] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [isGenerico, setIsGenerico] = useState(false);
  const [isDefault, setIsDefault] = useState(false);
  const [activo, setActivo] = useState(true);
  const [inhabilitado, setInhabilitado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handlePorDefectoChange = (checked: boolean) => {
    setIsDefault(checked);
    if (checked) setIsGenerico(true);
  };

  const loadTipo = useCallback(async (tid: number) => {
    setLoading(true);
    setError('');
    const result = await getTipoTarea(tid);
    setLoading(false);
    if (result.success && result.data) {
      setCode(result.data.code);
      setDescripcion(result.data.descripcion);
      setIsGenerico(result.data.is_generico);
      setIsDefault(result.data.is_default);
      setActivo(result.data.activo);
      setInhabilitado(result.data.inhabilitado);
    } else {
      setError(result.errorMessage ?? 'Error al cargar tipo de tarea');
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
    const result = await updateTipoTarea(tipoId, {
      descripcion: descripcion.trim(),
      is_generico: isDefault ? true : isGenerico,
      is_default: isDefault,
      activo,
      inhabilitado,
    });
    setSaving(false);
    if (result.success) {
      navigate('/tipos-tarea');
    } else {
      setError(
        result.errorCode === ERROR_YA_HAY_POR_DEFECTO
          ? 'Solo puede haber un tipo de tarea por defecto. Ya existe otro.'
          : (result.errorMessage ?? 'Error al actualizar')
      );
    }
  };

  if (loading) {
    return <div className="tipos-tarea-page"><p className="tipos-tarea-page-loading">Cargando...</p></div>;
  }

  if (error && !code) {
    return (
      <div className="tipos-tarea-page">
        <p className="tipos-tarea-page-error">{error}</p>
        <Button text="Volver" type="normal" onClick={() => navigate('/tipos-tarea')} />
      </div>
    );
  }

  return (
    <div className="tipos-tarea-page">
      <header className="tipos-tarea-page-header">
        <h1 className="tipos-tarea-page-title">Editar tipo de tarea</h1>
      </header>
      <form onSubmit={handleSubmit} className="tipos-tarea-form" data-testid="tipoTareaEditar.form">
        {error && <div className="tipos-tarea-page-error" role="alert">{error}</div>}
        <div className="tipos-tarea-form-group">
          <label className="tipos-tarea-form-label">Código</label>
          <TextBox value={code} readOnly disabled elementAttr={{ 'data-testid': 'tipoTareaEditar.code' }} />
        </div>
        <div className="tipos-tarea-form-group">
          <label htmlFor="descripcion" className="tipos-tarea-form-label">Descripción</label>
          <TextBox value={descripcion} onValueChanged={(e) => setDescripcion(e.value ?? '')} disabled={saving} maxLength={255} elementAttr={{ 'data-testid': 'tipoTareaEditar.descripcion' }} />
          {fieldErrors.descripcion && <span className="field-error">{fieldErrors.descripcion}</span>}
        </div>
        <div className="tipos-tarea-form-group checkbox">
          <CheckBox text="Genérico" value={isGenerico} onValueChanged={(e) => setIsGenerico(e.value ?? false)} disabled={saving || isDefault} />
        </div>
        <div className="tipos-tarea-form-group checkbox">
          <CheckBox text="Por defecto" value={isDefault} onValueChanged={(e) => handlePorDefectoChange(e.value ?? false)} disabled={saving} />
        </div>
        <div className="tipos-tarea-form-group checkbox">
          <CheckBox text="Activo" value={activo} onValueChanged={(e) => setActivo(e.value ?? true)} disabled={saving} />
        </div>
        <div className="tipos-tarea-form-group checkbox">
          <CheckBox text="Inhabilitado" value={inhabilitado} onValueChanged={(e) => setInhabilitado(e.value ?? false)} disabled={saving} />
        </div>
        <div className="tipos-tarea-form-actions">
          <Button text="Cancelar" type="normal" onClick={() => navigate('/tipos-tarea')} />
          <Button text={saving ? 'Guardando...' : 'Guardar'} type="default" useSubmitBehavior={true} disabled={saving} elementAttr={{ 'data-testid': 'tipoTareaEditar.submit' }} />
        </div>
      </form>
    </div>
  );
}
