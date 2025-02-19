import React, { createContext, useContext, useState } from 'react';

const ColorContext = createContext();

export const useColor = () => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error('useColor must be used within a ColorProvider');
  }
  return context;
};

export const ColorProvider = ({ children }) => {
  const [secondaryColor, setSecondaryColor] = useState('#3B82F6'); // Couleur bleue par défaut
  const [isDark, setIsDark] = useState(true); // État pour la version sombre/claire du texte

  const value = {
    secondaryColor,
    setSecondaryColor,
    isDark,
    setIsDark,
  };

  return (
    <ColorContext.Provider value={value}>
      {children}
    </ColorContext.Provider>
  );
};
