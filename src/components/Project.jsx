import React, { useEffect, useState, useRef, useCallback } from "react";
import { useColor } from "../contexts/ColorContext";
import { useLanguage } from "../contexts/LanguageContext";
import { getTextColor } from "../utils/color";
import { 
  FileCode, Coffee, Skull, Code, Github, 
  ExternalLink, ChevronDown, ChevronUp,
  ChevronLeft, ChevronRight
} from "lucide-react";
import SkillBadge from "./SkillBadge";
// Mapping des icônes avec les composants Lucide
const iconMap = {
  FileCode: FileCode,
  Code: Code,
  Coffee: Coffee,
  Skull: Skull
};
// Clé pour le stockage local des prévisualisations
const PREVIEW_CACHE_KEY = 'project-previews-cache';
// Durée de validité du cache en ms (24h)
const CACHE_VALIDITY = 24 * 60 * 60 * 1000;
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
  // Gestion du cache des prévisualisations
  useEffect(() => {
    try {
      // Récupération du cache
      const cachedData = localStorage.getItem(PREVIEW_CACHE_KEY);
      if (cachedData) {
        const parsedCache = JSON.parse(cachedData);
        // Vérification de la validité du cache
        const cacheIsValid = Object.values(parsedCache).every(item => 
          (Date.now() - item.timestamp) < CACHE_VALIDITY
        );
        if (cacheIsValid) {
          setPreviewCache(parsedCache);
        } else {
          // Nettoyage du cache expiré
          localStorage.removeItem(PREVIEW_CACHE_KEY);
          setPreviewCache({});
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du cache des prévisualisations:", error);
      // Nettoyage en cas d'erreur
      localStorage.removeItem(PREVIEW_CACHE_KEY);
    }
  }, []);
  // Mise à jour du cache des prévisualisations
  const updatePreviewCache = useCallback((url, loaded = true) => {
    const newCache = {
      ...previewCache,
      [url]: {
        loaded,
        timestamp: Date.now()
      }
    };
    setPreviewCache(newCache);
    
    try {
      localStorage.setItem(PREVIEW_CACHE_KEY, JSON.stringify(newCache));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du cache des prévisualisations:", error);
    }
  }, [previewCache]);
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
        setProjects(projectsData[language]);
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
    // Refermer tout projet ouvert lors du changement de slide
    setExpandedProject(null);
  };
  // Fonction pour basculer l'état d'expansion d'un projet
  const toggleProjectExpansion = (index) => {
    setExpandedProject(expandedProject === index ? null : index);
  };
  // Couleurs pour les éléments de l'interface
  const textColor = getTextColor(secondaryColor);
  const badgeBgColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';
  // Génération des projets visibles actuellement
  const visibleProjects = projects.slice(currentSlide, currentSlide + PROJECTS_PER_SLIDE);
  // Déterminer si les contrôles de slider sont nécessaires
  const showSliderControls = projects.length > PROJECTS_PER_SLIDE;
  if (isLoading) {
    return (
      <section className="mb-8">
        <h2
          className="text-2xl font-bold mb-6 pb-2 transition-colors duration-200"
          style={{
            borderBottom: `2px solid ${secondaryColor}`,
            color: isDark ? "white" : "black",
          }}
        >
          {language === "fr" ? "Projets" : "Projects"}
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
        className="text-2xl font-bold mb-6 pb-2 transition-colors duration-200"
        style={{
          borderBottom: `2px solid ${secondaryColor}`,
          color: isDark ? "white" : "black",
        }}
      >
        {language === "fr" ? "Projets" : "Projects"}
      </h2>
      {/* Container du slider avec transition */}
      <div 
        ref={sliderRef}
        className="relative overflow-hidden"
      >
        {/* Flèche de navigation gauche - positionnée absolument */}
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
        {/* Flèche de navigation droite - positionnée absolument */}
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
            const IconComponent = iconMap[project.icon] || FileCode;
            const absoluteIndex = currentSlide + index;
            const isExpanded = expandedProject === absoluteIndex;
            const isCached = project.link && previewCache[project.link]?.loaded;
            
            return (
              <div
                key={absoluteIndex}
                className="rounded-lg overflow-hidden shadow-md transition-all duration-300"
                style={{
                  backgroundColor: isDark
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(255, 255, 255, 0.95)",
                  borderLeft: `4px solid ${secondaryColor}`,
                  transform: isExpanded ? "scale(1.02)" : "scale(1)",
                }}
              >
                {/* En-tête du projet (toujours visible) */}
                <div className="flex flex-col">
                  {/* Première ligne : titre et flèche */}
                  <div 
                    className="flex justify-between items-center p-5 cursor-pointer"
                    onClick={() => toggleProjectExpansion(absoluteIndex)}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="rounded-full p-3 transition-colors duration-200 flex-shrink-0"
                        style={{ backgroundColor: secondaryColor }}
                      >
                        <IconComponent color={textColor} size={22} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {project.label}
                        </div>
                        <div 
                          className="font-medium text-lg" 
                          style={{ color: isDark ? "white" : "black" }}
                        >
                          {project.value}
                        </div>
                      </div>
                    </div>
                    
                    {/* Icône d'expansion */}
                    <div className="text-gray-500 dark:text-gray-400 flex-shrink-0">
                      {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </div>
                  </div>
                  
                  {/* Deuxième ligne : vignette (visible seulement quand le projet n'est pas développé) */}
                  {!isExpanded && project.link && (
                    <div className="px-5 pb-5 w-full">
                      <div 
                        className="relative rounded-md overflow-hidden w-full h-40 bg-gray-100 dark:bg-gray-800"
                      >
                        {/* Conteneur de l'iframe avec un overlay transparent pour bloquer les interactions */}
                        <div className="relative w-full h-full">
                          {/* N'affiche l'iframe que si le projet est dans la vue ou est déjà en cache */}
                          {isCached || !previewCache[project.link] ? (
                            <>
                              <iframe
                                src={project.link}
                                title={project.value}
                                style={{ 
                                  border: "none",
                                  width: "300%", 
                                  height: "300%",
                                  transform: "scale(0.33)",
                                  transformOrigin: "0 0",
                                  position: "absolute",
                                  top: "0",
                                  left: "0",
                                  pointerEvents: "none" // Désactive toute interaction avec l'iframe
                                }}
                                loading="lazy"
                                scrolling="no"
                                sandbox="allow-scripts allow-same-origin"
                                onLoad={() => updatePreviewCache(project.link)}
                                tabIndex="-1" // Empêche la sélection avec la touche Tab
                              />
                              {/* Overlay transparent pour bloquer les interactions */}
                              <div 
                                className="absolute inset-0 z-10"
                                onClick={(e) => e.stopPropagation()} 
                                style={{ cursor: "default" }}
                              ></div>
                            </>
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="animate-pulse h-full w-full bg-gray-200 dark:bg-gray-700"></div>
                            </div>
                          )}
                          
                          {/* Overlay discret avec dégradé pour une transition douce */}
                          <div 
                            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-20"
                            style={{ 
                              background: `linear-gradient(to bottom, rgba(0,0,0,0), ${isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.9)'})` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Contenu détaillé (visible uniquement si développé) */}
                  {isExpanded && (
                    <div className="p-5 pt-0 border-t border-gray-200 dark:border-gray-700">
                      <p className="my-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                        {project.description}
                      </p>
                      
                      {/* Technologies utilisées avec badges */}
                      <div className="mb-6">
                        <div className="text-sm font-medium mb-3 text-gray-500 dark:text-gray-400">
                          {language === "fr" ? "Technologies utilisées" : "Technologies used"}:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies && project.technologies.map((tech, techIndex) => {
                            const skill = skills[tech.toLowerCase()];
                            return skill ? (
                              <SkillBadge
                                key={techIndex}
                                name={tech}
                                logo={skill.logo}
                                isExpanded={false}
                                badgeBgColor={badgeBgColor}
                                secondaryColor={secondaryColor}
                                textColor={isDark ? "white" : "black"}
                              />
                            ) : (
                              <span 
                                key={techIndex}
                                className="px-3 py-1 text-xs rounded-full"
                                style={{ 
                                  backgroundColor: secondaryColor,
                                  color: textColor,
                                  opacity: 0.8
                                }}
                              >
                                {tech}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Liens vers le projet et GitHub */}
                      <div className="flex gap-4 flex-wrap">
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200"
                            style={{ 
                              backgroundColor: secondaryColor,
                              color: textColor
                            }}
                          >
                            <ExternalLink size={18} />
                            <span>{language === "fr" ? "Visiter" : "Visit"}</span>
                          </a>
                        )}
                        
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 transition-colors duration-200"
                          >
                            <Github size={18} />
                            <span>GitHub</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Indicateur de pagination */}
      {showSliderControls && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: Math.ceil(projects.length / PROJECTS_PER_SLIDE) }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentSlide(i * PROJECTS_PER_SLIDE);
                setExpandedProject(null);
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
    </section>
  );
};
export default Project;