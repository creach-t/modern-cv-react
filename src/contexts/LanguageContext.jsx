import React, { createContext, useContext, useState, useEffect } from "react";

// Création du contexte
const LanguageContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useLanguage = () => useContext(LanguageContext);

// Provider pour englober l'application
export const LanguageProvider = ({ children, initialLanguage = "fr" }) => {
  // Utiliser la valeur initiale fournie ou "fr" par défaut
  const [language, setLanguage] = useState(initialLanguage);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "fr" ? "en" : "fr"));
  };

  // Utiliser l'effet pour synchroniser avec localStorage, uniquement côté client
  useEffect(() => {
    // On vérifie si on est côté client
    if (typeof window !== "undefined") {
      // Essayer de récupérer la langue depuis localStorage
      const savedLanguage = localStorage.getItem("preferredLanguage");
      if (savedLanguage && ["fr", "en"].includes(savedLanguage)) {
        setLanguage(savedLanguage);
      }
    }
  }, []);

  // Sauvegarder la langue dans localStorage quand elle change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("preferredLanguage", language);
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
