/**
 * Component: TiposClientePage
 *
 * Listado paginado de tipos de cliente (solo supervisores). TR-014(MH).
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
import {
  getTiposClienteList,
  deleteTipoCliente,
  TipoClienteListItem,
  ERROR_TIENE_CLIENTES,
} from '../services/tipoCliente.service';
import { TaskPagination } from '../../tasks/components/TaskPagination';
import './TiposClientePage.css';

const DEFAULT_PAGE_SIZE = 15;

export interface TiposClienteFilters {
  search: string;
  activo: '' | 'true' | 'false';
  inhabilitado: '' | 'true' | 'false';
}

const defaultFilters: TiposClienteFilters = {
  search: '',
  activo: '',
  inhabilitado: '',
};

function buildParams(
  page: number,
  filters: TiposClienteFilters,
  pageSize: number
): Parameters<typeof getTiposClienteList>[0] {
  const params: Parameters<typeof getTiposClienteList>[0] = {
    page,
    page_size: pageSize,
    sort: 'descripcion',
    sort_dir: 'asc',
  };
  if (filters.search.trim()) params.search = filters.search.trim();
  if (filters.activo === 'true') params.activo = true;
  if (filters.activo === 'false') params.activo = false;
  if (filters.inhabilitado === 'true') params.inhabilitado = true;
  if (filters.inhabilitado === 'false') params.inhabilitado = false;
  return params;
}

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

export function TiposClientePage(): React.ReactElement {
  const navigate = useNavigate();
  const [data, setData] = useState<TipoClienteListItem[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: DEFAULT_PAGE_SIZE,
    total: 0,
    last_page: 1,
  });
  const [filters, setFilters] = useState<TiposClienteFilters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<TiposClienteFilters>(defaultFilters);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tipoToDelete, setTipoToDelete] = useState<TipoClienteListItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadTipos = useCallback(async (params: Parameters<typeof getTiposClienteList>[0]) => {
    setLoading(true);
    setErrorMessage('');
    const result = await getTiposClienteList(params);
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
      setErrorMessage(result.errorMessage || 'Error al cargar tipos de cliente');
      setData([]);
    }
  }, []);

  useEffect(() => {
    const params = buildParams(page, appliedFilters, DEFAULT_PAGE_SIZE);
    loadTipos(params);
  }, [page, appliedFilters, loadTipos]);

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, pagination.last_page)));
  };

  const handleDeleteClick = (t: TipoClienteListItem) => {
    setTipoToDelete(t);
    setDeleteError('');
  };

  const handleDeleteCancel = () => {
    setTipoToDelete(null);
    setDeleteError('');
  };

  const handleDeleteConfirm = async () => {
    if (!tipoToDelete) return;
    setDeleteLoading(true);
    setDeleteError('');
    const result = await deleteTipoCliente(tipoToDelete.id);
    setDeleteLoading(false);
    if (result.success) {
      setTipoToDelete(null);
      setSuccessMessage('Tipo de cliente eliminado correctamente.');
      loadTipos(buildParams(page, appliedFilters, DEFAULT_PAGE_SIZE));
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setDeleteError(
        result.errorCode === ERROR_TIENE_CLIENTES
          ? 'No se puede eliminar el tipo de cliente porque tiene clientes asociados.'
          : (result.errorMessage ?? 'Error al eliminar')
      );
    }
  };

  return (
    <div className="tipos-cliente-page" data-testid="tiposCliente.list">
      <header className="tipos-cliente-page-header">
        <h1 className="tipos-cliente-page-title">Tipos de Cliente</h1>
        <Button
          text="Crear tipo de cliente"
          type="default"
          onClick={() => navigate('/tipos-cliente/nuevo')}
          elementAttr={{ 'data-testid': 'tiposCliente.crear', 'aria-label': 'Crear tipo de cliente' }}
        />
      </header>

      <section className="tipos-cliente-page-filters" data-testid="tiposCliente.filters">
        <div className="tipos-cliente-filters-row">
          <label className="tipos-cliente-filter-label">
            <span className="tipos-cliente-filter-label-text">Búsqueda (código o descripción)</span>
            <TextBox
              value={filters.search}
              onValueChanged={(e) => setFilters((f) => ({ ...f, search: e.value ?? '' }))}
              placeholder="Buscar..."
              elementAttr={{ 'data-testid': 'tiposCliente.busqueda', 'aria-label': 'Búsqueda' }}
            />
          </label>
          <label className="tipos-cliente-filter-label">
            <span className="tipos-cliente-filter-label-text">Estado</span>
            <SelectBox
              dataSource={ESTADO_OPTIONS}
              value={filters.activo}
              onValueChanged={(e) => setFilters((f) => ({ ...f, activo: (e.value ?? '') as '' | 'true' | 'false' }))}
              displayExpr="text"
              valueExpr="value"
              elementAttr={{ 'data-testid': 'tiposCliente.filtroActivo', 'aria-label': 'Filtrar por activo' }}
            />
          </label>
          <label className="tipos-cliente-filter-label">
            <span className="tipos-cliente-filter-label-text">Inhabilitado</span>
            <SelectBox
              dataSource={INHABILITADO_OPTIONS}
              value={filters.inhabilitado}
              onValueChanged={(e) => setFilters((f) => ({ ...f, inhabilitado: (e.value ?? '') as '' | 'true' | 'false' }))}
              displayExpr="text"
              valueExpr="value"
              elementAttr={{ 'data-testid': 'tiposCliente.filtroInhabilitado', 'aria-label': 'Filtrar por inhabilitado' }}
            />
          </label>
          <Button
            text="Aplicar"
            type="default"
            onClick={handleApplyFilters}
            elementAttr={{ 'data-testid': 'tiposCliente.filters.apply', 'aria-label': 'Aplicar filtros' }}
          />
        </div>
      </section>

      {loading && (
        <div className="tipos-cliente-page-loading" data-testid="tiposCliente.loading" role="status">
          Cargando tipos de cliente...
        </div>
      )}

      {errorMessage && (
        <div className="tipos-cliente-page-error" data-testid="tiposCliente.error" role="alert">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="tipos-cliente-page-success" data-testid="tiposCliente.success" role="status">
          {successMessage}
        </div>
      )}

      {!loading && !errorMessage && (
        <>
          <p className="tipos-cliente-page-total" data-testid="tiposCliente.total">
            Total de tipos de cliente: <strong>{pagination.total}</strong>
          </p>

          {data.length === 0 ? (
            <p className="tipos-cliente-page-empty" data-testid="tiposCliente.empty" role="status">
              No se encontraron tipos de cliente.
            </p>
          ) : (
            <div className="tipos-cliente-table-wrapper">
              <DataGrid
                dataSource={data}
                keyExpr="id"
                showBorders={true}
                rowAlternationEnabled={true}
                onRowPrepared={(e) => {
                  if (e.rowType === 'data' && e.data?.inhabilitado) {
                    e.rowElement?.classList.add('tipos-cliente-table-row-inhabilitado');
                  }
                }}
                elementAttr={{ 'data-testid': 'tiposCliente.tabla', 'aria-label': 'Listado de tipos de cliente' }}
                noDataText=""
              >
                <Column dataField="code" caption="Código" width={100} />
                <Column dataField="descripcion" caption="Descripción" width={200} />
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
                  width={180}
                  allowSorting={false}
                  cellRender={({ data }: { data: TipoClienteListItem }) => (
                    <div className="tipos-cliente-actions-cell">
                      <Button
                        text="Editar"
                        type="normal"
                        stylingMode="text"
                        onClick={() => navigate(`/tipos-cliente/${data.id}/editar`)}
                        elementAttr={{ 'data-testid': `tiposCliente.editar.${data.id}`, 'aria-label': `Editar tipo ${data.code}` }}
                      />
                      <Button
                        text="Eliminar"
                        type="normal"
                        stylingMode="text"
                        onClick={() => handleDeleteClick(data)}
                        elementAttr={{ 'data-testid': `tiposCliente.eliminar.${data.id}`, 'aria-label': `Eliminar tipo ${data.code}` }}
                      />
                    </div>
                  )}
                />
              </DataGrid>
            </div>
          )}

          {pagination.last_page > 1 && (
            <TaskPagination
              currentPage={pagination.current_page}
              lastPage={pagination.last_page}
              total={pagination.total}
              perPage={pagination.per_page}
              onPageChange={handlePageChange}
              testIdPrefix="tiposCliente"
            />
          )}
        </>
      )}

      {tipoToDelete && (
        <div className="tipos-cliente-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="tipos-cliente-delete-title" data-testid="tiposCliente.delete.modal">
          <div className="tipos-cliente-modal">
            <h2 id="tipos-cliente-delete-title">Confirmar eliminación</h2>
            <p>
              ¿Eliminar el tipo de cliente <strong>{tipoToDelete.code}</strong> – {tipoToDelete.descripcion}?
            </p>
            {deleteError && <p className="tipos-cliente-modal-error" role="alert">{deleteError}</p>}
            <div className="tipos-cliente-modal-actions">
              <Button
                text="Cancelar"
                type="normal"
                onClick={handleDeleteCancel}
                disabled={deleteLoading}
                elementAttr={{ 'data-testid': 'tiposCliente.deleteCancel' }}
              />
              <Button
                text={deleteLoading ? 'Eliminando...' : 'Eliminar'}
                type="danger"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                elementAttr={{ 'data-testid': 'tiposCliente.deleteConfirm' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
