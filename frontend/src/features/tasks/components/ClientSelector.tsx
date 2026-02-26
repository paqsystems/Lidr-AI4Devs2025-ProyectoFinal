/**
 * Component: ClientSelector
 *
 * Selector de clientes con carga dinámica desde el API.
 * Usa SelectBox de DevExtreme.
 *
 * @see TR-028(MH)-carga-de-tarea-diaria.md
 * @see TR-057(SH)-migración-de-controles-a-devextreme.md
 */

import React, { useEffect, useState, useMemo } from 'react';
import SelectBox from 'devextreme-react/select-box';
import { getClients, Client } from '../services/task.service';
import { t } from '../../../shared/i18n';
import './TaskForm.css';

export interface ClientSelectorProps {
  value: number | null;
  onChange: (clientId: number | null) => void;
  error?: string;
  disabled?: boolean;
  showLabel?: boolean;
  allowAll?: boolean;
}

export function ClientSelector({ value, onChange, error, disabled, showLabel = true, allowAll = false }: ClientSelectorProps): React.ReactElement {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    setErrorMessage('');
    const result = await getClients();
    if (result.success && result.data) {
      setClients(result.data);
    } else {
      setErrorMessage(result.errorMessage || t('tasks.form.selectors.clients.error', 'Error al cargar clientes'));
    }
    setLoading(false);
  };

  const ALL_ID = -1;
  const items = useMemo(() => {
    const list = clients.map((c) => ({ id: c.id, text: `${c.nombre} (${c.code})` }));
    if (allowAll) {
      return [{ id: ALL_ID, text: t('tasks.list.filters.todos', 'Todos') }, ...list];
    }
    return list;
  }, [clients, allowAll]);

  const placeholder = allowAll ? t('tasks.list.filters.todos', 'Todos') : t('tasks.form.selectors.clients.placeholder', '-- Seleccione un cliente --');
  const effectiveValue = allowAll && value === null ? ALL_ID : value;

  const handleValueChanged = (e: { value?: number | null }) => {
    const v = e.value ?? null;
    onChange(allowAll && v === ALL_ID ? null : v);
  };

  const selectEl = (
    <SelectBox
      dataSource={items}
      value={effectiveValue ?? null}
      placeholder={placeholder}
      onValueChanged={handleValueChanged}
      displayExpr="text"
      valueExpr="id"
      disabled={disabled || loading}
      elementAttr={{ 'data-testid': 'task.form.clientSelect' }}
      inputAttr={{
        'aria-label': t('tasks.form.fields.cliente.ariaLabel', 'Seleccionar cliente'),
        'aria-invalid': !!error,
        'aria-required': !allowAll,
      }}
    />
  );

  if (!showLabel) {
    return (
      <div className="form-group">
        {selectEl}
        {loading && (
          <div className="field-loading" data-testid="task.form.clientSelect.loading">
            {t('tasks.form.selectors.clients.loading', 'Cargando clientes...')}
          </div>
        )}
        {(error || errorMessage) && (
          <span id="cliente-error" className="field-error" role="alert" data-testid="task.form.clientSelect.error">
            {error || errorMessage}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="form-group">
      <label htmlFor="cliente-select" className="form-label">
        {t('tasks.form.fields.cliente.label', 'Cliente')} {!allowAll && <span className="required">*</span>}
      </label>
      {selectEl}
      {loading && (
        <div className="field-loading" data-testid="task.form.clientSelect.loading">
          {t('tasks.form.selectors.clients.loading', 'Cargando clientes...')}
        </div>
      )}
      {(error || errorMessage) && (
        <span id="cliente-error" className="field-error" role="alert" data-testid="task.form.clientSelect.error">
          {error || errorMessage}
        </span>
      )}
    </div>
  );
}
