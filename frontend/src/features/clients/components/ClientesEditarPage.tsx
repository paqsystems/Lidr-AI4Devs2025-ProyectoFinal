/**
 * Component: ClientesEditarPage
 *
 * Formulario de edición de cliente (solo supervisores). TR-010(MH), TR-012(MH).
 * Ruta: /clientes/:id/editar. Código solo lectura; campos editables: nombre, tipo cliente,
 * email, activo, inhabilitado; si tiene_acceso: cambiar contraseña y habilitar/deshabilitar acceso.
 * Sección Tipos de tarea: asignar/desasignar tipos no genéricos (TR-012).
 *
 * @see TR-010(MH)-edición-de-cliente.md
 * @see TR-012(MH)-asignación-de-tipos-de-tarea-a-cliente.md
 */

import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TextBox from 'devextreme-react/text-box';
import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import Button from 'devextreme-react/button';
import {
  getCliente,
  updateCliente,
  getTiposCliente,
  getTiposTareaCliente,
  updateTiposTareaCliente,
  getTiposTareaParaAsignacion,
  UpdateClienteBody,
  TipoClienteItem,
  ClienteDetalleItem,
  TipoTareaItem,
  ERROR_SIN_TIPOS_TAREA,
} from '../services/client.service';
import './ClientesNuevaPage.css';

type FormState = 'initial' | 'loading' | 'loadError' | 'saving' | 'error' | 'success';

export function ClientesEditarPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const clienteId = id ? parseInt(id, 10) : NaN;

  const [cliente, setCliente] = useState<ClienteDetalleItem | null>(null);
  const [nombre, setNombre] = useState('');
  const [tipoClienteId, setTipoClienteId] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [habilitarAcceso, setHabilitarAcceso] = useState(false);
  const [password, setPassword] = useState('');
  const [activo, setActivo] = useState(true);
  const [inhabilitado, setInhabilitado] = useState(false);

  const [tiposCliente, setTiposCliente] = useState<TipoClienteItem[]>([]);
  const [formState, setFormState] = useState<FormState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // TR-012: Tipos de tarea asignables (no genéricos)
  const [tiposTareaDisponibles, setTiposTareaDisponibles] = useState<TipoTareaItem[]>([]);
  const [tiposTareaSeleccionados, setTiposTareaSeleccionados] = useState<Set<number>>(new Set());
  const [tiposTareaLoading, setTiposTareaLoading] = useState(false);
  const [tiposTareaSaving, setTiposTareaSaving] = useState(false);
  const [tiposTareaError, setTiposTareaError] = useState('');
  const [tiposTareaSuccess, setTiposTareaSuccess] = useState('');

  const loadCliente = useCallback(async (cid: number) => {
    setFormState('loading');
    setErrorMessage('');
    const result = await getCliente(cid);
    if (result.success && result.data) {
      const c = result.data;
      setCliente(c);
      setNombre(c.nombre);
      setTipoClienteId(c.tipo_cliente_id);
      setEmail(c.email ?? '');
      setHabilitarAcceso(c.tiene_acceso);
      setPassword('');
      setActivo(c.activo);
      setInhabilitado(c.inhabilitado);
      setFormState('initial');
    } else {
      setFormState('loadError');
      setErrorMessage(result.errorMessage ?? 'Error al cargar cliente');
    }
  }, []);

  const loadTiposCliente = useCallback(async () => {
    const result = await getTiposCliente();
    if (result.success && result.data) setTiposCliente(result.data);
  }, []);

  useEffect(() => {
    if (!Number.isNaN(clienteId) && clienteId > 0) {
      loadCliente(clienteId);
    } else {
      setFormState('loadError');
      setErrorMessage('ID de cliente inválido');
    }
  }, [clienteId, loadCliente]);

  useEffect(() => {
    loadTiposCliente();
  }, [loadTiposCliente]);

  const loadTiposTarea = useCallback(async (cid: number) => {
    setTiposTareaLoading(true);
    setTiposTareaError('');
    const [asignadosRes, catalogRes] = await Promise.all([
      getTiposTareaCliente(cid),
      getTiposTareaParaAsignacion(),
    ]);
    setTiposTareaLoading(false);
    if (catalogRes.success && catalogRes.data) {
      setTiposTareaDisponibles(catalogRes.data);
    }
    if (asignadosRes.success && asignadosRes.data) {
      setTiposTareaSeleccionados(new Set(asignadosRes.data.map((t) => t.id)));
    }
    if (asignadosRes.success && catalogRes.success && !asignadosRes.data?.length && catalogRes.data?.length) {
      setTiposTareaSeleccionados(new Set());
    }
  }, []);

  useEffect(() => {
    if (!Number.isNaN(clienteId) && clienteId > 0 && cliente) {
      loadTiposTarea(clienteId);
    }
  }, [clienteId, cliente, loadTiposTarea]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (Number.isNaN(clienteId) || clienteId <= 0 || !cliente) return;
    setErrorMessage('');
    setFieldErrors({});
    if (!tipoClienteId || tipoClienteId <= 0) {
      setFieldErrors((prev) => ({ ...prev, tipo_cliente_id: 'Seleccione un tipo de cliente.' }));
      return;
    }
    if (habilitarAcceso && cliente.tiene_acceso === false && (!password || password.length < 8)) {
      setFieldErrors((prev) => ({
        ...prev,
        password: 'La contraseña es obligatoria al habilitar acceso (mínimo 8 caracteres).',
      }));
      return;
    }

    setFormState('saving');
    const body: UpdateClienteBody = {
      nombre: nombre.trim(),
      tipo_cliente_id: tipoClienteId,
      email: email.trim() || null,
      password: password.trim() || undefined,
      habilitar_acceso: habilitarAcceso,
      activo,
      inhabilitado,
    };
    const result = await updateCliente(clienteId, body);
    setFormState(result.success ? 'success' : 'error');
    if (result.success) {
      setSuccessMessage('Cliente actualizado correctamente.');
      setTimeout(() => navigate('/clientes'), 1500);
      return;
    }
    setErrorMessage(result.errorMessage ?? 'Error al actualizar cliente');
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

  const handleTiposTareaChange = (tipoId: number, checked: boolean) => {
    setTiposTareaSeleccionados((prev) => {
      const next = new Set(prev);
      if (checked) next.add(tipoId);
      else next.delete(tipoId);
      return next;
    });
    setTiposTareaError('');
  };

  const handleGuardarTiposTarea = async () => {
    if (Number.isNaN(clienteId) || clienteId <= 0) return;
    setTiposTareaError('');
    setTiposTareaSuccess('');
    setTiposTareaSaving(true);
    const ids = Array.from(tiposTareaSeleccionados);
    const result = await updateTiposTareaCliente(clienteId, ids);
    setTiposTareaSaving(false);
    if (result.success && result.data) {
      setTiposTareaSeleccionados(new Set(result.data.map((t) => t.id)));
      setTiposTareaSuccess('Tipos de tarea actualizados correctamente.');
      setTiposTareaError('');
    } else {
      const msg =
        result.errorCode === ERROR_SIN_TIPOS_TAREA
          ? 'El cliente debe tener al menos un tipo de tarea disponible (genérico o asignado).'
          : result.errorMessage ?? 'Error al actualizar tipos de tarea';
      setTiposTareaError(msg);
      setTiposTareaSuccess('');
    }
  };

  const isSaving = formState === 'saving';
  const isLoadError = formState === 'loadError';

  if (isLoadError) {
    return (
      <div className="clientes-nueva-page" data-testid="clientes.edit.page">
        <header className="clientes-nueva-header">
          <h1 className="clientes-nueva-title">Editar cliente</h1>
        </header>
        <div className="clientes-nueva-form-error" role="alert">
          {errorMessage}
        </div>
        <Button text="Volver al listado" type="normal" onClick={handleCancel} />
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="clientes-nueva-page" data-testid="clientes.edit.page">
        <div className="clientes-nueva-form-error" role="status">
          Cargando...
        </div>
      </div>
    );
  }

  return (
    <div className="clientes-nueva-page" data-testid="clientes.edit.page">
      <header className="clientes-nueva-header">
        <h1 className="clientes-nueva-title">Editar cliente</h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="clientes-nueva-form"
        data-testid="clientes.edit.form"
        noValidate
      >
        <div className="clientes-nueva-field">
          <label className="clientes-nueva-label">Código</label>
          <TextBox value={cliente.code} readOnly disabled elementAttr={{ 'data-testid': 'clientes.edit.code' }} />
        </div>

        <div className="clientes-nueva-field">
          <label className="clientes-nueva-label">Nombre <span className="clientes-nueva-required">*</span></label>
          <TextBox value={nombre} onValueChanged={(e) => setNombre(e.value ?? '')} maxLength={255} elementAttr={{ 'data-testid': 'clientes.edit.nombre' }} />
          {fieldErrors.nombre && <span className="clientes-nueva-error" role="alert">{fieldErrors.nombre}</span>}
        </div>

        <div className="clientes-nueva-field">
          <label className="clientes-nueva-label">Tipo de cliente <span className="clientes-nueva-required">*</span></label>
          <SelectBox
            dataSource={tiposCliente}
            value={tipoClienteId}
            onValueChanged={(e) => setTipoClienteId(e.value ?? null)}
            displayExpr="descripcion"
            valueExpr="id"
            placeholder="Seleccione..."
            elementAttr={{ 'data-testid': 'clientes.edit.tipoCliente' }}
          />
          {fieldErrors.tipo_cliente_id && <span className="clientes-nueva-error" role="alert">{fieldErrors.tipo_cliente_id}</span>}
        </div>

        <div className="clientes-nueva-field">
          <label className="clientes-nueva-label">Email</label>
          <TextBox value={email} onValueChanged={(e) => setEmail(e.value ?? '')} mode="email" elementAttr={{ 'data-testid': 'clientes.edit.email' }} />
          {fieldErrors.email && <span className="clientes-nueva-error" role="alert">{fieldErrors.email}</span>}
        </div>

        <div className="clientes-nueva-field clientes-nueva-checkbox-row">
          <CheckBox
            text="Habilitar acceso al sistema"
            value={habilitarAcceso}
            onValueChanged={(e) => setHabilitarAcceso(e.value ?? false)}
            elementAttr={{ 'data-testid': 'clientes.edit.habilitarAcceso' }}
          />
          <span className="clientes-nueva-hint">
            {cliente.tiene_acceso
              ? 'Desmarque para desvincular el usuario del cliente.'
              : 'Marque y complete contraseña para crear usuario y vincular.'}
          </span>
        </div>

        {(habilitarAcceso || cliente.tiene_acceso) && (
          <div className="clientes-nueva-field">
            <label className="clientes-nueva-label">Cambiar contraseña</label>
            <TextBox
              value={password}
              onValueChanged={(e) => setPassword(e.value ?? '')}
              mode="password"
              placeholder={cliente.tiene_acceso ? 'Dejar en blanco para no cambiar' : 'Obligatoria al habilitar acceso'}
              elementAttr={{ 'data-testid': 'clientes.edit.password' }}
            />
            {fieldErrors.password && <span className="clientes-nueva-error" role="alert">{fieldErrors.password}</span>}
            <span className="clientes-nueva-hint">Mínimo 8 caracteres.</span>
          </div>
        )}

        <div className="clientes-nueva-field clientes-nueva-checkbox-row">
          <CheckBox text="Activo" value={activo} onValueChanged={(e) => setActivo(e.value ?? false)} elementAttr={{ 'data-testid': 'clientes.edit.activo' }} />
        </div>

        <div className="clientes-nueva-field clientes-nueva-checkbox-row">
          <CheckBox text="Inhabilitado" value={inhabilitado} onValueChanged={(e) => setInhabilitado(e.value ?? false)} elementAttr={{ 'data-testid': 'clientes.edit.inhabilitado' }} />
        </div>

        {/* TR-012: Sección Tipos de tarea (asignar tipos no genéricos) */}
        <section
          className="clientes-nueva-field clientes-task-types-section"
          data-testid="clientes.taskTypes.section"
          aria-labelledby="clientes-taskTypes-heading"
        >
          <h2 id="clientes-taskTypes-heading" className="clientes-nueva-label" style={{ marginTop: '1rem' }}>
            Tipos de tarea asignados
          </h2>
          <p className="clientes-nueva-hint">
            Marque los tipos de tarea específicos (no genéricos) que este cliente puede usar al registrar tareas. Los tipos genéricos están disponibles para todos.
          </p>
          {tiposTareaLoading ? (
            <p className="clientes-nueva-hint" role="status">
              Cargando tipos de tarea...
            </p>
          ) : (
            <>
              <ul className="clientes-task-types-list" data-testid="clientes.taskTypes.list" role="list">
                {tiposTareaDisponibles.map((tipo) => (
                  <li key={tipo.id} className="clientes-nueva-checkbox-row">
                    <CheckBox
                      text={`${tipo.descripcion} (${tipo.code})`}
                      value={tiposTareaSeleccionados.has(tipo.id)}
                      onValueChanged={(e) => handleTiposTareaChange(tipo.id, e.value ?? false)}
                      elementAttr={{ 'data-testid': `clientes.taskTypes.check.${tipo.id}` }}
                    />
                  </li>
                ))}
              </ul>
              {tiposTareaDisponibles.length === 0 && (
                <p className="clientes-nueva-hint">No hay tipos de tarea no genéricos disponibles.</p>
              )}
              <div className="clientes-nueva-actions" style={{ marginTop: '0.5rem' }}>
                <Button
                  text={tiposTareaSaving ? 'Guardando tipos...' : 'Guardar tipos de tarea'}
                  type="default"
                  disabled={tiposTareaSaving}
                  onClick={(e) => {
                    (e.event as Event)?.preventDefault?.();
                    handleGuardarTiposTarea();
                  }}
                  elementAttr={{ 'data-testid': 'clientes.taskTypes.save' }}
                />
              </div>
              {tiposTareaError && (
                <div className="clientes-nueva-form-error" data-testid="clientes.taskTypes.error" role="alert">
                  {tiposTareaError}
                </div>
              )}
              {tiposTareaSuccess && (
                <div className="clientes-nueva-form-success" data-testid="clientes.taskTypes.success" role="status">
                  {tiposTareaSuccess}
                </div>
              )}
            </>
          )}
        </section>

        {errorMessage && (
          <div className="clientes-nueva-form-error" data-testid="clientes.edit.error" role="alert">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="clientes-nueva-form-success" data-testid="clientes.edit.success" role="status">
            {successMessage}
          </div>
        )}

        <div className="clientes-nueva-actions">
          <Button text={isSaving ? 'Guardando...' : 'Guardar'} type="default" useSubmitBehavior disabled={isSaving} elementAttr={{ 'data-testid': 'clientes.edit.submit' }} />
          <Button text="Cancelar" type="normal" onClick={handleCancel} disabled={isSaving} elementAttr={{ 'data-testid': 'clientes.edit.cancel' }} />
        </div>
      </form>
    </div>
  );
}

export default ClientesEditarPage;
