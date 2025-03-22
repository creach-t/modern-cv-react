// src/services/PDFService/utils.js

/**
 * Fonction utilitaire pour fusionner profondément deux objets
 * @param {Object} target - Objet cible
 * @param {Object} source - Objet source
 * @returns {Object} - Objet fusionné
 */
export const deepMerge = (target, source) => {
    // Si l'un des deux objets n'est pas un objet, on retourne source ou target
    if (typeof source !== 'object' || source === null) {
      return source;
    }
    if (typeof target !== 'object' || target === null) {
      return { ...source };
    }
  
    // Création d'une copie de l'objet cible
    const output = { ...target };
  
    // Parcours des propriétés de l'objet source
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        if (Array.isArray(source[key])) {
          // Si la valeur est un tableau, on fait une copie superficielle
          output[key] = [...source[key]];
        } else if (typeof source[key] === 'object' && source[key] !== null) {
          // Si la valeur est un objet, on fusionne récursivement
          output[key] = deepMerge(output[key] || {}, source[key]);
        } else {
          // Sinon, on assigne simplement la valeur
          output[key] = source[key];
        }
      }
    }
  
    return output;
  };
  
  /**
   * Génère un identifiant unique
   * @returns {string} - Identifiant unique
   */
  export const generateUniqueId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };
  
  /**
   * Transforme un objet de style CSS en style inline pour react-pdf
   * @param {Object} cssStyle - Style CSS
   * @returns {Object} - Style inline pour react-pdf
   */
  export const cssToInlineStyle = (cssStyle) => {
    if (!cssStyle || typeof cssStyle !== 'object') {
      return {};
    }
  
    // Conversion des noms de propriétés CSS en camelCase
    const result = {};
    for (const key in cssStyle) {
      if (Object.prototype.hasOwnProperty.call(cssStyle, key)) {
        const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        result[camelKey] = cssStyle[key];
      }
    }
  
    return result;
  };
  
  /**
   * Formate une date selon le format spécifié et la langue
   * @param {string|Date} date - Date à formater
   * @param {string} language - Langue ('fr' ou 'en')
   * @param {string} format - Format de date (court, moyen, long)
   * @returns {string} - Date formatée
   */
  export const formatDate = (date, language = 'fr', format = 'medium') => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const options = {
      short: { year: 'numeric', month: 'numeric' },
      medium: { year: 'numeric', month: 'short' },
      long: { year: 'numeric', month: 'long', day: 'numeric' }
    };
    
    return dateObj.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', options[format] || options.medium);
  };

/**
 * Convertit une couleur hexadécimale en RGB
 * @param {string} hex - Couleur au format hexadécimal
 * @returns {Object} - Objet {r, g, b}
 */
export const hexToRgb = (hex) => {
  // Supprime le # si présent
  hex = hex.replace(/^#/, '');
  
  // Si c'est un format court (#RGB), on le convertit en format long (#RRGGBB)
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  
  // Extraire les composantes r, g, b
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return { r, g, b };
};

/**
 * Calcule le contraste entre une couleur et le blanc/noir pour déterminer
 * quelle couleur de texte utiliser pour une meilleure lisibilité
 * @param {string} backgroundColor - Couleur d'arrière-plan au format hexadécimal
 * @returns {string} - 'white' ou 'black' selon la meilleure lisibilité
 */
export const getContrastTextColor = (backgroundColor) => {
  // Si la couleur n'est pas définie ou n'est pas un format hexadécimal
  if (!backgroundColor || !backgroundColor.startsWith('#')) {
    return 'black'; // Valeur par défaut
  }
  
  const { r, g, b } = hexToRgb(backgroundColor);
  
  // Formule de luminosité perçue (selon WCAG)
  // Voir: https://www.w3.org/TR/WCAG20-TECHS/G17.html
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Si la luminosité est supérieure à 0.5, utiliser du texte noir, sinon du texte blanc
  return luminance > 0.5 ? 'black' : 'white';
};