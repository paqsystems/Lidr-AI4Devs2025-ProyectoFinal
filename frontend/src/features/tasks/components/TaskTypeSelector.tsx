/**
 * Component: TaskTypeSelector
 * 
 * Selector de tipos de tarea con carga dinámica según cliente seleccionado.
 * 
 * @see TR-028(MH)-carga-de-tarea-diaria.md
 */

import React, { useEffect, useState } from 'react';
import { getTaskTypes, TaskType } from '../services/task.service';
import { t } from '../../../shared/i18n';
import './TaskForm.css';

export interface TaskTypeSelectorProps {
  clienteId: number | null;
  value: number | null;
  onChange: (tipoTareaId: number | null) => void;
  error?: string;
  disabled?: boolean;
}

export function TaskTypeSelector({ 
  clienteId, 
  value, 
  onChange, 
  error, 
  disabled 
}: TaskTypeSelectorProps): React.ReactElement {
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (clienteId) {
      loadTaskTypes(clienteId);
    } else {
      // Si no hay cliente seleccionado, resetear tipos
      setTaskTypes([]);
      onChange(null);
    }
  }, [clienteId]);

  const loadTaskTypes = async (clienteIdValue: number) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tipoTareaId = e.target.value ? parseInt(e.target.value, 10) : null;
    onChange(tipoTareaId);
  };

  return (
    <div className="form-group">
      <label htmlFor="tipo-tarea-select" className="form-label">
        {t('tasks.form.fields.tipoTarea.label', 'Tipo de Tarea')} <span className="required">*</span>
      </label>
      <select
        id="tipo-tarea-select"
        data-testid="task.form.taskTypeSelect"
        value={value || ''}
        onChange={handleChange}
        disabled={disabled || loading || !clienteId}
        className={`form-input form-select ${error ? 'input-error' : ''}`}
        aria-label={t('tasks.form.fields.tipoTarea.ariaLabel', 'Seleccionar tipo de tarea')}
        aria-invalid={!!error}
        aria-describedby={error ? 'tipo-tarea-error' : undefined}
        aria-required="true"
      >
        <option value="">
          {!clienteId 
            ? t('tasks.form.selectors.taskTypes.placeholder.noClient', '-- Seleccione un cliente primero --')
            : t('tasks.form.selectors.taskTypes.placeholder.select', '-- Seleccione un tipo de tarea --')}
        </option>
        {taskTypes.map((tipo) => (
          <option key={tipo.id} value={tipo.id}>
            {tipo.descripcion} {tipo.is_generico ? t('tasks.form.selectors.taskTypes.generic', '(Genérico)') : ''}
          </option>
        ))}
      </select>
      {loading && (
        <div className="field-loading" data-testid="task.form.taskTypeSelect.loading">
          {t('tasks.form.selectors.taskTypes.loading', 'Cargando tipos de tarea...')}
        </div>
      )}
      {(error || errorMessage) && (
        <span 
          id="tipo-tarea-error" 
          className="field-error" 
          role="alert"
          data-testid="task.form.taskTypeSelect.error"
        >
          {error || errorMessage}
        </span>
      )}
    </div>
  );
}
