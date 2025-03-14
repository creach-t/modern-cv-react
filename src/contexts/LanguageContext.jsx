import React, { createContext, useContext, useState, useEffect } from "react";

// Création du contexte
const LanguageContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useLanguage = () => useContext(LanguageContext);

// Provider pour englober l'application
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(null);
  
  // Effet pour initialiser la langue à partir du localStorage ou de la langue du navigateur
  useEffect(() => {
    // Vérifier si une préférence existe dans le localStorage
    const savedLanguage = localStorage.getItem('preferredLanguage');
    
    if (savedLanguage) {
      setLanguage(savedLanguage);
    } else {
      // Sinon, utiliser la langue du navigateur ou 'fr' par défaut
      const browserLanguage = navigator.language || navigator.userLanguage;
      const detectedLanguage = browserLanguage.substring(0, 2).toLowerCase();
      
      // On peut définir quelles langues sont supportées
      const supportedLanguages = ['fr', 'en'];
      const defaultLanguage = supportedLanguages.includes(detectedLanguage) 
        ? detectedLanguage 
        : 'fr';
      
      setLanguage(defaultLanguage);
    }
  }, []);

  // Changement de langue avec sauvegarde dans localStorage
  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
  };

  // Toggle entre les langues fr et en
  const toggleLanguage = () => {
    const newLang = language === "fr" ? "en" : "fr";
    changeLanguage(newLang);
  };

  // Ne rendre les enfants que lorsque la langue est chargée
  if (language === null) {
    return null; // ou un composant de chargement
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};