/**
 * Component: Dashboard
 *
 * Página principal del sistema después del login (TR-051).
 * Muestra KPIs del período, Top clientes, Top empleados (supervisor),
 * Distribución por tipo (cliente). Selector de período (mes actual por defecto).
 *
 * @see TR-001(MH)-login-de-empleado.md
 * @see TR-003(MH)-logout.md
 * @see TR-006(MH)-visualización-de-perfil-de-usuario.md
 * @see TR-051(MH)-dashboard-principal.md
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData } from '../shared/utils/tokenStorage';
import {
  getDashboard,
  DashboardData,
  DashboardParams,
} from '../features/tasks/services/task.service';
import './Dashboard.css';

function formatLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getDefaultPeriod(): { fechaDesde: string; fechaHasta: string } {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    fechaDesde: formatLocalDate(firstDay),
    fechaHasta: formatLocalDate(lastDay),
  };
}

/**
 * Componente Dashboard (contenido; header en AppLayout)
 */
export function Dashboard(): React.ReactElement {
  const navigate = useNavigate();
  const user = getUserData();
  const defaultPeriod = getDefaultPeriod();

  const [period, setPeriod] = useState<{ fechaDesde: string; fechaHasta: string }>(defaultPeriod);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const loadingRef = useRef(false);

  const loadDashboard = useCallback(async (params: DashboardParams) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setErrorMessage('');
    try {
      const result = await getDashboard(params);
      if (result.success && result.data) {
        setDashboardData(result.data);
        setErrorMessage('');
      } else {
        setErrorMessage(
          result.errorMessage || 'Error al cargar el dashboard'
        );
        setDashboardData(null);
      }
    } catch (err) {
      console.error('loadDashboard error:', err);
      setErrorMessage('Error al cargar el dashboard. Compruebe que el backend esté en marcha (php artisan serve).');
      setDashboardData(null);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user || !period.fechaDesde || !period.fechaHasta) return;
    loadDashboard({
      fecha_desde: period.fechaDesde,
      fecha_hasta: period.fechaHasta,
    });
  }, [user?.userId, period.fechaDesde, period.fechaHasta, loadDashboard]);

  useEffect(() => {
    if (!loading) return;
    const safetyTimeout = setTimeout(() => {
      setLoading((prev) => {
        if (!prev) return prev;
        setErrorMessage(
          'Tiempo de espera agotado. Compruebe que el backend esté en marcha en http://localhost:8000'
        );
        return false;
      });
    }, 20000);
    return () => clearTimeout(safetyTimeout);
  }, [loading]);

  const handlePeriodChange = (fechaDesde: string, fechaHasta: string) => {
    setPeriod((prev) => ({
      fechaDesde: fechaDesde || prev.fechaDesde,
      fechaHasta: fechaHasta || prev.fechaHasta,
    }));
  };

  const applyCurrentMonth = () => {
    const def = getDefaultPeriod();
    setPeriod(def);
  };

  if (!user) {
    return (
      <div className="dashboard-loading" data-testid="dashboard.loading">
        Cargando...
      </div>
    );
  }

  const isCliente = user.tipoUsuario === 'cliente';
  const isSupervisor = user.esSupervisor === true;

  return (
    <div className="dashboard-container" data-testid="dashboard.container">
      <div className="dashboard-main">
        <div className="welcome-card">
          <h2>Bienvenido, {user.nombre}</h2>
          <p>Código de usuario: <strong>{user.userCode}</strong></p>
          <p>Tipo: <strong>{user.tipoUsuario === 'usuario' ? 'Empleado' : 'Cliente'}</strong></p>
          {user.esSupervisor && (
            <p className="supervisor-text">Tiene permisos de supervisor</p>
          )}
          <div className="welcome-card-actions">
            <button
              onClick={() => navigate('/perfil')}
              className="profile-link-button"
              data-testid="app.profileLink"
              aria-label="Ver mi perfil"
            >
              Ver Mi Perfil
            </button>
            <button
              onClick={() => navigate('/informes/consulta-detallada')}
              className="profile-link-button"
              data-testid="app.consultaDetalladaLink"
              aria-label="Consulta detallada de tareas"
            >
              Consulta Detallada
            </button>
            <button
              onClick={() => navigate('/informes/tareas-por-cliente')}
              className="profile-link-button"
              data-testid="app.tareasPorClienteLink"
              aria-label="Tareas por cliente"
            >
              Tareas por Cliente
            </button>
            {user.tipoUsuario === 'usuario' && (
              <>
                <button
                  onClick={() => navigate('/tareas')}
                  className="profile-link-button"
                  data-testid="app.myTasksLink"
                  aria-label="Ver mis tareas"
                >
                  Mis Tareas
                </button>
                <button
                  onClick={() => navigate('/tareas/nueva')}
                  className="profile-link-button"
                  data-testid="app.createTaskLink"
                  aria-label="Cargar nueva tarea"
                >
                  Cargar Tarea
                </button>
              </>
            )}
          </div>
        </div>

        {/* Selector de período (TR-051) */}
        <section className="dashboard-section dashboard-period-section" data-testid="dashboard.periodSelector">
          <h3>Período</h3>
          <div className="dashboard-period-controls">
            <label>
              <span>Desde</span>
              <input
                type="date"
                value={period.fechaDesde}
                onChange={(e) => handlePeriodChange(e.target.value, period.fechaHasta)}
                data-testid="dashboard.periodDesde"
                aria-label="Fecha desde"
              />
            </label>
            <label>
              <span>Hasta</span>
              <input
                type="date"
                value={period.fechaHasta}
                onChange={(e) => handlePeriodChange(period.fechaDesde, e.target.value)}
                data-testid="dashboard.periodHasta"
                aria-label="Fecha hasta"
              />
            </label>
            <button
              type="button"
              onClick={applyCurrentMonth}
              className="dashboard-btn-secondary"
              data-testid="dashboard.periodCurrentMonth"
              aria-label="Usar mes actual"
            >
              Mes actual
            </button>
          </div>
        </section>

        {loading && (
          <div className="dashboard-loading dashboard-loading-block" data-testid="dashboard.loading" role="status">
            Cargando datos del dashboard...
          </div>
        )}

        {errorMessage && (
          <div className="dashboard-error" data-testid="dashboard.error" role="alert">
            {errorMessage}
          </div>
        )}

        {!loading && !errorMessage && dashboardData && (
          <>
            {/* KPIs (TR-051) */}
            <section className="dashboard-section dashboard-kpis" data-testid="dashboard.kpis">
              <h3>Resumen del período</h3>
              <div className="dashboard-kpi-cards">
                <div className="dashboard-kpi-card" data-testid="dashboard.kpi.totalHoras">
                  <span className="dashboard-kpi-label">Total horas</span>
                  <span className="dashboard-kpi-value">{dashboardData.total_horas}</span>
                </div>
                <div className="dashboard-kpi-card" data-testid="dashboard.kpi.cantidadTareas">
                  <span className="dashboard-kpi-label">Cantidad de tareas</span>
                  <span className="dashboard-kpi-value">{dashboardData.cantidad_tareas}</span>
                </div>
                <div className="dashboard-kpi-card" data-testid="dashboard.kpi.promedioHoras">
                  <span className="dashboard-kpi-label">Promedio horas/día</span>
                  <span className="dashboard-kpi-value">{dashboardData.promedio_horas_por_dia}</span>
                </div>
              </div>
            </section>

            {/* Dedicación por Cliente (TR-052) / Top clientes (TR-051): empleado y supervisor */}
            {!isCliente && (
              <section
                className="dashboard-section"
                data-testid="dashboard.dedicacionCliente"
                aria-labelledby="dashboard.dedicacionCliente.title"
              >
                <div data-testid="dashboard.topClientes">
                <h3 id="dashboard.dedicacionCliente.title">Dedicación por Cliente</h3>
                {dashboardData.top_clientes.length === 0 ? (
                  <p className="dashboard-empty" role="status" data-testid="dashboard.dedicacionCliente.empty">
                    No se encontraron tareas para los filtros seleccionados.
                  </p>
                ) : (
                  <>
                    <ul className="dashboard-list" data-testid="dashboard.dedicacionCliente.lista">
                      {dashboardData.top_clientes.map((c) => (
                        <li key={c.cliente_id} className="dashboard-list-item dashboard-list-item-with-action">
                          <span className="dashboard-list-name">{c.nombre}</span>
                          <span className="dashboard-list-hours">{c.total_horas} h</span>
                          <span className="dashboard-list-count">{c.cantidad_tareas} tareas</span>
                          {c.porcentaje != null && (
                            <span className="dashboard-list-pct">{c.porcentaje}%</span>
                          )}
                          <a
                            href={`/informes/tareas-por-cliente?cliente_id=${c.cliente_id}&fecha_desde=${period.fechaDesde}&fecha_hasta=${period.fechaHasta}`}
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(
                                `/informes/tareas-por-cliente?cliente_id=${c.cliente_id}&fecha_desde=${period.fechaDesde}&fecha_hasta=${period.fechaHasta}`
                              );
                            }}
                            className="dashboard-link-detalle"
                            data-testid={`dashboard.dedicacionCliente.linkDetalle.${c.cliente_id}`}
                            aria-label={`Ver detalle de ${c.nombre}`}
                          >
                            Ver detalle
                          </a>
                        </li>
                      ))}
                    </ul>
                    <p className="dashboard-total-general" data-testid="dashboard.dedicacionCliente.totalGeneral">
                      Total general: <strong>{dashboardData.total_horas} h</strong>
                    </p>
                  </>
                )}
                </div>
              </section>
            )}

            {/* Top empleados (solo supervisor) */}
            {isSupervisor && !isCliente && (
              <section className="dashboard-section" data-testid="dashboard.topEmpleados">
                <h3>Top empleados</h3>
                {dashboardData.top_empleados.length === 0 ? (
                  <p className="dashboard-empty" role="status">
                    No hay datos de empleados en el período.
                  </p>
                ) : (
                  <ul className="dashboard-list">
                    {dashboardData.top_empleados.map((e) => (
                      <li key={e.usuario_id} className="dashboard-list-item">
                        <span className="dashboard-list-name">{e.nombre} ({e.code})</span>
                        <span className="dashboard-list-hours">{e.total_horas} h</span>
                        <span className="dashboard-list-count">{e.cantidad_tareas} tareas</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {/* Distribución por tipo (solo cliente) */}
            {isCliente && (
              <section className="dashboard-section" data-testid="dashboard.distribucionTipo">
                <h3>Distribución por tipo de tarea</h3>
                {dashboardData.distribucion_por_tipo.length === 0 ? (
                  <p className="dashboard-empty" role="status">
                    No se encontraron tareas para los filtros seleccionados.
                  </p>
                ) : (
                  <ul className="dashboard-list">
                    {dashboardData.distribucion_por_tipo.map((d) => (
                      <li key={d.tipo_tarea_id} className="dashboard-list-item">
                        <span className="dashboard-list-name">{d.descripcion}</span>
                        <span className="dashboard-list-hours">{d.total_horas} h</span>
                        <span className="dashboard-list-count">{d.cantidad_tareas} tareas</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {/* Estado vacío global (HU-050): período con cero tareas */}
            {dashboardData.cantidad_tareas === 0 && (
              <p className="dashboard-empty dashboard-empty-global" role="status">
                No se encontraron tareas para los filtros seleccionados.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
