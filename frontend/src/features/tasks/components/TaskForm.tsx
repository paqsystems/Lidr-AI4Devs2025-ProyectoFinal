/**
 * Component: TaskForm
 *
 * Formulario completo de carga o edición de tarea diaria.
 * Modo creación (sin taskId) o edición (taskId) – TR-029.
 *
 * @see TR-028(MH)-carga-de-tarea-diaria.md
 * @see TR-029(MH)-edición-de-tarea-propia.md
 */

import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DateBox from 'devextreme-react/date-box';
import TextBox from 'devextreme-react/text-box';
import TextArea from 'devextreme-react/text-area';
import CheckBox from 'devextreme-react/check-box';
import Button from 'devextreme-react/button';
import { createTask, getTask, updateTask, CreateTaskData, UpdateTaskData } from '../services/task.service';
import { getTodayYMD, isFutureDate, formatDateDMY, parseDMYtoYMD } from '../../../shared/utils/dateUtils';
import { minutesToTime, timeToMinutes } from '../../../shared/utils/durationUtils';
import { getUserData } from '../../../shared/utils/tokenStorage';
import { t } from '../../../shared/i18n';
import { ClientSelector } from './ClientSelector';
import { TaskTypeSelector } from './TaskTypeSelector';
import { EmployeeSelector } from './EmployeeSelector';
import './TaskForm.css';

type FormState = 'initial' | 'loading' | 'error' | 'success';
type LoadState = 'idle' | 'loading' | 'loaded' | 'error';

interface ValidationErrors {
  fecha?: string;
  cliente_id?: string;
  tipo_tarea_id?: string;
  duracion_minutos?: string;
  observacion?: string;
  usuario_id?: string;
}

interface TaskFormProps {
  /** Si se proporciona, modo edición: carga tarea y actualiza en submit */
  taskId?: number;
}

export function TaskForm({ taskId }: TaskFormProps): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = taskId != null && taskId > 0;

  // Estados del formulario
  const [fechaYMD, setFechaYMD] = useState<string>(getTodayYMD()); // Formato YMD interno
  const [fechaDisplay, setFechaDisplay] = useState<string>(formatDateDMY(getTodayYMD())); // Formato DMY para mostrar
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [tipoTareaId, setTipoTareaId] = useState<number | null>(null);
  const [duracionTime, setDuracionTime] = useState<string>(''); // Formato hh:mm para mostrar
  const [duracionMinutos, setDuracionMinutos] = useState<number | null>(null); // Minutos para enviar al API
  const [sinCargo, setSinCargo] = useState<boolean>(false);
  const [presencial, setPresencial] = useState<boolean>(false);
  const [observacion, setObservacion] = useState<string>('');
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  
  const [formState, setFormState] = useState<FormState>('initial');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [dateWarning, setDateWarning] = useState<string>('');
  const [loadState, setLoadState] = useState<LoadState>(isEditMode ? 'loading' : 'loaded');
  const [usuarioNombre, setUsuarioNombre] = useState<string>('');
  const isSupervisor = (getUserData()?.esSupervisor ?? false) && isEditMode;

  // Cargar tarea en modo edición
  useEffect(() => {
    if (!isEditMode || !taskId) return;
    let cancelled = false;
    setLoadState('loading');
    setErrorMessage('');
    getTask(taskId).then((result) => {
      if (cancelled) return;
      if (result.success && result.task) {
        const task = result.task;
        setFechaYMD(task.fecha);
        setFechaDisplay(formatDateDMY(task.fecha));
        setClienteId(task.cliente_id);
        setTipoTareaId(task.tipo_tarea_id);
        setDuracionTime(minutesToTime(task.duracion_minutos));
        setDuracionMinutos(task.duracion_minutos);
        setSinCargo(task.sin_cargo);
        setPresencial(task.presencial);
        setObservacion(task.observacion);
        setUsuarioNombre(task.usuario_nombre ?? '');
        setUsuarioId(task.usuario_id ?? null);
        setLoadState('loaded');
      } else {
        setLoadState('error');
        setErrorMessage(result.errorMessage ?? t('tasks.form.errors.loadFailed', 'Error al cargar la tarea'));
      }
    });
    return () => { cancelled = true; };
  }, [taskId, isEditMode]);

  // Resetear tipo de tarea cuando cambia el cliente
  const handleClienteChange = (newClienteId: number | null) => {
    setClienteId(newClienteId);
    setTipoTareaId(null); // Resetear tipo de tarea
  };

  const handleFechaChange = (e: { value?: Date | null }) => {
    const d = e.value ?? null;
    if (!d) {
      setFechaYMD('');
      setFechaDisplay('');
      setDateWarning('');
      return;
    }
    const ymd = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    setFechaYMD(ymd);
    setFechaDisplay(formatDateDMY(ymd));
    setDateWarning(isFutureDate(ymd) ? t('tasks.form.dateWarning.future', 'Advertencia: La fecha seleccionada es futura.') : '');
  };

  const fechaAsDate = fechaYMD ? new Date(fechaYMD + 'T12:00:00') : null;

  // Validar formulario
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    if (!fechaYMD) {
      errors.fecha = t('tasks.form.validation.fecha.required', 'La fecha es obligatoria');
    } else {
      // Validar que el formato DMY es válido
      const parsedYMD = parseDMYtoYMD(fechaDisplay);
      if (!parsedYMD) {
        errors.fecha = t('tasks.form.validation.fecha.format', 'La fecha debe tener formato DD/MM/YYYY');
      }
    }
    
    if (!clienteId) {
      errors.cliente_id = t('tasks.form.validation.cliente.required', 'El cliente es obligatorio');
    }
    
    if (!tipoTareaId) {
      errors.tipo_tarea_id = t('tasks.form.validation.tipoTarea.required', 'El tipo de tarea es obligatorio');
    }
    
    if (duracionMinutos === null || duracionMinutos <= 0) {
      errors.duracion_minutos = t('tasks.form.validation.duracion.required', 'La duración es obligatoria y debe ser mayor a cero');
    } else if (duracionMinutos % 15 !== 0) {
      errors.duracion_minutos = t('tasks.form.validation.duracion.multiple15', 'La duración debe ser múltiplo de 15 minutos');
    } else if (duracionMinutos > 1440) {
      errors.duracion_minutos = t('tasks.form.validation.duracion.max', 'La duración no puede exceder 1440 minutos (24 horas)');
    } else {
      // Validar que el formato hh:mm es válido
      const parsedMinutes = timeToMinutes(duracionTime);
      if (parsedMinutes === null && duracionTime !== '') {
        errors.duracion_minutos = t('tasks.form.validation.duracion.format', 'La duración debe tener formato hh:mm (ej: 02:30)');
      }
    }
    
    if (!observacion.trim()) {
      errors.observacion = t('tasks.form.validation.observacion.required', 'La observación es obligatoria');
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejar envío del formulario (crear o actualizar)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage('');
    setValidationErrors({});

    if (!validateForm()) {
      setFormState('error');
      return;
    }

    setFormState('loading');

    try {
      if (isEditMode && taskId) {
        const payload: UpdateTaskData = {
          fecha: fechaYMD,
          cliente_id: clienteId!,
          tipo_tarea_id: tipoTareaId!,
          duracion_minutos: duracionMinutos!,
          sin_cargo: sinCargo,
          presencial: presencial,
          observacion: observacion.trim(),
        };
        if (isSupervisor && usuarioId != null) {
          payload.usuario_id = usuarioId;
        }
        const result = await updateTask(taskId, payload);
        if (result.success) {
          setFormState('success');
          const returnPath = (location.state as { returnPath?: string } | null)?.returnPath || '/tareas';
          setTimeout(() => navigate(returnPath, { state: location.state }), 1500);
        } else {
          setFormState('error');
          setErrorMessage(result.errorMessage ?? t('tasks.form.errors.updateFailed', 'Error al actualizar la tarea'));
          if (result.validationErrors) {
            const serverErrors: ValidationErrors = {};
            Object.keys(result.validationErrors).forEach((key) => {
              const fieldKey = key as keyof ValidationErrors;
              serverErrors[fieldKey] = result.validationErrors![key][0];
            });
            setValidationErrors(serverErrors);
          }
        }
      } else {
        const taskData: CreateTaskData = {
          fecha: fechaYMD,
          cliente_id: clienteId!,
          tipo_tarea_id: tipoTareaId!,
          duracion_minutos: duracionMinutos!,
          sin_cargo: sinCargo,
          presencial: presencial,
          observacion: observacion.trim(),
          usuario_id: usuarioId || undefined,
        };
        const result = await createTask(taskData);
        if (result.success) {
          setFormState('success');
          setTimeout(() => {
            const todayYMD = getTodayYMD();
            setFechaYMD(todayYMD);
            setFechaDisplay(formatDateDMY(todayYMD));
            setClienteId(null);
            setTipoTareaId(null);
            setDuracionTime('');
            setDuracionMinutos(null);
            setSinCargo(false);
            setPresencial(false);
            setObservacion('');
            setUsuarioId(null);
            setFormState('initial');
            setDateWarning('');
          }, 2000);
        } else {
          setFormState('error');
          setErrorMessage(result.errorMessage ?? t('tasks.form.errors.createFailed', 'Error al crear la tarea'));
          if (result.validationErrors) {
            const serverErrors: ValidationErrors = {};
            Object.keys(result.validationErrors).forEach((key) => {
              const fieldKey = key as keyof ValidationErrors;
              serverErrors[fieldKey] = result.validationErrors![key][0];
            });
            setValidationErrors(serverErrors);
          }
        }
      }
    } catch {
      setFormState('error');
      setErrorMessage(t('tasks.form.errors.connection', 'Error de conexión. Intente nuevamente.'));
    }
  };

  const isLoading = formState === 'loading';
  const isLoadingTask = loadState === 'loading';
  const loadError = loadState === 'error';

  if (isEditMode && loadState === 'loading') {
    return (
      <div className="task-form-container" data-testid="task.form.container" lang="es">
        <p data-testid="task.edit.loading">{t('tasks.form.loading', 'Cargando tarea...')}</p>
      </div>
    );
  }

  if (isEditMode && loadError) {
    return (
      <div className="task-form-container" data-testid="task.form.container" lang="es">
        <div className="task-form-error" data-testid="task.edit.errorMessage" role="alert">
          {errorMessage}
        </div>
        <Button
          text={t('tasks.form.actions.backToList', 'Volver a la lista')}
          type="normal"
          onClick={() => navigate((location.state as { returnPath?: string } | null)?.returnPath || '/tareas', { state: location.state })}
        />
      </div>
    );
  }

  return (
    <div className="task-form-container" data-testid="task.form.container" lang="es">
      <h1 className="task-form-title">
        {isEditMode ? t('tasks.form.titleEdit', 'Editar Tarea') : t('tasks.form.title', 'Cargar Tarea Diaria')}
      </h1>

      {isEditMode && isSupervisor && (
        <div className="form-group" data-testid="task.edit.employeeSelector">
          <EmployeeSelector
            value={usuarioId}
            onChange={setUsuarioId}
            error={validationErrors.usuario_id}
            disabled={isLoading || isLoadingTask}
            showLabel={true}
            allowAll={false}
          />
        </div>
      )}
      {isEditMode && !isSupervisor && usuarioNombre && (
        <div className="form-group" data-testid="task.edit.usuarioId">
          <label className="form-label">{t('tasks.form.fields.empleado.label', 'Empleado')}</label>
          <TextBox
            value={usuarioNombre}
            readOnly
            disabled
            inputAttr={{ 'aria-label': t('tasks.form.fields.empleado.ariaLabel', 'Empleado (solo lectura)') }}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="task-form" aria-busy={isLoading} lang="es" noValidate data-testid={isEditMode ? 'task.edit.form' : 'task.form'}>
        {/* Mensaje de éxito */}
        {formState === 'success' && (
          <div
            className="task-form-success"
            data-testid="task.form.successMessage"
            role="alert"
            aria-live="polite"
          >
            {isEditMode
              ? t('tasks.form.success.updated', '✓ Tarea actualizada correctamente')
              : t('tasks.form.success.message', '✓ Tarea registrada correctamente')}
          </div>
        )}
        
        {/* Mensaje de error general */}
        {formState === 'error' && errorMessage && (
          <div 
            className="task-form-error"
            data-testid="task.form.errorMessage"
            role="alert"
            aria-live="polite"
          >
            {errorMessage}
          </div>
        )}
        
        {/* Campo de fecha */}
        <div className="form-group">
          <label htmlFor="fecha" className="form-label">
            {t('tasks.form.fields.fecha.label', 'Fecha')} <span className="required">*</span>
          </label>
          <DateBox
            value={fechaAsDate}
            onValueChanged={handleFechaChange}
            type="date"
            displayFormat="dd/MM/yyyy"
            disabled={isLoading}
            elementAttr={{ 'data-testid': 'task.form.dateInput' }}
            inputAttr={{
              id: 'fecha',
              'aria-label': t('tasks.form.fields.fecha.ariaLabel', 'Fecha de la tarea (formato DD/MM/YYYY)'),
              'aria-invalid': !!validationErrors.fecha,
              'aria-required': 'true',
            }}
          />
          {dateWarning && (
            <div 
              id="fecha-warning"
              className="field-warning"
              data-testid="task.form.dateWarning"
              role="alert"
            >
              {dateWarning}
            </div>
          )}
          {validationErrors.fecha && (
            <span id="fecha-error" className="field-error" role="alert">
              {validationErrors.fecha}
            </span>
          )}
        </div>
        
        {/* Selector de cliente */}
        <ClientSelector
          value={clienteId}
          onChange={handleClienteChange}
          error={validationErrors.cliente_id}
          disabled={isLoading}
        />
        
        {/* Selector de tipo de tarea */}
        <TaskTypeSelector
          clienteId={clienteId}
          value={tipoTareaId}
          onChange={setTipoTareaId}
          error={validationErrors.tipo_tarea_id}
          disabled={isLoading}
        />
        
        {/* Campo de duración */}
        <div className="form-group">
          <label htmlFor="duracion" className="form-label">
            {t('tasks.form.fields.duracion.label', 'Duración')} <span className="required">*</span>
          </label>
          <TextBox
            value={duracionTime}
            onValueChanged={(e) => {
              let newTime = (e.value ?? '').replace(/[^\d:]/g, '');
              if (newTime.length === 2 && !newTime.includes(':')) newTime += ':';
              if (newTime.length > 5) newTime = newTime.substring(0, 5);
              setDuracionTime(newTime);
              if (newTime.length === 5) {
                const min = timeToMinutes(newTime);
                setDuracionMinutos(min ?? null);
              } else if (newTime === '') setDuracionMinutos(null);
            }}
            disabled={isLoading}
            placeholder={t('tasks.form.fields.duracion.placeholder', 'hh:mm (ej: 02:30)')}
            maxLength={5}
            elementAttr={{ 'data-testid': 'task.form.durationInput' }}
            inputAttr={{
              id: 'duracion',
              'aria-label': t('tasks.form.fields.duracion.ariaLabel', 'Duración en formato hh:mm (ej: 02:30)'),
              'aria-invalid': !!validationErrors.duracion_minutos,
              'aria-required': 'true',
            }}
          />
          {validationErrors.duracion_minutos && (
            <span id="duracion-error" className="field-error" role="alert">
              {validationErrors.duracion_minutos}
            </span>
          )}
          <div id="duracion-helper" className="field-helper">
            {t('tasks.form.fields.duracion.helper', 'Duración en formato hh:mm (ej: 02:30 = 2 horas 30 minutos). Múltiplos de 15 minutos (máximo 24:00 = 1440 minutos)')}
          </div>
        </div>
        
        {/* Checkbox Sin cargo */}
        <div className="form-group" data-testid="task.form.sinCargoCheckbox">
          <CheckBox
            value={sinCargo}
            onValueChanged={(e) => setSinCargo(e.value ?? false)}
            disabled={isLoading}
            text={t('tasks.form.fields.sinCargo.label', 'Sin cargo')}
          />
        </div>

        {/* Checkbox Presencial */}
        <div className="form-group" data-testid="task.form.presencialCheckbox">
          <CheckBox
            value={presencial}
            onValueChanged={(e) => setPresencial(e.value ?? false)}
            disabled={isLoading}
            text={t('tasks.form.fields.presencial.label', 'Presencial')}
          />
        </div>
        
        {/* Campo de observación */}
        <div className="form-group">
          <label htmlFor="observacion" className="form-label">
            {t('tasks.form.fields.observacion.label', 'Observación / Descripción')} <span className="required">*</span>
          </label>
          <TextArea
            value={observacion}
            onValueChanged={(e) => setObservacion(e.value ?? '')}
            disabled={isLoading}
            height={100}
            elementAttr={{ 'data-testid': 'task.form.observacionTextarea' }}
            inputAttr={{
              id: 'observacion',
              'aria-label': t('tasks.form.fields.observacion.ariaLabel', 'Observación o descripción de la tarea'),
              'aria-invalid': !!validationErrors.observacion,
              'aria-required': 'true',
            }}
            placeholder={t('tasks.form.fields.observacion.placeholder', 'Describa la tarea realizada...')}
          />
          {validationErrors.observacion && (
            <span id="observacion-error" className="field-error" role="alert">
              {validationErrors.observacion}
            </span>
          )}
        </div>
        
        {/* Selector de empleado solo en modo creación (no editable en edición) */}
        {!isEditMode && (
          <EmployeeSelector
            value={usuarioId}
            onChange={setUsuarioId}
            error={validationErrors.usuario_id}
            disabled={isLoading}
          />
        )}
        
        {/* Botones de acción */}
        <div className="form-actions">
          <Button
            text={t('tasks.form.actions.cancel', 'Cancelar')}
            type="normal"
            elementAttr={{ 'data-testid': 'task.form.cancelButton' }}
            disabled={isLoading}
            onClick={() => navigate(isEditMode ? ((location.state as { returnPath?: string } | null)?.returnPath || '/tareas') : '/', { ...(isEditMode && { state: location.state }) })}
          />
          <Button
            text={isLoading ? t('tasks.form.actions.saving', 'Guardando...') : t('tasks.form.actions.save', 'Guardar')}
            type="default"
            useSubmitBehavior
            elementAttr={{ 'data-testid': 'task.form.submitButton' }}
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
