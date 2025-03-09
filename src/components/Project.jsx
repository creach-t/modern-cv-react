import React, { useEffect, useState, useRef, useCallback } from "react";
import { useColor } from "../contexts/ColorContext";
import { useLanguage } from "../contexts/LanguageContext";
import { getTextColor } from "../utils/color";
import { Code, Coffee, Skull, FileCode } from "lucide-react";
import ProjectSlider from "./ProjectSlider";
import { loadPreviewCache, updatePreviewCache as updateCache } from "../utils/previewCacheUtils";

// Nombre de projets visibles par slide
const PROJECTS_PER_SLIDE = 3;

const Project = () => {
  const { secondaryColor, isDark } = useColor();
  const { language } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [expandedProject, setExpandedProject] = useState(null);
  const [skills, setSkills] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [previewCache, setPreviewCache] = useState({});
  const sliderRef = useRef(null);

  // Mapping des icônes avec les composants Lucide
  const iconMap = {
    FileCode,
    Code,
    Coffee,
    Skull
  };

  // Chargement du cache des prévisualisations
  useEffect(() => {
    setPreviewCache(loadPreviewCache());
  }, []);

  // Mise à jour du cache des prévisualisations
  const updatePreviewCache = useCallback((url, loaded = true) => {
    setPreviewCache(currentCache => updateCache(currentCache, url, loaded));
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Chargement parallèle des données
        const [projectsResponse, skillsResponse] = await Promise.all([
          fetch("/data/projects.json"),
          fetch("/data/skills.json")
        ]);
        
        const projectsData = await projectsResponse.json();
        const skillsData = await skillsResponse.json();
        
        // Transformation des données de projet pour compatibilité avec l'interface
        const formattedProjects = projectsData.projects.map(project => {
          return {
            icon: project.icon,
            label: project[language].label,
            value: project[language].value,
            description: project[language].description,
            explanation: project[language].explanation,
            improvements: project[language].improvements,
            technologies: project.technologies,
            tools: project.tools,
            image: project.image,
            link: project.link,
            github: project.github
          };
        });
        
        setProjects(formattedProjects);
        
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
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [language]);

  // Fonction pour basculer l'état d'expansion d'un projet
  const toggleProjectExpansion = (index) => {
    setExpandedProject(expandedProject === index ? null : index);
  };

  // Couleurs pour les éléments de l'interface
  const textColor = isDark ? "white" : "black";
  const badgeBgColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';

  if (isLoading) {
    return (
      <section className="mb-8">
      <h2 
        className="text-2xl font-bold mb-6 pb-2 relative"
        style={{ color: textColor }}
      >
        {language === "fr" ? "Projets" : "Projects"}
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
    <section className="mb-8 relative">
      <h2 
        className="text-2xl font-bold mb-6 pb-2 relative"
        style={{ color: textColor }}
      >
        {language === "fr" ? "Projets" : "Projects"}
        <div 
          className="absolute bottom-0 left-0 h-1 rounded-full w-14" 
          style={{ backgroundColor: secondaryColor }}
        />
      </h2>
      
      <div ref={sliderRef}>
        <ProjectSlider
          projects={projects}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          expandedProject={expandedProject}
          toggleProjectExpansion={toggleProjectExpansion}
          previewCache={previewCache}
          updatePreviewCache={updatePreviewCache}
          PROJECTS_PER_SLIDE={PROJECTS_PER_SLIDE}
          secondaryColor={secondaryColor}
          textColor={textColor}
          isDark={isDark}
          skills={skills}
          language={language}
          badgeBgColor={badgeBgColor}
          iconMap={iconMap}
        />
      </div>
    </section>
  );
};

export default Project;