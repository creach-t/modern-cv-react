/**
 * Service simplifié de gestion des vignettes pour les projets
 * Utilise des images statiques avec marquage temporel pour forcer le rafraîchissement
 */

// Clé pour le stockage local des dernières mises à jour
const THUMBNAIL_TIMESTAMP_KEY = 'project-thumbnails-timestamp';
// Durée de validité du cache en ms (24h)
const CACHE_VALIDITY = 24 * 60 * 60 * 1000;

/**
 * Classe de service pour la gestion des vignettes
 */
class ThumbnailService {
  constructor() {
    this.timestamps = {};
    this.loadTimestampsFromStorage();
  }

  /**
   * Charge les timestamps depuis le localStorage
   */
  loadTimestampsFromStorage() {
    try {
      const data = localStorage.getItem(THUMBNAIL_TIMESTAMP_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        
        // Filtrer pour ne garder que les entrées valides (< 24h)
        const validEntries = {};
        for (const [url, timestamp] of Object.entries(parsed)) {
          if ((Date.now() - timestamp) < CACHE_VALIDITY) {
            validEntries[url] = timestamp;
          }
        }
        
        this.timestamps = validEntries;
        
        // Mise à jour du stockage si des entrées ont expiré
        if (Object.keys(validEntries).length !== Object.keys(parsed).length) {
          this.saveTimestampsToStorage();
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des timestamps des vignettes:", error);
      localStorage.removeItem(THUMBNAIL_TIMESTAMP_KEY);
      this.timestamps = {};
    }
  }

  /**
   * Sauvegarde les timestamps dans le localStorage
   */
  saveTimestampsToStorage() {
    try {
      localStorage.setItem(THUMBNAIL_TIMESTAMP_KEY, JSON.stringify(this.timestamps));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des timestamps des vignettes:", error);
    }
  }

  /**
   * Vérifie si une URL a une vignette récente (moins de 24h)
   * @param {string} url - URL à vérifier
   * @returns {boolean} - Indique si l'URL a une vignette récente
   */
  hasRecentThumbnail(url) {
    return (
      this.timestamps[url] && 
      (Date.now() - this.timestamps[url]) < CACHE_VALIDITY
    );
  }

  /**
   * Génère l'URL d'une vignette pour un projet
   * @param {string} url - URL du site
   * @param {string} id - Identifiant du projet
   * @returns {string} - URL de la vignette
   */
  getThumbnailUrl(url, id) {
    // Si pas de vignette récente, mettre à jour le timestamp
    if (!this.hasRecentThumbnail(url)) {
      this.timestamps[url] = Date.now();
      this.saveTimestampsToStorage();
    }
    
    // Construire le chemin de l'image basé sur l'ID du projet
    // Format: /images/projects/[id]-thumbnail.jpg
    const projectId = id || url.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const imagePath = `/images/projects/${projectId}-thumbnail.jpg`;
    
    // Ajouter un paramètre de cache-busting basé sur le timestamp
    return `${imagePath}?t=${this.timestamps[url]}`;
  }
}

// Exporte une instance unique du service
const thumbnailService = new ThumbnailService();
export default thumbnailService;