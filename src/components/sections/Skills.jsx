import React, { useEffect, useState } from 'react';
import { useColor } from '../../contexts/ColorContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Code, Server, Terminal, Wrench, Smartphone, Beaker } from 'lucide-react';
import SkillBadge from '../ui/SkillBadge';

const Skills = () => {
  const { secondaryColor, isDark } = useColor();
  const { language } = useLanguage();
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    fetch("/data/skills.json")
      .then((response) => response.json())
      .then((data) => {
        setSkills(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des compétences :", error);
        setIsLoading(false);
      });
  }, []);

  // Couleurs de base
  const textColor = isDark ? 'white' : 'black';
  const badgeBgColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';
  
  // Icônes par catégorie
  const categoryIcons = {
    frontend: <Code size={20} style={{ color: secondaryColor }} />,
    backend: <Server size={20} style={{ color: secondaryColor }} />,
    devops: <Terminal size={20} style={{ color: secondaryColor }} />,
    tools: <Wrench size={20} style={{ color: secondaryColor }} />,
    mobile: <Smartphone size={20} style={{ color: secondaryColor }} />,
    testing: <Beaker size={20} style={{ color: secondaryColor }} />
  };

  // Titre des catégories selon la langue
  const getCategoryTitle = (category) => {
    const categoryTitles = {
      frontend: {
        fr: "Frontend",
        en: "Frontend"
      },
      backend: {
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
      mobile: {
        fr: "Mobile",
        en: "Mobile"
      },
      testing: {
        fr: "Tests",
        en: "Testing"
      }
    };

    const normalizedKey = category.toLowerCase();
    return (categoryTitles[normalizedKey] && categoryTitles[normalizedKey][language]) || 
            category;
  };

  if (isLoading) {
    return (
      <section className="mb-12">
        <h2 
          className="text-2xl font-bold mb-6 pb-2 relative"
          style={{ color: textColor }}
        >
          {language === "fr" ? "Compétences" : "Skills"}
          <div 
            className="absolute bottom-0 left-0 h-1 rounded-full w-14" 
            style={{ backgroundColor: secondaryColor }}
          />
        </h2>
        <div className="flex justify-center my-8">
          <div 
            className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" 
            style={{ borderColor: `${secondaryColor} transparent transparent` }}
          />
        </div>
      </section>
    );
  }

  // Ordre de priorité pour l'affichage des catégories
  const categoryOrder = ['frontend', 'backend', 'devops', 'mobile', 'tools', 'testing'];
  
  // Trier les catégories selon l'ordre de priorité
  const sortedSkills = [...skills].sort((a, b) => {
    const indexA = categoryOrder.indexOf(a.category.toLowerCase());
    const indexB = categoryOrder.indexOf(b.category.toLowerCase());
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });

  return (
    <section className="mb-12">
      <h2 
        className="text-2xl font-bold mb-6 pb-2 relative"
        style={{ color: textColor }}
      >
        {language === "fr" ? "Compétences" : "Skills"}
        <div 
          className="absolute bottom-0 left-0 h-1 rounded-full w-14" 
          style={{ backgroundColor: secondaryColor }}
        />
      </h2>
      
      <div className="space-y-6">
        {sortedSkills.map((category) => {
          // Filtrer les compétences de niveau > 0
          const filteredSkills = category.skills.filter(skill => skill.level > 0);
          
          // Trier les compétences par niveau (décroissant)
          const sortedSkills = [...filteredSkills].sort((a, b) => b.level - a.level);
          
          // Ne pas afficher la catégorie si elle ne contient aucune compétence de niveau > 0
          if (sortedSkills.length === 0) return null;
          
          // Obtenir l'icône pour cette catégorie
          const normalizedCategory = category.category.toLowerCase();
          const icon = categoryIcons[normalizedCategory] || 
                     <Code size={20} style={{ color: secondaryColor }} />;
          
          return (
            <div key={category.category} className="mb-4">
              <div className="flex items-center mb-3">
                {icon}
                <h3 
                  className="ml-2 text-lg font-medium"
                  style={{ color: textColor }}
                >
                  {getCategoryTitle(category.category)}
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {sortedSkills.map((skill) => (
                  <SkillBadge
                    key={skill.name}
                    name={skill.name}
                    logo={skill.logo}
                    isExpanded={true}
                    badgeBgColor={badgeBgColor}
                    secondaryColor={secondaryColor}
                    textColor={textColor}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Skills;