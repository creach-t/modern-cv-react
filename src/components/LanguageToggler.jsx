import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Globe } from "lucide-react";

const LanguageToggler = ({ onClick }) => {
  const { language, toggleLanguage } = useLanguage();

  const handleLanguageToggle = () => {
    if (onClick) {
      onClick();
    } else {
      toggleLanguage();
    }
  };

  const LanguageFlag = () => {
    return language === "fr" ? "🇫🇷" : "🇬🇧";
  };

  return (
    <button
      onClick={handleLanguageToggle}
      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all transform hover:scale-105"
      aria-label={language === "fr" ? "Switch to English" : "Passer en français"}
    >
      <Globe className="absolute opacity-0">
        <LanguageFlag />
      </Globe>
      <LanguageFlag />
    </button>
  );
};

export default LanguageToggler;