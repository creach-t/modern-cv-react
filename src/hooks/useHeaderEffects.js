import { useState, useEffect, useRef } from "react";
import { titles, animations } from "../constants/headerConstants";
import { scrollConfig } from "../config/animationConfig";
import { useWindowSize } from "./useWindowSize";

/**
 * Custom hook for managing header effects and interactions
 * @returns {Object} Header-related states and functions
 */
export const useHeaderEffects = () => {
  // État pour l'animation des titres
  const [index, setIndex] = useState(0);
  const [animation, setAnimation] = useState(animations[0]);
  
  // État pour le menu de partage
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  // État du défilement
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Références pour mesurer la hauteur du header
  /** @type {React.RefObject<HTMLDivElement>} */
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  
  // Détecter si on est sur mobile
  const { width } = useWindowSize();
  const isMobile = width < 768;
  
  // Référence pour le throttle du scroll
  /** @type {React.MutableRefObject<number | null>} */
  const scrollTimeoutRef = useRef(null);
  /** @type {React.MutableRefObject<number>} */
  const lastScrollTimeRef = useRef(0);
  /** @type {React.MutableRefObject<number>} */
  const lastScrollValueRef = useRef(0);
  
  // Animation de rotation des titres
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % titles.length);
      setAnimation(animations[0]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Gestionnaire d'événement de défilement avec throttle
  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      
      // Limiter la fréquence des mises à jour (throttling)
      if (now - lastScrollTimeRef.current < 16) { // ~60fps
        return;
      }
      
      lastScrollTimeRef.current = now;
      const scrollY = window.scrollY;
      
      // Éviter les micro-ajustements
      if (Math.abs(scrollY - lastScrollValueRef.current) < 5) {
        return;
      }
      
      lastScrollValueRef.current = scrollY;
      
      // Annuler le timeout précédent
      if (scrollTimeoutRef.current) {
        cancelAnimationFrame(scrollTimeoutRef.current);
      }
      
      // Planifier la mise à jour avec requestAnimationFrame
      scrollTimeoutRef.current = requestAnimationFrame(() => {
        const threshold = scrollConfig.scrollThreshold;
        
        // Calculer la progression du défilement (0 à 1) avec des étapes discrètes
        // Pour éviter les micro-ajustements, on arrondit à 2 décimales
        const progress = Math.min(1, Math.round((scrollY / threshold) * 100) / 100);
        
        setScrolled(scrollY > 0);
        setScrollProgress(progress);
      });
    };
    
    // Ajouter l'écouteur d'événement
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Nettoyer
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        cancelAnimationFrame(scrollTimeoutRef.current);
      }
    };
  }, []);
  
  // Mesurer la hauteur du header pour le spacer
  useEffect(() => {
    // Copier la référence actuelle pour éviter les problèmes de fermeture
    const currentHeaderRef = headerRef.current;

    if (currentHeaderRef) {
      const updateHeight = () => {
        // Arrondir la hauteur au pixel près pour éviter les micro-ajustements
        const height = Math.round(currentHeaderRef.getBoundingClientRect().height);
        if (Math.abs(height - headerHeight) > 1) { // Ne mettre à jour que si le changement est significatif
          setHeaderHeight(height);
        }
      };
      
      updateHeight();
      
      const resizeObserver = new ResizeObserver(updateHeight);
      resizeObserver.observe(currentHeaderRef);
      
      return () => {
        if (currentHeaderRef) {
          resizeObserver.unobserve(currentHeaderRef);
        }
      };
    }
  }, [headerHeight]);
  
  // Fonction pour défiler vers le haut
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  return {
    index,
    animation,
    showShareMenu,
    setShowShareMenu,
    isMobile,
    scrolled,
    scrollProgress,
    headerRef,
    headerHeight,
    scrollToTop
  };
};