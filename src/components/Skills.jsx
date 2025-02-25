import React, { useEffect, useState } from 'react';
import { useColor } from '../contexts/ColorContext';
import { getTextColor } from '../utils/color';

const Skills = () => {
  const { secondaryColor, isDark } = useColor();
    const [skills, setSkills] = useState([]);
  
    useEffect(() => {
      fetch("/data/skills.json")
        .then((response) => response.json())
        .then((data) => setSkills(data))
        .catch((error) => console.error("Erreur lors du chargement des expériences :", error));
    }, []);

  return (
    <section className="mb-8">
      <h2 
        className="text-2xl font-bold mb-4 pb-2 transition-colors duration-200"
        style={{ 
          borderBottom: `2px solid ${secondaryColor}`,
          color: isDark ? 'white' : 'black'
        }}
      >
        Compétences
      </h2>
      
      <div className="space-y-6">
        {skills.map(({ category, skills }) => ( // Utilisation plus lisible
          <div key={category}>
            <h3 
              className="text-lg font-semibold mb-2 transition-colors duration-200"
              style={{ color: isDark ? 'white' : 'black' }}
            >
              {category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-full text-sm transition-colors duration-200"
                  style={{ 
                    backgroundColor: secondaryColor,
                    color: getTextColor(secondaryColor)
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
