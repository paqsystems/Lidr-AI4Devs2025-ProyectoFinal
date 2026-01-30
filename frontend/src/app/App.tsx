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
import { LoginForm } from '../features/auth';
import { ProfileView } from '../features/user';
import { TaskForm, TaskList } from '../features/tasks';
import { ProtectedRoute, PublicRoute } from '../routes';
import { EmployeeRoute } from '../routes/EmployeeRoute';
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
            path="tareas"
            element={
              <EmployeeRoute>
                <TaskList />
              </EmployeeRoute>
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
