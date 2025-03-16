import React, { useEffect, useState } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Wrapper qui résout les problèmes d'hydratation
function ClientOnlyRender({ children }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return mounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>;
}

// Récupérer l'état initial fourni par le serveur
const initialState = window.__INITIAL_STATE__ || {
  language: 'fr',
  theme: {
    isDark: true,
    secondaryColor: '#6667AB'
  }
};

const rootElement = document.getElementById('root');

// Détection basée sur la présence de contenu HTML prérendu
const hasPrerenderedContent = rootElement.innerHTML.trim().length > 0;

if (!hasPrerenderedContent) {
  // Pas de contenu prérendu, utiliser createRoot
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App initialState={initialState} />
    </React.StrictMode>
  );
} else {
  // Avec contenu prérendu, utiliser hydrateRoot et le wrapper pour résoudre les problèmes
  hydrateRoot(
    rootElement,
    <React.StrictMode>
      <ClientOnlyRender>
        <App initialState={initialState} />
      </ClientOnlyRender>
    </React.StrictMode>
  );
}