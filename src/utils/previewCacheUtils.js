// Clé pour le stockage local des prévisualisations
export const PREVIEW_CACHE_KEY = 'project-previews-cache';

// Durée de validité du cache en ms (24h)
export const CACHE_VALIDITY = 60 * 1000;

/**
 * Charge le cache des prévisualisations depuis le localStorage
 * @returns {Object} Le cache récupéré ou un objet vide
 */
export const loadPreviewCache = () => {
  try {
    // Récupération du cache
    const cachedData = localStorage.getItem(PREVIEW_CACHE_KEY);
    if (cachedData) {
      const parsedCache = JSON.parse(cachedData);
      // Vérification de la validité du cache
      const cacheIsValid = Object.values(parsedCache).every(item => 
        (Date.now() - item.timestamp) < CACHE_VALIDITY
      );
      if (cacheIsValid) {
        return parsedCache;
      } else {
        // Nettoyage du cache expiré
        localStorage.removeItem(PREVIEW_CACHE_KEY);
      }
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du cache des prévisualisations:", error);
    // Nettoyage en cas d'erreur
    localStorage.removeItem(PREVIEW_CACHE_KEY);
  }
  
  return {};
};

/**
 * Met à jour le cache des prévisualisations
 * @param {Object} currentCache Le cache actuel
 * @param {string} url L'URL à mettre en cache
 * @param {boolean} loaded Indique si la ressource est chargée
 * @returns {Object} Le nouveau cache
 */
export const updatePreviewCache = (currentCache, url, loaded = true) => {
  const newCache = {
    ...currentCache,
    [url]: {
      loaded,
      timestamp: Date.now()
    }
  };
  
  try {
    localStorage.setItem(PREVIEW_CACHE_KEY, JSON.stringify(newCache));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du cache des prévisualisations:", error);
  }
  
  return newCache;
};