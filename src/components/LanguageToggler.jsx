import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

const LanguageToggler = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
    >
      {language === "fr" ? "🇫🇷" : "🇬🇧"}
    </button>
  );
};

export default LanguageToggler;
