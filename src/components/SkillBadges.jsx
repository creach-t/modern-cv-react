import React, { useEffect, useState } from 'react';
import { useColor } from '../contexts/ColorContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Code, Server, Terminal, Wrench, Beaker, Smartphone } from 'lucide-react';

const SkillBadges = ({ isExpanded = true }) => {
  const { secondaryColor, isDark } = useColor();
  const { language } = useLanguage();
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetch("/data/skills.json")
      .then((response) => response.json())
      .then((data) => {
        // Transformer les données pour les adapter à notre affichage
        const categorizedSkills = {
          front: [],
          back: [],
          devops: [],
          tools: [],
          testing: [],
          mobile: []
        };
        
        // Filtrer et catégoriser les compétences
        data.forEach(category => {
          category.skills.forEach(skill => {
            if (category.category.toLowerCase().includes('front') || 
                skill.name.toLowerCase().includes('javascript') || 
                skill.name.toLowerCase().includes('react') || 
                skill.name.toLowerCase().includes('html') || 
                skill.name.toLowerCase().includes('css')) {
              categorizedSkills.front.push({...skill, category: 'Front'});
            } else if (category.category.toLowerCase().includes('devops') || 
                skill.name.toLowerCase().includes('docker') || 
                skill.name.toLowerCase().includes('kubernetes') || 
                skill.name.toLowerCase().includes('ci/cd')) {
              categorizedSkills.devops.push({...skill, category: 'DevOps'});
            } else if (category.category.toLowerCase() === 'tools') {
              categorizedSkills.tools.push({...skill, category: 'Tools'});
            } else if (category.category.toLowerCase() === 'testing') {
              categorizedSkills.testing.push({...skill, category: 'Testing'});
            } else if (category.category.toLowerCase() === 'mobile') {
              categorizedSkills.mobile.push({...skill, category: 'Mobile'});
            } else {
              categorizedSkills.back.push({...skill, category: 'Back'});
            }
          });
        });
        
        // Trier par niveau dans chaque catégorie
        Object.keys(categorizedSkills).forEach(key => {
          categorizedSkills[key].sort((a, b) => b.level - a.level);
        });
        
        setSkills(categorizedSkills);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des compétences :", error);
        setIsLoading(false);
      });
  }, [language]);
  
  // Couleurs
  const textColor = isDark ? 'white' : 'black';
  const badgeBgColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';
  
  // Icônes par catégorie
  const categoryIcons = {
    front: <Code size={20} style={{ color: secondaryColor }} />,
    back: <Server size={20} style={{ color: secondaryColor }} />,
    devops: <Terminal size={20} style={{ color: secondaryColor }} />,
    tools: <Wrench size={20} style={{ color: secondaryColor }} />,
    testing: <Beaker size={20} style={{ color: secondaryColor }} />,
    mobile: <Smartphone size={20} style={{ color: secondaryColor }} />
  };
  
  // Titre des catégories selon la langue
  const categoryTitles = {
    front: {
      fr: "Frontend",
      en: "Frontend"
    },
    back: {
      fr: "Backend",
      en: "Backend"
    },
    devops: {
      fr: "DevOps",
      en: "DevOps"
    },
    tools: {
      fr: "Outils",
      en: "Tools"
    },
    testing: {
      fr: "Tests",
      en: "Testing"
    },
    mobile: {
      fr: "Mobile",
      en: "Mobile"
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <div 
          className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" 
          style={{ borderColor: `${secondaryColor} transparent transparent` }}
        />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {Object.keys(skills).map((category) => (
        skills[category].length > 0 ? (
          <div key={category} className="mb-4">
            <div className="flex items-center mb-3">
              {categoryIcons[category]}
              <h3 
                className="ml-2 text-lg font-medium"
                style={{ color: textColor }}
              >
                {categoryTitles[category][language] || categoryTitles[category]['en']}
              </h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {skills[category].map((skill) => (
                skill.level > 0 ? (
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
                ) : null
              ))}
            </div>
          </div>
        ) : null
      ))}
    </div>
  );
};

export default SkillBadges;