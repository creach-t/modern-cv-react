import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

const LanguageToggler = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors text-sm font-medium flex items-center justify-center"
      aria-label={language === "fr" ? "Switch to English" : "Passer en français"}
    >
      {language === "fr" ? (
        <img 
          src="https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/fr.svg" 
          alt="Drapeau français" 
          className="w-6 h-4"
        />
      ) : (
        <img 
          src="https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/gb.svg" 
          alt="British flag" 
          className="w-6 h-4"
        />
      )}
    </button>
  );
};

export default LanguageToggler;