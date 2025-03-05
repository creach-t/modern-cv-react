import React, { createContext, useContext, useState, useEffect } from "react";

const ColorContext = createContext();

export const useColor = () => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error("useColor must be used within a ColorProvider");
  }
  return context;
};

export const ColorProvider = ({ children }) => {
  // État pour stocker les couleurs Pantone
  const [pantoneColors, setPantoneColors] = useState([]);
  const [secondaryColor, setSecondaryColor] = useState("#6667AB"); // Valeur par défaut (Very Peri)
  const [colorInfo, setColorInfo] = useState(null); // Information sur la couleur actuelle
  const [isDark, setIsDark] = useState(true); // Mode sombre activé par défaut
  const [isLoading, setIsLoading] = useState(true);
  
  // Chargement des couleurs depuis le JSON
  useEffect(() => {
    const loadColors = async () => {
      try {
        // Dans un environnement réel, vous utiliseriez un import ou fetch
        // Pour cet exemple, nous simulons le chargement depuis "pantone-colors.json"
        const response = await fetch("data/colors.json");
        const data = await response.json();
        
        if (data && data.colors && Array.isArray(data.colors)) {
          setPantoneColors(data.colors);
          
          // Sélectionner une couleur aléatoire au démarrage
          const randomIndex = Math.floor(Math.random() * data.colors.length);
          const randomColor = data.colors[randomIndex];
          setSecondaryColor(randomColor.hex);
          setColorInfo(randomColor);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des couleurs Pantone:", error);
        setIsLoading(false);
      }
    };
    
    loadColors();
  }, []);
  
  // Fonction pour obtenir une couleur aléatoire depuis notre liste Pantone
  const getRandomPantoneColor = () => {
    if (pantoneColors.length === 0) return { hex: "#6667AB", name: "Default Color" };
    
    const randomIndex = Math.floor(Math.random() * pantoneColors.length);
    return pantoneColors[randomIndex];
  };
  
  // Fonction pour changer manuellement la couleur
  const changeColor = () => {
    const newColorInfo = getRandomPantoneColor();
    setSecondaryColor(newColorInfo.hex);
    setColorInfo(newColorInfo);
    return newColorInfo;
  };
  
  // Fonction pour définir une couleur spécifique par nom
  const setColorByName = (colorName) => {
    const foundColor = pantoneColors.find(color => 
      color.name.toLowerCase() === colorName.toLowerCase()
    );
    
    if (foundColor) {
      setSecondaryColor(foundColor.hex);
      setColorInfo(foundColor);
      return true;
    }
    
    return false;
  };
  
  const value = {
    secondaryColor,
    setSecondaryColor,
    colorInfo,           // Information sur la couleur actuelle (nom, année, description)
    pantoneColors,       // Liste complète des couleurs
    changeColor,         // Fonction pour changer aléatoirement la couleur
    setColorByName,      // Fonction pour définir une couleur par son nom
    isDark,
    setIsDark,
    isLoading
  };
  
  return <ColorContext.Provider value={value}>{children}</ColorContext.Provider>;
};