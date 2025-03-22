import React from "react";
import { motion } from "framer-motion";
import SocialLinks from "./SocialLinks";
import AvailableBadge from "./AvailableBadge";
import { slideConfig, hoverConfig, opacityConfig } from "../../../config/animationConfig";

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
      <div className="flex flex-col items-start">
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
        
        {/* Badge sous le nom en mode compact */}
        <motion.div
          style={{
            opacity: Math.min(1, scrollProgress * 2),
            scale: Math.min(1, scrollProgress * 1.5),
            transition: `opacity ${opacityConfig.opacityTransitionDuration}s, scale ${opacityConfig.opacityTransitionDuration}s`
          }}
        >
          <AvailableBadge />
        </motion.div>
      </div>
      
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