import { useState, useRef } from "react";
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
  onPauseAutoPlay,
  onResumeAutoPlay
}) => {
  // États pour la navigation tactile/souris
  const [isPressed, setIsPressed] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const sliderRef = useRef(null);

  // Réorganisation des projets dans l'ordre spécifié
  const orderedProjects = [
    projects.find(p => p.id === "queensgame"),
    projects.find(p => p.id === "devjobs"),
    projects.find(p => p.id === "zombieland"),
    projects.find(p => p.id === "ocoffee"),
    projects.find(p => p.id === "oldportfolio")
  ].filter(Boolean);

  // Navigation avec boucle infinie
  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const next = prev + PROJECTS_PER_SLIDE;
      return next >= orderedProjects.length ? 0 : next;
    });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      const prev_slide = prev - PROJECTS_PER_SLIDE;
      return prev_slide < 0 ? Math.max(0, orderedProjects.length - PROJECTS_PER_SLIDE) : prev_slide;
    });
  };

  // Gestion des événements de début (touch et souris)
  const handleStart = (clientX) => {
    setIsPressed(true);
    setStartX(clientX);
    setCurrentX(clientX);
    setIsDragging(false);
  };

  // Gestion des événements de mouvement
  const handleMove = (clientX) => {
    if (!isPressed) return;

    setCurrentX(clientX);
    const diff = Math.abs(clientX - startX);

    if (diff > 5) {
      setIsDragging(true);
    }
  };

  // Gestion des événements de fin
  const handleEnd = () => {
    if (!isPressed) return;

    setIsPressed(false);

    if (isDragging) {
      const diff = currentX - startX;
      const threshold = 50; // Seuil minimum pour déclencher le slide

      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          prevSlide();
        } else {
          nextSlide();
        }
      }
    }

    setIsDragging(false);
  };

  // Événements tactiles
  const handleTouchStart = (e) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Événements souris
  const handleMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleMouseLeave = () => {
    if (isPressed) {
      handleEnd();
    }
  };

  // Gestion de la pause/reprise de l'auto-play au hover
  const handleMouseEnterContainer = () => {
    if (onPauseAutoPlay) {
      onPauseAutoPlay();
    }
  };

  const handleMouseLeaveContainer = () => {
    if (onResumeAutoPlay) {
      onResumeAutoPlay();
    }
  };

  // Génération des projets visibles actuellement
  const visibleProjects = orderedProjects.slice(
    currentSlide,
    currentSlide + PROJECTS_PER_SLIDE
  );

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnterContainer}
      onMouseLeave={handleMouseLeaveContainer}
    >
      {/* Conteneur des projets avec gestion tactile */}
      <div
        ref={sliderRef}
        className={`space-y-6 transition-all duration-500 ease-in-out select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isDragging ? `translateX(${(currentX - startX) * 0.1}px)` : 'translateX(0)',
          transition: isDragging ? 'none' : 'all 0.5s ease-in-out'
        }}
      >
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