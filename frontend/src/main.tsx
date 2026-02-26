/**
 * Punto de entrada de la aplicación React
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import config from 'devextreme/core/config';
import { licenseKey } from './devextreme-license';
import { App } from './app/App';

// Configurar licencia DevExtreme antes de renderizar cualquier componente
config({ licenseKey });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
