import React, { useMemo, useState, useEffect } from "react";
import React, { useState, useEffect, useRef } from "react";
import { useColor } from "../contexts/ColorContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useContactModal } from "../contexts/ContactModalContext";

const titles = [
  { prefix: "Full", suffix: "Stack" },
  { prefix: "Front", suffix: "end" },
  { prefix: "Back", suffix: "end" },
];

const animations = [
  { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 10 } },
  { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 1.2 } },
  { initial: { opacity: 0, rotateX: 90 }, animate: { opacity: 1, rotateX: 0 }, exit: { opacity: 0, rotateX: -90 } }
];

// Animation wiggle pour les boutons
const wiggleAnimation = {
  hover: {
    rotate: [0, -5, 5, -3, 3, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  }
};

const Header = () => {
  const { secondaryColor } = useColor(); // Couleur dynamique
  const { language } = useLanguage();
  const { openModal } = useContactModal();
  const t = headerTranslations[language];
  const textColor = getTextColor(secondaryColor);

  const {
    index,
    animation,
    showShareMenu,
    setShowShareMenu,
    isMobile,
    scrolled,
    scrollProgress,
    headerRef,
    headerHeight,
    scrollToTop,
  } = useHeaderEffects();

  // État intermédiaire pour amortir les changements de padding
  const [stablePadding, setStablePadding] = useState({
    top:
      headerSizeConfig.paddingTopCompact +
      headerSizeConfig.paddingExpandedFactor,
    bottom:
      headerSizeConfig.paddingBottomCompact +
      headerSizeConfig.paddingExpandedFactor,
  });

  // Mettre à jour le padding de manière amortie selon le scroll
  useEffect(() => {
    // Calculer les nouvelles valeurs de padding en fonction de scrollProgress
    const newTop =
      headerSizeConfig.paddingTopCompact +
      (1 - scrollProgress) * headerSizeConfig.paddingExpandedFactor;
    const newBottom =
      headerSizeConfig.paddingBottomCompact +
      (1 - scrollProgress) * headerSizeConfig.paddingExpandedFactor;

    // Ne mettre à jour que si le changement est significatif (>0.1rem)
    if (
      Math.abs(newTop - stablePadding.top) > 0.1 ||
      Math.abs(newBottom - stablePadding.bottom) > 0.1
    ) {
      setStablePadding({ top: newTop, bottom: newBottom });
    }
  }, [scrollProgress, stablePadding]);

  // Gestionnaire de partage adapté au composant
  const handleShare = (platform) => {
    shareHandler(platform, t, setShowShareMenu);
  };

  // Styles mémorisés pour le header
  const headerStyle = useMemo(() => {
    return {
      // Conversion de secondaryColor hex en rgba semi-transparente
      backgroundColor: hexToRgba(secondaryColor, 0.9),

      // Effet de flou pour iOS Safari, Chrome, Firefox, etc.
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",

      // Fallback IE (approx.) : risque de flouter tout l'élément au lieu de l’arrière-plan
      filter: "progid:DXImageTransform.Microsoft.Blur(pixelradius=10)",

      color: textColor,
      boxShadow: scrolled ? "0 2px 10px rgba(0, 0, 0, 0.1)" : "none",
      transition: `box-shadow ${scrollConfig.transitionDuration}s ${scrollConfig.transitionTiming}`,
    };
  }, [secondaryColor, textColor, scrolled]);

  // Styles mémorisés pour le padding
  const paddingStyle = useMemo(() => {
    return {
      paddingTop: `${stablePadding.top}rem`,
      paddingBottom: `${stablePadding.bottom}rem`,
      transition: `padding ${headerSizeConfig.heightTransitionDuration}s ${headerSizeConfig.heightTransitionTiming}`,
    };
  }, [stablePadding]);

  // Détermine si on affiche la version "Compact"
  const shouldShowCompactHeader = useMemo(() => {
    const threshold = isMobile ? 0.3 : 0.1;
    return scrollProgress > threshold;
  }, [scrollProgress, isMobile]);

  // Classe flex ajustée
  const flexClass = useMemo(() => {
    return `flex justify-between items-center ${
      scrollProgress > 0.5 ? "flex-row" : "flex-col md:flex-row"
    }`;
  }, [scrollProgress]);

  return (
    <>
      {/* Spacer pour conserver la place du header en position fixe */}
      <div style={{ height: `${headerHeight}px`, overflow: "hidden" }}></div>

      <motion.header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 will-change-transform"
        style={headerStyle}
      >
        <div className="container mx-auto px-4">
          <div className={flexClass} style={paddingStyle}>
            {shouldShowCompactHeader ? (
              <CompactHeader
                textColor={textColor}
                scrollToTop={scrollToTop}
                openModal={openModal}
                showShareMenu={showShareMenu}
                setShowShareMenu={setShowShareMenu}
                handleShare={handleShare}
                isMobile={isMobile}
                scrollProgress={scrollProgress}
              />
            ) : (
              <ExpandedHeader
                textColor={textColor}
                index={index}
                animation={animation}
                openModal={openModal}
                showShareMenu={showShareMenu}
                setShowShareMenu={setShowShareMenu}
                handleShare={handleShare}
                isMobile={isMobile}
                scrollProgress={scrollProgress}
              />
            )}
          </div>
        </div>
      </motion.header>
      
      {/* Modal de contact */}
     <ContactModal/>
    </>
  );
};

export default Header;
