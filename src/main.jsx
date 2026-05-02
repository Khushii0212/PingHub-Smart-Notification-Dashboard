import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import logger from './utils/logger';

logger.info('CampusNotify starting up', 'main', {
  version: '1.0.0',
  env: import.meta.env.MODE,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
