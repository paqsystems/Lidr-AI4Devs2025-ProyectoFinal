/**
 * Component: DeleteTaskModal
 *
 * Modal de confirmación para eliminar una tarea. Usa Button de DevExtreme.
 *
 * @see TR-030, TR-032
 * @see TR-057(SH)-migración-de-controles-a-devextreme.md
 */

import React from 'react';
import Button from 'devextreme-react/button';
import { TaskListItem } from '../services/task.service';
import { t } from '../../../shared/i18n';
import './DeleteTaskModal.css';

export interface DeleteTaskModalProps {
  task: TaskListItem | null;
  loading?: boolean;
  errorMessage?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteTaskModal({
  task,
  loading = false,
  errorMessage = '',
  onConfirm,
  onCancel,
}: DeleteTaskModalProps): React.ReactElement | null {
  if (!task) return null;

  return (
    <div
      className="delete-task-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-task-modal-title"
      aria-describedby="delete-task-modal-desc"
      data-testid="task.delete.modal"
    >
      <div className="delete-task-modal-content">
        <h2 id="delete-task-modal-title" className="delete-task-modal-title">
          {t('tasks.delete.modal.title', 'Eliminar tarea')}
        </h2>
        <p id="delete-task-modal-desc" className="delete-task-modal-desc">
          {t('tasks.delete.modal.confirmQuestion', '¿Está seguro de que desea eliminar esta tarea?')}
        </p>
        <dl className="delete-task-modal-info">
          <div className="delete-task-modal-info-row">
            <dt>{t('tasks.list.col.fecha', 'Fecha')}</dt>
            <dd>{task.fecha}</dd>
          </div>
          <div className="delete-task-modal-info-row">
            <dt>{t('tasks.list.col.cliente', 'Cliente')}</dt>
            <dd>{task.cliente.nombre}</dd>
          </div>
          <div className="delete-task-modal-info-row">
            <dt>{t('tasks.list.col.tipoTarea', 'Tipo tarea')}</dt>
            <dd>{task.tipo_tarea.nombre}</dd>
          </div>
          <div className="delete-task-modal-info-row">
            <dt>{t('tasks.list.col.duracion', 'Duración')}</dt>
            <dd>{task.duracion_horas}</dd>
          </div>
          {task.empleado && (
            <div className="delete-task-modal-info-row" data-testid="task.delete.employee">
              <dt>{t('tasks.form.fields.empleado.label', 'Empleado')}</dt>
              <dd>{task.empleado.nombre} ({task.empleado.code})</dd>
            </div>
          )}
        </dl>
        {errorMessage && (
          <div className="delete-task-modal-error" role="alert" data-testid="task.delete.error">
            {errorMessage}
          </div>
        )}
        <div className="delete-task-modal-actions">
          <Button
            text={t('tasks.delete.cancel', 'Cancelar')}
            type="normal"
            onClick={onCancel}
            disabled={loading}
            elementAttr={{ 'data-testid': 'task.delete.cancel', 'aria-label': t('tasks.delete.cancelLabel', 'Cancelar eliminación') }}
          />
          <Button
            text={loading ? t('tasks.delete.deleting', 'Eliminando...') : t('tasks.delete.confirm', 'Eliminar')}
            type="danger"
            onClick={onConfirm}
            disabled={loading}
            elementAttr={{ 'data-testid': 'task.delete.confirm', 'aria-label': t('tasks.delete.confirmLabel', 'Confirmar eliminación') }}
          />
        </div>
      </div>
    </div>
  );
}

export default DeleteTaskModal;
