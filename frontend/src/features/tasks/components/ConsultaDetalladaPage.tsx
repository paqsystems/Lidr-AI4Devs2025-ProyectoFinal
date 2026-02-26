/**
 * Component: ConsultaDetalladaPage
 *
 * Pantalla de consulta detallada de tareas (TR-044).
 * Usa DataGrid, DateBox, SelectBox y Button de DevExtreme.
 *
 * @see TR-057(SH)-migración-de-controles-a-devextreme.md
 */

import React, { useCallback, useEffect, useState } from 'react';
import DataGrid, { Column, Sorting } from 'devextreme-react/data-grid';
import DateBox from 'devextreme-react/date-box';
import SelectBox from 'devextreme-react/select-box';
import Button from 'devextreme-react/button';
import { getUserData } from '../../../shared/utils/tokenStorage';
import {
  getDetailReport,
  getClients,
  getEmployees,
  DetailReportItem,
  DetailReportParams,
  Client,
  Employee,
} from '../services/task.service';
import { TaskPagination } from './TaskPagination';
import { buildExportFileName, exportDetailToExcel } from '../utils/exportToExcel';
import { t } from '../../../shared/i18n';
import './ConsultaDetalladaPage.css';

const DEFAULT_PER_PAGE = 15;

export interface ConsultaDetalladaFilters {
  fechaDesde: string;
  fechaHasta: string;
  clienteId: number | null;
  usuarioId: number | null;
  ordenarPor: string;
  orden: 'asc' | 'desc';
}

const defaultFilters: ConsultaDetalladaFilters = {
  fechaDesde: '',
  fechaHasta: '',
  clienteId: null,
  usuarioId: null,
  ordenarPor: 'fecha',
  orden: 'desc',
};

function buildParams(
  page: number,
  filters: ConsultaDetalladaFilters,
  isSupervisor: boolean,
  isCliente: boolean
): DetailReportParams {
  const params: DetailReportParams = {
    page,
    per_page: DEFAULT_PER_PAGE,
    ordenar_por: filters.ordenarPor,
    orden: filters.orden,
  };
  if (filters.fechaDesde) params.fecha_desde = filters.fechaDesde;
  if (filters.fechaHasta) params.fecha_hasta = filters.fechaHasta;
  if (!isCliente && filters.clienteId != null) params.cliente_id = filters.clienteId;
  if (isSupervisor && filters.usuarioId != null) params.usuario_id = filters.usuarioId;
  return params;
}

export function ConsultaDetalladaPage(): React.ReactElement {
  const user = getUserData();
  const isSupervisor = user?.esSupervisor ?? false;
  const isCliente = user?.tipoUsuario === 'cliente';

  const [data, setData] = useState<DetailReportItem[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: DEFAULT_PER_PAGE,
    total: 0,
    last_page: 1,
  });
  const [totalHoras, setTotalHoras] = useState(0);
  const [filters, setFilters] = useState<ConsultaDetalladaFilters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<ConsultaDetalladaFilters>(defaultFilters);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [clients, setClients] = useState<Client[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const loadReport = useCallback(
    async (params: DetailReportParams) => {
      setLoading(true);
      setErrorMessage('');
      const result = await getDetailReport(params);
      setLoading(false);
      if (result.success && result.data !== undefined) {
        setData(result.data);
        if (result.pagination) setPagination(result.pagination);
        if (result.totalHoras !== undefined) setTotalHoras(result.totalHoras);
      } else {
        setErrorMessage(
          result.errorMessage || t('report.detail.error.load', 'Error al cargar la consulta')
        );
        setData([]);
      }
    },
    []
  );

  useEffect(() => {
    const params = buildParams(page, appliedFilters, isSupervisor, isCliente);
    loadReport(params);
  }, [page, appliedFilters, isSupervisor, isCliente, loadReport]);

  useEffect(() => {
    if (!isCliente) {
      getClients().then((r) => r.success && r.data && setClients(r.data));
    }
    if (isSupervisor) {
      getEmployees().then((r) => r.success && r.data && setEmployees(r.data));
    }
  }, [isCliente, isSupervisor]);

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const hasData = data.length > 0;
  const handleExportExcel = () => {
    const filename = buildExportFileName(appliedFilters.fechaDesde, appliedFilters.fechaHasta);
    exportDetailToExcel(data, filename, isSupervisor && !isCliente);
  };

  return (
    <div className="consulta-detallada-container" data-testid="report.detail.container">
      <header className="consulta-detallada-header">
        <h1 className="consulta-detallada-title">
          {t('report.detail.title', 'Consulta Detallada de Tareas')}
        </h1>
      </header>

      <div className="consulta-detallada-filters" data-testid="report.detail.filters" role="search">
        <div className="consulta-detallada-filters-row">
          <label className="consulta-detallada-label">
            {t('tasks.list.filters.fechaDesde', 'Fecha desde')}
            <DateBox
              type="date"
              value={filters.fechaDesde ? new Date(filters.fechaDesde + 'T12:00:00') : null}
              onValueChanged={(e) => {
                const d = e.value ?? null;
                setFilters({
                  ...filters,
                  fechaDesde: d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : '',
                });
              }}
              disabled={loading}
              elementAttr={{ 'aria-label': t('tasks.list.filters.fechaDesde', 'Fecha desde') }}
            />
          </label>
          <label className="consulta-detallada-label">
            {t('tasks.list.filters.fechaHasta', 'Fecha hasta')}
            <DateBox
              type="date"
              value={filters.fechaHasta ? new Date(filters.fechaHasta + 'T12:00:00') : null}
              onValueChanged={(e) => {
                const d = e.value ?? null;
                setFilters({
                  ...filters,
                  fechaHasta: d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : '',
                });
              }}
              disabled={loading}
              elementAttr={{ 'aria-label': t('tasks.list.filters.fechaHasta', 'Fecha hasta') }}
            />
          </label>
          {!isCliente && (
            <div className="consulta-detallada-label">
              <span className="consulta-detallada-label-text">
                {t('tasks.list.filters.cliente', 'Cliente')}
              </span>
              <SelectBox
                dataSource={[{ id: -1, nombre: t('tasks.list.filters.todos', 'Todos') }, ...clients]}
                value={filters.clienteId ?? -1}
                onValueChanged={(e) => {
                  const v = e.value ?? -1;
                  setFilters({ ...filters, clienteId: v === -1 ? null : (v as number) });
                }}
                displayExpr="nombre"
                valueExpr="id"
                disabled={loading}
                elementAttr={{ 'aria-label': t('tasks.list.filters.cliente', 'Cliente') }}
              />
            </div>
          )}
          {isSupervisor && (
            <div className="consulta-detallada-label">
              <span className="consulta-detallada-label-text">
                {t('tasks.list.filters.empleado', 'Empleado')}
              </span>
              <SelectBox
                dataSource={[{ id: -1, nombre: t('tasks.list.filters.todos', 'Todos') }, ...employees]}
                value={filters.usuarioId ?? -1}
                onValueChanged={(e) => {
                  const v = e.value ?? -1;
                  setFilters({ ...filters, usuarioId: v === -1 ? null : (v as number) });
                }}
                displayExpr="nombre"
                valueExpr="id"
                disabled={loading}
                elementAttr={{ 'aria-label': t('tasks.list.filters.empleado', 'Empleado') }}
              />
            </div>
          )}
          <div className="consulta-detallada-label">
            <span className="consulta-detallada-label-text">{t('report.detail.sortBy', 'Ordenar por')}</span>
            <SelectBox
              dataSource={[
                ...(isSupervisor && !isCliente ? [{ value: 'empleado', text: t('tasks.list.col.empleado', 'Empleado') }] : []),
                { value: 'cliente', text: t('tasks.list.col.cliente', 'Cliente') },
                { value: 'fecha', text: t('tasks.list.col.fecha', 'Fecha') },
                { value: 'tipo_tarea', text: t('tasks.list.col.tipoTarea', 'Tipo tarea') },
                { value: 'horas', text: t('report.detail.col.horas', 'Horas') },
              ]}
              value={appliedFilters.ordenarPor}
              onValueChanged={(e) => {
                const v = e.value ?? 'fecha';
                setAppliedFilters({ ...appliedFilters, ordenarPor: v });
                setPage(1);
              }}
              displayExpr="text"
              valueExpr="value"
              disabled={loading}
              elementAttr={{ 'aria-label': t('report.detail.sortBy', 'Ordenar por') }}
            />
          </div>
          <div className="consulta-detallada-label">
            <span className="consulta-detallada-label-text">{t('report.detail.sortOrder', 'Orden')}</span>
            <SelectBox
              dataSource={[
                { value: 'desc', text: t('report.detail.desc', 'Descendente') },
                { value: 'asc', text: t('report.detail.asc', 'Ascendente') },
              ]}
              value={appliedFilters.orden}
              onValueChanged={(e) => {
                const v = (e.value ?? 'desc') as 'asc' | 'desc';
                setAppliedFilters({ ...appliedFilters, orden: v });
                setPage(1);
              }}
              displayExpr="text"
              valueExpr="value"
              disabled={loading}
              elementAttr={{ 'aria-label': t('report.detail.sortOrder', 'Orden') }}
            />
          </div>
          <Button
            text={t('report.detail.applyFilters', 'Aplicar Filtros')}
            type="default"
            onClick={handleApplyFilters}
            disabled={loading}
            elementAttr={{ 'data-testid': 'report.detail.applyFilters' }}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="consulta-detallada-error" data-testid="report.detail.error" role="alert">
          {errorMessage}
        </div>
      )}

      {!errorMessage && (
        <>
          <div className="consulta-detallada-total-row">
            <div
              className="consulta-detallada-total"
              data-testid="report.detail.totalHours"
              role="status"
            >
              {t('report.detail.totalHoras', 'Total horas del período')}:{' '}
              <strong>{totalHoras.toFixed(2)}</strong>
            </div>
            <div className="consulta-detallada-export" data-testid="report.detail.export">
              {!hasData && !loading && (
                <span className="consulta-detallada-export-no-data" data-testid="exportarExcel.mensajeSinDatos">
                  {t('report.export.noData', 'No hay datos para exportar')}
                </span>
              )}
              <Button
                text={t('report.export.button', 'Exportar a Excel')}
                type="default"
                onClick={handleExportExcel}
                disabled={!hasData || loading}
                elementAttr={{ 'data-testid': 'exportarExcel.boton', 'aria-label': t('report.export.aria', 'Exportar a Excel') }}
              />
            </div>
          </div>

          {loading ? (
            <div className="consulta-detallada-loading" data-testid="report.detail.loading">
              {t('tasks.list.loading', 'Cargando...')}
            </div>
          ) : data.length === 0 ? (
            <div
              className="consulta-detallada-empty"
              data-testid="report.detail.empty"
              role="status"
            >
              {t('report.detail.empty', 'No se encontraron tareas para los filtros seleccionados.')}
            </div>
          ) : (
            <div className="consulta-detallada-table-wrapper">
              <DataGrid
                dataSource={data}
                keyExpr="id"
                showBorders={true}
                rowAlternationEnabled={true}
                elementAttr={{ 'data-testid': 'report.detail.table', 'aria-label': 'Consulta detallada' }}
                noDataText=""
              >
                <Sorting mode="none" />
                {isSupervisor && !isCliente && (
                  <Column
                    dataField="empleado.nombre"
                    caption={t('tasks.list.col.empleado', 'Empleado')}
                    width={150}
                    customizeText={({ value }) => value ?? '—'}
                  />
                )}
                <Column
                  dataField="cliente"
                  caption={t('tasks.list.col.cliente', 'Cliente')}
                  width={180}
                  calculateCellValue={(rowData) =>
                    `${rowData.cliente.nombre}${rowData.cliente.tipo_cliente ? ` (${rowData.cliente.tipo_cliente})` : ''}`
                  }
                />
                <Column dataField="fecha" caption={t('tasks.list.col.fecha', 'Fecha')} width={100} />
                <Column dataField="tipo_tarea.descripcion" caption={t('tasks.list.col.tipoTarea', 'Tipo tarea')} width={140} />
                <Column
                  dataField="horas"
                  caption={t('report.detail.col.horas', 'Horas')}
                  width={80}
                  customizeText={({ value }) => (value != null ? Number(value).toFixed(2) : '')}
                />
                <Column
                  dataField="sin_cargo"
                  caption={t('tasks.list.col.sinCargo', 'Sin cargo')}
                  width={90}
                  customizeText={({ value }) => (value ? t('tasks.list.si', 'Sí') : t('tasks.list.no', 'No'))}
                />
                <Column
                  dataField="presencial"
                  caption={t('tasks.list.col.presencial', 'Presencial')}
                  width={90}
                  customizeText={({ value }) => (value ? t('tasks.list.si', 'Sí') : t('tasks.list.no', 'No'))}
                />
                <Column dataField="descripcion" caption={t('report.detail.col.descripcion', 'Descripción')} minWidth={150} />
              </DataGrid>
            </div>
          )}

          {!loading && data.length > 0 && (
            <div data-testid="report.detail.pagination">
              <TaskPagination
                currentPage={pagination.current_page}
                lastPage={pagination.last_page}
                total={pagination.total}
                perPage={pagination.per_page}
                onPageChange={handlePageChange}
                disabled={loading}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
