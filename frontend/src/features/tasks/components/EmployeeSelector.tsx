/**
 * Component: EmployeeSelector
 * 
 * Selector de empleados (solo visible para supervisores).
 * 
 * @see TR-028(MH)-carga-de-tarea-diaria.md
 */

import React, { useEffect, useState } from 'react';
import { getEmployees, Employee } from '../services/task.service';
import { getUserData } from '../../../shared/utils/tokenStorage';
import { t } from '../../../shared/i18n';
import './TaskForm.css';

export interface EmployeeSelectorProps {
  value: number | null;
  onChange: (empleadoId: number | null) => void;
  error?: string;
  disabled?: boolean;
}

export function EmployeeSelector({ value, onChange, error, disabled }: EmployeeSelectorProps): React.ReactElement {
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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const empleadoId = e.target.value ? parseInt(e.target.value, 10) : null;
    onChange(empleadoId);
  };

  // Solo mostrar si es supervisor
  if (!isSupervisor) {
    return <></>;
  }

  return (
    <div className="form-group">
      <label htmlFor="empleado-select" className="form-label">
        {t('tasks.form.fields.empleado.label', 'Empleado')}
      </label>
      <select
        id="empleado-select"
        data-testid="task.form.employeeSelect"
        value={value || ''}
        onChange={handleChange}
        disabled={disabled || loading}
        className={`form-input form-select ${error ? 'input-error' : ''}`}
        aria-label={t('tasks.form.fields.empleado.ariaLabel', 'Seleccionar empleado')}
        aria-invalid={!!error}
        aria-describedby={error ? 'empleado-error' : undefined}
      >
        <option value="">{t('tasks.form.selectors.employees.placeholder.current', '-- Usuario actual --')}</option>
        {employees.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employee.nombre} ({employee.code})
          </option>
        ))}
      </select>
      {loading && (
        <div className="field-loading" data-testid="task.form.employeeSelect.loading">
          {t('tasks.form.selectors.employees.loading', 'Cargando empleados...')}
        </div>
      )}
      {(error || errorMessage) && (
        <span 
          id="empleado-error" 
          className="field-error" 
          role="alert"
          data-testid="task.form.employeeSelect.error"
        >
          {error || errorMessage}
        </span>
      )}
    </div>
  );
}
