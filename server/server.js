const express = require('express');
const fs = require('fs');
const path = require('path');

// Configuration des logs
const log = (message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
  
  // Écrire également dans un fichier de log pour s'assurer qu'ils sont capturés
  try {
    fs.appendFileSync(
      path.join(__dirname, 'server.log'), 
      `[${timestamp}] ${message}\n`
    );
  } catch (err) {
    console.error('Erreur d\'écriture de log:', err);
  }
};

log('Démarrage du serveur...');

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
  log('Import de App réussi');
} catch (error) {
  log(`Erreur lors de l'import de App: ${error.message}`);
  log(`Stack trace: ${error.stack}`);
  // Créer un composant minimal de secours si l'import échoue
  App = () => React.createElement('div', null, 'Erreur de chargement de l\'application');
}

// Le reste de votre code reste inchangé
const app = express();
const PORT = process.env.PORT || 2585;

// Servir les assets statiques du dossier build
app.use(express.static(path.resolve(__dirname, '../build')));

// Log pour toutes les requêtes
app.use((req, res, next) => {
  log(`NOUVELLE REQUETE: ${req.method} ${req.url}`);
  log(`IP: ${req.ip}, Headers: ${JSON.stringify(req.headers)}`);
  
  // Mode forcé pour les tests: si on a un paramètre bot=1 dans l'URL
  if (req.query.bot === '1') {
    log('Mode BOT forcé par paramètre URL');
    req.isBot = true;
  }
  
  next();
});

// Fonction pour vérifier s'il s'agit d'un bot
const isUserAgentBot = (userAgent) => {
  if (!userAgent) return false;
  
  const botPatterns = [
    'googlebot', 'bingbot', 'yandexbot', 'duckduckbot', 'slurp',
    'baiduspider', 'facebookexternalhit', 'twitterbot', 'rogerbot',
    'linkedinbot', 'embedly', 'quora link preview', 'showyoubot',
    'outbrain', 'pinterest', 'slackbot', 'vkshare', 'w3c_validator',
    'bot', 'spider', 'crawler', 'curl', 'wget'
  ];
  
  const lowercaseUA = userAgent.toLowerCase();
  return botPatterns.some(pattern => lowercaseUA.includes(pattern));
};

// Middleware pour le rendu SSR conditionnel
app.get('*', (req, res) => {
  // Récupérer l'user-agent
  const userAgent = req.headers['user-agent'] || '';
  log(`User-Agent: "${userAgent}"`);
  
  // Vérifier si c'est un bot (par user-agent ou par paramètre)
  const isBot = req.isBot || isUserAgentBot(userAgent) || req.query.bot === '1';
  
  log(`Est-ce un bot: ${isBot ? 'OUI' : 'NON'}`);
  
  if (isBot) {
    log('Rendu SSR pour bot');
    
    try {
      // Définir l'état initial
      const initialState = {
        language: 'fr',
        theme: {
          isDark: true,
          secondaryColor: '#6667AB'
        }
      };
      
      // Effectuer le vrai rendu SSR
      const appHtml = ReactDOMServer.renderToString(
        React.createElement(App, { initialState })
      );
      
      let helmetData = { title: '', meta: '' };
      try {
        const helmet = Helmet.renderStatic();
        helmetData = {
          title: helmet.title.toString(),
          meta: helmet.meta.toString()
        };
      } catch (helmetError) {
        log(`Erreur avec React Helmet: ${helmetError.message}`);
      }
      
      // Trouver les fichiers CSS et JS générés par webpack
      let cssFiles = [];
      let jsFiles = [];
      
      try {
        const buildDir = path.resolve(__dirname, '../build');
        
        if (fs.existsSync(buildDir)) {
          // Parcourir le dossier static/css
          const cssDir = path.join(buildDir, 'static/css');
          if (fs.existsSync(cssDir)) {
            cssFiles = fs.readdirSync(cssDir)
              .filter(file => file.endsWith('.css'))
              .map(file => `/static/css/${file}`);
          }
          
          // Parcourir le dossier static/js
          const jsDir = path.join(buildDir, 'static/js');
          if (fs.existsSync(jsDir)) {
            jsFiles = fs.readdirSync(jsDir)
              .filter(file => file.endsWith('.js'))
              .map(file => `/static/js/${file}`);
          }
        }
      } catch (fsError) {
        log(`Erreur lors de la recherche des fichiers statiques: ${fsError.message}`);
      }
      
      // HTML complet avec le contenu SSR
      const html = `
        <!DOCTYPE html>
        <html lang="fr">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Théo Créach - CV (SSR Bot)</title>
            ${helmetData.title}
            ${helmetData.meta}
            ${cssFiles.map(file => `<link rel="stylesheet" href="${file}">`).join('')}
          </head>
          <body>
            <div id="root">${appHtml}</div>
            <script>
              window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
            </script>
            ${jsFiles.map(file => `<script src="${file}"></script>`).join('')}
          </body>
        </html>
      `;
      
      log('Envoi de la réponse SSR réussie');
      return res.send(html);
    } catch (error) {
      log(`Erreur de rendu SSR: ${error.message}`);
      log(`Stack trace: ${error.stack}`);
      
      // Fallback en cas d'erreur SSR
      const fallbackHtml = `
        <!DOCTYPE html>
        <html lang="fr">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Théo Créach - CV (Fallback)</title>
          </head>
          <body>
            <div id="root">
              <div style="padding: 20px; background: #f7f7f7; border: 1px solid #ddd; margin: 30px auto; max-width: 600px;">
                <h1>Théo Créach - CV</h1>
                <p>Une erreur s'est produite lors du rendu SSR.</p>
                <p>Pour voir le CV complet, veuillez accéder à cette page avec un navigateur normal.</p>
                <p><small>Error: ${error.message}</small></p>
              </div>
            </div>
          </body>
        </html>
      `;
      
      log('Envoi de la réponse fallback');
      return res.status(500).send(fallbackHtml);
    }
  } else {
    log('Rendu client pour navigateur');
    
    try {
      // Trouver les fichiers CSS et JS générés par webpack
      let cssFiles = [];
      let jsFiles = [];
      
      const buildDir = path.resolve(__dirname, '../build');
      
      if (fs.existsSync(buildDir)) {
        // Parcourir le dossier static/css
        const cssDir = path.join(buildDir, 'static/css');
        if (fs.existsSync(cssDir)) {
          cssFiles = fs.readdirSync(cssDir)
            .filter(file => file.endsWith('.css'))
            .map(file => `/static/css/${file}`);
        }
        
        // Parcourir le dossier static/js
        const jsDir = path.join(buildDir, 'static/js');
        if (fs.existsSync(jsDir)) {
          jsFiles = fs.readdirSync(jsDir)
            .filter(file => file.endsWith('.js'))
            .map(file => `/static/js/${file}`);
        }
      }
      
      // Définir l'état initial pour le client aussi
      const initialState = {
        language: 'fr',
        theme: {
          isDark: true,
          secondaryColor: '#6667AB'
        }
      };
      
      // HTML pour les navigateurs avec les bons chemins de fichiers
      const html = `
        <!DOCTYPE html>
        <html lang="fr">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Théo Créach - CV</title>
            ${cssFiles.map(file => `<link rel="stylesheet" href="${file}">`).join('')}
          </head>
          <body>
            <div id="root">
              <!-- Contenu vide pour le rendu client -->
            </div>
            <script>
              window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
            </script>
            ${jsFiles.map(file => `<script src="${file}"></script>`).join('')}
          </body>
        </html>
      `;
      
      log('Envoi de la réponse client');
      return res.send(html);
    } catch (error) {
      log(`Erreur lors de la préparation de la réponse client: ${error.message}`);
      
      // Fallback en cas d'erreur
      return res.status(500).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Erreur</title>
          </head>
          <body>
            <div id="root">
              <p>Une erreur s'est produite lors du chargement de l'application.</p>
            </div>
          </body>
        </html>
      `);
    }
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  log(`Serveur démarré sur http://localhost:${PORT}`);
  log(`Méthode alternative: utilisez ?bot=1 dans l'URL pour forcer le mode bot`);
  log(`Exemple: http://localhost:${PORT}/?bot=1`);
});