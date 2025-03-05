import React from 'react';
import { useColor } from '../contexts/ColorContext';

const SkillBadge = ({
  name,
  logo,
  isExpanded = false,
  badgeBgColor,
  secondaryColor,
  textColor
}) => {
  // Si les couleurs ne sont pas fournies, on les récupère du contexte
  const colorContext = useColor();
  const finalSecondaryColor = secondaryColor || colorContext.secondaryColor;
  const finalBadgeBgColor = badgeBgColor || 
    (colorContext.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)');
  const finalTextColor = textColor || 
    (colorContext.isDark ? 'white' : 'black');

  return (
    <div
      className={`flex items-center rounded-full transition-all hover:shadow-sm ${isExpanded ? 'py-1 px-3' : 'p-2'}`}
      style={{ 
        backgroundColor: finalBadgeBgColor,
        border: `1px solid ${finalSecondaryColor}20`
      }}
      title={!isExpanded ? name : ""}
    >
      {logo && (
        <div className={`relative ${isExpanded ? 'mr-2' : ''}`}>
          <div 
            className="absolute inset-0 rounded-full blur-sm opacity-30" 
            style={{ backgroundColor: finalSecondaryColor }}
          ></div>
          <img 
            src={logo} 
            alt={`${name} logo`} 
            className="w-5 h-5 object-contain relative z-10" 
          />
        </div>
      )}
      {isExpanded && (
        <span 
          className="text-sm font-medium"
          style={{ color: finalTextColor }}
        >
          {name}
        </span>
      )}
    </div>
  );
};

export default SkillBadge;