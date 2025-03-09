import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProjectCard from "./ProjectCard";

const ProjectSlider = ({
  projects,
  currentSlide,
  setCurrentSlide,
  expandedProject,
  toggleProjectExpansion,
  previewCache,
  updatePreviewCache,
  PROJECTS_PER_SLIDE,
  secondaryColor,
  textColor,
  isDark,
  skills,
  language,
  badgeBgColor,
  iconMap
}) => {
  // Génération des projets visibles actuellement
  const visibleProjects = projects.slice(currentSlide, currentSlide + PROJECTS_PER_SLIDE);

  // Déterminer si les contrôles de slider sont nécessaires
  const showSliderControls = projects.length > PROJECTS_PER_SLIDE;

  // Navigation dans le slider
  const navigateSlider = (direction) => {
    let newSlide;
    
    if (direction === 'next') {
      newSlide = currentSlide + PROJECTS_PER_SLIDE;
      if (newSlide >= projects.length) {
        newSlide = 0; // Retour au début
      }
    } else {
      newSlide = currentSlide - PROJECTS_PER_SLIDE;
      if (newSlide < 0) {
        newSlide = Math.max(0, projects.length - PROJECTS_PER_SLIDE); // Aller à la fin
      }
    }
    
    setCurrentSlide(newSlide);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Flèche de navigation gauche */}
      {showSliderControls && (
        <button 
          onClick={() => navigateSlider('prev')} 
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 p-2 rounded-full transition-colors duration-200 z-10"
          style={{ 
            backgroundColor: secondaryColor,
            color: textColor,
            opacity: currentSlide === 0 ? 0.5 : 1
          }}
          aria-label={language === "fr" ? "Précédent" : "Previous"}
        >
          <ChevronLeft size={24} />
        </button>
      )}
      
      {/* Flèche de navigation droite */}
      {showSliderControls && (
        <button 
          onClick={() => navigateSlider('next')} 
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 p-2 rounded-full transition-colors duration-200 z-10"
          style={{ 
            backgroundColor: secondaryColor,
            color: textColor,
            opacity: currentSlide + PROJECTS_PER_SLIDE >= projects.length ? 0.5 : 1
          }}
          aria-label={language === "fr" ? "Suivant" : "Next"}
        >
          <ChevronRight size={24} />
        </button>
      )}
      
      <div className="space-y-6 transition-all duration-300 ease-in-out">
        {visibleProjects.map((project, index) => {
          const absoluteIndex = currentSlide + index;
          const isExpanded = expandedProject === absoluteIndex;
          const isCached = project.link && previewCache[project.link]?.loaded;
          
          return (
            <ProjectCard
              key={absoluteIndex}
              project={project}
              index={absoluteIndex}
              isExpanded={isExpanded}
              toggleExpansion={toggleProjectExpansion}
              isCached={isCached}
              updatePreviewCache={updatePreviewCache}
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
      
      {/* Indicateur de pagination */}
      {showSliderControls && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: Math.ceil(projects.length / PROJECTS_PER_SLIDE) }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentSlide(i * PROJECTS_PER_SLIDE);
              }}
              className="w-3 h-3 rounded-full transition-colors duration-200"
              style={{ 
                backgroundColor: i === Math.floor(currentSlide / PROJECTS_PER_SLIDE) 
                  ? secondaryColor 
                  : isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
              }}
              aria-label={`${language === "fr" ? "Page" : "Page"} ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectSlider;