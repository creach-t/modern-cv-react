import React, { createContext, useContext, useState, useEffect } from "react";

// Création du contexte
const LanguageContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useLanguage = () => useContext(LanguageContext);

// Provider pour englober l'application
export const LanguageProvider = ({ children, initialLanguage = "fr" }) => {
  // Vérifier si on est côté client ou serveur
  const isClient = typeof window !== "undefined";
  
  // Utiliser la valeur initiale fournie ou "fr" par défaut
  const [language, setLanguage] = useState(initialLanguage);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "fr" ? "en" : "fr"));
  };

  // Utiliser l'effet pour synchroniser avec localStorage, uniquement côté client
  useEffect(() => {
    // On vérifie si on est côté client
    if (!isClient) return;
    
    // Essayer de récupérer la langue depuis localStorage
    try {
      const savedLanguage = localStorage.getItem("preferredLanguage");
      if (savedLanguage && ["fr", "en"].includes(savedLanguage)) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la langue préférée:", error);
    }
  }, [isClient]);

  // Sauvegarder la langue dans localStorage quand elle change
  useEffect(() => {
    if (!isClient) return;
    
    try {
      localStorage.setItem("preferredLanguage", language);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la langue préférée:", error);
    }
  }, [language, isClient]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
