/**
 * Configuration des animations du header
 * Optimisé pour éviter les problèmes d'ancrage de défilement
 */

// Configuration du seuil de défilement et de la transition
export const scrollConfig = {
  // Hauteur en pixels sur laquelle la transition du header s'effectue
  // Augmenté pour que les petits défilements ne déclenchent pas de micro-ajustements
  scrollThreshold: 80,
  
  // Durée des transitions en secondes
  transitionDuration: 0.2,
  
  // Courbe d'accélération simplifiée
  transitionTiming: 'easeOut'
};
  
// Configuration des hauteurs et paddings du header
export const headerSizeConfig = {
  // Padding supérieur du header en mode étendu (rem)
  paddingTopExpanded: 1.8,
  
  // Padding inférieur du header en mode étendu (rem)
  paddingBottomExpanded: 1.8,
  
  // Padding supérieur du header en mode compact (rem)
  paddingTopCompact: 0.75,
  
  // Padding inférieur du header en mode compact (rem)
  paddingBottomCompact: 0.75,
  
  // Facteur d'espacement supplémentaire pour le header étendu
  // Réduit pour diminuer l'ampleur des changements de taille
  paddingExpandedFactor: 1.2,
  
  // Durée de transition de la hauteur/padding du header
  // Augmentée pour que les transitions soient plus fluides
  heightTransitionDuration: 0.35,
  
  // Courbe d'accélération pour éviter les oscillations
  heightTransitionTiming: 'easeOut'
};
  
// Configuration des animations des titres avec glissement horizontal
export const titleAnimations = {
  // Vitesse de transition entre les titres (secondes)
  transitionSpeed: 0.3,
  
  // Délai entre chaque changement de titre (millisecondes)
  changeInterval: 3000,
  
  // Distance de déplacement horizontal pour l'entrée et sortie des titres (pixels)
  slideDistance: 15
};
  
// Configuration des animations de glissement horizontal pour chaque élément
export const slideConfig = {
  // Distance maximale de déplacement horizontal pour la photo de profil (pixels)
  // Réduites pour minimiser les grands changements pendant le défilement
  profileDistance: 800,
  
  // Distance maximale de déplacement horizontal pour le nom (pixels)
  nameDistance: 800,
  
  // Distance maximale de déplacement horizontal pour le titre de métier (pixels)
  titleDistance: 800,

  // Distance de déplacement pour le nom dans la version compacte (pixels)
  compactNameDistance: 800,
  
  // Distance de déplacement pour les icônes dans la version compacte (pixels)
  compactIconDistance: 800,
  
  // Durée de transition des glissements (secondes)
  slideTransitionDuration: 0.4,
  
  // Courbe d'accélération simplifiée
  slideTransitionTiming: 'easeOut'
};
  
// Configuration des animations pour les icônes sociales
export const socialIconsConfig = {
  // Décalage horizontal du bloc d'icônes pendant le scroll (pixels)
  blockOffset: 0,
  
  // Vitesse de transition pour le bloc d'icônes (secondes)
  blockTransitionDuration: 0.3,
  
  // Facteur d'échelle pour contrôler la vitesse de disparition des icônes
  scaleFactor: 1.5,
  
  // Seuil d'échelle en dessous duquel les icônes sont complètement masquées
  scaleThreshold: 0.1,
  
  // Durée de la transition d'échelle/opacité pour GitHub et LinkedIn (secondes)
  iconTransitionDuration: 0.2,
  
  // Courbe d'accélération simplifiée
  iconTransitionTiming: 'easeOut'
};
  
// Configuration des animations d'opacité
export const opacityConfig = {
  // Facteur d'opacité pour la photo
  profileOpacityFactor: 1.2,
  
  // Facteur d'opacité pour le nom
  nameOpacityFactor: 0.8,
  
  // Facteur d'opacité pour le titre du métier
  titleOpacityFactor: 1.2,
  
  // Facteur d'opacité pour les icônes GitHub
  githubOpacityFactor: 1,
  
  // Facteur d'opacité pour les icônes LinkedIn
  linkedinOpacityFactor: 1,
  
  // Durée de transition des opacités (secondes)
  opacityTransitionDuration: 0.3,
  
  // Courbe d'accélération simplifiée
  opacityTransitionTiming: 'easeOut'
};
  
// Configuration du style au survol
export const hoverConfig = {
  // Facteur d'échelle au survol
  scaleFactorHover: 1.05,
  
  // Facteur d'échelle au clic
  scaleFactorTap: 0.98,
  
  // Durée de transition pour l'effet de survol (secondes)
  hoverTransitionDuration: 0.15,
  
  // Courbe d'accélération simplifiée
  hoverTransitionTiming: 'easeOut'
};