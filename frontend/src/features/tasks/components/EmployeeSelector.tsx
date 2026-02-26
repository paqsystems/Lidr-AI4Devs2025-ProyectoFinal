/**
 * Component: EmployeeSelector
 *
 * Selector de empleados (solo visible para supervisores).
 * Usa SelectBox de DevExtreme.
 *
 * @see TR-028(MH)-carga-de-tarea-diaria.md
 * @see TR-057(SH)-migración-de-controles-a-devextreme.md
 */

import React, { useEffect, useState, useMemo } from 'react';
import SelectBox from 'devextreme-react/select-box';
import { getEmployees, Employee } from '../services/task.service';
import { getUserData } from '../../../shared/utils/tokenStorage';
import { t } from '../../../shared/i18n';
import './TaskForm.css';

export interface EmployeeSelectorProps {
  value: number | null;
  onChange: (empleadoId: number | null) => void;
  error?: string;
  disabled?: boolean;
  showLabel?: boolean;
  allowAll?: boolean;
}

export function EmployeeSelector({ value, onChange, error, disabled, showLabel = true, allowAll = false }: EmployeeSelectorProps): React.ReactElement {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSupervisor, setIsSupervisor] = useState(false);

  useEffect(() => {
    checkSupervisorAndLoadEmployees();
  }, []);

  const checkSupervisorAndLoadEmployees = async () => {
    const userData = getUserData();
    const esSupervisor = userData?.esSupervisor || false;
    setIsSupervisor(esSupervisor);
    if (esSupervisor) {
      await loadEmployees();
    } else {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    setLoading(true);
    setErrorMessage('');
    const result = await getEmployees();
    if (result.success && result.data) {
      setEmployees(result.data);
    } else {
      setErrorMessage(result.errorMessage || t('tasks.form.selectors.employees.error', 'Error al cargar empleados'));
    }
    setLoading(false);
  };

  const items = useMemo(() => {
    return employees.map((e) => ({ id: e.id, text: `${e.nombre} (${e.code})` }));
  }, [employees]);

  const placeholder = allowAll ? t('tasks.list.filters.todos', 'Todos') : t('tasks.form.selectors.employees.placeholder.current', '-- Usuario actual --');

  const handleValueChanged = (e: { value?: number | null }) => {
    onChange(e.value ?? null);
  };

  if (!isSupervisor) {
    return <></>;
  }

  const selectEl = (
    <SelectBox
      dataSource={items}
      value={value ?? null}
      placeholder={placeholder}
      onValueChanged={handleValueChanged}
      displayExpr="text"
      valueExpr="id"
      disabled={disabled || loading}
      elementAttr={{ 'data-testid': 'task.form.employeeSelect' }}
      inputAttr={{
        'aria-label': t('tasks.form.fields.empleado.ariaLabel', 'Seleccionar empleado'),
        'aria-invalid': !!error,
      }}
    />
  );

  if (!showLabel) {
    return (
      <div className="form-group">
        {selectEl}
        {loading && (
          <div className="field-loading" data-testid="task.form.employeeSelect.loading">
            {t('tasks.form.selectors.employees.loading', 'Cargando empleados...')}
          </div>
        )}
        {(error || errorMessage) && (
          <span id="empleado-error" className="field-error" role="alert" data-testid="task.form.employeeSelect.error">
            {error || errorMessage}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="form-group">
      <label htmlFor="empleado-select" className="form-label">
        {t('tasks.form.fields.empleado.label', 'Empleado')}
      </label>
      {selectEl}
      {loading && (
        <div className="field-loading" data-testid="task.form.employeeSelect.loading">
          {t('tasks.form.selectors.employees.loading', 'Cargando empleados...')}
        </div>
      )}
      {(error || errorMessage) && (
        <span id="empleado-error" className="field-error" role="alert" data-testid="task.form.employeeSelect.error">
          {error || errorMessage}
        </span>
      )}
    </div>
  );
}
