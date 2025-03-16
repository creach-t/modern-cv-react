const express = require('express');
const fs = require('fs');
const path = require('path');

// Ajouter ces polyfills avant d'importer React et vos composants
global.SVGElement = function() {};
global.HTMLElement = function() {};
global.Element = function() {};
global.document = global.document || {
  createElement: () => ({}),
  head: { appendChild: () => {} },
  createElementNS: () => ({}),
  getElementById: () => null
};
global.window = global.window || {
  addEventListener: () => {},
  removeEventListener: () => {},
  innerWidth: 1200,
  innerHeight: 800
};
global.navigator = { userAgent: 'node' };
global.requestAnimationFrame = () => 0;
global.cancelAnimationFrame = () => {};

// Maintenant importer React et autres dépendances
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { Helmet } = require('react-helmet');
const loadable = require('@loadable/component');

// Importer l'application React
const App = require('../src/App').default;

// Le reste de votre code reste inchangé
const app = express();
const PORT = process.env.PORT || 2585;

// Servir les assets statiques du dossier public (pour le développement)
app.use(express.static(path.resolve(__dirname, '../build')));

// Cette fonction sert à ajouter les données initiales pour l'hydratation
const getInitialState = (req) => {
  return {
    language: 'fr',
    theme: {
      isDark: true,
      secondaryColor: '#6667AB'
    }
  };
};

// Générer une page HTML simple pour le développement
const generateHTML = (appHtml, initialState, helmetData = {}) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${helmetData.title || '<title>Théo Créach - CV</title>'}
        ${helmetData.meta || ''}
        ${helmetData.link || ''}
        <link rel="stylesheet" href="/css/index.css">
      </head>
      <body>
        <div id="root">${appHtml}</div>
        <script>
          // Définir process avant tout autre script
          window.process = { 
            env: {
              NODE_ENV: '${process.env.NODE_ENV || 'development'}'
            }
          };
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState).replace(/</g, '\\u003c')}
        </script>
        <script src="/js/main.js"></script>
      </body>
    </html>
  `;
};

// Middleware pour le rendu SSR
app.get('*', (req, res) => {
  try {
    // Récupérer les données initiales
    const initialState = getInitialState(req);
    
    // Rendre l'application en chaîne HTML
    const appHtml = ReactDOMServer.renderToString(
      React.createElement(App, { initialState })
    );
    
    // Récupérer les métadonnées générées par React Helmet
    const helmet = Helmet.renderStatic();
    const helmetData = {
      title: helmet.title.toString(),
      meta: helmet.meta.toString(),
      link: helmet.link.toString()
    };
    
    // Générer la page HTML complète
    const html = generateHTML(appHtml, initialState, helmetData);
    
    // Envoyer la réponse
    return res.send(html);
  } catch (error) {
    console.error('Erreur lors du rendu SSR:', error);
    // En cas d'erreur, envoyer une version sans SSR
    const initialState = getInitialState(req);
    const html = generateHTML('', initialState);
    return res.send(html);
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});