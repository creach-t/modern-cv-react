/**
 * Utilitaires pour le SSR
 * Ce fichier contient des fonctions d'aide pour le rendu côté serveur
 */

const fs = require('fs');
const path = require('path');

/**
 * Fonction pour détecter si un user-agent est un bot
 * @param {string} userAgent - User-agent à vérifier
 * @returns {boolean} - true si c'est un bot, false sinon
 */
const isUserAgentBot = (userAgent) => {
  if (!userAgent) return false;
  
  // Version plus stricte de la détection, utilisant des expressions régulières
  const botPatterns = [
    /googlebot/i,
    /bingbot/i,
    /yandexbot/i,
    /duckduckbot/i,
    /slurp/i,
    /baiduspider/i,
    /facebookexternalhit/i,
    /twitterbot/i,
    /rogerbot/i,
    /linkedinbot/i,
    /embedly/i,
    /quora link preview/i,
    /showyoubot/i,
    /outbrain/i,
    /pinterest/i,
    /slackbot/i,
    /vkshare/i,
    /w3c_validator/i,
    /bot/i,
    /spider/i,
    /crawler/i
  ];
  
  // Log pour le débogage (sera visible dans server.log)
  console.log(`Vérification du user-agent pour bot: "${userAgent}"`);
  
  return botPatterns.some(pattern => {
    const isMatch = pattern.test(userAgent);
    if (isMatch) {
      console.log(`  Match trouvé avec pattern: ${pattern}`);
    }
    return isMatch;
  });
};

/**
 * Trouver les fichiers CSS et JS générés par webpack dans le dossier build
 * @returns {Object} Objet contenant les tableaux de fichiers CSS et JS
 */
const findStaticAssets = () => {
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
    
    // Log des fichiers trouvés
    console.log(`Fichiers CSS trouvés: ${cssFiles.join(', ')}`);
    console.log(`Fichiers JS trouvés: ${jsFiles.join(', ')}`);
  } catch (error) {
    console.error(`Erreur lors de la recherche des fichiers statiques: ${error.message}`);
  }
  
  return { cssFiles, jsFiles };
};

/**
 * Crée l'état initial pour l'hydratation côté client
 * @returns {Object} État initial avec les préférences par défaut
 */
const createInitialState = () => {
  return {
    language: 'fr',
    theme: {
      isDark: true,
      secondaryColor: '#6667AB'
    }
  };
};

/**
 * Fonctions d'aide pour gérer les erreurs SSR
 */
const ssrErrorHandling = {
  /**
   * Logger une erreur de rendu SSR
   * @param {Error} error - L'erreur survenue
   * @param {Function} logFn - Fonction de log à utiliser
   */
  logRenderError: (error, logFn) => {
    logFn(`Erreur de rendu SSR: ${error.message}`);
    logFn(`Stack trace: ${error.stack}`);
  },

  /**
   * Créer une page HTML de fallback en cas d'erreur SSR
   * @param {Error} error - L'erreur survenue
   * @returns {string} HTML de la page de fallback
   */
  createFallbackHtml: (error) => {
    return `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Théo Créach - CV (Fallback)</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; }
            .error-container { padding: 20px; background: #f7f7f7; border: 1px solid #ddd; margin: 30px auto; max-width: 600px; border-radius: 8px; }
            h1 { color: #333; }
            .error-details { margin-top: 20px; font-size: 0.8em; color: #777; border-top: 1px solid #eee; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div id="root">
            <div class="error-container">
              <h1>Théo Créach - CV</h1>
              <p>Une erreur s'est produite lors du rendu côté serveur.</p>
              <p>Pour voir le CV complet, veuillez accéder à cette page avec un navigateur normal.</p>
              <div class="error-details">
                <p><small>Error: ${error.message}</small></p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }
};

module.exports = {
  isUserAgentBot,
  findStaticAssets,
  createInitialState,
  ssrErrorHandling
};