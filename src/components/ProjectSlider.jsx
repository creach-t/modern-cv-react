import React from "react";
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

  return (
    <div className="relative">
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