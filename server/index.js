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

// Polyfills complets pour le SSR
global.SVGElement = function() {};
global.HTMLElement = function() {};
global.Element = function() {};

// Un polyfill complet pour window
global.window = {
  addEventListener: () => {},
  removeEventListener: () => {},
  getComputedStyle: () => ({ getPropertyValue: () => {} }),
  innerWidth: 1200,
  innerHeight: 800,
  visualViewport: { width: 1200, height: 800 },
  scrollX: 0,
  scrollY: 0,
  devicePixelRatio: 1,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  matchMedia: () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {}
  })
};

// Polyfill pour document
global.document = {
  createElement: () => ({
    style: {},
    addEventListener: () => {},
    removeEventListener: () => {},
    setAttribute: () => {},
    appendChild: () => {}
  }),
  createElementNS: () => ({
    style: {},
    addEventListener: () => {},
    removeEventListener: () => {},
    setAttribute: () => {},
    appendChild: () => {}
  }),
  head: { appendChild: () => {} },
  body: { 
    appendChild: () => {},
    addEventListener: () => {},
    removeEventListener: () => {}
  },
  documentElement: {
    addEventListener: () => {},
    removeEventListener: () => {}
  },
  getElementById: () => null,
  querySelectorAll: () => []
};

global.navigator = { userAgent: 'node' };
global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);
global.getComputedStyle = () => ({ getPropertyValue: () => {} });

// Mock pour lucide-react
jest.mock('lucide-react', () => ({
  X: () => 'X Icon',
  Mail: () => 'Mail Icon',
  Linkedin: () => 'Linkedin Icon',
  Github: () => 'Github Icon',
  Phone: () => 'Phone Icon',
  // Ajouter d'autres icônes selon vos besoins
}));

// Importer le serveur Express 
require('./server');