const express = require('express');
const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { Helmet } = require('react-helmet');
const loadable = require('@loadable/component');

// Importer l'application React
const App = require('../src/App').default;

// Créer l'application Express
const app = express();
const PORT = process.env.PORT || 2585;

// Servir les assets statiques du dossier public (pour le développement)
app.use(express.static(path.resolve(__dirname, '../public')));

// Cette fonction sert à ajouter les données initiales pour l'hydratation
const getInitialState = (req) => {
  // Ici vous pourriez récupérer des données basées sur la requête
  // Par exemple, détecter la langue, les préférences de thème, etc.
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
    return res.status(500).send(`Erreur lors du rendu de la page: ${error.message}`);
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});