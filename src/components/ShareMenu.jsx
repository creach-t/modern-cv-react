import React from "react";
import { motion } from "framer-motion";
import { 
  Facebook, 
  Twitter as XIcon, // Renommé pour éviter la confusion
  Linkedin, 
  MessageCircle, 
  Phone, 
  Link2,
  AlertTriangle 
} from "lucide-react";
import { useColor } from "../contexts/ColorContext";
import { useLanguage } from "../contexts/LanguageContext";

const translations = {
  fr: {
    facebook: "Facebook",
    twitter: "X",
    twitterHover: "À vos risques et périls...",
    linkedin: "LinkedIn",
    whatsapp: "WhatsApp",
    sms: "SMS",
    copyLink: "Copier le lien"
  },
  en: {
    facebook: "Facebook",
    twitter: "X",
    twitterHover: "Enter at your own risk...",
    linkedin: "LinkedIn",
    whatsapp: "WhatsApp",
    sms: "SMS",
    copyLink: "Copy link"
  }
};

const ShareMenu = ({ handleShare, isMobile, setShowShareMenu }) => {
  const { secondaryColor, isDark } = useColor();
  const { language } = useLanguage();
  const t = translations[language];
  
  // Obtenir la couleur du texte basée sur le thème
  const menuBgColor = isDark ? "#1f2937" : "white"; // gray-800 en dark mode, blanc en mode clair
  const menuTextColor = isDark ? "white" : "black";
  const hoverBgColor = isDark ? "#374151" : "#f3f4f6"; // gray-700 en dark mode, gray-100 en mode clair
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute right-0 mt-2 w-44 rounded-lg shadow-lg overflow-hidden z-50"
        style={{ 
          backgroundColor: menuBgColor,
          color: menuTextColor,
          borderColor: isDark ? "#374151" : "#e5e7eb", // gray-700 ou gray-200
          borderWidth: "1px",
        }}
      >
        <div className="py-1">
          <button 
            className="w-full px-4 py-2 text-left flex items-center gap-2 transition-colors duration-150"
            onClick={() => handleShare('facebook')}
            style={{ 
              color: menuTextColor,
              ":hover": { backgroundColor: hoverBgColor }
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = hoverBgColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <Facebook className="w-5 h-5 text-blue-600" />
            <span>{t.facebook}</span>
          </button>
          
          <button 
            className="w-full px-4 py-2 text-left flex items-center gap-2 transition-colors duration-150 group relative"
            onClick={() => handleShare('twitter')}
            style={{ 
              color: menuTextColor,
              ":hover": { backgroundColor: hoverBgColor }
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = hoverBgColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <XIcon className="w-5 h-5 text-black dark:text-white" />
            <span>{t.twitter}</span>
            <div className="absolute invisible group-hover:visible left-0 bottom-full mb-2 p-2 bg-red-50 dark:bg-red-900 text-red-500 dark:text-red-200 text-xs rounded shadow-lg w-44 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none flex items-center">
              <AlertTriangle className="w-3 h-3 mr-1 flex-shrink-0" />
              <span>{t.twitterHover}</span>
              <div className="absolute top-full left-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-l-transparent border-r-transparent border-t-red-50 dark:border-t-red-900"></div>
            </div>
          </button>
          
          <button 
            className="w-full px-4 py-2 text-left flex items-center gap-2 transition-colors duration-150"
            onClick={() => handleShare('linkedin')}
            style={{ 
              color: menuTextColor,
              ":hover": { backgroundColor: hoverBgColor }
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = hoverBgColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <Linkedin className="w-5 h-5 text-blue-700" />
            <span>{t.linkedin}</span>
          </button>
          
          <button 
            className="w-full px-4 py-2 text-left flex items-center gap-2 transition-colors duration-150"
            onClick={() => handleShare('whatsapp')}
            style={{ 
              color: menuTextColor,
              ":hover": { backgroundColor: hoverBgColor }
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = hoverBgColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <MessageCircle className="w-5 h-5 text-green-500" />
            <span>{t.whatsapp}</span>
          </button>
          
          {isMobile && (
            <button 
              className="w-full px-4 py-2 text-left flex items-center gap-2 transition-colors duration-150"
              onClick={() => handleShare('sms')}
              style={{ 
                color: menuTextColor,
                ":hover": { backgroundColor: hoverBgColor }
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = hoverBgColor}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <Phone className="w-5 h-5" style={{ color: isDark ? "#9ca3af" : "#4b5563" }} />
              <span>{t.sms}</span>
            </button>
          )}
          
          <button 
            className="w-full px-4 py-2 text-left flex items-center gap-2 transition-colors duration-150"
            onClick={() => handleShare('copy')}
            style={{ 
              color: menuTextColor,
              ":hover": { backgroundColor: hoverBgColor }
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = hoverBgColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <Link2 className="w-5 h-5" style={{ color: isDark ? "#9ca3af" : "#4b5563" }} />
            <span>{t.copyLink}</span>
          </button>
        </div>
      </motion.div>
      
      {/* Overlay pour fermer le menu de partage */}
      <div 
        className="fixed inset-0 z-40"
        onClick={() => setShowShareMenu(false)}
      ></div>
    </>
  );
};

export default ShareMenu;