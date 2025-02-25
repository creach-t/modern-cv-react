import React, { createContext, useContext, useState } from "react";

// Création du contexte
const LanguageContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useLanguage = () => useContext(LanguageContext);

// Provider pour englober l'application
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("fr"); // "fr" par défaut

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "fr" ? "en" : "fr"));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
