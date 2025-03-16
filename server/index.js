// Importer les dépendances de base
require('ignore-styles');

// Babel pour la transpilation
require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-proposal-class-properties',
    '@loadable/babel-plugin'
  ]
});

// Polyfills pour le SSR
global.window = {};
global.document = { createElement: () => {} };

// Empêcher les erreurs liées aux APIs du navigateur en environnement Node.js
if (typeof window !== 'undefined') {
  // Certains modules peuvent dépendre d'objets spécifiques au navigateur
  global.HTMLElement = {};
}

// Importer le serveur Express 
require('./server');
