/**
 * Component: EmpleadosPage
 *
 * Listado paginado de empleados (solo supervisores). TR-018(MH), TR-021(MH).
 * Usa DataGrid, TextBox, SelectBox y Button de DevExtreme.
 *
 * @see TR-057(SH)-migración-de-controles-a-devextreme.md
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataGrid, { Column } from 'devextreme-react/data-grid';
import TextBox from 'devextreme-react/text-box';
import SelectBox from 'devextreme-react/select-box';
import Button from 'devextreme-react/button';
import { getEmpleados, deleteEmpleado, EmpleadoListItem } from '../services/empleado.service';
import { TaskPagination } from '../../tasks/components/TaskPagination';
import './EmpleadosPage.css';

const DEFAULT_PAGE_SIZE = 15;

export interface EmpleadosFilters {
  search: string;
  supervisor: '' | 'true' | 'false';
  activo: '' | 'true' | 'false';
  inhabilitado: '' | 'true' | 'false';
}

const defaultFilters: EmpleadosFilters = {
  search: '',
  supervisor: '',
  activo: '',
  inhabilitado: '',
};

function buildParams(
  page: number,
  filters: EmpleadosFilters,
  pageSize: number
): Parameters<typeof getEmpleados>[0] {
  const params: Parameters<typeof getEmpleados>[0] = {
    page,
    page_size: pageSize,
    sort: 'nombre',
    sort_dir: 'asc',
  };
  if (filters.search.trim()) params.search = filters.search.trim();
  if (filters.supervisor === 'true') params.supervisor = true;
  if (filters.supervisor === 'false') params.supervisor = false;
  if (filters.activo === 'true') params.activo = true;
  if (filters.activo === 'false') params.activo = false;
  if (filters.inhabilitado === 'true') params.inhabilitado = true;
  if (filters.inhabilitado === 'false') params.inhabilitado = false;
  return params;
}

const SUPERVISOR_OPTIONS = [
  { value: '', text: 'Todos' },
  { value: 'true', text: 'Sí' },
  { value: 'false', text: 'No' },
];

const ESTADO_OPTIONS = [
  { value: '', text: 'Todos' },
  { value: 'true', text: 'Activo' },
  { value: 'false', text: 'Inactivo' },
];

const INHABILITADO_OPTIONS = [
  { value: '', text: 'Todos' },
  { value: 'false', text: 'No' },
  { value: 'true', text: 'Sí' },
];

export function EmpleadosPage(): React.ReactElement {
  const navigate = useNavigate();
  const [data, setData] = useState<EmpleadoListItem[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: DEFAULT_PAGE_SIZE,
    total: 0,
    last_page: 1,
  });
  const [filters, setFilters] = useState<EmpleadosFilters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<EmpleadosFilters>(defaultFilters);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [empleadoToDelete, setEmpleadoToDelete] = useState<EmpleadoListItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadEmpleados = useCallback(
    async (params: Parameters<typeof getEmpleados>[0]) => {
      setLoading(true);
      setErrorMessage('');
      const result = await getEmpleados(params);
      setLoading(false);
      if (result.success && result.data !== undefined) {
        setData(result.data);
        if (result.pagination) {
          setPagination({
            current_page: result.pagination.page,
            per_page: result.pagination.page_size,
            total: result.pagination.total,
            last_page: result.pagination.total_pages,
          });
        }
      } else {
        setErrorMessage(result.errorMessage || 'Error al cargar empleados');
        setData([]);
      }
    },
    []
  );

  useEffect(() => {
    const params = buildParams(page, appliedFilters, DEFAULT_PAGE_SIZE);
    loadEmpleados(params);
  }, [page, appliedFilters, loadEmpleados]);

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, pagination.last_page)));
  };

  const handleDeleteClick = (e: EmpleadoListItem) => {
    setEmpleadoToDelete(e);
    setDeleteError('');
  };

  const handleDeleteCancel = () => {
    setEmpleadoToDelete(null);
    setDeleteError('');
  };

  const handleDeleteConfirm = async () => {
    if (!empleadoToDelete) return;
    setDeleteLoading(true);
    setDeleteError('');
    const result = await deleteEmpleado(empleadoToDelete.id);
    setDeleteLoading(false);
    if (result.success) {
      setEmpleadoToDelete(null);
      setSuccessMessage('Empleado eliminado correctamente.');
      const params = buildParams(page, appliedFilters, DEFAULT_PAGE_SIZE);
      loadEmpleados(params);
    } else {
      setDeleteError(result.errorMessage ?? 'Error al eliminar empleado');
    }
  };

  return (
    <div className="empleados-page" data-testid="empleados.list">
      <header className="empleados-page-header">
        <h1 className="empleados-page-title">Empleados</h1>
        <Button
          text="Crear empleado"
          type="default"
          onClick={() => navigate('/empleados/nuevo')}
          elementAttr={{ 'data-testid': 'empleados.create', 'aria-label': 'Crear empleado' }}
        />
      </header>

      <section className="empleados-page-filters" data-testid="empleados.filters">
        <div className="empleados-filters-row">
          <label className="empleados-filter-label">
            <span className="empleados-filter-label-text">Búsqueda (código, nombre o email)</span>
            <TextBox
              value={filters.search}
              onValueChanged={(e) => setFilters((f) => ({ ...f, search: e.value ?? '' }))}
              placeholder="Buscar..."
              elementAttr={{ 'data-testid': 'empleados.search', 'aria-label': 'Búsqueda por código, nombre o email' }}
            />
          </label>
          <label className="empleados-filter-label">
            <span className="empleados-filter-label-text">Supervisor</span>
            <SelectBox
              dataSource={SUPERVISOR_OPTIONS}
              value={filters.supervisor}
              onValueChanged={(e) => setFilters((f) => ({ ...f, supervisor: (e.value ?? '') as '' | 'true' | 'false' }))}
              displayExpr="text"
              valueExpr="value"
              elementAttr={{ 'data-testid': 'empleados.filter.supervisor', 'aria-label': 'Filtrar por rol supervisor' }}
            />
          </label>
          <label className="empleados-filter-label">
            <span className="empleados-filter-label-text">Estado</span>
            <SelectBox
              dataSource={ESTADO_OPTIONS}
              value={filters.activo}
              onValueChanged={(e) => setFilters((f) => ({ ...f, activo: (e.value ?? '') as '' | 'true' | 'false' }))}
              displayExpr="text"
              valueExpr="value"
              elementAttr={{ 'data-testid': 'empleados.filter.activo', 'aria-label': 'Filtrar por estado activo' }}
            />
          </label>
          <label className="empleados-filter-label">
            <span className="empleados-filter-label-text">Inhabilitado</span>
            <SelectBox
              dataSource={INHABILITADO_OPTIONS}
              value={filters.inhabilitado}
              onValueChanged={(e) => setFilters((f) => ({ ...f, inhabilitado: (e.value ?? '') as '' | 'true' | 'false' }))}
              displayExpr="text"
              valueExpr="value"
              elementAttr={{ 'data-testid': 'empleados.filter.inhabilitado', 'aria-label': 'Filtrar por inhabilitado' }}
            />
          </label>
          <Button
            text="Aplicar"
            type="default"
            onClick={handleApplyFilters}
            elementAttr={{ 'data-testid': 'empleados.filters.apply', 'aria-label': 'Aplicar filtros' }}
          />
        </div>
      </section>

      {loading && (
        <div className="empleados-page-loading" data-testid="empleados.loading" role="status">
          Cargando empleados...
        </div>
      )}

      {errorMessage && (
        <div className="empleados-page-error" data-testid="empleados.error" role="alert">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="empleados-page-success" data-testid="empleados.success" role="alert">
          {successMessage}
        </div>
      )}

      {!loading && !errorMessage && (
        <>
          <p className="empleados-page-total" data-testid="empleados.total">
            Total de usuarios: <strong>{pagination.total}</strong>
          </p>

          {data.length === 0 ? (
            <p className="empleados-page-empty" data-testid="empleados.empty" role="status">
              No se encontraron empleados.
            </p>
          ) : (
            <div className="empleados-table-wrapper">
              <DataGrid
                dataSource={data}
                keyExpr="id"
                showBorders={true}
                rowAlternationEnabled={true}
                onRowPrepared={(e) => {
                  if (e.rowType === 'data' && e.data?.inhabilitado) {
                    e.rowElement?.classList.add('empleados-table-row-inhabilitado');
                  }
                }}
                elementAttr={{ 'data-testid': 'empleados.table', 'aria-label': 'Listado de empleados' }}
                noDataText=""
              >
                <Column dataField="code" caption="Código" width={100} />
                <Column dataField="nombre" caption="Nombre" width={180} />
                <Column dataField="email" caption="Email" width={180} customizeText={({ value }) => value ?? '—'} />
                <Column
                  dataField="supervisor"
                  caption="Supervisor"
                  width={90}
                  customizeText={({ value }) => (value ? 'Sí' : 'No')}
                />
                <Column
                  dataField="activo"
                  caption="Estado"
                  width={90}
                  customizeText={({ value }) => (value ? 'Activo' : 'Inactivo')}
                />
                <Column
                  dataField="inhabilitado"
                  caption="Inhabilitado"
                  width={90}
                  customizeText={({ value }) => (value ? 'Sí' : 'No')}
                />
                <Column
                  caption="Acciones"
                  width={260}
                  allowSorting={false}
                  cellRender={({ data }: { data: EmpleadoListItem }) => (
                    <div className="empleados-actions-cell">
                      <Button
                        text="Ver detalle"
                        type="normal"
                        stylingMode="text"
                        onClick={() => navigate(`/empleados/${data.id}`)}
                        elementAttr={{ 'data-testid': `empleados.detail.${data.id}`, 'aria-label': `Ver detalle de ${data.nombre}` }}
                      />
                      <Button
                        text="Editar"
                        type="normal"
                        stylingMode="text"
                        onClick={() => navigate(`/empleados/${data.id}/editar`)}
                        elementAttr={{ 'data-testid': `empleados.edit.${data.id}`, 'aria-label': `Editar empleado ${data.nombre}` }}
                      />
                      <Button
                        text="Eliminar"
                        type="normal"
                        stylingMode="text"
                        onClick={() => handleDeleteClick(data)}
                        elementAttr={{ 'data-testid': `empleados.row.${data.id}.delete`, 'aria-label': `Eliminar empleado ${data.nombre}` }}
                      />
                    </div>
                  )}
                />
              </DataGrid>
            </div>
          )}

          <TaskPagination
            currentPage={pagination.current_page}
            lastPage={pagination.last_page}
            total={pagination.total}
            perPage={pagination.per_page}
            onPageChange={handlePageChange}
            disabled={loading}
          />
        </>
      )}

      {empleadoToDelete && (
        <div
          className="empleados-delete-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="empleados-delete-modal-title"
          data-testid="empleados.delete.modal"
        >
          <div className="empleados-delete-modal">
            <h2 id="empleados-delete-modal-title" className="empleados-delete-modal-title">
              Eliminar empleado
            </h2>
            <p className="empleados-delete-modal-text">
              ¿Está seguro de eliminar el empleado <strong data-testid="empleados.delete.code">{empleadoToDelete.code}</strong> – <strong data-testid="empleados.delete.nombre">{empleadoToDelete.nombre}</strong>?
            </p>
            {deleteError && (
              <div className="empleados-delete-modal-error" role="alert" data-testid="empleados.delete.error">
                {deleteError}
              </div>
            )}
            <div className="empleados-delete-modal-actions">
              <Button
                text="Cancelar"
                type="normal"
                onClick={handleDeleteCancel}
                disabled={deleteLoading}
                elementAttr={{ 'data-testid': 'empleados.delete.cancel' }}
              />
              <Button
                text={deleteLoading ? 'Eliminando...' : 'Confirmar'}
                type="danger"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                elementAttr={{ 'data-testid': 'empleados.delete.confirm', 'aria-busy': deleteLoading ? 'true' : 'false' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmpleadosPage;
