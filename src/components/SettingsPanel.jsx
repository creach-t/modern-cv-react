import React, { useState, useEffect } from "react";
import ColorPicker from "./ColorPicker";
import DarkModeToggler from "./DarkModeToggler";
import LanguageToggler from "./LanguageToggler";
import PdfExportButton from "./PdfExportButton";
import { Settings } from "lucide-react";
import { useColor } from "../contexts/ColorContext";
import { useLanguage } from "../contexts/LanguageContext";

const SettingsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setSecondaryColor, setIsDark } = useColor();
  const { toggleLanguage } = useLanguage();

  const toggleSettings = () => setIsOpen(!isOpen);

  const handleSettingChange = (changeFunction) => {
    // Exécute la fonction de changement
    changeFunction();
    
    // Ferme le panneau après 3 secondes
    setTimeout(() => {
      setIsOpen(false);
    }, 3000);
  };

  // Ajoute un effet pour gérer le scroll
  useEffect(() => {
    // Ne pas ajouter l'écouteur si le panneau est fermé
    if (!isOpen) return;

    // Fonction de gestion du scroll
    const handleScroll = () => {
      setIsOpen(false);
    };

    // Ajoute l'écouteur d'événement
    window.addEventListener('scroll', handleScroll);

    // Nettoie l'écouteur lors du démontage ou de la fermeture
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]); // Dépend de l'état isOpen

  return (
    <div className="fixed z-50 bottom-4 right-4 flex flex-col items-end">
      {/* Settings Trigger Button */}
      <button 
        onClick={toggleSettings}
        className={`p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all transform hover:scale-105 ${isOpen ? 'rotate-90' : ''}`}
        aria-label="Toggle Settings"
      >
        <Settings className="w-7 h-7 text-gray-700 dark:text-gray-200" />
      </button>
      {/* Sliding Settings Panel */}
      <div 
        className={`
          overflow-hidden transition-all duration-300 ease-in-out 
          ${isOpen 
            ? 'max-h-64 opacity-100 mt-2' 
            : 'max-h-0 opacity-0 -mt-2'
          } 
          flex flex-col gap-3 bg-white dark:bg-gray-800 
          rounded-lg shadow-lg p-3
        `}
      >
        <DarkModeToggler 
          onClick={() => handleSettingChange(() => setIsDark(prevIsDark => !prevIsDark))} 
        />
        <ColorPicker 
          onColorChange={(color) => {
            handleSettingChange(() => setSecondaryColor(color));
          }}
        />
        <LanguageToggler 
          onClick={() => handleSettingChange(toggleLanguage)} 
        />
        <PdfExportButton 
          onClick={() => {
            // Ne pas fermer le panneau pendant l'export
            // car l'utilisateur pourrait vouloir choisir des options d'export
          }} 
        />
      </div>
    </div>
  );
};

export default SettingsPanel;