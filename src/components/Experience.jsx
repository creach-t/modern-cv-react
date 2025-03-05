import React, { useEffect, useState } from "react";
import { useColor } from "../contexts/ColorContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Calendar, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import SkillBadge from "./SkillBadge";

const Experience = () => {
  const { secondaryColor, isDark } = useColor();
  const { language } = useLanguage();
  const [experiences, setExperiences] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [expandedExperience, setExpandedExperience] = useState(null);
  const [loading, setLoading] = useState(true);

  // Récupérer les compétences depuis skills.json
  useEffect(() => {
    fetch("/data/skills.json")
      .then((response) => response.json())
      .then((data) => setSkillsData(data))
      .catch((error) =>
        console.error("Erreur lors du chargement des compétences :", error)
      );
  }, []);

  // Récupérer les expériences
  useEffect(() => {
    fetch("/data/experiences.json")
      .then((response) => response.json())
      .then((data) => {
        setExperiences(data[language]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des expériences :", error);
        setLoading(false);
      });
  }, [language]);

  // Fonction pour trouver les détails d'une compétence par son nom
  const findSkillDetails = (skillName) => {
    for (const category of skillsData) {
      const skill = category.skills.find(
        (s) => s.name.toLowerCase() === skillName.toLowerCase()
      );
      if (skill) return skill;
    }
    // Si la compétence n'est pas trouvée, retourner un objet par défaut
    return {
      name: skillName,
      level: 0,
      logo: null
    };
  };

  const toggleExpand = (index) => {
    setExpandedExperience(expandedExperience === index ? null : index);
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <section className="mb-8">
      <h2
        className="text-2xl font-bold mb-6 pb-2 transition-colors duration-200"
        style={{
          borderBottom: `2px solid ${secondaryColor}`,
          color: isDark ? "white" : "black",
        }}
      >
        {language === "fr" ? "Expérience Professionnelle" : "Professional Experience"}
      </h2>
      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="p-4 rounded-lg transition-colors duration-200"
            style={{
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.02)",
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3
                  className="text-lg font-semibold transition-colors duration-200"
                  style={{ color: isDark ? "white" : "black" }}
                >
                  {exp.title}
                </h3>
                <p className="font-medium" style={{ color: secondaryColor }}>
                  {exp.company}
                </p>
              </div>
              <button 
                onClick={() => toggleExpand(index)}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label={expandedExperience === index ? "Réduire" : "Développer"}
              >
                {expandedExperience === index ? 
                  <ChevronUp className="w-5 h-5" style={{ color: secondaryColor }} /> : 
                  <ChevronDown className="w-5 h-5" style={{ color: secondaryColor }} />
                }
              </button>
            </div>
            <div className="flex gap-4 mb-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{exp.period}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{exp.location}</span>
              </div>
            </div>
            
            {/* Section des badges de compétences */}
            {exp.skills && exp.skills.length > 0 && skillsData.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {exp.skills.map((skillName, skillIndex) => {
                  const skillDetails = findSkillDetails(skillName);
                  return (
                    <SkillBadge
                      key={skillIndex}
                      name={skillDetails.name}
                      logo={skillDetails.logo}
                      isExpanded={expandedExperience === index}
                    />
                  );
                })}
              </div>
            )}
            
            <ul
              className={`list-disc list-inside space-y-1 transition-colors duration-200 ${
                expandedExperience === index ? "block" : "line-clamp-2 overflow-hidden"
              }`}
              style={{
                color: isDark ? "rgb(209 213 219)" : "rgb(55 65 81)",
              }}
            >
              {exp.description.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            
            {/* Bouton "Voir plus" si la description est trop longue et non développée */}
            {expandedExperience !== index && exp.description.length > 2 && (
              <button
                onClick={() => toggleExpand(index)}
                className="mt-2 text-sm font-medium"
                style={{ color: secondaryColor }}
              >
                {language === "fr" ? "Voir plus" : "See more"}
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;