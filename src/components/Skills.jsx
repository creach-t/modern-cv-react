import React from 'react';
import { useColor } from '../contexts/ColorContext';

const Skills = () => {
  const { secondaryColor, isDark } = useColor();

  const skills = [
    { category: 'Frontend', items: ['React', 'Vue.js', 'HTML/CSS', 'JavaScript'] },
    { category: 'Backend', items: ['Node.js', 'Python', 'Java', 'SQL'] },
    { category: 'DevOps', items: ['Docker', 'AWS', 'CI/CD', 'Git'] },
  ];

  const getTextColor = (bgColor) => {
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
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
        Compétences
      </h2>
      
      <div className="space-y-6">
        {skills.map((skillGroup) => (
          <div key={skillGroup.category}>
            <h3 
              className="text-lg font-semibold mb-2 transition-colors duration-200"
              style={{ color: isDark ? 'white' : 'black' }}
            >
              {skillGroup.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {skillGroup.items.map((skill) => (
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