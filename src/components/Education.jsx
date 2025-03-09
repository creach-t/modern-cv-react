import React, { useEffect, useState } from "react";
import { useColor } from "../contexts/ColorContext";
import { useLanguage } from "../contexts/LanguageContext";
import { GraduationCap, Calendar, MapPin, Book, Briefcase } from "lucide-react";

const Education = () => {
  const { secondaryColor, isDark } = useColor();
  const { language } = useLanguage();
  const [educationData, setEducationData] = useState([]);
  
  const textColor = isDark ? "white" : "black";
  const bgColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)";
  const detailsColor = isDark ? "rgb(209 213 219)" : "rgb(55 65 81)";

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const response = await fetch("/data/education.json");
        const data = await response.json();
        
        // Transform data structure for the current language
        const transformedData = data.education.map(item => {
          const trans = item.translations[language];
          
          // Create details array based on available information
          const details = [];
          if (trans.specialization) details.push(trans.specialization);
          if (trans.project) details.push(trans.project);
          if (trans.internship) details.push(trans.internship);
          
          return {
            id: item.id,
            degree: trans.degree,
            school: item.school.name,
            location: item.school.location,
            period: item.period.replace('-', ' - '), // Ensure consistent formatting
            details
          };
        });
        
        setEducationData(transformedData);
      } catch (error) {
        console.error(`Erreur lors du chargement des formations: ${error.message}`);
        setEducationData([]);
      }
    };
    
    fetchEducation();
  }, [language]);

  const title = language === "fr" ? "Formation" : "Education";

  return (
    <section className="mb-12">
      <h2 
        className="text-2xl font-bold mb-6 pb-2 relative"
        style={{ color: textColor }}
      >
        {title}
        <div 
          className="absolute bottom-0 left-0 h-1 rounded-full w-14" 
          style={{ backgroundColor: secondaryColor }}
        />
      </h2>

      <div className="space-y-6">
        {educationData.map((edu) => (
          <div
            key={edu.id}
            className="p-4 rounded-lg transition-colors duration-200"
            style={{ backgroundColor: bgColor }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3
                  className="text-lg font-semibold transition-colors duration-200"
                  style={{ color: textColor }}
                >
                  {edu.degree}
                </h3>
                <p className="font-medium" style={{ color: secondaryColor }}>
                  {edu.school}
                </p>
              </div>
              <GraduationCap
                className="w-6 h-6 transition-colors duration-200"
                style={{ color: secondaryColor }}
              />
            </div>

            <div className="flex flex-wrap gap-3 mb-3">
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{edu.period}</span>
              </div>
              
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{edu.location}</span>
              </div>
            </div>

            <ul
              className="list-none space-y-1 transition-colors duration-200"
              style={{ color: detailsColor }}
            >
              {edu.details.map((detail, i) => (
                <li key={i} className="flex items-start gap-2">
                  {i === 0 ? (
                    <Book className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  ) : i === 1 && detail.includes("site") || detail.includes("website") ? (
                    <Briefcase className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: secondaryColor }} />
                  )}
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Education;