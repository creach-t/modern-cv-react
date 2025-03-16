import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, Share2 } from "lucide-react";
import ShareMenu from "../ShareMenu";


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
  // Déterminer si on doit afficher GitHub et LinkedIn
  const showGithubLinkedin = !compact && scrollProgress < 0.7;
  
  // Calculer la position de glissement pour Mail et Share
  const slideOffset = !showGithubLinkedin ? (isMobile ? -20 : -40) : 0;
  
  // Classe commune pour tous les boutons sociaux avec écartement cohérent
  const socialButtonClass = "hover:opacity-80 transition-all p-2 hover:bg-white hover:bg-opacity-20 rounded-full";
  
  return (
    <div className={`flex ${compact ? "items-center" : "mt-4 md:mt-0 items-center"} gap-4`}>
      {/* GitHub et LinkedIn avec apparition/disparition */}
      <AnimatePresence>
        {showGithubLinkedin && (
          <motion.div 
            className="flex gap-4" // Utiliser le même gap que le conteneur parent
            initial={{ width: 0, opacity: 0, marginRight: 0 }}
            animate={{ width: "auto", opacity: 1, marginRight: 0 }}
            exit={{ width: 0, opacity: 0, marginRight: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.a 
              href="https://github.com/creach-t" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={socialButtonClass}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
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
              className={socialButtonClass}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Linkedin 
                className="w-6 h-6" 
                style={{ color: textColor }} 
              />
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mail avec glissement */}
      <motion.button
        onClick={openModal}
        className={socialButtonClass}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ 
          x: slideOffset,
          transition: { 
            type: "spring", 
            stiffness: 400, 
            damping: 25 
          }
        }}
      >
        <Mail 
          className={`${compact ? "w-5 h-5" : "w-6 h-6"}`} 
          style={{ color: textColor }} 
        />
      </motion.button>
      
      {/* Share avec glissement */}
      <div className="relative">
        <motion.button 
          onClick={() => setShowShareMenu(!showShareMenu)}
          className={socialButtonClass}
          aria-label="Partager"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{ 
            x: slideOffset,
            transition: { 
              type: "spring", 
              stiffness: 400, 
              damping: 25,
              delay: 0.05 // Légèrement décalé pour un effet en cascade
            }
          }}
        >
          <Share2 
            className={`${compact ? "w-5 h-5" : "w-6 h-6"}`} 
            style={{ color: textColor }} 
          />
        </motion.button>
        
        {/* Menu de partage */}
        <AnimatePresence>
          {showShareMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 z-10"
            >
              <ShareMenu 
                handleShare={handleShare} 
                isMobile={isMobile} 
                setShowShareMenu={setShowShareMenu} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SocialLinks;