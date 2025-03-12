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

// Servir les assets statiques du dossier build
app.use(express.static(path.resolve(__dirname, '../build')));

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

// Middleware pour le rendu SSR
app.get('*', (req, res) => {
  // Chemin vers le fichier HTML template
  const indexFile = path.resolve('./build/index.html');
  
  // Lire le fichier HTML comme template
  fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Erreur lors de la lecture du fichier index.html:', err);
      return res.status(500).send('Erreur lors du chargement de la page');
    }
    
    try {
      // Récupérer les données initiales
      const initialState = getInitialState(req);
      
      // Rendre l'application en chaîne HTML
      const appHtml = ReactDOMServer.renderToString(<App initialState={initialState} />);
      
      // Récupérer les métadonnées générées par React Helmet
      const helmet = Helmet.renderStatic();
      
      // Remplacer les marqueurs dans le template avec le contenu rendu
      let html = data;
      
      // Injecter les balises meta, title et autres de React Helmet
      html = html.replace('<title>Théo Créac\'h - CV</title>', `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}`);
      
      // Injecter l'application rendue
      html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
      
      // Injecter l'état initial pour l'hydratation
      html = html.replace(
        '</body>',
        `<script>window.__INITIAL_STATE__ = ${JSON.stringify(initialState).replace(/</g, '\\u003c')}</script></body>`
      );
      
      // Envoyer la réponse
      return res.send(html);
    } catch (error) {
      console.error('Erreur lors du rendu SSR:', error);
      return res.status(500).send('Erreur lors du rendu de la page');
    }
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
