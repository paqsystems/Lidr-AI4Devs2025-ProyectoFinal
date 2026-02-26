/**
 * Component: TaskFilters
 *
 * Filtros para la lista de tareas. Usa controles DevExtreme.
 *
 * @see TR-033(MH)-visualización-de-lista-de-tareas-propias.md
 * @see TR-057(SH)-migración-de-controles-a-devextreme.md
 */

import React from 'react';
import DateBox from 'devextreme-react/date-box';
import TextBox from 'devextreme-react/text-box';
import SelectBox from 'devextreme-react/select-box';
import Button from 'devextreme-react/button';
import { ClientSelector } from './ClientSelector';
import { TaskTypeSelector } from './TaskTypeSelector';
import { EmployeeSelector } from './EmployeeSelector';
import { getUserData } from '../../../shared/utils/tokenStorage';
import { t } from '../../../shared/i18n';
import './TaskList.css';

export interface TaskFiltersValues {
  fechaDesde: string;
  fechaHasta: string;
  clienteId: number | null;
  tipoTareaId: number | null;
  empleadoId: number | null;
  busqueda: string;
  orden: 'asc' | 'desc';
}

export interface TaskFiltersProps {
  values: TaskFiltersValues;
  onChange: (values: TaskFiltersValues) => void;
  onApply: () => void;
  disabled?: boolean;
}

const ORDEN_OPTIONS = [
  { value: 'desc', text: 'Más reciente primero' },
  { value: 'asc', text: 'Más antigua primero' },
];

export function TaskFilters({
  values,
  onChange,
  onApply,
  disabled = false,
}: TaskFiltersProps): React.ReactElement {
  const userData = getUserData();
  const isSupervisor = userData?.esSupervisor ?? false;

  return (
    <div className="task-list-filters" data-testid="task.list.filters" role="search">
      <div className="task-list-filters-row">
        <label className="task-list-filter-label">
          {t('tasks.list.filters.fechaDesde', 'Fecha desde')}
          <DateBox
            type="date"
            value={values.fechaDesde ? new Date(values.fechaDesde + 'T12:00:00') : null}
            onValueChanged={(e) => {
              const d = e.value ?? null;
              onChange({ ...values, fechaDesde: d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : '' });
            }}
            disabled={disabled}
            elementAttr={{ 'aria-label': t('tasks.list.filters.fechaDesde', 'Fecha desde') }}
          />
        </label>
        <label className="task-list-filter-label">
          {t('tasks.list.filters.fechaHasta', 'Fecha hasta')}
          <DateBox
            type="date"
            value={values.fechaHasta ? new Date(values.fechaHasta + 'T12:00:00') : null}
            onValueChanged={(e) => {
              const d = e.value ?? null;
              onChange({ ...values, fechaHasta: d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : '' });
            }}
            disabled={disabled}
            elementAttr={{ 'aria-label': t('tasks.list.filters.fechaHasta', 'Fecha hasta') }}
          />
        </label>
        <div className="task-list-filter-label task-list-filter-cliente">
          <span className="task-list-filter-label-text">{t('tasks.list.filters.cliente', 'Cliente')}</span>
          <ClientSelector
            value={values.clienteId}
            onChange={(clienteId) => onChange({ ...values, clienteId })}
            disabled={disabled}
            showLabel={false}
            allowAll={true}
          />
        </div>
        <div className="task-list-filter-label task-list-filter-tipo">
          <span className="task-list-filter-label-text">{t('tasks.list.filters.tipoTarea', 'Tipo de tarea')}</span>
          <TaskTypeSelector
            value={values.tipoTareaId}
            onChange={(tipoTareaId) => onChange({ ...values, tipoTareaId })}
            clienteId={values.clienteId}
            disabled={disabled}
            showLabel={false}
            allowAll={true}
          />
        </div>
        {isSupervisor && (
          <div className="task-list-filter-label task-list-filter-empleado">
            <span className="task-list-filter-label-text">{t('tasks.list.filters.empleado', 'Empleado')}</span>
            <EmployeeSelector
              value={values.empleadoId}
              onChange={(empleadoId) => onChange({ ...values, empleadoId })}
              disabled={disabled}
              showLabel={false}
              allowAll={true}
            />
          </div>
        )}
      </div>
      <div className="task-list-filters-row">
        <label className="task-list-filter-label task-list-filter-busqueda">
          {t('tasks.list.filters.busqueda', 'Buscar en observación')}
          <TextBox
            value={values.busqueda}
            onValueChanged={(e) => onChange({ ...values, busqueda: e.value ?? '' })}
            placeholder={t('tasks.list.filters.busquedaPlaceholder', 'Texto...')}
            disabled={disabled}
            elementAttr={{ 'aria-label': t('tasks.list.filters.busqueda', 'Buscar en observación') }}
          />
        </label>
        <label className="task-list-filter-label">
          {t('tasks.list.filters.orden', 'Ordenar fecha')}
          <SelectBox
            dataSource={ORDEN_OPTIONS}
            value={values.orden}
            onValueChanged={(e) => onChange({ ...values, orden: (e.value ?? 'desc') as 'asc' | 'desc' })}
            displayExpr="text"
            valueExpr="value"
            disabled={disabled}
            elementAttr={{ 'aria-label': t('tasks.list.filters.orden', 'Ordenar fecha') }}
          />
        </label>
        <Button
          text={t('tasks.list.filters.aplicar', 'Aplicar')}
          type="default"
          onClick={onApply}
          disabled={disabled}
          elementAttr={{ 'data-testid': 'task.list.filters.apply' }}
        />
      </div>
    </div>
  );
}
