/**
 * Component: App
 *
 * Componente raíz de la aplicación.
 * Configura el router y las rutas principales.
 * El header (AppLayout) permanece visible en todas las pantallas autenticadas.
 *
 * @see TR-001(MH)-login-de-empleado.md
 * @see docs/frontend/frontend-specifications.md (Layout general y navegación)
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm, ForgotPasswordPage, ResetPasswordPage } from '../features/auth';
import { ProfileView } from '../features/user';
import { TaskForm, TaskList, TaskListAll, TaskEditPage, ConsultaDetalladaPage, TareasPorClientePage } from '../features/tasks';
import { ClientesPage, ClientesNuevaPage, ClientesEditarPage } from '../features/clients';
import { EmpleadosPage, EmpleadosNuevoPage, EmpleadosEditarPage, EmpleadosDetallePage } from '../features/employees';
import { ProtectedRoute, PublicRoute } from '../routes';
import { EmployeeRoute } from '../routes/EmployeeRoute';
import { SupervisorRoute } from '../routes/SupervisorRoute';
import { AppLayout } from './AppLayout';
import { Dashboard } from './Dashboard';
import './App.css';

/**
 * Componente App principal
 */
export function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta de login (pública) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginForm />
            </PublicRoute>
          }
        />
        {/* Recuperación de contraseña (públicas) @see TR-004(SH) */}
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPasswordPage />
            </PublicRoute>
          }
        />

        {/* Rutas protegidas: layout con header común + Outlet */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="perfil" element={<ProfileView />} />
          <Route
            path="informes/consulta-detallada"
            element={<ConsultaDetalladaPage />}
          />
          <Route
            path="informes/tareas-por-cliente"
            element={<TareasPorClientePage />}
          />
          <Route
            path="clientes"
            element={
              <SupervisorRoute>
                <ClientesPage />
              </SupervisorRoute>
            }
          />
          <Route
            path="clientes/nueva"
            element={
              <SupervisorRoute>
                <ClientesNuevaPage />
              </SupervisorRoute>
            }
          />
          <Route
            path="clientes/:id/editar"
            element={
              <SupervisorRoute>
                <ClientesEditarPage />
              </SupervisorRoute>
            }
          />
          <Route
            path="empleados"
            element={
              <SupervisorRoute>
                <EmpleadosPage />
              </SupervisorRoute>
            }
          />
          <Route
            path="empleados/nuevo"
            element={
              <SupervisorRoute>
                <EmpleadosNuevoPage />
              </SupervisorRoute>
            }
          />
          <Route
            path="empleados/:id/editar"
            element={
              <SupervisorRoute>
                <EmpleadosEditarPage />
              </SupervisorRoute>
            }
          />
          <Route
            path="empleados/:id"
            element={
              <SupervisorRoute>
                <EmpleadosDetallePage />
              </SupervisorRoute>
            }
          />
          <Route
            path="tareas"
            element={
              <EmployeeRoute>
                <TaskList />
              </EmployeeRoute>
            }
          />
          <Route
            path="tareas/todas"
            element={
              <SupervisorRoute>
                <TaskListAll />
              </SupervisorRoute>
            }
          />
          <Route
            path="tareas/nueva"
            element={
              <EmployeeRoute>
                <TaskForm />
              </EmployeeRoute>
            }
          />
          <Route
            path="tareas/:id/editar"
            element={
              <EmployeeRoute>
                <TaskEditPage />
              </EmployeeRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
