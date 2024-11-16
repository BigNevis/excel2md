import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../components/App'; // Ajusta la ruta si `App.tsx` no está aquí
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
