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

// Fonction pour détecter les bots de recherche et réseaux sociaux
const isBot = (userAgent) => {
  if (!userAgent) return false;
  
  const botPatterns = [
    'googlebot', 'bingbot', 'yandexbot', 'duckduckbot', 'slurp',
    'baiduspider', 'twitterbot', 'facebookexternalhit', 'linkedinbot',
    'embedly', 'quora link preview', 'showyoubot', 'outbrain',
    'pinterest', 'slackbot', 'vkshare', 'w3c_validator', 'facebot',
    'applebot', 'twitterbot', 'rogerbot', 'linkedinbot', 'msnbot',
    'discordbot', 'yahoo', 'semrushbot', 'ahrefsbot',
    'bot', 'crawler', 'spider'
  ];
  
  return botPatterns.some(pattern => userAgent.toLowerCase().includes(pattern));
};

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
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState).replace(/</g, '\\\\u003c')}
        </script>
        <script src="/js/main.js"></script>
      </body>
    </html>
  `;
};

// Fonction pour servir l'application SPA statique
const serveSPA = (req, res) => {
  // En environnement de production, on sert le fichier statique du build
  if (process.env.NODE_ENV === 'production') {
    const indexPath = path.resolve(__dirname, '../build/index.html');
    
    fs.readFile(indexPath, 'utf8', (err, htmlData) => {
      if (err) {
        console.error('Erreur lors de la lecture du fichier index.html:', err);
        return res.status(500).send('Erreur serveur');
      }
      
      // Récupérer l'état initial pour les données initiales
      const initialState = getInitialState(req);
      
      // Injecter l'état initial dans le HTML
      const html = htmlData.replace(
        '</head>',
        `<script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState).replace(/</g, '\\\\u003c')}
        </script>
        </head>`
      );
      
      return res.send(html);
    });
  } else {
    // En développement, on génère un HTML minimal
    const initialState = getInitialState(req);
    const html = generateHTML('', initialState);
    return res.send(html);
  }
};

// Middleware pour le rendu SSR conditionnel
app.get('*', (req, res) => {
  const userAgent = req.headers['user-agent'] || '';
  const isSearchBot = isBot(userAgent);
  
  console.log(`Request from: ${userAgent}`);
  console.log(`Is search bot: ${isSearchBot}`);
  
  // Pour les bots de recherche, faire le rendu côté serveur
  if (isSearchBot) {
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
      // Fallback en cas d'erreur
      serveSPA(req, res);
    }
  } else {
    // Pour les navigateurs normaux, servir l'application client-side
    serveSPA(req, res);
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});