import React, { useEffect, useState, useRef, useCallback } from "react";
import { useColor } from "../contexts/ColorContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Code, Coffee, Skull, FileCode } from "lucide-react";
import ProjectSlider from "./ProjectSlider";

// Nombre de projets visibles par slide
const PROJECTS_PER_SLIDE = 1;
// Durée du timer en secondes
const TIMER_DURATION = 20;

const Project = () => {
  const { secondaryColor, isDark } = useColor();
  const { language } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [expandedProject, setExpandedProject] = useState(null);
  const [skills, setSkills] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [timeoutId, setTimeoutId] = useState(null);
  
  const sliderRef = useRef(null);
  const timerRef = useRef(null);
  
  // Mapping des icônes avec les composants Lucide
  const iconMap = {
    FileCode,
    Code,
    Coffee,
    Skull
  };
  
  // -- 1. Rendre navigateSlider stable --
  // On l'encapsule dans un useCallback, pour que la fonction ne se recrée pas
  // à chaque rendu. On la redéfinira uniquement si currentSlide ou projects changent.
  const navigateSlider = useCallback((direction) => {
    let newSlide;
    const totalProjects = projects.length;
    
    if (direction === 'next') {
      newSlide = currentSlide + PROJECTS_PER_SLIDE;
      if (newSlide >= totalProjects) {
        newSlide = 0;
      }
    } else {
      newSlide = currentSlide - PROJECTS_PER_SLIDE;
      if (newSlide < 0) {
        newSlide = Math.floor((totalProjects - 1) / PROJECTS_PER_SLIDE) * PROJECTS_PER_SLIDE;
      }
    }
    
    setCurrentSlide(newSlide);
    setExpandedProject(null); // Fermer la carte lors du changement de slide
  }, [currentSlide, projects.length]);
  
  // Navigation directe à un index
  const goToSlide = useCallback((index) => {
    setCurrentSlide(index * PROJECTS_PER_SLIDE);
    setExpandedProject(null);
  }, []);
  
  // Gérer le mouvement de la souris pour réinitialiser ou arrêter le timer
  const handleMouseMove = useCallback(() => {
    // On arrête le timer quand la souris bouge
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsTimerActive(false);
    
    // On réinitialise le timeout pour suivre l'inactivité de la souris
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    const newTimeoutId = setTimeout(() => {
      if (!expandedProject) {
        setTimeRemaining(TIMER_DURATION);
        setIsTimerActive(true);
      }
    }, 3000);
    
    setTimeoutId(newTimeoutId);
  }, [timeoutId, expandedProject]);
  
  useEffect(() => {
    // Nettoyage du timeout à la destruction du composant
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeoutId]);
  
  // -- 2. useEffect qui utilise navigateSlider comme dépendance --
  useEffect(() => {
    // Si le timer est actif et qu'aucun projet n'est développé
    if (isTimerActive && !expandedProject && projects.length > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            navigateSlider("next");
            return TIMER_DURATION;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  // On inclut navigateSlider pour éliminer l’avertissement
  }, [isTimerActive, expandedProject, projects.length, navigateSlider]);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // Chargement parallèle des données
        const [projectsResponse, skillsResponse] = await Promise.all([
          fetch("/data/projects.json"),
          fetch("/data/skills.json"),
        ]);
        
        const projectsData = await projectsResponse.json();
        const projectsList = projectsData.projects || projectsData;
        
        const formattedProjects = projectsList.map((project) => {
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
            github: project.github || "",
          };
        });
        
        setProjects(formattedProjects);
        
        const skillsData = await skillsResponse.json();
        const skillsArray = Array.isArray(skillsData) ? skillsData : skillsData.skills || [];
        
        const skillsMap = {};
        skillsArray.forEach((category) => {
          if (Array.isArray(category.skills)) {
            category.skills.forEach((skill) => {
              if (skill.level > 0) {
                skillsMap[skill.name.toLowerCase()] = skill;
              }
            });
          }
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
  
  // Effet pour gérer l'expansion d'un projet et arrêter le timer
  useEffect(() => {
    if (expandedProject !== null) {
      setIsTimerActive(false);
    } else {
      // Après un délai, réactiver le timer si la souris n'a pas bougé
      const delayId = setTimeout(() => {
        setIsTimerActive(true);
      }, 1000);
      
      return () => clearTimeout(delayId);
    }
  }, [expandedProject]);
  
  // Fonction pour basculer l'état d'expansion d'un projet
  const toggleProjectExpansion = (index) => {
    setExpandedProject(expandedProject === index ? null : index);
  };
  
  // Couleurs pour les éléments de l'interface
  const textColor = isDark ? "white" : "black";
  const badgeBgColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)";
  const totalSlides = Math.ceil((projects.length || 0) / PROJECTS_PER_SLIDE);
  const currentIndex = Math.floor(currentSlide / PROJECTS_PER_SLIDE);
  
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
          />
        </div>
      </section>
    );
  }
  
  return (
    <section
      className="mb-8 relative"
      onMouseMove={handleMouseMove}
    >
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-2xl font-bold pb-2 relative flex-grow"
          style={{ color: textColor }}
        >
          {language === "fr" ? "Projets" : "Projects"}
          <div
            className="absolute bottom-0 left-0 h-1 rounded-full w-14"
            style={{ backgroundColor: secondaryColor }}
          />
        </h2>
        
        {totalSlides > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateSlider("prev")}
              className="p-1 rounded-full transition-transform hover:scale-110 duration-300"
              style={{ color: textColor }}
              aria-label={language === "fr" ? "Précédent" : "Previous"}
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex space-x-1.5">
              {Array.from({ length: totalSlides }).map((_, i) => {
                const isActive = i === currentIndex;
                return (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    className="transition-all duration-300 rounded-full"
                    style={{
                      width: isActive ? "8px" : "6px",
                      height: isActive ? "8px" : "6px",
                      backgroundColor: isActive
                        ? secondaryColor
                        : isDark
                          ? "rgba(255, 255, 255, 0.3)"
                          : "rgba(0, 0, 0, 0.2)",
                    }}
                    aria-label={`${
                      language === "fr" ? "Page" : "Page"
                    } ${i + 1}`}
                  />
                );
              })}
            </div>
            
            <button
              onClick={() => navigateSlider("next")}
              className="p-1 rounded-full transition-transform hover:scale-110 duration-300"
              style={{ color: textColor }}
              aria-label={language === "fr" ? "Suivant" : "Next"}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
      
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
            timeRemaining={timeRemaining}
            timerDuration={TIMER_DURATION}
            isTimerActive={isTimerActive}
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
