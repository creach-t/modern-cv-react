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
  iconMap,
  timeRemaining,
  timerDuration,
  isTimerActive
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

  // Calcul pour l'animation du cercle de progression
  const radius = 6; // Rayon plus petit
  const strokeWidth = 3; // Trait plus épais
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - timeRemaining / timerDuration);

  return (
    <div className="relative">
      {/* Cercle d'avancement du timer */}
      {isTimerActive && !expandedProject && (
        <div className="absolute -top-7 right-0 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 18 18">
            {/* Cercle de fond */}
            <circle 
              cx="9" 
              cy="9" 
              r={radius} 
              fill="none" 
              stroke={isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"} 
              strokeWidth={strokeWidth} 
            />
            {/* Cercle d'avancement */}
            <circle 
              cx="9" 
              cy="9" 
              r={radius} 
              fill="none" 
              stroke={secondaryColor}
              strokeWidth={strokeWidth} 
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 9 9)"
              style={{ transition: "stroke-dashoffset 0.3s ease" }}
            />
          </svg>
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