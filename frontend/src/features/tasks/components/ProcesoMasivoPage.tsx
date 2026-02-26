/**
 * Component: ProcesoMasivoPage
 *
 * Página de proceso masivo de tareas (TR-039 a TR-043). Solo supervisores.
 * Filtros (fecha, cliente, empleado, estado), DataGrid DevExtreme con selección múltiple,
 * Seleccionar/Deseleccionar todos, contador, botón Procesar con confirmación.
 *
 * @see TR-057(SH)-migración-de-controles-a-devextreme.md
 */

import React, { useCallback, useEffect, useState } from 'react';
import DataGrid, { Column } from 'devextreme-react/data-grid';
import DateBox from 'devextreme-react/date-box';
import SelectBox from 'devextreme-react/select-box';
import Button from 'devextreme-react/button';
import {
  getAllTasks,
  bulkToggleClose,
  TaskListItem,
  TaskListParams,
} from '../services/task.service';
import { ClientSelector } from './ClientSelector';
import { EmployeeSelector } from './EmployeeSelector';
import { TaskPagination } from './TaskPagination';
import { TaskTotals } from './TaskTotals';
import { Modal } from '../../../shared/ui/Modal';
import { t } from '../../../shared/i18n';
import './ProcesoMasivoPage.css';

const DEFAULT_PER_PAGE = 15;
type EstadoCerrado = 'all' | 'open' | 'closed';

interface ProcesoMasivoFilters {
  fechaDesde: string;
  fechaHasta: string;
  clienteId: number | null;
  empleadoId: number | null;
  estadoCerrado: EstadoCerrado;
}

const DEFAULT_FILTERS: ProcesoMasivoFilters = {
  fechaDesde: '',
  fechaHasta: '',
  clienteId: null,
  empleadoId: null,
  estadoCerrado: 'all',
};

function buildParams(
  page: number,
  filters: ProcesoMasivoFilters,
  perPage: number
): TaskListParams {
  const params: TaskListParams = {
    page,
    per_page: perPage,
    ordenar_por: 'fecha',
    orden: 'desc',
  };
  if (filters.fechaDesde) params.fecha_desde = filters.fechaDesde;
  if (filters.fechaHasta) params.fecha_hasta = filters.fechaHasta;
  if (filters.clienteId != null) params.cliente_id = filters.clienteId;
  if (filters.empleadoId != null) params.usuario_id = filters.empleadoId;
  if (filters.estadoCerrado === 'open') params.cerrado = false;
  if (filters.estadoCerrado === 'closed') params.cerrado = true;
  return params;
}

export function ProcesoMasivoPage(): React.ReactElement {
  const [data, setData] = useState<TaskListItem[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: DEFAULT_PER_PAGE,
    total: 0,
    last_page: 1,
  });
  const [totales, setTotales] = useState({ cantidad_tareas: 0, total_horas: 0 });
  const [filters, setFilters] = useState<ProcesoMasivoFilters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<ProcesoMasivoFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [processError, setProcessError] = useState<string>('');

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

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setPage(1);
    setSelectedIds(new Set());
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const selectAll = () => {
    setSelectedIds(new Set(data.map((r) => r.id)));
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleProcesarClick = () => {
    if (selectedIds.size === 0) return;
    setProcessError('');
    setShowConfirmModal(true);
  };

  const handleConfirmProcesar = async () => {
    const ids = Array.from(selectedIds);
    setShowConfirmModal(false);
    setProcessing(true);
    setProcessError('');
    const result = await bulkToggleClose(ids);
    setProcessing(false);
    if (result.success && result.processed != null) {
      setSuccessMessage(
        (t('procesoMasivo.success', 'Se procesaron X registros') as string).replace(
          'X',
          String(result.processed)
        )
      );
      setSelectedIds(new Set());
      const params = buildParams(page, appliedFilters, DEFAULT_PER_PAGE);
      await loadTasks(params);
      setTimeout(() => setSuccessMessage(''), 4000);
    } else {
      setProcessError(result.errorMessage || 'Error al procesar');
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
    setProcessError('');
  };

  return (
    <div className="proceso-masivo-container" data-testid="procesoMasivo.page">
      <header className="proceso-masivo-header">
        <h1 className="proceso-masivo-title">
          {t('procesoMasivo.title', 'Proceso Masivo de Tareas')}
        </h1>
      </header>

      <div className="proceso-masivo-filtros" data-testid="procesoMasivo.filtros" role="search">
        <div className="proceso-masivo-filtros-row">
          <label className="proceso-masivo-label">
            {t('tasks.list.filters.fechaDesde', 'Fecha desde')}
            <DateBox
              type="date"
              value={filters.fechaDesde ? new Date(filters.fechaDesde + 'T12:00:00') : null}
              onValueChanged={(e) => {
                const d = e.value ?? null;
                setFilters((f) => ({ ...f, fechaDesde: d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : '' }));
              }}
              disabled={loading}
              elementAttr={{ 'data-testid': 'procesoMasivo.filtroFechaDesde', 'aria-label': 'Fecha desde' }}
            />
          </label>
          <label className="proceso-masivo-label">
            {t('tasks.list.filters.fechaHasta', 'Fecha hasta')}
            <DateBox
              type="date"
              value={filters.fechaHasta ? new Date(filters.fechaHasta + 'T12:00:00') : null}
              onValueChanged={(e) => {
                const d = e.value ?? null;
                setFilters((f) => ({ ...f, fechaHasta: d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : '' }));
              }}
              disabled={loading}
              elementAttr={{ 'data-testid': 'procesoMasivo.filtroFechaHasta', 'aria-label': 'Fecha hasta' }}
            />
          </label>
          <div className="proceso-masivo-label proceso-masivo-cliente">
            <span className="proceso-masivo-label-text">{t('tasks.list.filters.cliente', 'Cliente')}</span>
            <ClientSelector
              value={filters.clienteId}
              onChange={(clienteId) => setFilters((f) => ({ ...f, clienteId }))}
              disabled={loading}
              showLabel={false}
              allowAll={true}
            />
          </div>
          <div className="proceso-masivo-label proceso-masivo-empleado">
            <span className="proceso-masivo-label-text">{t('tasks.list.filters.empleado', 'Empleado')}</span>
            <EmployeeSelector
              value={filters.empleadoId}
              onChange={(empleadoId) => setFilters((f) => ({ ...f, empleadoId }))}
              disabled={loading}
              showLabel={false}
              allowAll={true}
            />
          </div>
          <label className="proceso-masivo-label">
            {t('procesoMasivo.filtroEstado', 'Estado')}
            <SelectBox
              dataSource={[
                { value: 'all', text: t('procesoMasivo.estadoTodos', 'Todos') },
                { value: 'open', text: t('procesoMasivo.estadoAbiertos', 'Abiertos') },
                { value: 'closed', text: t('procesoMasivo.estadoCerrados', 'Cerrados') },
              ]}
              value={filters.estadoCerrado}
              onValueChanged={(e) => setFilters((f) => ({ ...f, estadoCerrado: (e.value ?? 'all') as EstadoCerrado }))}
              displayExpr="text"
              valueExpr="value"
              disabled={loading}
              elementAttr={{ 'data-testid': 'procesoMasivo.filtroEstado', 'aria-label': 'Estado cerrado/abierto' }}
            />
          </label>
          <Button
            text={t('procesoMasivo.aplicarFiltros', 'Aplicar Filtros')}
            type="default"
            onClick={handleApplyFilters}
            disabled={loading}
            elementAttr={{ 'data-testid': 'procesoMasivo.aplicarFiltros' }}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="proceso-masivo-error" data-testid="procesoMasivo.mensajeError" role="alert">
          {errorMessage}
        </div>
      )}

      {processError && (
        <div className="proceso-masivo-error" data-testid="procesoMasivo.mensajeError" role="alert">
          {processError}
        </div>
      )}

      {successMessage && (
        <div className="proceso-masivo-success" data-testid="procesoMasivo.mensajeExito" role="status">
          {successMessage}
        </div>
      )}

      {processing && (
        <div className="proceso-masivo-loading" data-testid="procesoMasivo.procesando" role="status">
          {t('procesoMasivo.procesando', 'Procesando...')}
        </div>
      )}

      {!errorMessage && (
        <>
          <TaskTotals
            cantidadTareas={totales.cantidad_tareas}
            totalHoras={totales.total_horas}
          />
          <div className="proceso-masivo-total" data-testid="procesoMasivo.total">
            {t('procesoMasivo.totalTareas', 'Total de tareas filtradas')}: {totales.cantidad_tareas}
          </div>

          <div className="proceso-masivo-actions">
            <Button
              text={t('procesoMasivo.seleccionarTodos', 'Seleccionar todos')}
              type="normal"
              stylingMode="text"
              onClick={selectAll}
              disabled={loading || data.length === 0}
              elementAttr={{ 'data-testid': 'procesoMasivo.seleccionarTodos' }}
            />
            <Button
              text={t('procesoMasivo.deseleccionarTodos', 'Deseleccionar todos')}
              type="normal"
              stylingMode="text"
              onClick={deselectAll}
              disabled={loading || selectedIds.size === 0}
              elementAttr={{ 'data-testid': 'procesoMasivo.deseleccionarTodos' }}
            />
            <span className="proceso-masivo-contador" data-testid="procesoMasivo.contadorSeleccionadas">
              {selectedIds.size} {t('procesoMasivo.tareasSeleccionadas', 'tareas seleccionadas')}
            </span>
            <Button
              text={t('procesoMasivo.procesar', 'Procesar')}
              type="default"
              onClick={handleProcesarClick}
              disabled={selectedIds.size === 0 || processing}
              elementAttr={{ 'data-testid': 'procesoMasivo.procesar' }}
            />
          </div>

          {loading ? (
            <div className="proceso-masivo-loading" data-testid="procesoMasivo.loading">
              {t('tasks.list.loading', 'Cargando...')}
            </div>
          ) : data.length === 0 ? (
            <div className="proceso-masivo-empty" data-testid="procesoMasivo.empty">
              {t('tasks.list.empty', 'No hay tareas que mostrar.')}
            </div>
          ) : (
            <div className="proceso-masivo-grid-wrapper" data-testid="procesoMasivo.tabla">
              <DataGrid
                dataSource={data}
                keyExpr="id"
                showBorders={true}
                rowAlternationEnabled={true}
                selection={{
                  mode: 'multiple',
                  showCheckBoxesMode: 'always',
                }}
                selectedRowKeys={Array.from(selectedIds)}
                onSelectionChanged={(e) => {
                  const keys = e.selectedRowKeys as number[];
                  setSelectedIds(new Set(keys));
                }}
                noDataText=""
                elementAttr={{ 'data-testid': 'procesoMasivo.dataGrid' }}
              >
                <Column dataField="fecha" caption={t('tasks.list.col.fecha', 'Fecha')} width={100} />
                <Column
                  caption={t('tasks.form.fields.empleado.label', 'Empleado')}
                  width={180}
                  calculateCellValue={(rowData) =>
                    rowData.empleado ? `${rowData.empleado.nombre} (${rowData.empleado.code})` : '—'
                  }
                />
                <Column dataField="cliente.nombre" caption={t('tasks.list.col.cliente', 'Cliente')} width={150} />
                <Column dataField="tipo_tarea.nombre" caption={t('tasks.list.col.tipoTarea', 'Tipo tarea')} width={120} />
                <Column dataField="duracion_horas" caption={t('tasks.list.col.duracion', 'Duración')} width={90} />
                <Column
                  dataField="cerrado"
                  caption={t('tasks.list.col.cerrado', 'Cerrado')}
                  width={90}
                  customizeText={(cellInfo) => (cellInfo.value ? t('tasks.list.si', 'Sí') : t('tasks.list.no', 'No'))}
                />
              </DataGrid>
            </div>
          )}

          {!loading && data.length > 0 && (
            <TaskPagination
              currentPage={pagination.current_page}
              lastPage={pagination.last_page}
              total={pagination.total}
              perPage={pagination.per_page}
              onPageChange={handlePageChange}
              disabled={loading}
            />
          )}
        </>
      )}

      {showConfirmModal && (
        <Modal
          testId="procesoMasivo.confirmModal"
          isOpen={showConfirmModal}
          onClose={handleCancelConfirm}
          title={t('procesoMasivo.confirmTitle', 'Confirmar procesamiento')}
        >
          <p>
            {(t('procesoMasivo.confirmMessage', 'Se invertirá el estado de N tareas. ¿Continuar?') as string).replace(
              'N',
              String(selectedIds.size)
            )}
          </p>
          <div className="proceso-masivo-modal-actions">
            <Button
              text={t('procesoMasivo.confirmar', 'Confirmar')}
              type="default"
              onClick={handleConfirmProcesar}
              elementAttr={{ 'data-testid': 'procesoMasivo.confirmarProcesar' }}
            />
            <Button text={t('procesoMasivo.cancelar', 'Cancelar')} type="normal" onClick={handleCancelConfirm} />
          </div>
        </Modal>
      )}
    </div>
  );
}
