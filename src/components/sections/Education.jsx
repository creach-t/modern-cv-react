import React, { useEffect, useState } from "react";
import { useColor } from "../../contexts/ColorContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { GraduationCap, Calendar, MapPin, Book, Briefcase, Code, Wrench } from "lucide-react";
import SkillBadge from "../ui/SkillBadge";

const Education = () => {
  const { secondaryColor, isDark } = useColor();
  const { language } = useLanguage();
  const [educationData, setEducationData] = useState([]);
  const [skills, setSkills] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  const textColor = isDark ? "white" : "black";
  const detailsColor = isDark ? "rgb(209 213 219)" : "rgb(55 65 81)";
  const badgeBgColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Chargement parallèle des données d'éducation et des compétences
        const [educationResponse, skillsResponse] = await Promise.all([
          fetch("/data/education.json"),
          fetch("/data/skills.json")
        ]);
        
        const educationData = await educationResponse.json();
        const skillsData = await skillsResponse.json();
        
        // Transformation des données d'éducation pour compatibilité avec l'interface
        const formattedEducation = educationData.education.map(edu => {
          return {
            id: edu.id,
            icon: edu.icon || "GraduationCap", // Icône par défaut
            school: edu.school,
            period: edu.period.replace('-', ' - '), // Assurer un formatage cohérent
            technologies: edu.technologies || [],
            tools: edu.tools || [],
            label: edu[language].label,
            value: edu[language].value,
            description: edu[language].description,
            specialization: edu[language].specialization,
            project: edu[language].project,
            internship: edu[language].internship,
            explanation: edu[language].explanation
          };
        });
        
        setEducationData(formattedEducation);
        
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
        console.error(`Erreur lors du chargement des formations: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [language]);

  const title = language === "fr" ? "Formation" : "Education";

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
        {educationData.map((edu) => (
          <div
            key={edu.id}
            className="p-4 rounded-lg transition-colors duration-200"
            style={{ 
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.95)",
              borderLeft: `4px solid ${secondaryColor}`
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3
                  className="text-lg font-semibold transition-colors duration-200"
                  style={{ color: textColor }}
                >
                  {edu.label}
                </h3>
                <p className="font-medium" style={{ color: secondaryColor }}>
                  {edu.value}
                </p>
              </div>
              <GraduationCap
                className="w-6 h-6 transition-colors duration-200"
                style={{ color: secondaryColor }}
              />
            </div>

            <div className="flex flex-wrap gap-3 mb-3">
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{edu.period}</span>
              </div>
              
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{edu.school.location}</span>
              </div>
            </div>

            <div className="mb-4">
              <ul className="list-none space-y-1" style={{ color: detailsColor }}>
                {edu.specialization && (
                  <li className="flex items-start gap-2">
                    <Book className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{edu.specialization}</span>
                  </li>
                )}
                {edu.project && (
                  <li className="flex items-start gap-2">
                    <Briefcase className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{edu.project}</span>
                  </li>
                )}
                {edu.internship && (
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: secondaryColor }} />
                    <span>{edu.internship}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Section des technologies et outils */}
            {(edu.technologies.length > 0 || edu.tools.length > 0) && (
              <div className="space-y-3 mt-3">
                {edu.technologies.length > 0 && (
                  <div className="mb-5">
                    <h4 className="text-md font-semibold mb-2 flex items-center gap-2"
                        style={{ color: isDark ? "white" : "black" }}>
                      <Code className="w-4 h-4" />
                      <span>{language === "fr" ? "Technologies" : "Technologies"}</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {edu.technologies.map((tech, techIndex) => {
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
                
                {edu.tools.length > 0 && (
                  <div className="mb-5">
                    <h4 className="text-md font-semibold mb-2 flex items-center gap-2"
                        style={{ color: isDark ? "white" : "black" }}>
                      <Wrench className="w-4 h-4" />
                      <span>{language === "fr" ? "Outils" : "Tools"}</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {edu.tools.map((tool, toolIndex) => {
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
          </div>
        ))}
      </div>
    </section>
  );
};

export default Education;