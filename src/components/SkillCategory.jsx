import React from 'react';
import { useColor } from '../contexts/ColorContext';
import { useLanguage } from '../contexts/LanguageContext';

const SkillCategory = ({ category, icon, skills, isExpanded, categoryTitle }) => {
  const { secondaryColor, isDark } = useColor();
  const { language } = useLanguage();
  
  // Couleurs
  const textColor = isDark ? 'white' : 'black';
  const badgeBgColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';

  return (
    <div className="mb-4">
      <div className="flex items-center mb-3">
        {icon}
        <h3 
          className="ml-2 text-lg font-medium"
          style={{ color: textColor }}
        >
          {categoryTitle[language] || categoryTitle['en']}
        </h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className={`flex items-center rounded-full transition-all hover:shadow-sm ${isExpanded ? 'py-1 px-3' : 'p-2'}`}
            style={{ 
              backgroundColor: badgeBgColor,
              border: `1px solid ${secondaryColor}20`
            }}
            title={!isExpanded ? skill.name : ""}
          >
            {skill.logo && (
              <div className={`relative ${isExpanded ? 'mr-2' : ''}`}>
                <div 
                  className="absolute inset-0 rounded-full blur-sm opacity-30" 
                  style={{ backgroundColor: secondaryColor }}
                ></div>
                <img 
                  src={skill.logo} 
                  alt={`${skill.name} logo`} 
                  className="w-5 h-5 object-contain relative z-10" 
                />
              </div>
            )}
            {isExpanded && (
              <span 
                className="text-sm font-medium"
                style={{ color: textColor }}
              >
                {skill.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillCategory;