/**
 * Component: TaskForm
 * 
 * Formulario completo de carga de tarea diaria.
 * Incluye todos los campos requeridos, validaciones y manejo de estados.
 * 
 * Estados:
 * - initial: Formulario vacío, listo para input
 * - loading: Enviando datos al servidor
 * - error: Error de validación o servidor
 * - success: Tarea creada exitosamente
 * 
 * @see TR-028(MH)-carga-de-tarea-diaria.md
 */

import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTask, CreateTaskData } from '../services/task.service';
import { getTodayYMD, isFutureDate, formatDateDMY, parseDMYtoYMD } from '../../../shared/utils/dateUtils';
import { minutesToTime, timeToMinutes, formatMinutesForInput } from '../../../shared/utils/durationUtils';
import { t } from '../../../shared/i18n';
import { ClientSelector } from './ClientSelector';
import { TaskTypeSelector } from './TaskTypeSelector';
import { EmployeeSelector } from './EmployeeSelector';
import './TaskForm.css';

type FormState = 'initial' | 'loading' | 'error' | 'success';

interface ValidationErrors {
  fecha?: string;
  cliente_id?: string;
  tipo_tarea_id?: string;
  duracion_minutos?: string;
  observacion?: string;
  usuario_id?: string;
}

export function TaskForm(): React.ReactElement {
  const navigate = useNavigate();

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

  // Resetear tipo de tarea cuando cambia el cliente
  const handleClienteChange = (newClienteId: number | null) => {
    setClienteId(newClienteId);
    setTipoTareaId(null); // Resetear tipo de tarea
  };

  // Manejar cambio de fecha en formato DMY y convertir a YMD
  const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newFechaDisplay = e.target.value; // Formato DMY del input
    
    // Remover caracteres no numéricos excepto barras
    newFechaDisplay = newFechaDisplay.replace(/[^\d/]/g, '');
    
    // Auto-formatear agregando barras
    if (newFechaDisplay.length === 2 && !newFechaDisplay.includes('/')) {
      newFechaDisplay = newFechaDisplay + '/';
    } else if (newFechaDisplay.length === 5 && newFechaDisplay.split('/').length === 2) {
      newFechaDisplay = newFechaDisplay + '/';
    }
    
    // Limitar longitud
    if (newFechaDisplay.length > 10) {
      newFechaDisplay = newFechaDisplay.substring(0, 10);
    }
    
    // Actualizar display
    setFechaDisplay(newFechaDisplay);
    
    // Convertir DMY a YMD solo si tiene formato completo
    if (newFechaDisplay.length === 10) {
      const newFechaYMD = parseDMYtoYMD(newFechaDisplay);
      
      if (newFechaYMD) {
        setFechaYMD(newFechaYMD);
        // Validar si es futura (advertencia, no bloquea)
        if (isFutureDate(newFechaYMD)) {
          setDateWarning(t('tasks.form.dateWarning.future', 'Advertencia: La fecha seleccionada es futura.'));
        } else {
          setDateWarning('');
        }
      }
    } else if (newFechaDisplay === '') {
      // Si está vacío, limpiar ambos
      setFechaYMD('');
      setDateWarning('');
    }
    // Si el formato es inválido o incompleto, mantener el YMD anterior pero mostrar el display
  };

  // Manejar cambio de duración en formato hh:mm y convertir a minutos
  const handleDuracionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newTime = e.target.value; // Formato hh:mm del input
    
    // Remover caracteres no numéricos excepto dos puntos
    newTime = newTime.replace(/[^\d:]/g, '');
    
    // Auto-formatear agregando dos puntos después de 1-2 dígitos
    if (newTime.length === 2 && !newTime.includes(':')) {
      newTime = newTime + ':';
    }
    
    // Limitar longitud
    if (newTime.length > 5) {
      newTime = newTime.substring(0, 5);
    }
    
    // Actualizar display
    setDuracionTime(newTime);
    
    // Convertir hh:mm a minutos solo si tiene formato completo
    if (newTime.length === 5) {
      const minutos = timeToMinutes(newTime);
      
      if (minutos !== null) {
        setDuracionMinutos(minutos);
      }
    } else if (newTime === '') {
      // Si está vacío, limpiar ambos
      setDuracionMinutos(null);
    }
    // Si el formato es inválido o incompleto, mantener los minutos anteriores pero mostrar el display
  };

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

  // Manejar envío del formulario
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
        // Limpiar formulario después de guardar exitosamente
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
          // Opcional: redirigir a dashboard o lista de tareas
          // navigate('/');
        }, 2000);
      } else {
        setFormState('error');
        setErrorMessage(result.errorMessage || t('tasks.form.errors.createFailed', 'Error al crear la tarea'));
        
        // Si hay errores de validación del servidor, agregarlos
        if (result.validationErrors) {
          const serverErrors: ValidationErrors = {};
          Object.keys(result.validationErrors).forEach((key) => {
            const fieldKey = key as keyof ValidationErrors;
            serverErrors[fieldKey] = result.validationErrors![key][0];
          });
          setValidationErrors(serverErrors);
        }
      }
    } catch {
      setFormState('error');
      setErrorMessage(t('tasks.form.errors.connection', 'Error de conexión. Intente nuevamente.'));
    }
  };

  const isLoading = formState === 'loading';

  return (
    <div className="task-form-container" data-testid="task.form.container" lang="es">
      <h1 className="task-form-title">{t('tasks.form.title', 'Cargar Tarea Diaria')}</h1>
      
      <form onSubmit={handleSubmit} className="task-form" aria-busy={isLoading} lang="es" noValidate>
        {/* Mensaje de éxito */}
        {formState === 'success' && (
          <div 
            className="task-form-success"
            data-testid="task.form.successMessage"
            role="alert"
            aria-live="polite"
          >
            {t('tasks.form.success.message', '✓ Tarea registrada correctamente')}
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
          <input
            type="text"
            id="fecha"
            data-testid="task.form.dateInput"
            value={fechaDisplay}
            onChange={handleFechaChange}
            disabled={isLoading}
            className={`form-input ${validationErrors.fecha ? 'input-error' : ''}`}
            aria-label={t('tasks.form.fields.fecha.ariaLabel', 'Fecha de la tarea (formato DD/MM/YYYY)')}
            aria-invalid={!!validationErrors.fecha}
            aria-describedby={validationErrors.fecha ? 'fecha-error' : dateWarning ? 'fecha-warning' : undefined}
            aria-required="true"
            required
            placeholder={t('tasks.form.fields.fecha.placeholder', 'DD/MM/YYYY')}
            pattern="\d{2}/\d{2}/\d{4}"
            maxLength={10}
            title={t('tasks.form.fields.fecha.title', 'Ingrese la fecha en formato DD/MM/YYYY')}
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
          <input
            type="text"
            id="duracion"
            data-testid="task.form.durationInput"
            value={duracionTime}
            onChange={handleDuracionChange}
            disabled={isLoading}
            className={`form-input ${validationErrors.duracion_minutos ? 'input-error' : ''}`}
            aria-label={t('tasks.form.fields.duracion.ariaLabel', 'Duración en formato hh:mm (ej: 02:30)')}
            aria-invalid={!!validationErrors.duracion_minutos}
            aria-describedby={validationErrors.duracion_minutos ? 'duracion-error' : 'duracion-helper'}
            aria-required="true"
            required
            placeholder={t('tasks.form.fields.duracion.placeholder', 'hh:mm (ej: 02:30)')}
            pattern="\d{1,2}:\d{2}"
            maxLength={5}
            title={t('tasks.form.fields.duracion.title', 'Ingrese la duración en formato hh:mm (ej: 02:30)')}
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
        <div className="form-group">
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              data-testid="task.form.sinCargoCheckbox"
              checked={sinCargo}
              onChange={(e) => setSinCargo(e.target.checked)}
              disabled={isLoading}
              className="form-checkbox"
            />
            {t('tasks.form.fields.sinCargo.label', 'Sin cargo')}
          </label>
        </div>
        
        {/* Checkbox Presencial */}
        <div className="form-group">
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              data-testid="task.form.presencialCheckbox"
              checked={presencial}
              onChange={(e) => setPresencial(e.target.checked)}
              disabled={isLoading}
              className="form-checkbox"
            />
            {t('tasks.form.fields.presencial.label', 'Presencial')}
          </label>
        </div>
        
        {/* Campo de observación */}
        <div className="form-group">
          <label htmlFor="observacion" className="form-label">
            {t('tasks.form.fields.observacion.label', 'Observación / Descripción')} <span className="required">*</span>
          </label>
          <textarea
            id="observacion"
            data-testid="task.form.observacionTextarea"
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            disabled={isLoading}
            rows={4}
            className={`form-input form-textarea ${validationErrors.observacion ? 'input-error' : ''}`}
            aria-label={t('tasks.form.fields.observacion.ariaLabel', 'Observación o descripción de la tarea')}
            aria-invalid={!!validationErrors.observacion}
            aria-describedby={validationErrors.observacion ? 'observacion-error' : undefined}
            aria-required="true"
            required
            placeholder={t('tasks.form.fields.observacion.placeholder', 'Describa la tarea realizada...')}
            title={t('tasks.form.fields.observacion.title', 'Describa la tarea realizada')}
          />
          {validationErrors.observacion && (
            <span id="observacion-error" className="field-error" role="alert">
              {validationErrors.observacion}
            </span>
          )}
        </div>
        
        {/* Selector de empleado (solo para supervisores) */}
        <EmployeeSelector
          value={usuarioId}
          onChange={setUsuarioId}
          error={validationErrors.usuario_id}
          disabled={isLoading}
        />
        
        {/* Botones de acción */}
        <div className="form-actions">
          <button
            type="button"
            data-testid="task.form.cancelButton"
            onClick={() => navigate('/')}
            disabled={isLoading}
            className="form-button form-button-secondary"
          >
            {t('tasks.form.actions.cancel', 'Cancelar')}
          </button>
          <button
            type="submit"
            data-testid="task.form.submitButton"
            disabled={isLoading}
            className="form-button form-button-primary"
          >
            {isLoading ? t('tasks.form.actions.saving', 'Guardando...') : t('tasks.form.actions.save', 'Guardar')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
