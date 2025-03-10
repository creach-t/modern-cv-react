import React, { useState, useEffect, useRef } from "react";
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
import ShareMenu from "./ShareMenu";
import ContactModal from "./ContactModal";

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
  const { secondaryColor } = useColor();
  const textColor = getTextColor(secondaryColor);
  const [index, setIndex] = useState(0);
  const [animation, setAnimation] = useState(animations[0]);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
  
  // Effet pour surveiller le scroll et mettre à jour l'état
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Mesurer la hauteur du header pour le spacer
  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
      
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          setHeaderHeight(entry.target.offsetHeight);
        }
      });
      
      resizeObserver.observe(headerRef.current);
      
      return () => {
        if (headerRef.current) {
          resizeObserver.unobserve(headerRef.current);
        }
      };
    }
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
  
  // Fonction pour remonter en haut de la page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <>
      {/* Spacer div qui prend la même hauteur que le header */}
      <div style={{ height: headerHeight }}></div>
      
      <motion.header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{ 
          backgroundColor: secondaryColor, 
          color: textColor,
          boxShadow: scrolled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none'
        }}
      >
        <div className="container mx-auto px-4">
          <div 
            className={`flex ${scrolled ? 'flex-row' : 'flex-col md:flex-row'} justify-between items-center transition-all duration-300 ease-in-out`}
            style={{
              paddingTop: scrolled ? '0.75rem' : '2rem',
              paddingBottom: scrolled ? '0.75rem' : '2rem',
            }}
          >
            {/* Version non scrollée */}
            {!scrolled && (
              <>
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <motion.div 
                    className="relative group"
                    whileHover="hover"
                    variants={wiggleAnimation}
                  >
                    <img
                      src="/img/profil_picture.png"
                      alt="Théo Créac'h"
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 text-white font-medium transition-opacity duration-300">Hello!</span>
                    </div>
                  </motion.div>
                  
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
                  <motion.a 
                    href="https://github.com/creach-t" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:opacity-80 transition-opacity p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
                    whileHover="hover"
                    variants={wiggleAnimation}
                  >
                    <Github className="w-6 h-6" style={{ color: textColor }} />
                  </motion.a>
                  
                  <motion.a 
                    href="https://linkedin.com/in/creachtheo" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:opacity-80 transition-opacity p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
                    whileHover="hover"
                    variants={wiggleAnimation}
                  >
                    <Linkedin className="w-6 h-6" style={{ color: textColor }} />
                  </motion.a>
                  
                  <motion.button
                    onClick={() => setShowContactModal(true)}
                    className="hover:opacity-80 transition-opacity p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
                    whileHover="hover"
                    variants={wiggleAnimation}
                  >
                    <Mail className="w-6 h-6" style={{ color: textColor }} />
                  </motion.button>
                  
                  <div className="relative">
                    <motion.button 
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="flex items-center justify-center p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
                      aria-label="Partager"
                      whileHover="hover"
                      variants={wiggleAnimation}
                    >
                      <Share2 className="w-6 h-6" style={{ color: textColor }} />
                    </motion.button>
                    
                    {showShareMenu && <ShareMenu handleShare={handleShare} isMobile={isMobile} setShowShareMenu={setShowShareMenu} />}
                  </div>
                </div>
              </>
            )}
            
            {/* Version scrollée - nom, bouton contact et bouton de partage */}
            {scrolled && (
              <>
                <motion.h1 
                  className="text-xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ color: textColor }}
                  onClick={scrollToTop}
                  whileHover="hover"
                  variants={wiggleAnimation}
                >
                  Théo Créac'h
                </motion.h1>
                
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => setShowContactModal(true)}
                    className="hover:opacity-80 transition-opacity p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
                    whileHover="hover"
                    variants={wiggleAnimation}
                  >
                    <Mail className="w-5 h-5" style={{ color: textColor }} />
                  </motion.button>
                  
                  <div className="relative">
                    <motion.button 
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="flex items-center justify-center p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
                      aria-label="Partager"
                      whileHover="hover"
                      variants={wiggleAnimation}
                    >
                      <Share2 className="w-5 h-5" style={{ color: textColor }} />
                    </motion.button>
                    
                    {showShareMenu && <ShareMenu handleShare={handleShare} isMobile={isMobile} setShowShareMenu={setShowShareMenu} />}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.header>
      
      {/* Modal de contact */}
      {showContactModal && <ContactModal isOpen={setShowContactModal}  onClose={() => setShowContactModal(false)}/>}
    </>
  );
};

export default Header;