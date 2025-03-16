import React, { useEffect, useState } from "react";
import { useColor } from "../contexts/ColorContext";
import { Sun, Moon } from "lucide-react";

// Clé pour le stockage localStorage
const DARK_MODE_KEY = "user_dark_mode_preference";

const DarkModeToggler = () => {
  const { isDark, setIsDark } = useColor();
  // État local pour déclencher une animation ponctuelle sur le clic
  const [isSpinning, setIsSpinning] = useState(false);
  
  // Charger la préférence au démarrage
  useEffect(() => {
    try {
      const savedPreference = localStorage.getItem(DARK_MODE_KEY);
      if (savedPreference !== null) {
        setIsDark(savedPreference === "true");
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la préférence de thème:", error);
    }
  }, [setIsDark]);
  
  // Fonction de bascule + déclenchement d'animation
  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    
    // Lancer l’animation de rotation
    setIsSpinning(true);
    // Arrêter l’animation après un court délai
    setTimeout(() => setIsSpinning(false), 900);
    
    // Enregistrer la préférence
    try {
      localStorage.setItem(DARK_MODE_KEY, String(newMode));
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la préférence de thème:", error);
    }
  };
  
  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 bg-gray-200 rounded-lg shadow-lg hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <Sun
          className={`
            text-black dark:text-white
            transition-transform
            ${isSpinning ? "animate-spin" : ""}
          `}
        />
      ) : (
        <Moon
          className={`
            text-black dark:text-white
            transition-transform
            ${isSpinning ? "animate-spin" : ""}
          `}
        />
      )}
    </button>
  );
};

export default DarkModeToggler;
