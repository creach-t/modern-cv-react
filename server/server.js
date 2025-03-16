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

// Middleware pour le rendu SSR conditionnel
app.get('*', (req, res) => {
  // Récupérer l'user-agent
  const userAgent = req.headers['user-agent'] || '';
  log(`User-Agent: "${userAgent}"`);
  
  // Vérifier si c'est un bot (par user-agent ou par paramètre)
  const isBot = 
    req.isBot || // Flag spécial
    userAgent.toLowerCase().includes('googlebot') || 
    userAgent.toLowerCase().includes('bot') ||
    userAgent.toLowerCase().includes('spider') ||
    userAgent.toLowerCase().includes('curl') ||
    req.query.bot === '1'; // Paramètre URL pour forcer le mode bot
  
  log(`Est-ce un bot: ${isBot ? 'OUI' : 'NON'}`);
  
  if (isBot) {
    log('Rendu SSR pour bot');
    
    // HTML pour les bots avec preuve de SSR
    const html = `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Théo Créach - CV (Version Bot)</title>
        </head>
        <body>
          <div id="root">
            <div style="padding: 20px; background: #f0f0f0; border: 1px solid #999;">
              <h1>Version SSR pour les bots</h1>
              <p>Cette page a été rendue côté serveur.</p>
              <p>User-Agent: ${userAgent}</p>
              <p>IP: ${req.ip}</p>
              <p>Date: ${new Date().toISOString()}</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    log('Envoi de la réponse SSR');
    return res.send(html);
  } else {
    log('Rendu client pour navigateur');
    
    // HTML pour les navigateurs
    const html = `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Théo Créach - CV</title>
        </head>
        <body>
          <div id="root">
            <!-- Contenu vide pour le rendu client -->
          </div>
          <script src="/static/js/main.js"></script>
        </body>
      </html>
    `;
    
    log('Envoi de la réponse client');
    return res.send(html);
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  log(`Serveur démarré sur http://localhost:${PORT}`);
  log(`Méthode alternative: utilisez ?bot=1 dans l'URL pour forcer le mode bot`);
  log(`Exemple: http://localhost:${PORT}/?bot=1`);
});