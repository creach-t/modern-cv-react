import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Share2 } from "lucide-react";
import { wiggleAnimation } from "../../../constants/headerConstants";
import ShareMenu from "./ShareMenu";
import { socialIconsConfig } from "../../../config/animationConfig";

const SocialLinks = ({ 
  textColor, 
  openModal, 
  showShareMenu, 
  setShowShareMenu, 
  handleShare, 
  isMobile, 
  compact = false,
  scrollProgress = 0
}) => {
  // Calcul de la taille pour GitHub et LinkedIn en fonction du scroll
  const getSocialIconScale = () => {
    // De taille normale (1) à 0 avec le scroll
    return Math.max(0, 1 - scrollProgress * socialIconsConfig.scaleFactor);
  };
  
  // Déterminer si on doit afficher les icônes
  const showSocialIcons = getSocialIconScale() > socialIconsConfig.scaleThreshold;

  return (
    <motion.div 
      className={`flex gap-4 items-center ${compact ? "" : "mt-4 md:mt-0"}`}
      // Le bloc entier peut se déplacer légèrement vers la gauche lors du scroll
      style={{
        transform: `translateX(${-socialIconsConfig.blockOffset * scrollProgress}px)`
      }}
      transition={{ duration: socialIconsConfig.blockTransitionDuration }}
    >
      {/* GitHub et LinkedIn qui apparaissent/disparaissent avec un effet d'échelle */}
      {!compact && showSocialIcons && (
        <>
          <motion.a 
            href="https://github.com/creach-t" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:opacity-80 transition-all p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
            whileHover="hover"
            variants={wiggleAnimation}
            style={{
              scale: getSocialIconScale(),
              opacity: getSocialIconScale(),
              width: showSocialIcons ? 'auto' : 0,
              marginRight: showSocialIcons ? 'auto' : 0,
              overflow: 'hidden',
              transformOrigin: 'center'
            }}
            transition={{ 
              duration: socialIconsConfig.iconTransitionDuration,
              ease: socialIconsConfig.iconTransitionTiming
            }}
          >
            <Github 
              className="w-6 h-6" 
              style={{ color: textColor }} 
            />
          </motion.a>
          
          <motion.a 
            href="https://linkedin.com/in/creachtheo" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:opacity-80 transition-all p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
            whileHover="hover"
            variants={wiggleAnimation}
            style={{
              scale: getSocialIconScale(),
              opacity: getSocialIconScale(),
              width: showSocialIcons ? 'auto' : 0,
              marginRight: showSocialIcons ? 'auto' : 0,
              overflow: 'hidden',
              transformOrigin: 'center'
            }}
            transition={{ 
              duration: socialIconsConfig.iconTransitionDuration,
              ease: socialIconsConfig.iconTransitionTiming
            }}
          >
            <Linkedin 
              className="w-6 h-6" 
              style={{ color: textColor }} 
            />
          </motion.a>
        </>
      )}
      
      {/* Mail and Share icons container for consistent alignment */}
      <div className="flex items-center">
        {/* Mail icon */}
        <motion.button
          onClick={openModal}
          className="flex items-center justify-center hover:opacity-80 transition-opacity p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
          whileHover="hover"
          variants={wiggleAnimation}
        >
          <Mail 
            className={`${compact ? "w-5 h-5" : "w-6 h-6"}`} 
            style={{ color: textColor }} 
          />
        </motion.button>
        
        {/* Share icon and menu */}
        <div className="relative flex items-center">
          <motion.button 
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="flex items-center justify-center p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
            aria-label="Partager"
            whileHover="hover"
            variants={wiggleAnimation}
          >
            <Share2 
              className={`${compact ? "w-5 h-5" : "w-6 h-6"}`} 
              style={{ color: textColor }} 
            />
          </motion.button>
          
          {showShareMenu && (
            <ShareMenu 
              handleShare={handleShare} 
              isMobile={isMobile} 
              setShowShareMenu={setShowShareMenu} 
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SocialLinks;