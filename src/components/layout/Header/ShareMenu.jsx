import React, { useEffect, useRef } from "react";
import { 
  Linkedin, 
  MessageCircle, 
  Phone, 
  Link2
} from "lucide-react";
import { useColor } from "../../../contexts/ColorContext";
import { useLanguage } from "../../../contexts/LanguageContext";

const translations = {
  fr: {
    linkedin: "LinkedIn",
    whatsapp: "WhatsApp",
    sms: "SMS",
    copyLink: "Copier le lien"
  },
  en: {
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
  const menuRef = useRef(null);
  
  // Couleurs dynamiques basées sur secondaryColor
  const menuBgColor = isDark ? "#1f2937" : "white";
  const menuTextColor = isDark ? "white" : "black";
  const hoverBgColor = isDark ? "#374151" : "#f3f4f6";
  
  // Gestionnaire de clic en dehors du menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowShareMenu(false);
      }
    };
    
    // Ajouter l'écouteur d'événements
    document.addEventListener("mousedown", handleClickOutside);
    
    // Nettoyage
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowShareMenu]);
  
  // Fonction pour générer des styles dynamiques
  const getDynamicStyles = (platform) => ({
    base: { 
      color: menuTextColor,
      backgroundColor: 'transparent',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      padding: '0.5rem',
      transition: 'background-color 0.2s',
      borderRadius: '0.25rem'
    },
    hover: { 
      backgroundColor: hoverBgColor,
      color: secondaryColor // Utilisation de secondaryColor au survol
    }
  });

  return (
    <div 
      ref={menuRef}
      className="absolute z-50 right-0 w-64 rounded-lg shadow-lg"
      style={{ 
        backgroundColor: menuBgColor,
        border: `1px solid ${secondaryColor}`,
        top: '40px',
        position: 'absolute'
      }}
    >
      {/* Bouton LinkedIn */}
      <button
        onClick={() => handleShare('linkedin')}
        style={getDynamicStyles('linkedin').base}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = getDynamicStyles('linkedin').hover.backgroundColor;
          e.currentTarget.style.color = getDynamicStyles('linkedin').hover.color;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = menuTextColor;
        }}
      >
        <Linkedin className="mr-2" />
        {t.linkedin}
      </button>

      {/* Bouton WhatsApp */}
      <button
        onClick={() => handleShare('whatsapp')}
        style={getDynamicStyles('whatsapp').base}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = getDynamicStyles('whatsapp').hover.backgroundColor;
          e.currentTarget.style.color = getDynamicStyles('whatsapp').hover.color;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = menuTextColor;
        }}
      >
        <MessageCircle className="mr-2" />
        {t.whatsapp}
      </button>

      {/* Bouton SMS (mobile uniquement) */}
      {isMobile && (
        <button
          onClick={() => handleShare('sms')}
          style={getDynamicStyles('sms').base}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = getDynamicStyles('sms').hover.backgroundColor;
            e.currentTarget.style.color = getDynamicStyles('sms').hover.color;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = menuTextColor;
          }}
        >
          <Phone className="mr-2" />
          {t.sms}
        </button>
      )}

      {/* Bouton Copier le lien */}
      <button
        onClick={() => handleShare('copy')}
        style={getDynamicStyles('copy').base}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = getDynamicStyles('copy').hover.backgroundColor;
          e.currentTarget.style.color = getDynamicStyles('copy').hover.color;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = menuTextColor;
        }}
      >
        <Link2 className="mr-2" />
        {t.copyLink}
      </button>
    </div>
  );
};

export default ShareMenu;