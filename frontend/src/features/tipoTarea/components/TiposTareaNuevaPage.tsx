/**
 * TiposTareaNuevaPage – Formulario de creación de tipo de tarea. TR-024(MH).
 * Usa TextBox, CheckBox y Button de DevExtreme.
 *
 * @see TR-057(SH)-migración-de-controles-a-devextreme.md
 */
import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import TextBox from 'devextreme-react/text-box';
import CheckBox from 'devextreme-react/check-box';
import Button from 'devextreme-react/button';
import { createTipoTarea, ERROR_YA_HAY_POR_DEFECTO } from '../services/tipoTarea.service';
import './TiposTareaPage.css';

export function TiposTareaNuevaPage(): React.ReactElement {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [isGenerico, setIsGenerico] = useState(false);
  const [isDefault, setIsDefault] = useState(false);
  const [activo, setActivo] = useState(true);
  const [inhabilitado, setInhabilitado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handlePorDefectoChange = (checked: boolean) => {
    setIsDefault(checked);
    if (checked) setIsGenerico(true);
  };

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
    const result = await createTipoTarea({
      code: code.trim(),
      descripcion: descripcion.trim(),
      is_generico: isDefault ? true : isGenerico,
      is_default: isDefault,
      activo,
      inhabilitado,
    });
    setLoading(false);
    if (result.success) {
      navigate('/tipos-tarea');
    } else {
      setError(
        result.errorCode === ERROR_YA_HAY_POR_DEFECTO
          ? 'Solo puede haber un tipo de tarea por defecto. Ya existe otro.'
          : (result.errorMessage ?? 'Error al crear tipo de tarea')
      );
    }
  };

  return (
    <div className="tipos-tarea-page">
      <header className="tipos-tarea-page-header">
        <h1 className="tipos-tarea-page-title">Nuevo tipo de tarea</h1>
      </header>
      <form onSubmit={handleSubmit} className="tipos-tarea-form" data-testid="tipoTareaCrear.form">
        {error && <div className="tipos-tarea-page-error" role="alert">{error}</div>}
        <div className="tipos-tarea-form-group">
          <label htmlFor="code" className="tipos-tarea-form-label">Código</label>
          <TextBox value={code} onValueChanged={(e) => setCode(e.value ?? '')} disabled={loading} maxLength={50} elementAttr={{ 'data-testid': 'tipoTareaCrear.code' }} />
          {fieldErrors.code && <span className="field-error">{fieldErrors.code}</span>}
        </div>
        <div className="tipos-tarea-form-group">
          <label htmlFor="descripcion" className="tipos-tarea-form-label">Descripción</label>
          <TextBox value={descripcion} onValueChanged={(e) => setDescripcion(e.value ?? '')} disabled={loading} maxLength={255} elementAttr={{ 'data-testid': 'tipoTareaCrear.descripcion' }} />
          {fieldErrors.descripcion && <span className="field-error">{fieldErrors.descripcion}</span>}
        </div>
        <div className="tipos-tarea-form-group checkbox">
          <CheckBox text="Genérico" value={isGenerico} onValueChanged={(e) => setIsGenerico(e.value ?? false)} disabled={loading || isDefault} elementAttr={{ 'data-testid': 'tipoTareaCrear.generico' }} />
          {isDefault && <span className="tipos-tarea-form-label" style={{ marginLeft: '0.5rem', color: '#6b7280' }}>(obligatorio si es por defecto)</span>}
        </div>
        <div className="tipos-tarea-form-group checkbox">
          <CheckBox text="Por defecto" value={isDefault} onValueChanged={(e) => handlePorDefectoChange(e.value ?? false)} disabled={loading} elementAttr={{ 'data-testid': 'tipoTareaCrear.porDefecto' }} />
        </div>
        <div className="tipos-tarea-form-group checkbox">
          <CheckBox text="Activo" value={activo} onValueChanged={(e) => setActivo(e.value ?? true)} disabled={loading} />
        </div>
        <div className="tipos-tarea-form-group checkbox">
          <CheckBox text="Inhabilitado" value={inhabilitado} onValueChanged={(e) => setInhabilitado(e.value ?? false)} disabled={loading} />
        </div>
        <div className="tipos-tarea-form-actions">
          <Button text="Cancelar" type="normal" onClick={() => navigate('/tipos-tarea')} />
          <Button text={loading ? 'Guardando...' : 'Guardar'} type="default" useSubmitBehavior={true} disabled={loading} elementAttr={{ 'data-testid': 'tipoTareaCrear.submit' }} />
        </div>
      </form>
    </div>
  );
}
