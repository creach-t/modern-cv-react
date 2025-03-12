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

// Importer le serveur Express 
require('./server');
