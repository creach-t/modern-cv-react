import React from "react";
import { useColor } from "../contexts/ColorContext";
import { Sun, Moon } from "lucide-react";

const DarkModeToggler = () => {
  const { isDark, setIsDark } = useColor();

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  return (
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
  );
};

export default DarkModeToggler;
