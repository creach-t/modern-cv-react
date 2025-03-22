import React, { useRef } from "react";
import { useColor } from "../../contexts/ColorContext";
import { Palette } from "lucide-react";

const ColorPicker = ({ onColorChange }) => {
  const { secondaryColor, setSecondaryColor, saveUserColor } = useColor();
  const colorInputRef = useRef(null);

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    
    // Si un gestionnaire externe est fourni, l'utiliser
    if (onColorChange) {
      onColorChange(newColor);
    } else {
      // Sinon, utiliser le comportement par défaut
      setSecondaryColor(newColor);
      saveUserColor(newColor);
    }
  };

  const handlePaletteClick = () => {
    // Programmatically trigger the color input click
    if (colorInputRef.current) {
      colorInputRef.current.click();
    }
  };

  return (
    <div className="relative">
      <input
        ref={colorInputRef}
        type="color"
        value={secondaryColor}
        onChange={handleColorChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <button 
        onClick={handlePaletteClick}
        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all transform hover:scale-105"
        aria-label="Pick Color"
      >
        <Palette 
          color={secondaryColor} 
          style={{ color: secondaryColor }} 
          className="w-6 h-6 text-gray-700 dark:text-gray-200" 
        />
      </button>
    </div>
  );
};

export default ColorPicker;