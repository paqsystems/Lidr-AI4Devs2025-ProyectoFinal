/**
 * Component: App
 * 
 * Componente raíz de la aplicación.
 * Configura el router y las rutas principales.
 * 
 * @see TR-001(MH)-login-de-empleado.md
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginForm } from '../features/auth';
import { ProfileView } from '../features/user';
import { TaskForm } from '../features/tasks';
import { ProtectedRoute, PublicRoute } from '../routes';
import { EmployeeRoute } from '../routes/EmployeeRoute';
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
        
        {/* Dashboard (protegida) */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Perfil de usuario (protegida) */}
        <Route 
          path="/perfil" 
          element={
            <ProtectedRoute>
              <ProfileView />
            </ProtectedRoute>
          } 
        />
        
        {/* Cargar tarea diaria (solo para empleados) */}
        <Route 
          path="/tareas/nueva" 
          element={
            <EmployeeRoute>
              <TaskForm />
            </EmployeeRoute>
          } 
        />
        
        {/* Ruta por defecto - redirige a login o dashboard */}
        <Route 
          path="*" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
