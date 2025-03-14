import React from "react";
import { motion } from "framer-motion";
import SocialLinks from "./SocialLinks";
import { slideConfig, hoverConfig, opacityConfig } from "../../config/animationConfig";

const CompactHeader = ({ 
  textColor, 
  scrollToTop, 
  openModal, 
  showShareMenu, 
  setShowShareMenu, 
  handleShare, 
  isMobile,
  scrollProgress = 1
}) => {
  return (
    <div className="flex items-center justify-between w-full">
      <motion.h1 
        className="text-xl font-bold cursor-pointer hover:opacity-90 transition-all"
        style={{ 
          color: textColor,
          transform: `translateX(${slideConfig.compactNameDistance * (1 - scrollProgress)}px)`,
          opacity: scrollProgress,
          transition: `transform ${slideConfig.slideTransitionDuration}s ${slideConfig.slideTransitionTiming}, opacity ${opacityConfig.opacityTransitionDuration}s ${opacityConfig.opacityTransitionTiming}`
        }}
        onClick={scrollToTop}
        whileHover={{ scale: hoverConfig.scaleFactorHover }}
        whileTap={{ scale: hoverConfig.scaleFactorTap }}
      >
        Théo Créac'h
      </motion.h1>
      
      <SocialLinks 
        textColor={textColor}
        openModal={openModal}
        showShareMenu={showShareMenu}
        setShowShareMenu={setShowShareMenu}
        handleShare={handleShare}
        isMobile={isMobile}
        compact={true}
        scrollProgress={scrollProgress}
      />
    </div>
  );
};

export default CompactHeader;