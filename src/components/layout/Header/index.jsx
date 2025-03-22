import React from "react";
import { useColor } from "../../../contexts/ColorContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useContactModal } from "../../../contexts/ContactModalContext";
import { motion } from "framer-motion";
import { getTextColor } from "../../../utils/color";
import { headerTranslations } from "../../../constants/headerTranslations";
import { useHeaderEffects } from "../../../hooks/useHeaderEffects";
import { handleShare as shareHandler } from "../../../utils/shareUtils";
import ExpandedHeader from "./ExpandedHeader";
import CompactHeader from "./CompactHeader";
import { scrollConfig, headerSizeConfig } from "../../../config/animationConfig";

const Header = () => {
  const { secondaryColor } = useColor();
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
    scrollToTop
  } = useHeaderEffects();
  
  // Gestionnaire de partage adapté au composant
  const handleShare = (platform) => {
    shareHandler(platform, t, setShowShareMenu);
  };
  
  return (
    <>
      
      {/* Spacer div qui prend la même hauteur que le header */}
      <div style={{ height: headerHeight }}></div>
      
      <motion.header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50"
        style={{ 
          backgroundColor: secondaryColor, 
          color: textColor,
          boxShadow: scrolled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none',
          transition: `box-shadow ${scrollConfig.transitionDuration}s ${scrollConfig.transitionTiming}`
        }}
      >
        <div className="container mx-auto px-4">
          <div 
            className={`flex justify-between items-center ${scrollProgress > 0.5 ? 'flex-row' : 'flex-col md:flex-row'}`}
            style={{
              paddingTop: headerSizeConfig.paddingTopCompact + (1 - scrollProgress) * headerSizeConfig.paddingExpandedFactor + 'rem',
              paddingBottom: headerSizeConfig.paddingBottomCompact + (1 - scrollProgress) * headerSizeConfig.paddingExpandedFactor + 'rem',
              transition: `padding ${headerSizeConfig.heightTransitionDuration}s ${headerSizeConfig.heightTransitionTiming}`
            }}
          >
            {/* Rendu conditionnel avec effet de transition */}
            {scrolled ? (
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
    </>
  );
};

export default Header;