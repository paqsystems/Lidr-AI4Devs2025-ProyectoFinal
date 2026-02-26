/**
 * Component: TaskTypeSelector
 *
 * Selector de tipos de tarea con carga dinámica según cliente seleccionado.
 * Usa SelectBox de DevExtreme.
 *
 * @see TR-028(MH)-carga-de-tarea-diaria.md
 * @see TR-057(SH)-migración-de-controles-a-devextreme.md
 */

import React, { useEffect, useState, useMemo } from 'react';
import SelectBox from 'devextreme-react/select-box';
import { getTaskTypes, TaskType } from '../services/task.service';
import { t } from '../../../shared/i18n';
import './TaskForm.css';

export interface TaskTypeSelectorProps {
  clienteId: number | null;
  value: number | null;
  onChange: (tipoTareaId: number | null) => void;
  error?: string;
  disabled?: boolean;
  showLabel?: boolean;
  allowAll?: boolean;
}

export function TaskTypeSelector({
  clienteId,
  value,
  onChange,
  error,
  disabled,
  showLabel = true,
  allowAll = false,
}: TaskTypeSelectorProps): React.ReactElement {
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (allowAll && (clienteId === null || clienteId === undefined)) {
      loadTaskTypes(undefined);
    } else if (clienteId) {
      loadTaskTypes(clienteId);
    } else {
      setTaskTypes([]);
      onChange(null);
    }
  }, [clienteId, allowAll]);

  const loadTaskTypes = async (clienteIdValue: number | undefined) => {
    setLoading(true);
    setErrorMessage('');
    const result = await getTaskTypes(clienteIdValue);
    if (result.success && result.data) {
      setTaskTypes(result.data);
    } else {
      setErrorMessage(result.errorMessage || t('tasks.form.selectors.taskTypes.error', 'Error al cargar tipos de tarea'));
      setTaskTypes([]);
    }
    setLoading(false);
  };

  const items = useMemo(() => {
    return taskTypes.map((tipo) => ({
      id: tipo.id,
      text: `${tipo.descripcion}${tipo.is_generico ? ` ${t('tasks.form.selectors.taskTypes.generic', '(Genérico)')}` : ''}`,
    }));
  }, [taskTypes]);

  const ALL_TIPO_ID = -1;
  const itemsWithAll = useMemo(() => {
    if (allowAll) {
      return [{ id: ALL_TIPO_ID, text: t('tasks.list.filters.todos', 'Todos') }, ...items];
    }
    return items;
  }, [items, allowAll]);

  const placeholder = allowAll
    ? t('tasks.list.filters.todos', 'Todos')
    : !clienteId
      ? t('tasks.form.selectors.taskTypes.placeholder.noClient', '-- Seleccione un cliente primero --')
      : t('tasks.form.selectors.taskTypes.placeholder.select', '-- Seleccione un tipo de tarea --');

  const effectiveValue = allowAll && value === null ? ALL_TIPO_ID : value;

  const handleValueChanged = (e: { value?: number | null }) => {
    const v = e.value ?? null;
    onChange(allowAll && v === ALL_TIPO_ID ? null : v);
  };

  const isDisabled = disabled || loading || (!allowAll && !clienteId);

  const selectEl = (
    <SelectBox
      dataSource={allowAll ? itemsWithAll : items}
      value={effectiveValue ?? null}
      placeholder={placeholder}
      onValueChanged={handleValueChanged}
      displayExpr="text"
      valueExpr="id"
      disabled={isDisabled}
      elementAttr={{ 'data-testid': 'task.form.taskTypeSelect' }}
      inputAttr={{
        'aria-label': t('tasks.form.fields.tipoTarea.ariaLabel', 'Seleccionar tipo de tarea'),
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
          <div className="field-loading" data-testid="task.form.taskTypeSelect.loading">
            {t('tasks.form.selectors.taskTypes.loading', 'Cargando tipos de tarea...')}
          </div>
        )}
        {(error || errorMessage) && (
          <span id="tipo-tarea-error" className="field-error" role="alert" data-testid="task.form.taskTypeSelect.error">
            {error || errorMessage}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="form-group">
      <label htmlFor="tipo-tarea-select" className="form-label">
        {t('tasks.form.fields.tipoTarea.label', 'Tipo de Tarea')} {!allowAll && <span className="required">*</span>}
      </label>
      {selectEl}
      {loading && (
        <div className="field-loading" data-testid="task.form.taskTypeSelect.loading">
          {t('tasks.form.selectors.taskTypes.loading', 'Cargando tipos de tarea...')}
        </div>
      )}
      {(error || errorMessage) && (
        <span id="tipo-tarea-error" className="field-error" role="alert" data-testid="task.form.taskTypeSelect.error">
          {error || errorMessage}
        </span>
      )}
    </div>
  );
}
