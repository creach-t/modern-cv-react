import React, { createContext, useContext, useState, useEffect } from "react";

// Création du contexte
const LanguageContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useLanguage = () => useContext(LanguageContext);

// Provider pour englober l'application
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(null);
  
  // Effet pour initialiser la langue
  useEffect(() => {
    // Priorité 1: Vérifier les paramètres d'URL
    const queryParams = new URLSearchParams(window.location.search);
    const urlLang = queryParams.get('lang');
    
    // Priorité 2: Vérifier si une préférence existe dans le localStorage
    const savedLanguage = localStorage.getItem('preferredLanguage');
    
    // Priorité 3: Utiliser la langue du navigateur
    const browserLanguage = navigator.language || navigator.userLanguage;
    const detectedLanguage = browserLanguage.substring(0, 2).toLowerCase();
    
    // Définir les langues supportées
    const supportedLanguages = ['fr', 'en'];
    const defaultLanguage = 'fr';
    
    // Déterminer la langue à utiliser selon les priorités
    let selectedLanguage;
    
    if (urlLang && supportedLanguages.includes(urlLang)) {
      selectedLanguage = urlLang;
      // Optionnel: sauvegarder la préférence d'URL dans localStorage
      localStorage.setItem('preferredLanguage', urlLang);
    } else if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
      selectedLanguage = savedLanguage;
    } else {
      selectedLanguage = supportedLanguages.includes(detectedLanguage) 
        ? detectedLanguage 
        : defaultLanguage;
    }
    
    setLanguage(selectedLanguage);
  }, []);

  // Surveiller les changements d'URL pour mettre à jour la langue si nécessaire
  useEffect(() => {
    const handleUrlChange = () => {
      const queryParams = new URLSearchParams(window.location.search);
      const urlLang = queryParams.get('lang');
      
      if (urlLang && ['fr', 'en'].includes(urlLang) && urlLang !== language) {
        setLanguage(urlLang);
        localStorage.setItem('preferredLanguage', urlLang);
      }
    };

    // Écouter les changements d'historique (navigation)
    window.addEventListener('popstate', handleUrlChange);
    
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [language]);
  
  // Changement de langue avec sauvegarde dans localStorage
  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
    
    // Optionnel: Mettre à jour l'URL sans recharger la page
    const url = new URL(window.location);
    url.searchParams.set('lang', lang);
    window.history.pushState({}, '', url);
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