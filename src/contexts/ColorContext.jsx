import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// Clé pour le stockage localStorage
const USER_COLOR_KEY = "user_preferred_color";
const USER_THEME_KEY = "user_preferred_theme"; // Nouvelle clé pour le thème

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
  const [isDark, setIsDark] = useState(false); // Valeur initiale à false, sera déterminée par useEffect
  const [isLoading, setIsLoading] = useState(true);
  
  // Fonction pour enregistrer la couleur de l'utilisateur
  const saveUserColor = (color) => {
    try {
      localStorage.setItem(USER_COLOR_KEY, color);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la couleur:", error);
    }
  };

  // Fonction pour enregistrer le choix de thème de l'utilisateur
  const saveUserTheme = (isDarkMode) => {
    try {
      localStorage.setItem(USER_THEME_KEY, JSON.stringify(isDarkMode));
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du thème:", error);
    }
  };

  // Déterminer le thème initial en suivant l'ordre de priorité
  useEffect(() => {
    // 1. Vérifier si l'utilisateur a déjà fait un choix (localStorage)
    try {
      const savedTheme = localStorage.getItem(USER_THEME_KEY);
      
      if (savedTheme !== null) {
        // Utiliser le thème sauvegardé
        setIsDark(JSON.parse(savedTheme));
      } else {
        // 2. Vérifier la préférence du navigateur
        const prefersDark = window.matchMedia && 
          window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (prefersDark !== undefined) {
          setIsDark(prefersDark);
        } else {
          // 3. Par défaut: mode sombre
          setIsDark(true);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du thème:", error);
      // En cas d'erreur, utiliser le mode sombre par défaut
      setIsDark(true);
    }
  }, []);

  // Observer les changements de préférence du système
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Ne pas mettre à jour si l'utilisateur a déjà fait un choix explicite
    const hasUserPreference = localStorage.getItem(USER_THEME_KEY) !== null;
    
    const handleChange = (e) => {
      if (!hasUserPreference) {
        setIsDark(e.matches);
      }
    };
    
    // Ajouter un écouteur pour le changement de préférence
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback pour les anciens navigateurs
      mediaQuery.addListener(handleChange);
    }
    
    // Nettoyage
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Utiliser useCallback pour memoizer la fonction et éviter les dépendances cycliques
  const updateColorInfo = useCallback((color) => {
    // Chercher si la couleur existe dans notre palette pantone
    const foundColor = pantoneColors.find(c => c.hex.toLowerCase() === color.toLowerCase());
    
    if (foundColor) {
      setColorInfo(foundColor);
    } else {
      // Si la couleur n'existe pas dans notre palette, créer une info basique
      setColorInfo({
        hex: color,
        name: "Couleur personnalisée",
        year: new Date().getFullYear(),
        description: "Couleur choisie par l'utilisateur"
      });
    }
  }, [pantoneColors]);
  
  // Chargement des couleurs depuis le JSON et récupération de la couleur utilisateur
  useEffect(() => {
    const loadColors = async () => {
      try {
        // Dans un environnement réel, vous utiliseriez un import ou fetch
        // Pour cet exemple, nous simulons le chargement depuis "pantone-colors.json"
        const response = await fetch("data/colors.json");
        const data = await response.json();
        
        if (data && data.colors && Array.isArray(data.colors)) {
          setPantoneColors(data.colors);
          
          // Vérifier si l'utilisateur a une couleur enregistrée
          try {
            const savedColor = localStorage.getItem(USER_COLOR_KEY);
            
            if (savedColor) {
              // Utiliser la couleur sauvegardée
              setSecondaryColor(savedColor);
              // Mettre à jour les infos de couleur (après avoir chargé les couleurs pantone)
              const foundColor = data.colors.find(c => c.hex.toLowerCase() === savedColor.toLowerCase());
              setColorInfo(foundColor || {
                hex: savedColor,
                name: "Couleur personnalisée",
                year: new Date().getFullYear(),
                description: "Couleur choisie par l'utilisateur"
              });
            } else {
              // Sélectionner une couleur aléatoire au démarrage
              const randomIndex = Math.floor(Math.random() * data.colors.length);
              const randomColor = data.colors[randomIndex];
              setSecondaryColor(randomColor.hex);
              setColorInfo(randomColor);
            }
          } catch (error) {
            console.error("Erreur lors de la récupération de la couleur sauvegardée:", error);
            // En cas d'erreur, utiliser une couleur aléatoire
            const randomIndex = Math.floor(Math.random() * data.colors.length);
            const randomColor = data.colors[randomIndex];
            setSecondaryColor(randomColor.hex);
            setColorInfo(randomColor);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des couleurs Pantone:", error);
        setIsLoading(false);
      }
    };
    
    loadColors();
  }, []);
  
  // Mettre à jour les informations de couleur lorsque la couleur secondaire change
  useEffect(() => {
    if (pantoneColors.length > 0) {
      updateColorInfo(secondaryColor);
    }
  }, [secondaryColor, pantoneColors, updateColorInfo]);
  
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
    saveUserColor(newColorInfo.hex); // Enregistrer la nouvelle couleur aléatoire
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
      saveUserColor(foundColor.hex); // Enregistrer la couleur définie par nom
      return true;
    }
    
    return false;
  };

  // Fonction modifiée pour changer le mode sombre/clair
  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    saveUserTheme(newIsDark); // Enregistrer le choix de l'utilisateur
  };
  
  const value = {
    secondaryColor,
    setSecondaryColor,
    colorInfo,           // Information sur la couleur actuelle (nom, année, description)
    pantoneColors,       // Liste complète des couleurs
    changeColor,         // Fonction pour changer aléatoirement la couleur
    setColorByName,      // Fonction pour définir une couleur par son nom
    saveUserColor,       // Fonction pour enregistrer la couleur choisie par l'utilisateur
    isDark,
    setIsDark: toggleDarkMode, // Remplacer setIsDark par toggleDarkMode pour enregistrer les préférences
    isLoading
  };
  
  return <ColorContext.Provider value={value}>{children}</ColorContext.Provider>;
};