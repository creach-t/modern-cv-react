import { ChevronLeft, ChevronRight, Code, Coffee, FileCode, Skull } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useColor } from "../../../contexts/ColorContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import ProjectSlider from "./ProjectSlider";

// Nombre de projets visibles par slide
const PROJECTS_PER_SLIDE = 1;
// Délai d'inactivité avant auto slide (en ms)
const AUTO_SLIDE_DELAY = 20000;

const Project = () => {
  const { secondaryColor, isDark } = useColor();
  const { language } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [expandedProject, setExpandedProject] = useState(null);
  const [skills, setSkills] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [navHovered, setNavHovered] = useState(false);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);
  const sliderRef = useRef(null);
  const autoSlideTimerRef = useRef(null);
  const userInteractionTimerRef = useRef(null);

  // Mapping des icônes avec les composants Lucide
  const iconMap = {
    FileCode,
    Code,
    Coffee,
    Skull
  };

  // Utiliser useMemo pour les fonctions interdépendantes
  const sliderMethods = useMemo(() => {
    // Réinitialise le timer d'auto-slide après une interaction utilisateur
    const resetAutoSlideTimer = () => {
      // Annuler le timer existant si présent
      if (autoSlideTimerRef.current) {
        clearTimeout(autoSlideTimerRef.current);
      }

      // Ne pas configurer un nouveau timer si l'auto-play est en pause
      if (isAutoPlayPaused) return;

      // Configurer un nouveau timer
      autoSlideTimerRef.current = setTimeout(() => {
        // Passer à la slide suivante et fermer la carte développée
        navigateSlider('next');
        setExpandedProject(null);
      }, AUTO_SLIDE_DELAY);
    };

    // Pause l'auto-play
    const pauseAutoPlay = () => {
      setIsAutoPlayPaused(true);
      if (autoSlideTimerRef.current) {
        clearTimeout(autoSlideTimerRef.current);
        autoSlideTimerRef.current = null;
      }
    };

    // Reprend l'auto-play
    const resumeAutoPlay = () => {
      setIsAutoPlayPaused(false);
      resetAutoSlideTimer();
    };

    // Navigation dans le slider
    const navigateSlider = (direction) => {
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
      resetAutoSlideTimer();
      return newSlide;
    };

    // Navigation directe à un index
    const goToSlide = (index) => {
      setCurrentSlide(index * PROJECTS_PER_SLIDE);
      setExpandedProject(null); // Fermer la carte lors du changement de slide
      resetAutoSlideTimer();
    };

    return { navigateSlider, goToSlide, resetAutoSlideTimer, pauseAutoPlay, resumeAutoPlay };
  }, [currentSlide, projects.length, isAutoPlayPaused]);

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

  // Configuration de l'auto-slide
  useEffect(() => {
    // Initialiser le timer d'auto-slide seulement si pas en pause
    if (!isAutoPlayPaused) {
      sliderMethods.resetAutoSlideTimer();
    }

    // Fonction de nettoyage pour annuler le timer lors du démontage
    return () => {
      if (autoSlideTimerRef.current) {
        clearTimeout(autoSlideTimerRef.current);
      }
    };
  }, [projects, currentSlide, sliderMethods, isAutoPlayPaused]);

  // Détecteurs d'activité utilisateur pour gérer le timer
  useEffect(() => {
    const handleUserActivity = () => {
      // Annuler le timer de détection d'interaction précédent
      if (userInteractionTimerRef.current) {
        clearTimeout(userInteractionTimerRef.current);
      }

      // Définir un nouveau timer pour réinitialiser l'auto-slide
      userInteractionTimerRef.current = setTimeout(() => {
        if (!isAutoPlayPaused) {
          sliderMethods.resetAutoSlideTimer();
        }
      }, 500); // Délai court pour "debouncer" les événements
    };

    // Ajouter des écouteurs pour détecter l'activité
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('mousedown', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);

    // Nettoyage des écouteurs d'événements
    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('mousedown', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);

      if (userInteractionTimerRef.current) {
        clearTimeout(userInteractionTimerRef.current);
      }
    };
  }, [sliderMethods, isAutoPlayPaused]);

  // Fonction pour basculer l'état d'expansion d'un projet
  const toggleProjectExpansion = (index) => {
    setExpandedProject(expandedProject === index ? null : index);
    sliderMethods.resetAutoSlideTimer();
  };

  // Couleurs pour les éléments de l'interface
  const textColor = isDark ? "white" : "black";
  const badgeBgColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';

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
          ></div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8 relative">
      <div
        className="flex items-center justify-between mb-6"
        onMouseEnter={() => setNavHovered(true)}
        onMouseLeave={() => setNavHovered(false)}
      >
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

        {/* Contrôles de navigation intégrés au titre */}
        {totalSlides > 1 && (
          <div className="flex items-center space-x-4">
            {/* Indicateurs de page */}
            <div className="flex space-x-1.5">
              {Array.from({ length: totalSlides }).map((_, i) => {
                const isActive = i === currentIndex;

                return (
                  <button
                    key={i}
                    onClick={() => sliderMethods.goToSlide(i)}
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

            {/* Boutons de navigation */}
            <div className="flex items-center">
              <button
                onClick={() => sliderMethods.navigateSlider('prev')}
                className="p-1 rounded-full transition-transform duration-300 mr-1"
                style={{
                  color: textColor,
                  opacity: navHovered ? 1 : 0.7,
                  transform: navHovered ? 'scale(1.1)' : 'scale(1)'
                }}
                aria-label={language === "fr" ? "Précédent" : "Previous"}
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() => sliderMethods.navigateSlider('next')}
                className="p-1 rounded-full transition-transform duration-300"
                style={{
                  color: textColor,
                  opacity: navHovered ? 1 : 0.7,
                  transform: navHovered ? 'scale(1.1)' : 'scale(1)'
                }}
                aria-label={language === "fr" ? "Suivant" : "Next"}
              >
                <ChevronRight size={20} />
              </button>
            </div>
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
            onPauseAutoPlay={sliderMethods.pauseAutoPlay}
            onResumeAutoPlay={sliderMethods.resumeAutoPlay}
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