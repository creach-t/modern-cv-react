import React, { useEffect, useState } from "react";
import { useColor } from "../contexts/ColorContext";
import { useLanguage } from "../contexts/LanguageContext";
import { GraduationCap, Calendar } from "lucide-react";

const Education = () => {
  const { secondaryColor, isDark } = useColor();
  const { language } = useLanguage(); // Utilisation du contexte de langue
  const [education, setEducation] = useState([]);

  useEffect(() => {
    fetch("/data/education.json")
      .then((response) => response.json())
      .then((data) => setEducation(data[language]))
      .catch((error) =>
        console.error("Erreur lors du chargement des formations :", error)
      );
  }, [language]);

  return (
    <section className="mb-8">
      <h2
        className="text-2xl font-bold mb-6 pb-2 transition-colors duration-200"
        style={{
          borderBottom: `2px solid ${secondaryColor}`,
          color: isDark ? "white" : "black",
        }}
      >
        {language === "fr" ? "Formation" : "Education"}
      </h2>

      <div className="space-y-6">
        {education.map((edu, index) => (
          <div
            key={index}
            className="p-4 rounded-lg transition-colors duration-200"
            style={{
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.02)",
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3
                  className="text-lg font-semibold transition-colors duration-200"
                  style={{ color: isDark ? "white" : "black" }}
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

            <div className="flex items-center gap-1 mb-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{edu.period}</span>
            </div>

            <ul
              className="list-disc list-inside space-y-1 transition-colors duration-200"
              style={{ color: isDark ? "rgb(209 213 219)" : "rgb(55 65 81)" }}
            >
              {edu.details.map((detail, i) => (
                <li key={i}>{detail}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Education;
