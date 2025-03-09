import React from "react";
import { 
  Github, ExternalLink, 
  ChevronDown, ChevronUp, 
  Rocket, Wrench
} from "lucide-react";
import SkillBadge from "./SkillBadge";

const ProjectCard = ({ 
  project, 
  index, 
  isExpanded, 
  toggleExpansion, 
  secondaryColor,
  textColor,
  isDark,
  skills,
  language,
  badgeBgColor,
  iconMap
}) => {
  const IconComponent = iconMap[project.icon] || iconMap.FileCode;
  // Utilisation directe de l'URL de l'image du projet sans générer de chemin personnalisé

  return (
    <div
      className="rounded-lg overflow-hidden shadow-md transition-all duration-300"
      style={{
        backgroundColor: isDark
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(255, 255, 255, 0.95)",
        borderLeft: `4px solid ${secondaryColor}`,
        transform: isExpanded ? "scale(1.02)" : "scale(1)",
      }}
    >
      <div className="flex flex-col">
        {/* En-tête du projet (toujours visible) */}
        <div 
          className="flex justify-between items-center p-5 cursor-pointer"
          onClick={() => toggleExpansion(index)}
        >
          <div className="flex items-center gap-4">
            <div
              className="rounded-full p-3 transition-colors duration-200 flex-shrink-0"
              style={{ backgroundColor: secondaryColor }}
            >
              <IconComponent color={textColor} size={22} />
            </div>
            <div className="min-w-0">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {project.label}
              </div>
              <div 
                className="font-medium text-lg" 
                style={{ color: isDark ? "white" : "black" }}
              >
                {project.value}
              </div>
            </div>
          </div>
          
          {/* Icône d'expansion */}
          <div className="text-gray-500 dark:text-gray-400 flex-shrink-0">
            {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </div>
        </div>
        
        {/* Aperçu du projet (visible seulement quand le projet n'est pas développé) */}
        {!isExpanded && (
          <div className="px-5 pb-5 w-full">
            <div 
              className="relative rounded-md overflow-hidden w-full cursor-pointer"
              style={{ 
                maxWidth: "100%", 
                height: "0", 
                paddingBottom: "56.25%" // Ratio 16:9
              }}
              onClick={() => toggleExpansion(index)}
            >
              {/* Image de prévisualisation du projet */}
              <img 
                src={project.image}
                alt={project.label}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Overlay discret avec dégradé pour une transition douce */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                style={{ 
                  background: `linear-gradient(to bottom, rgba(0,0,0,0), ${isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.9)'})` 
                }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Contenu détaillé (visible uniquement si développé) */}
        {isExpanded && (
          <div className="p-5 pt-0 border-t border-gray-200 dark:border-gray-700">
            {/* Pas d'image en haut quand le projet est déployé */}
            
            {/* Description courte */}
            <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              {project.description}
            </p>
            
            {/* Description détaillée */}
            <div className="mt-5 mb-6">
              <h4 
                className="text-md font-semibold mb-2"
                style={{ color: isDark ? "white" : "black" }}
              >
                {language === "fr" ? "À propos du projet" : "About the project"}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {project.explanation}
              </p>
            </div>
            
            {/* Technologies utilisées */}
            <div className="mb-5">
              <h4 
                className="text-md font-semibold mb-2 flex items-center gap-2"
                style={{ color: isDark ? "white" : "black" }}
              >
                <Wrench size={16} />
                {language === "fr" ? "Technologies principales" : "Core Technologies"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies && project.technologies.map((tech, techIndex) => {
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
                      className="px-3 py-1 text-xs rounded-full"
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
            
            {/* Outils utilisés */}
            <div className="mb-5">
              <h4 
                className="text-md font-semibold mb-2 flex items-center gap-2"
                style={{ color: isDark ? "white" : "black" }}
              >
                <Wrench size={16} />
                {language === "fr" ? "Outils" : "Tools"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tools && project.tools.map((tool, toolIndex) => {
                  const skill = skills[tool.toLowerCase()];
                  return skill ? (
                    <SkillBadge
                      key={toolIndex}
                      name={tool}
                      logo={skill.logo}
                      isExpanded={false}
                      badgeBgColor={badgeBgColor}
                      secondaryColor={secondaryColor}
                      textColor={isDark ? "white" : "black"}
                    />
                  ) : (
                    <span 
                      key={toolIndex}
                      className="px-3 py-1 text-xs rounded-full"
                      style={{ 
                        backgroundColor: 'rgba(100, 100, 100, 0.2)',
                        color: isDark ? 'white' : 'black',
                      }}
                    >
                      {tool}
                    </span>
                  );
                })}
              </div>
            </div>
            
            {/* Améliorations futures */}
            <div className="mb-6">
              <h4 
                className="text-md font-semibold mb-2 flex items-center gap-2"
                style={{ color: isDark ? "white" : "black" }}
              >
                <Rocket size={16} />
                {language === "fr" ? "Améliorations futures" : "Future Improvements"}
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                {project.improvements && project.improvements.map((improvement, index) => (
                  <li 
                    key={index}
                    className="text-gray-600 dark:text-gray-300"
                  >
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Liens vers le projet et GitHub */}
            <div className="flex gap-4 flex-wrap">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200"
                  style={{ 
                    backgroundColor: secondaryColor,
                    color: textColor
                  }}
                >
                  <ExternalLink size={18} />
                  <span>{language === "fr" ? "Visiter" : "Visit"}</span>
                </a>
              )}
              
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 transition-colors duration-200"
                >
                  <Github size={18} />
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;