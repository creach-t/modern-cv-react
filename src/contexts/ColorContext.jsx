import React, { createContext, useContext, useState } from "react";

const ColorContext = createContext();

export const useColor = () => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error("useColor must be used within a ColorProvider");
  }
  return context;
};

// Fonction pour générer une couleur hexadécimale aléatoire
const getRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
};

export const ColorProvider = ({ children }) => {
  const [secondaryColor, setSecondaryColor] = useState(getRandomColor()); // Couleur aléatoire par défaut
  const [isDark, setIsDark] = useState(true); // Mode sombre activé par défaut

  const value = {
    secondaryColor,
    setSecondaryColor,
    isDark,
    setIsDark,
  };

  return <ColorContext.Provider value={value}>{children}</ColorContext.Provider>;
};
