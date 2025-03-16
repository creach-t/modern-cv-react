import { useState, useEffect } from 'react';

/**
 * Hook pour détecter la taille de la fenêtre du navigateur
 * Utilisé pour ajuster le comportement en fonction de la taille d'écran
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Référence pour debouncer le redimensionnement
    let timeoutId = null;
    
    const handleResize = () => {
      // Nettoyer le timeout précédent
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Définir un nouveau timeout de 150ms
      timeoutId = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 150);
    };

    // Ajouter l'écouteur d'événement avec l'option passive pour de meilleures performances
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Nettoyage à la désactivation du composant
    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return windowSize;
};

export default useWindowSize;