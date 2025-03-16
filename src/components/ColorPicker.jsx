import React from "react";
import { useColor } from "../contexts/ColorContext";
import { Paintbrush } from "lucide-react";

const ColorPicker = () => {
  const { secondaryColor, setSecondaryColor } = useColor();

  const handleColorChange = (e) => {
    setSecondaryColor(e.target.value);
  };

  return (
    <div className="select-none p-2 bg-gray-200 hover:bg-gray-300 rounded-lg shadow-lg dark:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer">
      <label htmlFor="colorPicker" className="flex items-center gap-2 cursor-pointer">
        <Paintbrush 
          size={22} 
          className="text-grey-700 dark:text-gray-200" 
          aria-label="Couleur" 
        />
        <input
          type="color"
          id="colorPicker"
          value={secondaryColor}
          onChange={handleColorChange}
          className="w-8 h-8 p-1 bg-transparent border rounded cursor-pointer dark:border-gray-600"
        />
      </label>
    </div>
  );
};

export default ColorPicker;
