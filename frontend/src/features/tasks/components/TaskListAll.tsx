/**
 * Component: TaskListAll
 *
 * Lista paginada de todas las tareas (solo supervisores). Usa DataGrid de DevExtreme.
 *
 * @see TR-034
 * @see TR-057(SH)-migración-de-controles-a-devextreme.md
 */

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DataGrid, { Column, ColumnButton } from 'devextreme-react/data-grid';
import { getAllTasks, deleteTask, TaskListItem, TaskListParams } from '../services/task.service';
import { TaskFilters, type TaskFiltersValues } from './TaskFilters';
import { TaskPagination } from './TaskPagination';
import { TaskTotals } from './TaskTotals';
import { DeleteTaskModal } from './DeleteTaskModal';
import { t } from '../../../shared/i18n';
import './TaskList.css';

const DEFAULT_PER_PAGE = 15;
const DEFAULT_FILTERS: TaskFiltersValues = {
  fechaDesde: '',
  fechaHasta: '',
  clienteId: null,
  tipoTareaId: null,
  empleadoId: null,
  busqueda: '',
  orden: 'desc',
};

function buildParams(page: number, filters: TaskFiltersValues, perPage: number): TaskListParams {
  const params: TaskListParams = {
    page,
    per_page: perPage,
    ordenar_por: 'fecha',
    orden: filters.orden,
  };
  if (filters.fechaDesde) params.fecha_desde = filters.fechaDesde;
  if (filters.fechaHasta) params.fecha_hasta = filters.fechaHasta;
  if (filters.clienteId != null) params.cliente_id = filters.clienteId;
  if (filters.tipoTareaId != null) params.tipo_tarea_id = filters.tipoTareaId;
  if (filters.empleadoId != null) params.usuario_id = filters.empleadoId;
  if (filters.busqueda.trim()) params.busqueda = filters.busqueda.trim();
  return params;
}

export interface TaskListAllReturnState {
  returnFilters: TaskFiltersValues;
  returnPage: number;
  returnPath?: string;
}

function getInitialStateFromLocation(location: ReturnType<typeof useLocation>) {
  const state = location.state as TaskListAllReturnState | null;
  return {
    filters: state?.returnFilters ?? DEFAULT_FILTERS,
    appliedFilters: state?.returnFilters ?? DEFAULT_FILTERS,
    page: state?.returnPage ?? 1,
  };
}

export function TaskListAll(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const initialState = getInitialStateFromLocation(location);
  const [data, setData] = useState<TaskListItem[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: DEFAULT_PER_PAGE,
    total: 0,
    last_page: 1,
  });
  const [totales, setTotales] = useState({ cantidad_tareas: 0, total_horas: 0 });
  const [filters, setFilters] = useState<TaskFiltersValues>(initialState.filters);
  const [appliedFilters, setAppliedFilters] = useState<TaskFiltersValues>(initialState.appliedFilters);
  const [page, setPage] = useState(initialState.page);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [taskToDelete, setTaskToDelete] = useState<TaskListItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const loadTasks = useCallback(async (params: TaskListParams) => {
    setLoading(true);
    setErrorMessage('');
    const result = await getAllTasks(params);
    setLoading(false);
    if (result.success && result.data !== undefined) {
      setData(result.data);
      if (result.pagination) setPagination(result.pagination);
      if (result.totales) setTotales(result.totales);
    } else {
      setErrorMessage(result.errorMessage || t('tasks.list.error.load', 'Error al cargar tareas'));
      setData([]);
    }
  }, []);

  useEffect(() => {
    const params = buildParams(page, appliedFilters, DEFAULT_PER_PAGE);
    loadTasks(params);
  }, [page, appliedFilters, loadTasks]);

  const prevLocationKey = useRef<string | undefined>(undefined);
  useEffect(() => {
    const state = location.state as TaskListAllReturnState | null;
    const hasReturnState =
      state?.returnFilters != null &&
      typeof state?.returnPage === 'number' &&
      location.pathname === '/tareas/todas';
    if (hasReturnState && prevLocationKey.current !== location.key) {
      prevLocationKey.current = location.key;
      setFilters(state.returnFilters);
      setAppliedFilters(state.returnFilters);
      setPage(state.returnPage);
    }
    if (!hasReturnState) prevLocationKey.current = location.key;
  }, [location.pathname, location.key, location.state]);

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => setPage(newPage);

  const returnState = {
    returnFilters: appliedFilters,
    returnPage: page,
    returnPath: '/tareas/todas',
  };

  const handleEdit = (id: number) => {
    navigate(`/tareas/${id}/editar`, { state: returnState });
  };

  const handleDeleteClick = (row: TaskListItem) => {
    if (row.cerrado) return;
    setDeleteError('');
    setTaskToDelete(row);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    setDeleteLoading(true);
    setDeleteError('');
    const result = await deleteTask(taskToDelete.id);
    setDeleteLoading(false);
    if (result.success) {
      setTaskToDelete(null);
      setSuccessMessage(t('tasks.delete.success', 'Tarea eliminada correctamente'));
      const params = buildParams(page, appliedFilters, DEFAULT_PER_PAGE);
      await loadTasks(params);
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setDeleteError(result.errorMessage ?? t('tasks.list.error.load', 'Error al eliminar'));
    }
  };

  const handleCancelDelete = () => {
    setTaskToDelete(null);
    setDeleteError('');
  };

  return (
    <div className="task-list-container" data-testid="task.all.container">
      <header className="task-list-header">
        <h1 className="task-list-title">{t('tasks.list.all.title', 'Todas las Tareas')}</h1>
      </header>

      <TaskFilters values={filters} onChange={setFilters} onApply={handleApplyFilters} disabled={loading} />

      {errorMessage && (
        <div className="task-list-error" data-testid="task.all.error" role="alert">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="task-list-success" data-testid="task.all.deleteSuccess" role="status">
          {successMessage}
        </div>
      )}

      <DeleteTaskModal
        task={taskToDelete}
        loading={deleteLoading}
        errorMessage={deleteError}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {!errorMessage && (
        <>
          <TaskTotals cantidadTareas={totales.cantidad_tareas} totalHoras={totales.total_horas} />

          {loading ? (
            <div className="task-list-loading" data-testid="task.all.loading">
              {t('tasks.list.loading', 'Cargando...')}
            </div>
          ) : data.length === 0 ? (
            <div className="task-list-empty" data-testid="task.all.empty">
              {t('tasks.list.empty', 'No hay tareas que mostrar.')}
            </div>
          ) : (
            <>
              <DataGrid
                dataSource={data}
                keyExpr="id"
                showBorders={true}
                rowAlternationEnabled={true}
                elementAttr={{ 'data-testid': 'task.all.table' }}
                noDataText=""
              >
                <Column dataField="fecha" caption={t('tasks.list.col.fecha', 'Fecha')} width={100} />
                <Column
                  caption={t('tasks.form.fields.empleado.label', 'Empleado')}
                  width={150}
                  calculateCellValue={(rowData) =>
                    rowData.empleado ? `${rowData.empleado.nombre} (${rowData.empleado.code})` : '—'
                  }
                />
                <Column dataField="cliente.nombre" caption={t('tasks.list.col.cliente', 'Cliente')} width={150} />
                <Column dataField="tipo_tarea.nombre" caption={t('tasks.list.col.tipoTarea', 'Tipo tarea')} width={120} />
                <Column dataField="duracion_horas" caption={t('tasks.list.col.duracion', 'Duración')} width={80} />
                <Column
                  dataField="sin_cargo"
                  caption={t('tasks.list.col.sinCargo', 'Sin cargo')}
                  width={90}
                  customizeText={(cellInfo) => (cellInfo.value ? t('tasks.list.si', 'Sí') : t('tasks.list.no', 'No'))}
                />
                <Column
                  dataField="presencial"
                  caption={t('tasks.list.col.presencial', 'Presencial')}
                  width={90}
                  customizeText={(cellInfo) => (cellInfo.value ? t('tasks.list.si', 'Sí') : t('tasks.list.no', 'No'))}
                />
                <Column dataField="observacion" caption={t('tasks.list.col.observacion', 'Observación')} minWidth={150} />
                <Column
                  dataField="cerrado"
                  caption={t('tasks.list.col.cerrado', 'Cerrado')}
                  width={80}
                  customizeText={(cellInfo) => (cellInfo.value ? t('tasks.list.si', 'Sí') : t('tasks.list.no', 'No'))}
                />
                <Column type="buttons" width={150} caption={t('tasks.list.col.acciones', 'Acciones')}>
                  <ColumnButton
                    hint={t('tasks.list.edit', 'Editar')}
                    icon="edit"
                    onClick={(e) => !e.row?.data?.cerrado && handleEdit(e.row!.data.id)}
                    disabled={(opts) => !!opts.row?.data?.cerrado}
                  />
                  <ColumnButton
                    hint={t('tasks.list.delete', 'Eliminar')}
                    icon="trash"
                    onClick={(e) => e.row?.data && handleDeleteClick(e.row.data)}
                    disabled={(opts) => !!opts.row?.data?.cerrado}
                  />
                </Column>
              </DataGrid>
            </>
          )}

          {!loading && data.length > 0 && (
            <TaskPagination
              currentPage={pagination.current_page}
              lastPage={pagination.last_page}
              total={pagination.total}
              perPage={pagination.per_page}
              onPageChange={handlePageChange}
              disabled={loading}
              testIdPrefix="task.all"
            />
          )}
        </>
      )}
    </div>
  );
}
