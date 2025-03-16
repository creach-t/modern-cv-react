import { useState, useEffect, useRef } from "react";
import { animations } from "../constants/headerConstants";
import { scrollConfig, titleAnimations } from "../config/animationConfig";

/**
 * Hook personnalisé pour gérer les effets du header
 * @returns {Object} Retourne l'état et les fonctions utiles pour le header
 */
export const useHeaderEffects = () => {
  const [index, setIndex] = useState(0);
  const [animation, setAnimation] = useState(animations[0]);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  
  // Vérifier si l'appareil est mobile
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Effet pour surveiller le scroll et mettre à jour l'état avec progression
  useEffect(() => {
    const handleScroll = () => {
      // Utiliser le seuil de transition configuré
      const scrollThreshold = scrollConfig.scrollThreshold;
      const scrollPosition = window.scrollY;
      
      if (scrollPosition > scrollThreshold) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      // Calculer une valeur de progression du scroll entre 0 et 1
      const scrollProgress = Math.min(scrollPosition / scrollThreshold, 1);
      setScrollProgress(scrollProgress);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Mesurer la hauteur du header pour le spacer
  useEffect(() => {
    // Store the current value of headerRef to use in the cleanup function
    const currentHeaderRef = headerRef.current;
    
    if (currentHeaderRef) {
      setHeaderHeight(currentHeaderRef.offsetHeight);
      
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          setHeaderHeight(entry.target.offsetHeight);
        }
      });
      
      resizeObserver.observe(currentHeaderRef);
      
      return () => {
        // Use the stored ref in the cleanup function
        if (currentHeaderRef) {
          resizeObserver.unobserve(currentHeaderRef);
        }
      };
    }
  }, []);
  
  // Animation des titres
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % 3);
      setAnimation(animations[0]); // Utiliser toujours la même animation
    }, titleAnimations.changeInterval);
    return () => clearInterval(interval);
  }, []);
  
  // Fonction pour remonter en haut de la page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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