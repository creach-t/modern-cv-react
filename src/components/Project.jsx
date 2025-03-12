import React, { useEffect, useState, useRef } from "react";
import { useColor } from "../contexts/ColorContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Code, Coffee, Skull, FileCode } from "lucide-react";
import ProjectSlider from "./ProjectSlider";

// Nombre de projets visibles par slide
const PROJECTS_PER_SLIDE = 2;

const Project = () => {
  const { secondaryColor, isDark } = useColor();
  const { language } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [expandedProject, setExpandedProject] = useState(null);
  const [skills, setSkills] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  // Mapping des icônes avec les composants Lucide
  const iconMap = {
    FileCode,
    Code,
    Coffee,
    Skull
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Chargement parallèle des données
        const [projectsResponse, skillsResponse] = await Promise.all([
          fetch("/data/projects.json"),
          fetch("/data/skills.json")
        ]);
        
        // Traitement des données de projets
        try {
          const projectsData = await projectsResponse.json();
          
          // Vérifier si projectsData a une propriété 'projects'
          const projectsList = projectsData.projects || projectsData;
          
          // Transformation des données de projet pour compatibilité avec l'interface
          const formattedProjects = projectsList.map(project => {
            return {
              id: project.id,
              icon: project.icon,
              label: project[language]?.label || "",
              value: project[language]?.value || "",
              description: project[language]?.description || "",
              explanation: project[language]?.explanation || "",
              improvements: project[language]?.improvements || [],
              technologies: project.technologies || [],
              tools: project.tools || [],
              image: project.image || "",
              link: project.link || "",
              github: project.github || ""
            };
          });
          
          setProjects(formattedProjects);
        } catch (error) {
          console.error("Erreur lors du traitement des projets:", error);
          setProjects([]);
        }
        
        // Traitement des données de compétences
        try {
          const skillsData = await skillsResponse.json();
          
          // Détermine si le skillsData est un tableau ou un objet avec une propriété "skills"
          const skillsArray = Array.isArray(skillsData) ? skillsData : skillsData.skills || [];
          
          // Traitement des compétences
          const skillsMap = {};
          skillsArray.forEach(category => {
            if (Array.isArray(category.skills)) {
              category.skills.forEach(skill => {
                if (skill.level > 0) {
                  skillsMap[skill.name.toLowerCase()] = skill;
                }
              });
            }
          });
          
          setSkills(skillsMap);
        } catch (error) {
          console.error("Erreur lors du traitement des compétences:", error);
          setSkills({});
        }
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
          <div 
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary" 
            style={{ borderColor: secondaryColor }}
          ></div>
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
        {projects.length > 0 ? (
          <ProjectSlider
            projects={projects}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
            expandedProject={expandedProject}
            toggleProjectExpansion={toggleProjectExpansion}
            PROJECTS_PER_SLIDE={PROJECTS_PER_SLIDE}
            secondaryColor={secondaryColor}
            textColor={textColor}
            isDark={isDark}
            skills={skills}
            language={language}
            badgeBgColor={badgeBgColor}
            iconMap={iconMap}
          />
        ) : (
          <div className="text-center p-8">
            <p style={{ color: textColor }}>
              {language === "fr" 
                ? "Aucun projet trouvé. Veuillez vérifier le fichier de données."
                : "No projects found. Please check the data file."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Project;