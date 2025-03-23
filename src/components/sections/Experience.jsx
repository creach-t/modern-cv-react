import React, { useEffect, useState, useRef } from "react";
import { useColor } from "../../contexts/ColorContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { Briefcase, Calendar, MapPin, Code, Globe, Wrench } from "lucide-react";
import SkillBadge from "../ui/SkillBadge";

const Experience = () => {
  const { secondaryColor, isDark } = useColor();
  const { language } = useLanguage();
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [expandedExperiences, setExpandedExperiences] = useState({});
  const timeoutRefs = useRef({});
  
  const textColor = isDark ? "white" : "black";
  const detailsColor = isDark ? "rgb(209 213 219)" : "rgb(55 65 81)";
  const badgeBgColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';
  
  // Mapping des icônes avec les composants Lucide
  const iconMap = {
    Briefcase,
    Code,
    Globe
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Chargement parallèle des données d'expériences et des compétences
        const [experiencesResponse, skillsResponse] = await Promise.all([
          fetch("/data/experiences.json"),
          fetch("/data/skills.json")
        ]);
        
        const experiencesData = await experiencesResponse.json();
        const skillsData = await skillsResponse.json();
        
        // Transformation des données d'expérience pour compatibilité avec l'interface
        const formattedExperiences = experiencesData.experiences.map(exp => {
          return {
            id: exp.id,
            icon: exp.icon || "Briefcase", // Icône par défaut
            company: exp.company,
            period: exp.period,
            technologies: exp.technologies || [],
            tools: exp.tools || [],
            label: exp[language].label,
            value: exp[language].value,
            description: exp[language].description,
            details: exp[language].details || [],
            explanation: exp[language].explanation
          };
        });
        
        setExperiences(formattedExperiences);
        
        // Initialisation des états d'expansion
        // Les expériences de développement sont toujours ouvertes
        // Les autres expériences sont fermées par défaut
        const initialExpandState = {};
        formattedExperiences.forEach(exp => {
          // Expériences de développement toujours ouvertes
          if (exp.id === "imperiatec" || exp.id === "csf") {
            initialExpandState[exp.id] = true;
          } else {
            // Autres expériences fermées par défaut
            initialExpandState[exp.id] = false;
          }
        });
        
        setExpandedExperiences(initialExpandState);
        
        // Traitement des compétences
        const skillsMap = {};
        skillsData.forEach(category => {
          category.skills.forEach(skill => {
            if (skill.level > 0) {
              skillsMap[skill.name.toLowerCase()] = skill;
            }
          });
        });
        
        setSkills(skillsMap);
      } catch (error) {
        console.error(`Erreur lors du chargement des expériences: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Nettoyage des timers lors du démontage du composant
    return () => {
      const currentTimeouts = timeoutRefs.current;
      Object.values(currentTimeouts).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, [language]);
  
  const expandCard = (id, expType) => {
    // Ne faire rien pour les expériences de développement
    if (expType === 'dev') return;
    
    // Efface tout timer existant pour cette carte
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id]);
    }
    
    // Ouvre la carte
    setExpandedExperiences(prev => ({
      ...prev,
      [id]: true
    }));
  };
  
  const startCollapseTimer = (id, expType) => {
    // Ne démarrer le timer que pour les expériences non-dev
    if (expType === 'dev') return;
    
    // Définit un nouveau timer pour fermer la carte après 5 secondes
    timeoutRefs.current[id] = setTimeout(() => {
      setExpandedExperiences(prev => ({
        ...prev,
        [id]: false
      }));
    }, 100);
  };
  
  const clearCollapseTimer = (id, expType) => {
    // Ne rien faire pour les expériences de développement
    if (expType === 'dev') return;
    
    // Annule le timer si la souris revient sur la carte
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id]);
      timeoutRefs.current[id] = null;
    }
  };
  
  const title = language === "fr" ? "Expérience professionnelle" : "Professional Experience";
  
  if (isLoading) {
    return (
      <section className="mb-12">
        <h2 
          className="text-2xl font-bold mb-6 pb-2 relative"
          style={{ color: textColor }}
        >
          {title}
          <div 
            className="absolute bottom-0 left-0 h-1 rounded-full w-14" 
            style={{ backgroundColor: secondaryColor }}
          />
        </h2>
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary" 
            style={{ borderColor: secondaryColor }}></div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="mb-12">
      <h2 
        className="text-2xl font-bold mb-6 pb-2 relative"
        style={{ color: textColor }}
      >
        {title}
        <div 
          className="absolute bottom-0 left-0 h-1 rounded-full w-14" 
          style={{ backgroundColor: secondaryColor }}
        />
      </h2>
      <div className="space-y-6">
        {experiences.map((exp) => {
          const Icon = iconMap[exp.icon] || Briefcase;
          const isExpanded = expandedExperiences[exp.id];
          
          // Détermine si c'est une expérience de dev ou non
          const isDevExperience = exp.id === "imperiatec" || exp.id === "csf";
          
          return (
            <div
              key={exp.id}
              className={`p-4 rounded-lg transition-colors duration-200 ${!isDevExperience ? 'cursor-pointer' : ''}`}
              style={{ 
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.95)",
                borderLeft: `4px solid ${isDevExperience ? secondaryColor : (isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)")}`
              }}
              onClick={() => expandCard(exp.id, isDevExperience ? 'dev' : 'other')}
              onMouseEnter={() => clearCollapseTimer(exp.id, isDevExperience ? 'dev' : 'other')}
              onMouseLeave={() => startCollapseTimer(exp.id, isDevExperience ? 'dev' : 'other')}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3
                      className="text-lg font-semibold transition-colors duration-200"
                      style={{ color: textColor }}
                    >
                      {exp.label}
                    </h3>
                  </div>
                  <p className="font-medium" style={{ color: isDevExperience ? secondaryColor : (isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)") }}>
                    {exp.value}
                  </p>
                </div>
                <Icon
                  className="w-6 h-6 transition-colors duration-200 ml-2"
                  style={{ color: isDevExperience ? secondaryColor : (isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)") }}
                />
              </div>
              
              <div className="flex flex-wrap gap-3 mb-3">
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{exp.period}</span>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{exp.company.location}</span>
                </div>
              </div>
              
              {/* Contenu qui sera affiché/masqué selon l'état d'expansion */}
              {isExpanded && (
                <>
                  {/* Description de l'expérience */}
                  <div className="mb-4">
                    <p className="mb-2" style={{ color: detailsColor }}>
                      {exp.explanation}
                    </p>
                    <ul
                      className="list-disc list-inside space-y-1"
                      style={{ color: detailsColor }}
                    >
                      {exp.details.map((detail, i) => (
                        <li key={i}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Section des technologies et outils */}
                  {(exp.technologies.length > 0 || exp.tools.length > 0) && (
                    <div className="space-y-3 mt-3">
                      {exp.technologies.length > 0 && (
                        <div className="mb-5">
                          <h4 className="text-md font-semibold mb-2 flex items-center gap-2"
                              style={{ color: isDark ? "white" : "black" }}>
                            <Code className="w-4 h-4" />
                            <span>{language === "fr" ? "Technologies" : "Technologies"}</span>
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.map((tech, techIndex) => {
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
                      )}
                      
                      {exp.tools.length > 0 && (
                        <div className="mb-5">
                          <h4 className="text-md font-semibold mb-2 flex items-center gap-2"
                              style={{ color: isDark ? "white" : "black" }}>
                            <Wrench className="w-4 h-4" />
                            <span>{language === "fr" ? "Outils" : "Tools"}</span>
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {exp.tools.map((tool, toolIndex) => {
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
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Experience;