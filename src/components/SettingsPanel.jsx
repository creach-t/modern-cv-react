import React from "react";
import ColorPicker from "./ColorPicker";
import DarkModeToggler from "./DarkModeToggler";
import LanguageToggler from "./LanguageToggler";

const SettingsPanel = () => {
  return (
    <div className="fixed z-50 flex gap-4 bottom-4 right-4">
      <DarkModeToggler />
      <ColorPicker />
      <LanguageToggler />
    </div>
  );
};

export default SettingsPanel;
