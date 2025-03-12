import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Récupérer l'état initial fourni par le serveur
const initialState = window.__INITIAL_STATE__ || {
  language: 'fr',
  theme: {
    isDark: true,
    secondaryColor: '#6667AB'
  }
};

// Utiliser hydrateRoot au lieu de createRoot pour l'hydratation SSR
const rootElement = document.getElementById('root');

// En développement, utiliser createRoot pour éviter les avertissements d'hydratation
if (process.env.NODE_ENV === 'development') {
  const { createRoot } = require('react-dom/client');
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App initialState={initialState} />
    </React.StrictMode>
  );
} else {
  // En production, utiliser hydrateRoot pour l'hydratation SSR
  hydrateRoot(
    rootElement,
    <React.StrictMode>
      <App initialState={initialState} />
    </React.StrictMode>
  );
}
