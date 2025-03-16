const express = require('express');
const fs = require('fs');
const path = require('path');
const isbot = require('isbot');

// Importer les utilitaires SSR
const { 
  findStaticAssets, 
  createInitialState,
  ssrErrorHandling 
} = require('./ssr-utils');

// Importer les helpers pour React Helmet
const { createSEOComponent, getHelmetData } = require('./helmet-helper');

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

log('Démarrage du serveur avec SSR...');
log('Version de isbot: ' + isbot.version);

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
  log(`IP: ${req.ip}, Headers User-Agent: "${req.headers['user-agent']}"`);
  
  // Mode forcé pour les tests: si on a un paramètre bot=1 dans l'URL
  if (req.query.bot === '1') {
    log('Mode BOT forcé par paramètre URL');
    req.isBot = true;
  }
  
  next();
});

// Middleware pour le rendu SSR conditionnel
app.get('*', (req, res) => {
  // Récupérer l'user-agent
  const userAgent = req.headers['user-agent'] || '';
  
  // Utiliser isbot pour détecter si c'est un bot
  const isBotCheck = isbot(userAgent);
  log(`User-Agent: "${userAgent}"`);
  log(`Détection isbot: ${isBotCheck ? 'BOT' : 'NON BOT'}`);
  
  // Vérifier si c'est un bot (par isbot ou par paramètre)
  const isBot = req.isBot || isBotCheck || req.query.bot === '1';
  
  log(`Décision finale - Est-ce un bot: ${isBot ? 'OUI' : 'NON'}`);
  
  if (isBot) {
    log('Rendu SSR pour bot');
    
    try {
      // Définir l'état initial
      const initialState = createInitialState();
      
      // Créer le composant SEO pour les métadonnées
      const SEO = createSEOComponent({
        title: 'Théo Créach - Développeur Web Full-Stack',
        description: 'CV et portfolio de Théo Créach, développeur web full-stack spécialisé en React, Node.js et technologies modernes du web.',
        url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        keywords: 'CV, développeur, web, react, javascript, tailwind, full-stack, frontend, backend'
      });
      
      // Wrapper App avec le composant SEO
      const AppWithSEO = () => React.createElement(
        React.Fragment,
        null,
        SEO,
        React.createElement(App, { initialState })
      );
      
      log('Tentative de rendu SSR...');
      
      // Effectuer le vrai rendu SSR
      const appHtml = ReactDOMServer.renderToString(
        React.createElement(AppWithSEO)
      );
      
      log(`Rendu SSR réussi, HTML généré: ${appHtml.length} caractères`);
      
      // Récupérer les données de Helmet
      const helmetData = getHelmetData();
      
      // Trouver les fichiers CSS et JS générés par webpack
      const { cssFiles, jsFiles } = findStaticAssets();
      
      // HTML complet avec le contenu SSR
      const html = `
        <!DOCTYPE html>
        <html ${helmetData.htmlAttributes}>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            ${helmetData.title}
            ${helmetData.meta}
            ${helmetData.link}
            ${cssFiles.map(file => `<link rel="stylesheet" href="${file}">`).join('')}
            <!-- Preuve de rendu SSR pour débogage -->
            <meta name="rendered-by" content="server" />
            <meta name="user-agent" content="${userAgent}" />
            <meta name="render-time" content="${new Date().toISOString()}" />
          </head>
          <body ${helmetData.bodyAttributes}>
            <div id="root">${appHtml}</div>
            <script>
              window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
            </script>
            ${helmetData.script}
            ${jsFiles.map(file => `<script src="${file}"></script>`).join('')}
          </body>
        </html>
      `;
      
      log('Envoi de la réponse SSR réussie');
      return res.send(html);
    } catch (error) {
      ssrErrorHandling.logRenderError(error, log);
      
      // Fallback en cas d'erreur SSR
      const fallbackHtml = ssrErrorHandling.createFallbackHtml(error);
      
      log('Envoi de la réponse fallback');
      return res.status(500).send(fallbackHtml);
    }
  } else {
    log('Rendu client pour navigateur');
    
    try {
      // Trouver les fichiers CSS et JS générés par webpack
      const { cssFiles, jsFiles } = findStaticAssets();
      
      // Définir l'état initial pour le client aussi
      const initialState = createInitialState();
      
      // HTML pour les navigateurs avec les bons chemins de fichiers
      const html = `
        <!DOCTYPE html>
        <html lang="fr">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Théo Créach - CV</title>
            <meta name="description" content="CV et portfolio de Théo Créach, développeur web full-stack" />
            <link rel="canonical" href="${req.protocol}://${req.get('host')}${req.originalUrl}" />
            ${cssFiles.map(file => `<link rel="stylesheet" href="${file}">`).join('')}
            <!-- Preuve de rendu client pour débogage -->
            <meta name="rendered-by" content="client" />
            <meta name="render-time" content="${new Date().toISOString()}" />
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
app.listen(PORT, '0.0.0.0', () => {
  log(`Serveur démarré sur http://localhost:${PORT}`);
  log(`Méthode alternative: utilisez ?bot=1 dans l'URL pour forcer le mode bot`);
  log(`Exemple: http://localhost:${PORT}/?bot=1`);
  log(`Pour tester tous les user-agents: npm run test:ssr`);
});