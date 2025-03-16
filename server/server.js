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

// Récupérer l'App
let App;
try {
  // Import dynamique
  App = require('../src/App').default;
  console.log('Import de App réussi');
} catch (error) {
  console.error('Erreur lors de l\'import de App:', error.message);
  // Créer un composant minimal de secours si l'import échoue
  App = () => React.createElement('div', null, 'Erreur de chargement de l\'application');
}

// Le reste de votre code reste inchangé
const app = express();
const PORT = process.env.PORT || 2585;

// Servir les assets statiques du dossier build
app.use(express.static(path.resolve(__dirname, '../build')));

// Fonction pour détecter les bots de recherche et réseaux sociaux
const isBot = (userAgent = '') => {
  // Pour les tests, considérez toujours "googlebot" ou "curl" comme un bot
  if (!userAgent) return false;
  
  const botPatterns = [
    'googlebot', 'bingbot', 'yandexbot', 'duckduckbot', 'slurp',
    'baiduspider', 'twitterbot', 'facebookexternalhit', 'linkedinbot',
    'embedly', 'quora link preview', 'showyoubot', 'outbrain',
    'pinterest', 'slackbot', 'vkshare', 'w3c_validator', 'facebot',
    'applebot', 'rogerbot', 'msnbot', 'curl',
    'discordbot', 'yahoo', 'semrushbot', 'ahrefsbot',
    'bot', 'crawler', 'spider'
  ];

  console.log(`Analyse de l'User-Agent: "${userAgent}"`);
  
  // Convertir en minuscules pour une comparaison insensible à la casse
  const lowerUA = userAgent.toLowerCase();
  
  // Vérifier chaque pattern et collecter ceux qui correspondent
  const matchedPatterns = botPatterns.filter(pattern => lowerUA.includes(pattern));
  
  if (matchedPatterns.length > 0) {
    console.log(`Bot détecté! Patterns trouvés: ${matchedPatterns.join(', ')}`);
    return true;
  }
  
  console.log('Aucun bot détecté, considérant comme un navigateur normal');
  return false;
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

// Générer une page HTML avec le rendu côté serveur
const generateHTML = (appHtml, initialState, helmetData = {}) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${helmetData.title?.toString() || '<title>Théo Créach - CV</title>'}
        ${helmetData.meta?.toString() || ''}
        ${helmetData.link?.toString() || ''}
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
        <script src="/static/js/main.js"></script>
      </body>
    </html>
  `;
};

// Fonction pour servir l'application SPA statique (client-side rendering)
const serveSPA = (req, res) => {
  console.log('Serving SPA (Client-Side Rendering)');
  
  try {
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
      // En développement, générer un HTML minimal
      const initialState = getInitialState(req);
      
      // Créer un contenu HTML minimal pour le client (sans rendu SSR)
      const html = `
        <!DOCTYPE html>
        <html lang="fr">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Théo Créach - CV</title>
            <script>
              window.__INITIAL_STATE__ = ${JSON.stringify(initialState).replace(/</g, '\\\\u003c')}
            </script>
          </head>
          <body>
            <div id="root"></div>
            <script src="/static/js/main.js"></script>
          </body>
        </html>
      `;
      
      return res.send(html);
    }
  } catch (error) {
    console.error('Erreur dans serveSPA:', error);
    res.status(500).send('Erreur serveur');
  }
};

// Middleware pour le rendu SSR conditionnel
app.get('*', (req, res) => {
  // Récupérer l'user-agent
  const userAgent = req.headers['user-agent'] || '';
  
  // Déterminer si c'est un bot
  const isSearchBot = isBot(userAgent);
  
  console.log(`Requête reçue de: ${userAgent}`);
  console.log(`Est-ce un bot de recherche: ${isSearchBot}`);
  
  // Pour les tests, forcer le mode SSR pour certains user-agents
  if (isSearchBot) {
    console.log('Mode SSR activé pour ce bot');
    try {
      // Version simplifiée du rendu SSR pour tester
      const initialState = getInitialState(req);
      
      // Simple div avec un message pour vérifier le SSR
      const simpleHtml = ReactDOMServer.renderToString(
        React.createElement('div', { id: 'ssr-test' }, 'Ceci est une version SSR pour les bots')
      );
      
      // Générer la page HTML complète
      const html = `
        <!DOCTYPE html>
        <html lang="fr">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Théo Créach - CV (Version Bot)</title>
            <script>
              window.__INITIAL_STATE__ = ${JSON.stringify(initialState).replace(/</g, '\\\\u003c')}
            </script>
          </head>
          <body>
            <div id="root">${simpleHtml}</div>
            <script src="/static/js/main.js"></script>
          </body>
        </html>
      `;
      
      // Envoyer la réponse
      console.log('Envoi de la réponse SSR');
      return res.send(html);
    } catch (error) {
      console.error('Erreur lors du rendu SSR:', error);
      // Fallback en cas d'erreur
      console.log('Fallback vers Client-Side Rendering suite à une erreur');
      serveSPA(req, res);
    }
  } else {
    // Pour les navigateurs normaux, servir l'application client-side
    console.log('Mode Client-Side Rendering pour ce navigateur');
    serveSPA(req, res);
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});