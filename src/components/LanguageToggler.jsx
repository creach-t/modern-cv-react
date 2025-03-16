import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Globe } from "lucide-react";

const LanguageToggler = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="select-none p-2 bg-gray-200 rounded-lg shadow-lg hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-sm font-medium flex items-center justify-center"
      aria-label={language === "fr" ? "Switch to English" : "Passer en français"}
    >
      <Globe className="w-7 h-7 pr-2 text-black dark:text-white" />
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