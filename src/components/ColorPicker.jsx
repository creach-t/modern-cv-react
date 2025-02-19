import React from 'react';
import { useColor } from '../contexts/ColorContext';

const ColorPicker = () => {
  const { secondaryColor, setSecondaryColor } = useColor();

  const handleColorChange = (e) => {
    setSecondaryColor(e.target.value);
  };

  return (
    <div className="fixed bottom-4 right-4 p-2 bg-white rounded-lg shadow-lg">
      <label htmlFor="colorPicker" className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Couleur secondaire</span>
        <input
          type="color"
          id="colorPicker"
          value={secondaryColor}
          onChange={handleColorChange}
          className="w-8 h-8 rounded cursor-pointer"
        />
      </label>
    </div>
  );
};

export default ColorPicker;
