/**
 * Component: ClientesPage
 *
 * Listado paginado de clientes (solo supervisores). TR-008(MH).
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
  getClientes,
  getTiposCliente,
  deleteCliente,
  ClienteListItem,
  TipoClienteItem,
} from '../services/client.service';
import { TaskPagination } from '../../tasks/components/TaskPagination';
import './ClientesPage.css';

const DEFAULT_PAGE_SIZE = 15;

export interface ClientesFilters {
  search: string;
  tipoClienteId: number | null;
  activo: '' | 'true' | 'false';
  inhabilitado: '' | 'true' | 'false';
}

const defaultFilters: ClientesFilters = {
  search: '',
  tipoClienteId: null,
  activo: '',
  inhabilitado: '',
};

function buildParams(
  page: number,
  filters: ClientesFilters,
  pageSize: number
): Parameters<typeof getClientes>[0] {
  const params: Parameters<typeof getClientes>[0] = {
    page,
    page_size: pageSize,
    sort: 'nombre',
    sort_dir: 'asc',
  };
  if (filters.search.trim()) params.search = filters.search.trim();
  if (filters.tipoClienteId != null) params.tipo_cliente_id = filters.tipoClienteId;
  if (filters.activo === 'true') params.activo = true;
  if (filters.activo === 'false') params.activo = false;
  if (filters.inhabilitado === 'true') params.inhabilitado = true;
  if (filters.inhabilitado === 'false') params.inhabilitado = false;
  return params;
}

export function ClientesPage(): React.ReactElement {
  const navigate = useNavigate();
  const [data, setData] = useState<ClienteListItem[]>([]);
  const [tiposCliente, setTiposCliente] = useState<TipoClienteItem[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: DEFAULT_PAGE_SIZE,
    total: 0,
    last_page: 1,
  });
  const [filters, setFilters] = useState<ClientesFilters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<ClientesFilters>(defaultFilters);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [clienteToDelete, setClienteToDelete] = useState<ClienteListItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadClientes = useCallback(
    async (params: Parameters<typeof getClientes>[0]) => {
      setLoading(true);
      setErrorMessage('');
      const result = await getClientes(params);
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
        setErrorMessage(result.errorMessage || 'Error al cargar clientes');
        setData([]);
      }
    },
    []
  );

  const loadTiposCliente = useCallback(async () => {
    const result = await getTiposCliente();
    if (result.success && result.data) setTiposCliente(result.data);
  }, []);

  useEffect(() => {
    loadTiposCliente();
  }, [loadTiposCliente]);

  useEffect(() => {
    const params = buildParams(page, appliedFilters, DEFAULT_PAGE_SIZE);
    loadClientes(params);
  }, [page, appliedFilters, loadClientes]);

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, pagination.last_page)));
  };

  const handleDeleteClick = (cliente: ClienteListItem) => {
    setClienteToDelete(cliente);
    setDeleteError('');
  };

  const handleDeleteCancel = () => {
    setClienteToDelete(null);
    setDeleteError('');
  };

  const handleDeleteConfirm = async () => {
    if (!clienteToDelete) return;
    setDeleteLoading(true);
    setDeleteError('');
    const result = await deleteCliente(clienteToDelete.id);
    setDeleteLoading(false);
    if (result.success) {
      setClienteToDelete(null);
      setSuccessMessage('Cliente eliminado correctamente.');
      const params = buildParams(page, appliedFilters, DEFAULT_PAGE_SIZE);
      await loadClientes(params);
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setDeleteError(result.errorMessage || 'Error al eliminar cliente');
    }
  };

  return (
    <div className="clientes-page" data-testid="clientes.list">
      <header className="clientes-page-header">
        <h1 className="clientes-page-title">Clientes</h1>
        <Button
          text="Crear cliente"
          type="default"
          onClick={() => navigate('/clientes/nueva')}
          elementAttr={{ 'data-testid': 'clientes.create', 'aria-label': 'Crear cliente' }}
        />
      </header>

      <section className="clientes-page-filters" data-testid="clientes.filters">
        <div className="clientes-filters-row">
          <label className="clientes-filter-label">
            <span className="clientes-filter-label-text">Búsqueda (código o nombre)</span>
            <TextBox
              value={filters.search}
              onValueChanged={(e) => setFilters((f) => ({ ...f, search: e.value ?? '' }))}
              placeholder="Buscar..."
              elementAttr={{ 'data-testid': 'clientes.search', 'aria-label': 'Búsqueda por código o nombre' }}
            />
          </label>
          <label className="clientes-filter-label">
            <span className="clientes-filter-label-text">Tipo de cliente</span>
            <SelectBox
              dataSource={[{ id: -1, descripcion: 'Todos' }, ...tiposCliente]}
              value={filters.tipoClienteId ?? -1}
              onValueChanged={(e) => {
                const v = e.value ?? -1;
                setFilters((f) => ({ ...f, tipoClienteId: v === -1 ? null : v }));
              }}
              displayExpr="descripcion"
              valueExpr="id"
              elementAttr={{ 'data-testid': 'clientes.filter.tipoCliente', 'aria-label': 'Filtrar por tipo de cliente' }}
            />
          </label>
          <label className="clientes-filter-label">
            <span className="clientes-filter-label-text">Estado</span>
            <SelectBox
              dataSource={[
                { value: '', text: 'Todos' },
                { value: 'true', text: 'Activo' },
                { value: 'false', text: 'Inactivo' },
              ]}
              value={filters.activo}
              onValueChanged={(e) => setFilters((f) => ({ ...f, activo: (e.value ?? '') as '' | 'true' | 'false' }))}
              displayExpr="text"
              valueExpr="value"
              elementAttr={{ 'data-testid': 'clientes.filter.activo', 'aria-label': 'Filtrar por estado activo' }}
            />
          </label>
          <label className="clientes-filter-label">
            <span className="clientes-filter-label-text">Inhabilitado</span>
            <SelectBox
              dataSource={[
                { value: '', text: 'Todos' },
                { value: 'false', text: 'No' },
                { value: 'true', text: 'Sí' },
              ]}
              value={filters.inhabilitado}
              onValueChanged={(e) => setFilters((f) => ({ ...f, inhabilitado: (e.value ?? '') as '' | 'true' | 'false' }))}
              displayExpr="text"
              valueExpr="value"
              elementAttr={{ 'data-testid': 'clientes.filter.inhabilitado', 'aria-label': 'Filtrar por inhabilitado' }}
            />
          </label>
          <Button
            text="Aplicar"
            type="default"
            onClick={handleApplyFilters}
            elementAttr={{ 'data-testid': 'clientes.filters.apply', 'aria-label': 'Aplicar filtros' }}
          />
        </div>
      </section>

      {loading && (
        <div className="clientes-page-loading" data-testid="clientes.loading" role="status">
          Cargando clientes...
        </div>
      )}

      {errorMessage && (
        <div className="clientes-page-error" data-testid="clientes.error" role="alert">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="clientes-page-success" data-testid="clientes.success" role="status">
          {successMessage}
        </div>
      )}

      {!loading && !errorMessage && (
        <>
          <p className="clientes-page-total" data-testid="clientes.total">
            Total de clientes: <strong>{pagination.total}</strong>
          </p>

          {data.length === 0 ? (
            <p className="clientes-page-empty" data-testid="clientes.empty" role="status">
              No se encontraron clientes.
            </p>
          ) : (
            <div className="clientes-table-wrapper">
              <DataGrid
                dataSource={data}
                keyExpr="id"
                showBorders={true}
                rowAlternationEnabled={true}
                onRowPrepared={(e) => {
                  if (e.rowType === 'data' && e.data?.inhabilitado) {
                    e.rowElement?.classList.add('clientes-table-row-inhabilitado');
                  }
                }}
                elementAttr={{ 'data-testid': 'clientes.table', 'aria-label': 'Listado de clientes' }}
                noDataText=""
              >
                <Column dataField="code" caption="Código" width={100} />
                <Column dataField="nombre" caption="Nombre" width={180} />
                <Column
                  dataField="tipo_cliente.descripcion"
                  caption="Tipo de cliente"
                  width={140}
                  customizeText={({ value }) => value ?? '—'}
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
                  width={220}
                  allowSorting={false}
                  cellRender={({ data }: { data: ClienteListItem }) => (
                    <div className="clientes-actions-cell">
                      <Button
                        text="Ver"
                        type="normal"
                        stylingMode="text"
                        onClick={() => navigate(`/clientes/${data.id}`)}
                        elementAttr={{ 'data-testid': `clientes.ver.${data.id}`, 'aria-label': `Ver detalle de ${data.nombre}` }}
                      />
                      <Button
                        text="Editar"
                        type="normal"
                        stylingMode="text"
                        onClick={() => navigate(`/clientes/${data.id}/editar`)}
                        elementAttr={{ 'data-testid': `clientes.edit.${data.id}`, 'aria-label': `Editar cliente ${data.nombre}` }}
                      />
                      <Button
                        text="Eliminar"
                        type="normal"
                        stylingMode="text"
                        onClick={() => handleDeleteClick(data)}
                        elementAttr={{ 'data-testid': `clientes.row.${data.id}.delete`, 'aria-label': `Eliminar cliente ${data.nombre}` }}
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

      {clienteToDelete && (
        <div
          className="clientes-delete-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="clientes-delete-modal-title"
          data-testid="clientes.delete.modal"
        >
          <div className="clientes-delete-modal">
            <h2 id="clientes-delete-modal-title" className="clientes-delete-modal-title">
              Eliminar cliente
            </h2>
            <p className="clientes-delete-modal-text">
              ¿Está seguro de eliminar el cliente <strong data-testid="clientes.delete.code">{clienteToDelete.code}</strong> – <strong data-testid="clientes.delete.nombre">{clienteToDelete.nombre}</strong>?
            </p>
            {deleteError && (
              <div className="clientes-delete-modal-error" role="alert" data-testid="clientes.delete.error">
                {deleteError}
              </div>
            )}
            <div className="clientes-delete-modal-actions">
              <Button
                text="Cancelar"
                type="normal"
                onClick={handleDeleteCancel}
                disabled={deleteLoading}
                elementAttr={{ 'data-testid': 'clientes.delete.cancel' }}
              />
              <Button
                text={deleteLoading ? 'Eliminando...' : 'Confirmar'}
                type="danger"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                elementAttr={{ 'data-testid': 'clientes.delete.confirm', 'aria-busy': deleteLoading ? 'true' : 'false' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientesPage;
