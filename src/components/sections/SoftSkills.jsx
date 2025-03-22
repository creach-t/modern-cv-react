import React, { useEffect, useState } from 'react';
import { useColor } from '../../contexts/ColorContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Target, Calendar, Puzzle, Users, BarChart2, Award, Brain,
  ArrowLeftRight, Heart, Wrench, Cpu, Leaf
} from 'lucide-react';
import './SoftSkills.css';
import { getTextColor } from '../../utils/color';

const SoftSkills = () => {
  const { secondaryColor, isDark } = useColor();
  const { language } = useLanguage();
  const [softSkills, setSoftSkills] = useState([]);
  const [hobbies, setHobbies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [flippedCards, setFlippedCards] = useState({});

  // Couleurs et styles de base
  const textColor = isDark ? "white" : "black";
  const detailsColor = isDark ? "rgb(209 213 219)" : "rgb(55 65 81)";
  const bgColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.95)";
  
  // Fonction pour retourner une carte
  const toggleCard = (id) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    
    // Retourner la carte après 4 secondes
    setTimeout(() => {
      setFlippedCards(prev => ({
        ...prev,
        [id]: false
      }));
    }, 4000);
  };

  // Mapping des icônes
  const iconMap = {
    target: Target,
    calendar: Calendar,
    puzzle: Puzzle,
    "bar-chart-2": BarChart2,
    users: Users,
    award: Award,
    brain: Brain,
    heart: Heart,
    tool: Wrench,
    cpu: Cpu,
    leaf: Leaf
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les soft skills
        const skillsResponse = await fetch("/data/softSkills.json");
        const skillsData = await skillsResponse.json();
        // Filtrer pour exclure les hobbies si présent dans le fichier softSkills.json
        const filteredSkills = skillsData.filter(skill => skill.id !== 'hobbies');
        setSoftSkills(filteredSkills);
        
        // Charger les hobbies depuis un fichier séparé
        const hobbiesResponse = await fetch("/data/hobbies.json");
        const hobbiesData = await hobbiesResponse.json();
        setHobbies(hobbiesData);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const title = language === "fr" ? "Compétences personnelles" : "Personal Skills";

  if (isLoading) {
    return (
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 pb-2 relative" style={{ color: textColor }}>
          {title}
          <div className="absolute bottom-0 left-0 h-1 rounded-full w-12" style={{ backgroundColor: secondaryColor }} />
        </h2>
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2" style={{ borderColor: secondaryColor }}></div>
        </div>
      </section>
    );
  }

  // Calculer toutes les cartes à afficher, y compris la carte des hobbies
  const allCards = [
    ...softSkills,
    {
      id: 'hobbies',
      icon: 'heart',
      title: {
        fr: 'Loisirs',
        en: 'Hobbies'
      },
      color: '#F0756A'
    }
  ];

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4 pb-2 relative" style={{ color: textColor }}>
        {title}
        <div className="absolute bottom-0 left-0 h-1 rounded-full w-12" style={{ backgroundColor: secondaryColor }} />
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {allCards.map((skill) => {
          const Icon = iconMap[skill.icon] || Award;
          const isFlipped = flippedCards[skill.id] || false;
          
          return (
            <div
              key={skill.id}
              className="relative rounded-lg cursor-pointer h-20"
              style={{ 
                perspective: "1000px",
              }}
              onClick={() => toggleCard(skill.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleCard(skill.id);
                }
              }}
              tabIndex="0"
              role="button"
              aria-pressed={isFlipped}
            >
              {/* Indicateur de flip */}
              <div 
                className="absolute top-2 right-2 z-10 opacity-50 hover:opacity-90 transition-opacity" 
                style={{ color: secondaryColor }}
                title={language === "fr" ? "Cliquez pour retourner" : "Click to flip"}
              >
                <ArrowLeftRight size={12} />
              </div>
              
              {/* Face avant */}
              <div
                className={`absolute w-full h-full p-3 rounded-lg transition-all duration-500 backface-visibility-hidden ${isFlipped ? 'opacity-0 rotateY-180' : 'opacity-100 rotateY-0'}`}
                style={{ 
                  backgroundColor: bgColor,
                  borderLeft: `3px solid ${secondaryColor}`,
                  backfaceVisibility: "hidden",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  transformStyle: "preserve-3d"
                }}
              >
                <div className="flex items-center h-full">
                  <div 
                    className="flex-shrink-0 mr-3 w-10 h-10 flex items-center justify-center rounded-full"
                    style={{ 
                      backgroundColor: secondaryColor,
                      color: "white"
                    }}
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.5}
                      color={getTextColor(secondaryColor)}
                    />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="font-semibold"
                      style={{ color: textColor }}
                    >
                      {skill.title[language]}
                    </h3>
                  </div>
                </div>
              </div>
              
              {/* Face arrière */}
              <div
                className={`absolute w-full h-full p-3 rounded-lg transition-all duration-500 backface-visibility-hidden ${isFlipped ? 'opacity-100 rotateY-0' : 'opacity-0 rotateY-180'}`}
                style={{ 
                  backgroundColor: bgColor,
                  borderLeft: `3px solid ${secondaryColor}`,
                  backfaceVisibility: "hidden",
                  transform: isFlipped ? "rotateY(0deg)" : "rotateY(180deg)",
                  transformStyle: "preserve-3d"
                }}
              >
                {skill.id === 'hobbies' ? (
                  <div className="flex items-center h-full">
                    <div className="flex flex-wrap gap-1 w-full">
                      {hobbies.map((hobby) => {
                        const HobbyIcon = iconMap[hobby.icon] || Heart;
                        return (
                          <div
                            key={hobby.id}
                            className="flex items-center bg-opacity-20 rounded-full px-2 py-0.5"
                            style={{ backgroundColor: `${secondaryColor}30` }}
                          >
                            <HobbyIcon size={12} style={{ color: secondaryColor }} className="mr-1" />
                            <span className="text-xs" style={{ color: textColor }}>{hobby.title[language]}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center h-full">
                    <p className="text-sm" style={{ color: detailsColor }}>
                      {skill.description[language]}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SoftSkills;