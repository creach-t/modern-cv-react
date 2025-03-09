import React, { useState, useEffect } from "react";
import { useColor } from "../contexts/ColorContext";
import { 
  Github, 
  Linkedin, 
  Mail, 
  Share2, 
  X, 
  Facebook, 
  Twitter, 
  Link2,
  MessageCircle,
  Phone
} from "lucide-react";
import { getTextColor } from "../utils/color";
import { motion, AnimatePresence } from "framer-motion";

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

const Header = () => {
  const { secondaryColor } = useColor();
  const textColor = getTextColor(secondaryColor);
  const [index, setIndex] = useState(0);
  const [animation, setAnimation] = useState(animations[0]);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
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

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % titles.length);
      setAnimation(animations[Math.floor(Math.random() * animations.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = "Portfolio de Théo Créac'h - Développeur Full Stack";
    
    let shareUrl;
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
      case 'sms':
        shareUrl = `sms:?body=${encodeURIComponent(title + ' ' + url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert("Lien copié dans le presse-papier !");
        setShowShareMenu(false);
        return;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  return (
    <header
      className="py-8 transition-colors duration-200 relative"
      style={{ backgroundColor: secondaryColor, color: textColor }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative group">
              <img
                src="/img/profil_picture.png"
                alt="Théo Créac'h"
                className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 text-white font-medium transition-opacity duration-300">Hello!</span>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-1" style={{ color: textColor }}>
                Théo Créac'h
              </h1>
              <h2 className="text-lg md:text-xl font-medium opacity-80 flex gap-2" style={{ color: textColor }}>
                <span>Développeur</span>
                <span className="flex gap-1">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={index}
                      initial={animation.initial}
                      animate={animation.animate}
                      exit={animation.exit}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                      {titles[index].prefix}
                    </motion.span>
                  </AnimatePresence>
                  <span>{titles[index].suffix}</span>
                </span>
              </h2>
            </div>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0 items-center">
            <a href="https://github.com/creach-t" target="_blank" rel="noopener noreferrer" 
               className="hover:opacity-80 transition-opacity p-2 hover:bg-white hover:bg-opacity-20 rounded-full">
              <Github className="w-6 h-6" style={{ color: textColor }} />
            </a>
            <a href="https://linkedin.com/in/creachtheo" target="_blank" rel="noopener noreferrer" 
               className="hover:opacity-80 transition-opacity p-2 hover:bg-white hover:bg-opacity-20 rounded-full">
              <Linkedin className="w-6 h-6" style={{ color: textColor }} />
            </a>
            <a href="mailto:creach.t@gmail.com" 
               className="hover:opacity-80 transition-opacity p-2 hover:bg-white hover:bg-opacity-20 rounded-full">
              <Mail className="w-6 h-6" style={{ color: textColor }} />
            </a>
            
            {/* Bouton de partage avec menu déroulant */}
            <div className="relative">
              <button 
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center justify-center p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
                aria-label="Partager"
              >
                <Share2 className="w-6 h-6" style={{ color: textColor }} />
              </button>
              
              {/* Menu déroulant de partage */}
              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg overflow-hidden z-50"
                    style={{ color: "black" }}
                  >
                    <div className="py-1">
                      <button 
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => handleShare('facebook')}
                      >
                        <Facebook className="w-5 h-5 text-blue-600" />
                        <span>Facebook</span>
                      </button>
                      <button 
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => handleShare('twitter')}
                      >
                        <Twitter className="w-5 h-5 text-blue-400" />
                        <span>Twitter</span>
                      </button>
                      <button 
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => handleShare('linkedin')}
                      >
                        <Linkedin className="w-5 h-5 text-blue-700" />
                        <span>LinkedIn</span>
                      </button>
                      <button 
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => handleShare('whatsapp')}
                      >
                        <MessageCircle className="w-5 h-5 text-green-500" />
                        <span>WhatsApp</span>
                      </button>
                      {isMobile && (
                        <button 
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                          onClick={() => handleShare('sms')}
                        >
                          <Phone className="w-5 h-5 text-gray-600" />
                          <span>SMS</span>
                        </button>
                      )}
                      <button 
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => handleShare('copy')}
                      >
                        <Link2 className="w-5 h-5 text-gray-600" />
                        <span>Copier le lien</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Bouton de fermeture du menu de partage qui apparaît en dehors du menu */}
            {showShareMenu && (
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setShowShareMenu(false)}
              ></div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;