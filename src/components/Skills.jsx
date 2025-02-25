import React, { useEffect, useState } from 'react';
import { useColor } from '../contexts/ColorContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getTextColor } from '../utils/color';

const Skills = () => {
  const { secondaryColor, isDark } = useColor();
  const { language } = useLanguage();
  const [skills, setSkills] = useState([]);
  
  useEffect(() => {
    fetch("/data/skills.json")
      .then((response) => response.json())
      .then((data) => setSkills(data))
      .catch((error) => console.error("Erreur lors du chargement des compétences :", error));
  }, []);

  // Fonction pour ajuster l'opacité de la couleur secondaire en fonction du niveau
  const getColorWithOpacity = (color, level) => {
    // Convertir la couleur hex en RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculer l'opacité en fonction du niveau (min 0.3 pour que même les compétences de faible niveau soient visibles)
    const opacity = 0.3 + (level / 100) * 0.7;
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <section className="mb-8">
      <h2 
        className="text-2xl font-bold mb-4 pb-2 transition-colors duration-200"
        style={{ 
          borderBottom: `2px solid ${secondaryColor}`,
          color: isDark ? 'white' : 'black'
        }}
      >
        {language === "fr" ? "Compétences" : "Skills"}
      </h2>
      
      <div className="space-y-6">
        {skills.map(({ category, skills }) => (
          <div key={category}>
            <h3 
              className="text-lg font-semibold mb-3 transition-colors duration-200"
              style={{ color: isDark ? 'white' : 'black' }}
            >
              {category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => {
                const bgColor = getColorWithOpacity(secondaryColor, skill.level);
                const textColor = getTextColor(secondaryColor);
                
                return (
                  <span
                    key={skill.name}
                    className="flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-all duration-200 hover:scale-105"
                    style={{ 
                      backgroundColor: bgColor,
                      color: textColor
                    }}
                    title={`${language === "fr" ? "Niveau" : "Level"}: ${skill.level}%`}
                  >
                    {skill.logo && (
                      <img 
                        src={skill.logo} 
                        alt={`${skill.name} logo`} 
                        className="w-5 h-5 object-contain" 
                      />
                    )}
                    {skill.name}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;