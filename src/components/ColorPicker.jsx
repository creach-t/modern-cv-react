import React from 'react';
import { useColor } from '../contexts/ColorContext';
import { Sun, Moon } from 'lucide-react';

const ColorPicker = () => {
  const { secondaryColor, setSecondaryColor, isDark, setIsDark } = useColor();

  const handleColorChange = (e) => {
    setSecondaryColor(e.target.value);
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  // Calculer la luminosité pour le texte
  const getTextColor = (bgColor) => {
    // Convertir la couleur hex en RGB
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculer la luminosité
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  return (
    <div className="fixed z-50 flex gap-4 bottom-4 right-4">
      {/* Toggle Dark Mode */}
      <button
        onClick={toggleDarkMode}
        className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
        aria-label="Toggle dark mode"
      >
        {isDark ? (
          <Sun className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        ) : (
          <Moon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        )}
      </button>

      {/* Color Picker */}
      <div className="p-2 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <label 
          htmlFor="colorPicker" 
          className="flex items-center gap-2"
          style={{ color: getTextColor(secondaryColor) }}
        >
          <span className="text-sm font-medium dark:text-white">Couleur</span>
          <div className="relative">
            <input
              type="color"
              id="colorPicker"
              value={secondaryColor}
              onChange={handleColorChange}
              className="w-8 h-8 p-1 bg-transparent border rounded cursor-pointer dark:border-gray-600"
            />
          </div>
        </label>
      </div>
    </div>
  );
};

export default ColorPicker;