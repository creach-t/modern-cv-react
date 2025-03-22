import React, { useEffect, useState } from 'react';
import { useColor } from '../contexts/ColorContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Wrench, Cpu, Leaf, Tool, ArrowLeftRight, Heart
} from 'lucide-react';
import './SoftSkills.css';
import { getTextColor } from '../utils/color';

const Hobbies = () => {
  const { secondaryColor, isDark } = useColor();
  const { language } = useLanguage();
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
    tool: Wrench,
    cpu: Cpu,
    leaf: Leaf,
    heart: Heart
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/hobbies.json");
        const data = await response.json();
        setHobbies(data);
      } catch (error) {
        console.error("Erreur lors du chargement des hobbies :", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const title = language === "fr" ? "Loisirs" : "Hobbies";

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

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4 pb-2 relative" style={{ color: textColor }}>
        {title}
        <div className="absolute bottom-0 left-0 h-1 rounded-full w-12" style={{ backgroundColor: secondaryColor }} />
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div
          className="relative rounded-lg cursor-pointer h-20"
          style={{ 
            perspective: "1000px",
          }}
          onClick={() => toggleCard('hobbies')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleCard('hobbies');
            }
          }}
          tabIndex="0"
          role="button"
          aria-pressed={flippedCards['hobbies']}
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
            className={`absolute w-full h-full p-3 rounded-lg transition-all duration-500 backface-visibility-hidden ${flippedCards['hobbies'] ? 'opacity-0 rotateY-180' : 'opacity-100 rotateY-0'}`}
            style={{ 
              backgroundColor: bgColor,
              borderLeft: `3px solid ${secondaryColor}`,
              backfaceVisibility: "hidden",
              transform: flippedCards['hobbies'] ? "rotateY(180deg)" : "rotateY(0deg)",
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
                <Heart
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
                  {title}
                </h3>
              </div>
            </div>
          </div>
          
          {/* Face arrière */}
          <div
            className={`absolute w-full h-full p-3 rounded-lg transition-all duration-500 backface-visibility-hidden ${flippedCards['hobbies'] ? 'opacity-100 rotateY-0' : 'opacity-0 rotateY-180'}`}
            style={{ 
              backgroundColor: bgColor,
              borderLeft: `3px solid ${secondaryColor}`,
              backfaceVisibility: "hidden",
              transform: flippedCards['hobbies'] ? "rotateY(0deg)" : "rotateY(180deg)",
              transformStyle: "preserve-3d"
            }}
          >
            <div className="flex items-center h-full">
              <div className="flex flex-wrap gap-1 w-full">
                {hobbies.map((hobby) => {
                  const Icon = iconMap[hobby.icon] || Heart;
                  return (
                    <div 
                      key={hobby.id}
                      className="flex items-center bg-opacity-20 rounded-full px-2 py-0.5"
                      style={{ backgroundColor: `${secondaryColor}30` }}
                    >
                      <Icon size={12} style={{ color: secondaryColor }} className="mr-1" />
                      <span className="text-xs" style={{ color: textColor }}>{hobby.title[language]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hobbies;