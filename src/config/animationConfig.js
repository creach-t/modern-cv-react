/**
 * Configuration des animations du header
 * Modifiez ces valeurs pour ajuster les animations sans toucher au code des composants
 */

// Configuration du seuil de défilement et de la transition
export const scrollConfig = {
    // Hauteur en pixels sur laquelle la transition du header s'effectue
    scrollThreshold: 60,
    
    // Durée des transitions en secondes
    transitionDuration: 0.3,
    
    // Courbe d'accélération pour les transitions
    // Options: 'linear', 'easeIn', 'easeOut', 'easeInOut'
    transitionTiming: 'easeInOut'
  };
  
  // Configuration des hauteurs et paddings du header
  export const headerSizeConfig = {
    // Padding supérieur du header en mode étendu (rem)
    paddingTopExpanded: 2,
    
    // Padding inférieur du header en mode étendu (rem)
    paddingBottomExpanded: 2,
    
    // Padding supérieur du header en mode compact (rem)
    paddingTopCompact: 0.75,
    
    // Padding inférieur du header en mode compact (rem)
    paddingBottomCompact: 0.75,
    
    // Facteur d'espacement supplémentaire pour le header étendu (sera multiplié et ajouté au padding de base)
    paddingExpandedFactor: 1.5,
    
    // Durée de transition de la hauteur/padding du header (secondes)
    heightTransitionDuration: 0.3,
    
    // Courbe d'accélération pour la transition de hauteur
    // Options: 'linear', 'easeIn', 'easeOut', 'easeInOut', 'cubic-bezier(x1, y1, x2, y2)'
    heightTransitionTiming: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  };
  
  // Configuration des animations des titres avec glissement horizontal
  export const titleAnimations = {
    // Vitesse de transition entre les titres (secondes)
    transitionSpeed: 0.4,
    
    // Délai entre chaque changement de titre (millisecondes)
    changeInterval: 3000,
    
    // Distance de déplacement horizontal pour l'entrée et sortie des titres (pixels)
    slideDistance: 20
  };
  
  // Configuration des animations de glissement horizontal pour chaque élément
  export const slideConfig = {
    // Distance maximale de déplacement horizontal pour la photo de profil (pixels)
    profileDistance: 100,
    
    // Distance maximale de déplacement horizontal pour le nom (pixels)
    nameDistance: 100,
    
    // Distance maximale de déplacement horizontal pour le titre de métier (pixels)
    titleDistance: 100,
    
    // Distance de déplacement pour chaque icône sociale (pixels)
    socialIconStep: 100,
    
    // Distance de déplacement pour le nom dans la version compacte (pixels)
    compactNameDistance: 100,
    
    // Distance de déplacement pour les icônes dans la version compacte (pixels)
    compactIconDistance: 100,
    
    // Durée de transition des glissements (secondes)
    slideTransitionDuration: 0.8,
    
    // Courbe d'accélération pour les transitions de glissement
    slideTransitionTiming: 'easeOut'
  };
  
  // Configuration des animations pour les icônes sociales
  export const socialIconsConfig = {
    // Décalage horizontal du bloc d'icônes pendant le scroll (pixels)
    blockOffset: 10,
    
    // Vitesse de transition pour le bloc d'icônes (secondes)
    blockTransitionDuration: 0.8,
    
    // Facteur d'échelle pour contrôler la vitesse de disparition des icônes
    // Valeurs plus élevées = disparition plus rapide (1.0 = disparition à la fin du scroll)
    scaleFactor: 1.5,
    
    // Seuil d'échelle en dessous duquel les icônes sont complètement masquées (0-1)
    scaleThreshold: 0.01,
    
    // Durée de la transition d'échelle/opacité pour GitHub et LinkedIn (secondes)
    iconTransitionDuration: 0.35,
    
    // Courbe d'accélération pour les transitions des icônes sociales
    iconTransitionTiming: 'easeInOut'
  };
  
  // Configuration des animations d'opacité
  export const opacityConfig = {
    // Facteur d'opacité pour la photo (0-1, où 1 signifie qu'elle disparaît complètement)
    profileOpacityFactor: 1,
    
    // Facteur d'opacité pour le nom (0-1)
    nameOpacityFactor: 0.5,
    
    // Facteur d'opacité pour le titre du métier (0-1)
    titleOpacityFactor: 1,
    
    // Facteur d'opacité pour les icônes GitHub (0-1)
    githubOpacityFactor: 0.7,
    
    // Facteur d'opacité pour les icônes LinkedIn (0-1)
    linkedinOpacityFactor: 0.5,
    
    // Durée de transition des opacités (secondes)
    opacityTransitionDuration: 0.35,
    
    // Courbe d'accélération pour les transitions d'opacité
    opacityTransitionTiming: 'easeInOut'
  };
  
  // Configuration du style au survol
  export const hoverConfig = {
    // Facteur d'échelle au survol (1 = pas de changement)
    scaleFactorHover: 1.1,
    
    // Facteur d'échelle au clic (1 = pas de changement)
    scaleFactorTap: 0.98,
    
    // Durée de transition pour l'effet de survol (secondes)
    hoverTransitionDuration: 0.2,
    
    // Courbe d'accélération pour l'effet de survol
    hoverTransitionTiming: 'easeOut'
  };