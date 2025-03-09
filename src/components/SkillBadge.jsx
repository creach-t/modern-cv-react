import React, { useState, useEffect, useRef } from 'react';
import { useColor } from '../contexts/ColorContext';

const SkillBadge = ({
  name,
  logo,
  isExpanded = false,
  badgeBgColor,
  secondaryColor,
  textColor
}) => {
  // Si les couleurs ne sont pas fournies, on les récupère du contexte
  const colorContext = useColor();
  const finalSecondaryColor = secondaryColor || colorContext.secondaryColor;
  const finalBadgeBgColor = badgeBgColor || 
    (colorContext.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)');
  const finalTextColor = textColor || 
    (colorContext.isDark ? 'white' : 'black');
    
  // État local pour gérer l'ouverture temporaire
  const [tempExpanded, setTempExpanded] = useState(false);
  // État pour gérer l'animation shake
  const [isShaking, setIsShaking] = useState(false);
  // État pour désactiver les interactions pendant la fermeture automatique
  const [isInteractionDisabled, setIsInteractionDisabled] = useState(false);
  
  // Références pour les timeouts
  const hoverTimeoutRef = useRef(null);
  const expandTimeoutRef = useRef(null);
  const shakeTimeoutRef = useRef(null);

  // Gestion du survol pour expanded=false
  const handleMouseEnter = () => {
    if (isExpanded || isInteractionDisabled) return;
    
    // Démarrer le timer de survol pour l'ouverture
    hoverTimeoutRef.current = setTimeout(() => {
      handleOpen();
    }, 300); // Ouverture après 1 seconde de survol
  };

  const handleMouseLeave = () => {
    if (isExpanded) return;
    
    // Annuler le timer de survol s'il quitte avant la fin
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  // Fonction pour ouvrir temporairement et fermer automatiquement
  const handleOpen = () => {
    if (isExpanded || isInteractionDisabled) return;
    
    setTempExpanded(true);
    setIsInteractionDisabled(true);
    
    // Fermer automatiquement après 5 secondes
    expandTimeoutRef.current = setTimeout(() => {
      setTempExpanded(false);
      
      // Réactiver les interactions après fermeture
      setTimeout(() => {
        setIsInteractionDisabled(false);
      }, 300); // Petit délai après animation de fermeture
    }, 1000);
  };

  // Animation shake pour expanded=true
  const handleExpandedInteraction = () => {
    if (!isExpanded) return;
    
    setIsShaking(true);
    
    // Arrêter l'animation après un court instant
    shakeTimeoutRef.current = setTimeout(() => {
      setIsShaking(false);
    }, 500);
  };

  // Nettoyage des timeouts à la destruction du composant
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (expandTimeoutRef.current) clearTimeout(expandTimeoutRef.current);
      if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    };
  }, []);

  // L'état d'affichage effectif dépend de isExpanded prop et de tempExpanded
  const effectivelyExpanded = isExpanded || tempExpanded;

  return (
    <div
      className={`flex items-center rounded-full transition-all ${
        effectivelyExpanded ? 'py-1 px-3' : 'p-2'
      } ${isShaking ? 'animate-wiggle' : ''} ${
        isInteractionDisabled ? 'pointer-events-none' : 'hover:shadow-sm'
      }`}
      style={{ 
        backgroundColor: finalBadgeBgColor,
        border: `1px solid ${finalSecondaryColor}20`
      }}
      title={!effectivelyExpanded ? name : ""}
      onClick={isExpanded ? handleExpandedInteraction : handleOpen}
      onMouseEnter={isExpanded ? handleExpandedInteraction : handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={isExpanded ? handleExpandedInteraction : handleOpen}
    >
      {logo && (
        <div className={`relative ${effectivelyExpanded ? 'mr-2' : ''}`}>
          <div 
            className="absolute inset-0 rounded-full blur-sm opacity-30" 
            style={{ backgroundColor: finalSecondaryColor }}
          ></div>
          <img 
            src={logo} 
            alt={`${name} logo`} 
            className="w-5 h-5 object-contain relative z-10" 
          />
        </div>
      )}
      {effectivelyExpanded && (
        <span 
          className={`text-sm font-medium transition-opacity ${
            tempExpanded ? 'animate-fadeIn' : ''
          }`}
          style={{ color: finalTextColor }}
        >
          {name}
        </span>
      )}
    </div>
  );
};



export default SkillBadge;