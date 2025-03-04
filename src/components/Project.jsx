import React, { useEffect, useState } from "react";
import { useColor } from "../contexts/ColorContext";
import { useLanguage } from "../contexts/LanguageContext";
import { getTextColor } from "../utils/color";
import { FileCode, Coffee, Skull, Code, Github, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import SkillBadge from "./SkillBadge";

// Mapping des icônes avec les composants Lucide
const iconMap = {
  FileCode: FileCode,
  Code: Code,
  Coffee: Coffee,
  Skull: Skull
};

const Project = () => {
  const { secondaryColor, isDark } = useColor();
  const { language } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [expandedProject, setExpandedProject] = useState(null);
  const [skills, setSkills] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Chargement des projets
    fetch("/data/projects.json")
      .then((response) => response.json())
      .then((data) => setProjects(data[language]))
      .catch((error) =>
        console.error("Erreur lors du chargement des projets :", error)
      );
    
    // Chargement des compétences pour les badges
    fetch("/data/skills.json")
      .then((response) => response.json())
      .then((data) => {
        // Créer un map de toutes les compétences pour un accès facile
        const skillsMap = {};
        data.forEach(category => {
          category.skills.forEach(skill => {
            if (skill.level > 0) {
              skillsMap[skill.name.toLowerCase()] = skill;
            }
          });
        });
        setSkills(skillsMap);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des compétences :", error);
        setIsLoading(false);
      });
  }, [language]);

  // Fonction pour basculer l'état d'expansion d'un projet
  const toggleProjectExpansion = (index) => {
    setExpandedProject(expandedProject === index ? null : index);
  };

  // Couleurs pour les éléments de l'interface
  const textColor = getTextColor(secondaryColor);
  const badgeBgColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';

  return (
    <section className="mb-8">
      <h2
        className="text-2xl font-bold mb-6 pb-2 transition-colors duration-200"
        style={{
          borderBottom: `2px solid ${secondaryColor}`,
          color: isDark ? "white" : "black",
        }}
      >
        {language === "fr" ? "Projets" : "Projects"}
      </h2>
      <div className="space-y-4">
        {projects.map((project, index) => {
          const IconComponent = iconMap[project.icon] || FileCode;
          const isExpanded = expandedProject === index;
          
          return (
            <div
              key={index}
              className="rounded-lg overflow-hidden shadow-md transition-all duration-300"
              style={{
                backgroundColor: isDark
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(255, 255, 255, 0.95)",
                borderLeft: `4px solid ${secondaryColor}`,
                transform: isExpanded ? "scale(1.02)" : "scale(1)",
              }}
            >
              {/* En-tête du projet (toujours visible) avec vignette */}
              <div className="flex flex-col">
                {/* Première ligne : titre et fleche */}
                <div 
                  className="flex justify-between items-center p-4 cursor-pointer"
                  onClick={() => toggleProjectExpansion(index)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="rounded-full p-2 transition-colors duration-200"
                      style={{ backgroundColor: secondaryColor }}
                    >
                      <IconComponent color={textColor} size={20} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {project.label}
                      </div>
                      <div className="font-medium" style={{ color: isDark ? "white" : "black" }}>
                        {project.value}
                      </div>
                    </div>
                  </div>
                  
                  {/* Icône d'expansion */}
                  <div className="text-gray-500 dark:text-gray-400">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
                
                {/* Deuxième ligne : vignette (visible seulement quand le projet n'est pas développé) */}
                {!isExpanded && project.link && (
                  <div className="px-4 pb-4 w-full">
                    <div className="relative rounded-md overflow-hidden" style={{ height: "120px" }}>
                      <iframe
                        src={project.link}
                        title={project.value}
                        style={{ 
                          border: "none",
                          width: "300%", 
                          height: "300%",
                          transform: "scale(0.33)",
                          transformOrigin: "0 0",
                          position: "absolute",
                          top: "0",
                          left: "0"
                        }}
                        loading="lazy"
                        scrolling="no"
                        sandbox="allow-scripts allow-same-origin"
                      />
                      
                      {/* Overlay discret avec dégradé pour une transition douce */}
                      <div 
                        className="absolute bottom-0 left-0 right-0 h-16"
                        style={{ 
                          background: `linear-gradient(to bottom, rgba(0,0,0,0), ${isDark ? 'rgba(30,30,30,1)' : 'rgba(255,255,255,1)'})` 
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Contenu détaillé (visible uniquement si développé) */}
              {isExpanded && (
                <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
                  <p className="mb-3 text-gray-600 dark:text-gray-300">
                    {project.description}
                  </p>
                  
                  {/* Technologies utilisées avec badges */}
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">
                      {language === "fr" ? "Technologies utilisées" : "Technologies used"}:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {!isLoading && project.technologies && project.technologies.map((tech, techIndex) => {
                        const skill = skills[tech.toLowerCase()];
                        return skill ? (
                          <SkillBadge
                            key={techIndex}
                            name={tech}
                            logo={skill.logo}
                            isExpanded={false}
                            badgeBgColor={badgeBgColor}
                            secondaryColor={secondaryColor}
                            textColor={isDark ? "white" : "black"}
                          />
                        ) : (
                          <span 
                            key={techIndex}
                            className="px-2 py-1 text-xs rounded-full"
                            style={{ 
                              backgroundColor: secondaryColor,
                              color: textColor,
                              opacity: 0.8
                            }}
                          >
                            {tech}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Liens vers le projet et GitHub */}
                  <div className="flex gap-3">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1 rounded-md transition-colors duration-200"
                      style={{ 
                        backgroundColor: secondaryColor,
                        color: textColor
                      }}
                    >
                      <ExternalLink size={16} />
                      <span>{language === "fr" ? "Visiter" : "Visit"}</span>
                    </a>
                    
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 transition-colors duration-200"
                      >
                        <Github size={16} />
                        <span>GitHub</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Project;