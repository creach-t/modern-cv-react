import React from "react";
import { MapPin } from "lucide-react";
import { useColor } from "../../contexts/ColorContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useData } from "../data/DataContext";
import { Loading, Tag } from "./ui";

const ExperienceApp = () => {
  const { data } = useData();
  const { language } = useLanguage();
  const { secondaryColor } = useColor();

  if (!data) return <Loading label="tail -f experience.log…" />;

  return (
    <div className="p-5">
      <ol className="relative ml-2 border-l border-white/10">
        {data.experiences.map((exp) => {
          const loc = exp[language] || exp.fr;
          return (
            <li key={exp.id} className="mb-6 ml-5 last:mb-1">
              <span
                className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full border-2 border-[#12141c]"
                style={{ backgroundColor: secondaryColor }}
              />
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3 className="text-sm font-semibold text-white">{loc.label}</h3>
                <span className="font-mono text-xs text-gray-500">
                  {exp.period}
                </span>
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                <span style={{ color: secondaryColor }}>{exp.company.name}</span>
                <span className="inline-flex items-center gap-1 text-gray-500">
                  <MapPin className="h-3 w-3" />
                  {exp.company.location}
                </span>
              </div>

              {loc.details?.length > 0 && (
                <ul className="mt-2 space-y-1 text-sm text-gray-300">
                  {loc.details.map((d, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-gray-600">–</span>
                      {d}
                    </li>
                  ))}
                </ul>
              )}

              {exp.technologies?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {exp.technologies.map((t) => (
                    <Tag key={t} tone="accent">
                      {t}
                    </Tag>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default ExperienceApp;
