import React, { useEffect, useState } from "react";
import { useColor } from "../contexts/ColorContext";
import { useLanguage } from "../contexts/LanguageContext";
import { getTextColor } from "../utils/color";
import { FileCode } from "lucide-react";

const iconMap = {
  FileCode: FileCode,
};

const Project = () => {
  const { secondaryColor, isDark } = useColor();
  const { language } = useLanguage(); // Utilisation du contexte de langue
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("/data/projects.json")
      .then((response) => response.json())
      .then((data) => setProjects(data[language]))
      .catch((error) =>
        console.error("Erreur lors du chargement des projets :", error)
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
        {language === "fr" ? "Projets" : "Projects"}
      </h2>

      <div className="space-y-6">
        {projects.map((info, index) => {
          const IconComponent = iconMap[info.icon] || FileCode; // Sélection de l'icône

          return (
            <a
              key={index}
              href={info.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: isDark
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.02)",
                color: isDark ? "white" : "black",
              }}
            >
              <div
                className="rounded-full p-2 transition-colors duration-200"
                style={{ backgroundColor: secondaryColor }}
              >
                <IconComponent color={getTextColor(secondaryColor)} size={20} />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {info.label}
                </div>
                <div className="font-medium">{info.value}</div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};

export default Project;
