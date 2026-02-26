/**
 * Component: TiposTareaPage
 *
 * Listado paginado de tipos de tarea (solo supervisores). TR-023(MH).
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
  getTiposTareaList,
  deleteTipoTarea,
  TipoTareaListItem,
  ERROR_EN_USO,
} from '../services/tipoTarea.service';
import { TaskPagination } from '../../tasks/components/TaskPagination';
import './TiposTareaPage.css';

const DEFAULT_PAGE_SIZE = 15;

export interface TiposTareaFilters {
  search: string;
  is_generico: '' | 'true' | 'false';
  is_default: '' | 'true' | 'false';
  activo: '' | 'true' | 'false';
  inhabilitado: '' | 'true' | 'false';
}

const defaultFilters: TiposTareaFilters = {
  search: '',
  is_generico: '',
  is_default: '',
  activo: '',
  inhabilitado: '',
};

function buildParams(
  page: number,
  filters: TiposTareaFilters,
  pageSize: number
): Parameters<typeof getTiposTareaList>[0] {
  const params: Parameters<typeof getTiposTareaList>[0] = {
    page,
    page_size: pageSize,
    sort: 'descripcion',
    sort_dir: 'asc',
  };
  if (filters.search.trim()) params.search = filters.search.trim();
  if (filters.is_generico === 'true') params.is_generico = true;
  if (filters.is_generico === 'false') params.is_generico = false;
  if (filters.is_default === 'true') params.is_default = true;
  if (filters.is_default === 'false') params.is_default = false;
  if (filters.activo === 'true') params.activo = true;
  if (filters.activo === 'false') params.activo = false;
  if (filters.inhabilitado === 'true') params.inhabilitado = true;
  if (filters.inhabilitado === 'false') params.inhabilitado = false;
  return params;
}

const SI_NO_OPTIONS = [
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

export function TiposTareaPage(): React.ReactElement {
  const navigate = useNavigate();
  const [data, setData] = useState<TipoTareaListItem[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: DEFAULT_PAGE_SIZE,
    total: 0,
    last_page: 1,
  });
  const [filters, setFilters] = useState<TiposTareaFilters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<TiposTareaFilters>(defaultFilters);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tipoToDelete, setTipoToDelete] = useState<TipoTareaListItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadTipos = useCallback(async (params: Parameters<typeof getTiposTareaList>[0]) => {
    setLoading(true);
    setErrorMessage('');
    const result = await getTiposTareaList(params);
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
      setErrorMessage(result.errorMessage || 'Error al cargar tipos de tarea');
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

  const handleDeleteClick = (t: TipoTareaListItem) => {
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
    const result = await deleteTipoTarea(tipoToDelete.id);
    setDeleteLoading(false);
    if (result.success) {
      setTipoToDelete(null);
      setSuccessMessage('Tipo de tarea eliminado correctamente.');
      loadTipos(buildParams(page, appliedFilters, DEFAULT_PAGE_SIZE));
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setDeleteError(
        result.errorCode === ERROR_EN_USO
          ? 'No se puede eliminar el tipo de tarea porque está en uso (tareas o clientes asociados).'
          : (result.errorMessage ?? 'Error al eliminar')
      );
    }
  };

  return (
    <div className="tipos-tarea-page" data-testid="tiposTarea.list">
      <header className="tipos-tarea-page-header">
        <h1 className="tipos-tarea-page-title">Tipos de Tarea</h1>
        <Button
          text="Crear tipo de tarea"
          type="default"
          onClick={() => navigate('/tipos-tarea/nuevo')}
          elementAttr={{ 'data-testid': 'tiposTarea.crear', 'aria-label': 'Crear tipo de tarea' }}
        />
      </header>

      <section className="tipos-tarea-page-filters" data-testid="tiposTarea.filters">
        <div className="tipos-tarea-filters-row">
          <label className="tipos-tarea-filter-label">
            <span className="tipos-tarea-filter-label-text">Búsqueda (código o descripción)</span>
            <TextBox
              value={filters.search}
              onValueChanged={(e) => setFilters((f) => ({ ...f, search: e.value ?? '' }))}
              placeholder="Buscar..."
              elementAttr={{ 'data-testid': 'tiposTarea.busqueda', 'aria-label': 'Búsqueda' }}
            />
          </label>
          <label className="tipos-tarea-filter-label">
            <span className="tipos-tarea-filter-label-text">Genérico</span>
            <SelectBox
              dataSource={SI_NO_OPTIONS}
              value={filters.is_generico}
              onValueChanged={(e) => setFilters((f) => ({ ...f, is_generico: (e.value ?? '') as '' | 'true' | 'false' }))}
              displayExpr="text"
              valueExpr="value"
              elementAttr={{ 'data-testid': 'tiposTarea.filtroGenerico', 'aria-label': 'Filtrar por genérico' }}
            />
          </label>
          <label className="tipos-tarea-filter-label">
            <span className="tipos-tarea-filter-label-text">Por defecto</span>
            <SelectBox
              dataSource={SI_NO_OPTIONS}
              value={filters.is_default}
              onValueChanged={(e) => setFilters((f) => ({ ...f, is_default: (e.value ?? '') as '' | 'true' | 'false' }))}
              displayExpr="text"
              valueExpr="value"
              elementAttr={{ 'data-testid': 'tiposTarea.filtroPorDefecto', 'aria-label': 'Filtrar por defecto' }}
            />
          </label>
          <label className="tipos-tarea-filter-label">
            <span className="tipos-tarea-filter-label-text">Estado</span>
            <SelectBox
              dataSource={ESTADO_OPTIONS}
              value={filters.activo}
              onValueChanged={(e) => setFilters((f) => ({ ...f, activo: (e.value ?? '') as '' | 'true' | 'false' }))}
              displayExpr="text"
              valueExpr="value"
              elementAttr={{ 'data-testid': 'tiposTarea.filtroActivo', 'aria-label': 'Filtrar por activo' }}
            />
          </label>
          <label className="tipos-tarea-filter-label">
            <span className="tipos-tarea-filter-label-text">Inhabilitado</span>
            <SelectBox
              dataSource={INHABILITADO_OPTIONS}
              value={filters.inhabilitado}
              onValueChanged={(e) => setFilters((f) => ({ ...f, inhabilitado: (e.value ?? '') as '' | 'true' | 'false' }))}
              displayExpr="text"
              valueExpr="value"
              elementAttr={{ 'data-testid': 'tiposTarea.filtroInhabilitado', 'aria-label': 'Filtrar por inhabilitado' }}
            />
          </label>
          <Button
            text="Aplicar"
            type="default"
            onClick={handleApplyFilters}
            elementAttr={{ 'data-testid': 'tiposTarea.filters.apply', 'aria-label': 'Aplicar filtros' }}
          />
        </div>
      </section>

      {loading && (
        <div className="tipos-tarea-page-loading" data-testid="tiposTarea.loading" role="status">
          Cargando tipos de tarea...
        </div>
      )}

      {errorMessage && (
        <div className="tipos-tarea-page-error" data-testid="tiposTarea.error" role="alert">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="tipos-tarea-page-success" data-testid="tiposTarea.success" role="status">
          {successMessage}
        </div>
      )}

      {!loading && !errorMessage && (
        <>
          <p className="tipos-tarea-page-total" data-testid="tiposTarea.total">
            Total de tipos de tarea: <strong>{pagination.total}</strong>
          </p>

          {data.length === 0 ? (
            <p className="tipos-tarea-page-empty" data-testid="tiposTarea.empty" role="status">
              No se encontraron tipos de tarea.
            </p>
          ) : (
            <div className="tipos-tarea-table-wrapper">
              <DataGrid
                dataSource={data}
                keyExpr="id"
                showBorders={true}
                rowAlternationEnabled={true}
                onRowPrepared={(e) => {
                  if (e.rowType === 'data' && e.data) {
                    if (e.data.inhabilitado) e.rowElement?.classList.add('tipos-tarea-table-row-inhabilitado');
                    else if (e.data.is_default) e.rowElement?.classList.add('tipos-tarea-table-row-por-defecto');
                  }
                }}
                elementAttr={{ 'data-testid': 'tiposTarea.tabla', 'aria-label': 'Listado de tipos de tarea' }}
                noDataText=""
              >
                <Column dataField="code" caption="Código" width={100} />
                <Column dataField="descripcion" caption="Descripción" width={200} />
                <Column
                  dataField="is_generico"
                  caption="Genérico"
                  width={90}
                  customizeText={({ value }) => (value ? 'Sí' : 'No')}
                />
                <Column
                  dataField="is_default"
                  caption="Por defecto"
                  width={100}
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
                  width={220}
                  allowSorting={false}
                  cellRender={({ data }: { data: TipoTareaListItem }) => (
                    <div className="tipos-tarea-actions-cell">
                      <Button
                        text="Ver"
                        type="normal"
                        stylingMode="text"
                        onClick={() => navigate(`/tipos-tarea/${data.id}`)}
                        elementAttr={{ 'data-testid': `tiposTarea.ver.${data.id}`, 'aria-label': `Ver detalle de ${data.code}` }}
                      />
                      <Button
                        text="Editar"
                        type="normal"
                        stylingMode="text"
                        onClick={() => navigate(`/tipos-tarea/${data.id}/editar`)}
                        elementAttr={{ 'data-testid': `tiposTarea.editar.${data.id}`, 'aria-label': `Editar tipo ${data.code}` }}
                      />
                      <Button
                        text="Eliminar"
                        type="normal"
                        stylingMode="text"
                        onClick={() => handleDeleteClick(data)}
                        elementAttr={{ 'data-testid': `tiposTarea.eliminar.${data.id}`, 'aria-label': `Eliminar tipo ${data.code}` }}
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
              testIdPrefix="tiposTarea"
            />
          )}
        </>
      )}

      {tipoToDelete && (
        <div className="tipos-tarea-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="tipos-tarea-delete-title" data-testid="tiposTarea.delete.modal">
          <div className="tipos-tarea-modal">
            <h2 id="tipos-tarea-delete-title">Confirmar eliminación</h2>
            <p>
              ¿Eliminar el tipo de tarea <strong>{tipoToDelete.code}</strong> – {tipoToDelete.descripcion}?
            </p>
            {deleteError && <p className="tipos-tarea-modal-error" role="alert">{deleteError}</p>}
            <div className="tipos-tarea-modal-actions">
              <Button
                text="Cancelar"
                type="normal"
                onClick={handleDeleteCancel}
                disabled={deleteLoading}
                elementAttr={{ 'data-testid': 'tiposTarea.deleteCancel' }}
              />
              <Button
                text={deleteLoading ? 'Eliminando...' : 'Eliminar'}
                type="danger"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                elementAttr={{ 'data-testid': 'tiposTarea.deleteConfirm' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
