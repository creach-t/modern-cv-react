import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProjectCard from "./ProjectCard";

const ProjectSlider = ({
  projects,
  currentSlide,
  setCurrentSlide,
  expandedProject,
  toggleProjectExpansion,
  PROJECTS_PER_SLIDE,
  secondaryColor,
  textColor,
  isDark,
  skills,
  language,
  badgeBgColor,
  iconMap
}) => {
  // État pour le survol des contrôles de navigation
  const [navHovered, setNavHovered] = useState(false);

  // Réorganisation des projets dans l'ordre spécifié
  const orderedProjects = [
    projects.find(p => p.id === "devjobs"),
    projects.find(p => p.id === "zombieland"),
    projects.find(p => p.id === "ocoffee"),
    projects.find(p => p.id === "oldportfolio")
  ].filter(Boolean); // Filtre pour éliminer les undefined
  
  // Génération des projets visibles actuellement
  const visibleProjects = orderedProjects.slice(
    currentSlide, 
    currentSlide + PROJECTS_PER_SLIDE
  );
  
  const totalSlides = Math.ceil(orderedProjects.length / PROJECTS_PER_SLIDE);
  const currentIndex = Math.floor(currentSlide / PROJECTS_PER_SLIDE);
  
  // Navigation dans le slider
  const navigateSlider = (direction) => {
    let newSlide;
    
    if (direction === 'next') {
      newSlide = currentSlide + PROJECTS_PER_SLIDE;
      if (newSlide >= orderedProjects.length) {
        newSlide = 0;
      }
    } else {
      newSlide = currentSlide - PROJECTS_PER_SLIDE;
      if (newSlide < 0) {
        newSlide = Math.floor((orderedProjects.length - 1) / PROJECTS_PER_SLIDE) * PROJECTS_PER_SLIDE;
      }
    }
    
    setCurrentSlide(newSlide);
  };
  
  // Navigation directe à un index
  const goToSlide = (index) => {
    setCurrentSlide(index * PROJECTS_PER_SLIDE);
  };

  return (
    <div className="relative">
      {/* Système de navigation discret en haut */}
      {totalSlides > 1 && (
        <div 
          className="flex justify-center items-center w-full mb-6"
          onMouseEnter={() => setNavHovered(true)}
          onMouseLeave={() => setNavHovered(false)}
        >
          <div 
            className="flex items-center py-1 px-3 rounded-full transition-all duration-300"
            style={{ 
              backgroundColor: isDark 
                ? `rgba(255, 255, 255, ${navHovered ? 0.15 : 0.08})` 
                : `rgba(0, 0, 0, ${navHovered ? 0.1 : 0.05})`,
              boxShadow: navHovered ? `0 2px 8px ${isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)'}` : 'none'
            }}
          >
            {/* Flèche gauche */}
            <button 
              onClick={() => navigateSlider('prev')}
              className="p-1 mr-2 rounded-full transition-transform duration-300"
              style={{ 
                color: textColor,
                opacity: navHovered ? 1 : 0.7,
                transform: navHovered ? 'scale(1.1)' : 'scale(1)'
              }}
              aria-label={language === "fr" ? "Précédent" : "Previous"}
            >
              <ChevronLeft size={16} />
            </button>
            
            {/* Indicateurs de page */}
            <div className="flex space-x-1.5">
              {Array.from({ length: totalSlides }).map((_, i) => {
                const isActive = i === currentIndex;
                
                return (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    className="transition-all duration-300 rounded-full"
                    style={{ 
                      width: isActive ? '8px' : '6px',
                      height: isActive ? '8px' : '6px',
                      backgroundColor: isActive 
                        ? secondaryColor 
                        : isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
                      transform: navHovered && isActive ? 'scale(1.2)' : 'scale(1)',
                    }}
                    aria-label={`${language === "fr" ? "Page" : "Page"} ${i + 1}`}
                  />
                );
              })}
            </div>
            
            {/* Flèche droite */}
            <button 
              onClick={() => navigateSlider('next')}
              className="p-1 ml-2 rounded-full transition-transform duration-300"
              style={{ 
                color: textColor,
                opacity: navHovered ? 1 : 0.7,
                transform: navHovered ? 'scale(1.1)' : 'scale(1)'
              }}
              aria-label={language === "fr" ? "Suivant" : "Next"}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
      
      {/* Conteneur des projets */}
      <div className="space-y-6 transition-all duration-500 ease-in-out">
        {visibleProjects.map((project, index) => {
          const absoluteIndex = currentSlide + index;
          const isExpanded = expandedProject === absoluteIndex;
          
          return (
            <ProjectCard
              key={absoluteIndex}
              project={project}
              index={absoluteIndex}
              isExpanded={isExpanded}
              toggleExpansion={toggleProjectExpansion}
              secondaryColor={secondaryColor}
              textColor={textColor}
              isDark={isDark}
              skills={skills}
              language={language}
              badgeBgColor={badgeBgColor}
              iconMap={iconMap}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProjectSlider;