import React from "react";
import { useColor } from "../contexts/ColorContext";

const ColorPicker = () => {
  const { secondaryColor, setSecondaryColor } = useColor();

  const handleColorChange = (e) => {
    setSecondaryColor(e.target.value);
  };

  return (
    <div className="p-2 bg-white rounded-lg shadow-lg dark:bg-gray-800">
      <label htmlFor="colorPicker" className="flex items-center gap-2">
        <span className="text-sm font-medium text-black dark:text-white">
          Couleur
        </span>
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
