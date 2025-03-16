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

// Log pour toutes les requêtes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Requête ${req.method} ${req.url}`);
  console.log(`Headers: ${JSON.stringify(req.headers)}`);
  next();
});

// Fonction pour détecter les bots de recherche et réseaux sociaux
const isBot = (userAgent = '') => {
  console.log('\n-------- VÉRIFICATION BOT --------');
  console.log(`User-Agent complet: "${userAgent}"`);
  
  // Si vide, pas un bot
  if (!userAgent) {
    console.log('User-Agent vide, considéré comme navigateur');
    return false;
  }
  
  // Liste des patterns de bots
  const botPatterns = [
    'googlebot', 'bingbot', 'yandexbot', 'duckduckbot', 'slurp',
    'baiduspider', 'twitterbot', 'facebookexternalhit', 'linkedinbot',
    'embedly', 'quora link preview', 'showyoubot', 'outbrain',
    'pinterest', 'slackbot', 'vkshare', 'w3c_validator', 'facebot',
    'applebot', 'rogerbot', 'msnbot', 'curl',
    'discordbot', 'yahoo', 'semrushbot', 'ahrefsbot',
    'bot', 'crawler', 'spider'
  ];

  // Convertir en minuscules pour une comparaison insensible à la casse
  const lowerUA = userAgent.toLowerCase();
  
  console.log(`User-Agent en minuscules: "${lowerUA}"`);
  
  // Vérifier chaque pattern et collecter ceux qui correspondent
  const matchedPatterns = [];
  for (const pattern of botPatterns) {
    if (lowerUA.includes(pattern)) {
      matchedPatterns.push(pattern);
      console.log(`Pattern trouvé: "${pattern}"`);
    }
  }
  
  // Si on a trouvé des patterns de bot
  if (matchedPatterns.length > 0) {
    console.log(`✅ BOT DÉTECTÉ! Patterns trouvés: ${matchedPatterns.join(', ')}`);
    return true;
  }
  
  // Détection d'urgence pour curl test
  if (req.headers && req.headers['user-agent'] && req.headers['user-agent'].toLowerCase().includes('googlebot')) {
    console.log('⚠️ Détection d\'urgence: Googlebot détecté par analyse directe des headers');
    return true;
  }
  
  console.log('❌ Pas de bot détecté, considéré comme navigateur normal');
  console.log('------------------------------------\n');
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

// Fonction pour servir l'application SPA statique (client-side rendering)
const serveSPA = (req, res) => {
  console.log('💻 Serving CLIENT-SIDE RENDERING');
  
  try {
    // Générer un HTML minimal
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
          <div id="root"><!-- Rendu client --></div>
          <script src="/static/js/main.js"></script>
        </body>
      </html>
    `;
    
    return res.send(html);
  } catch (error) {
    console.error('Erreur dans serveSPA:', error);
    res.status(500).send('Erreur serveur');
  }
};

// Middleware pour le rendu SSR conditionnel
app.get('*', (req, res) => {
  // Récupérer l'user-agent
  const userAgent = req.headers['user-agent'] || '';
  
  // FORCER LE MODE BOT POUR LES TESTS AVEC CURL ET GOOGLEBOT
  const forceBot = userAgent.toLowerCase().includes('googlebot');
  
  // Déterminer si c'est un bot
  console.log(`Vérification si "${userAgent}" est un bot...`);
  
  // Si googlebot dans l'agent, forcer la détection comme bot
  if (forceBot) {
    console.log('🤖 BOT DÉTECTÉ (Mode forcé pour les tests)');
    
    // Version SSR simplifiée pour les bots
    try {
      console.log('🔄 Génération du HTML côté serveur...');
      
      // Contenu SSR basique pour confirmer le fonctionnement
      const html = `
        <!DOCTYPE html>
        <html lang="fr">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Théo Créach - CV (Version Bot)</title>
            <script>
              window.__INITIAL_STATE__ = ${JSON.stringify(getInitialState(req)).replace(/</g, '\\\\u003c')}
            </script>
          </head>
          <body>
            <div id="root">
              <div id="ssr-test" style="padding: 20px; background: #f0f0f0; border: 1px solid #999;">
                <h1>Version SSR pour les bots</h1>
                <p>Cette page a été rendue côté serveur pour Googlebot.</p>
                <p>User-Agent détecté: ${userAgent}</p>
              </div>
            </div>
            <script src="/static/js/main.js"></script>
          </body>
        </html>
      `;
      
      console.log('✅ Envoi de la réponse SSR pour le bot');
      return res.send(html);
    } catch (error) {
      console.error('❌ Erreur lors du rendu SSR:', error);
      serveSPA(req, res);
    }
  } else {
    // Pour les navigateurs normaux
    console.log('🌐 Navigateur normal détecté');
    serveSPA(req, res);
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`\n🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📝 Logs détaillés activés pour la détection des bots`);
  console.log(`🤖 Mode test: "googlebot" dans l'User-Agent sera toujours détecté comme bot\n`);
});