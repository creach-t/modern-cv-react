import React from "react";
import { MapPin } from "lucide-react";
import { useColor } from "../../contexts/ColorContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useData } from "../data/DataContext";
import { Loading, Tag } from "./ui";

const EducationApp = () => {
  const { data } = useData();
  const { language } = useLanguage();
  const { secondaryColor } = useColor();

  if (!data) return <Loading label="loading education.log…" />;

  return (
    <div className="space-y-3 p-5">
      {data.education.map((ed) => {
        const loc = ed[language] || ed.fr;
        return (
          <div
            key={ed.id}
            className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h3 className="text-sm font-semibold text-white">{loc.label}</h3>
              <span className="font-mono text-xs text-gray-500">{ed.period}</span>
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400">
              <span style={{ color: secondaryColor }}>{ed.school.name}</span>
              <span className="inline-flex items-center gap-1 text-gray-500">
                <MapPin className="h-3 w-3" />
                {ed.school.location}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-300">{loc.description}</p>
            {loc.specialization && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Tag tone="accent">{loc.specialization}</Tag>
                {ed.technologies?.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default EducationApp;
