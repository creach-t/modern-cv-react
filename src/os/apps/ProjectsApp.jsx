import React, { useState } from "react";
import { ExternalLink, Github, ChevronRight } from "lucide-react";
import { useColor } from "../../contexts/ColorContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useData } from "../data/DataContext";
import { Loading, Tag } from "./ui";

const ProjectsApp = () => {
  const { data } = useData();
  const { language } = useLanguage();
  const { secondaryColor } = useColor();
  const [selected, setSelected] = useState(0);

  if (!data) return <Loading label="fetching /projects…" />;
  const projects = data.projects;
  const p = projects[selected];
  const loc = p[language] || p.fr;

  return (
    <div className="flex h-full flex-col sm:flex-row">
      {/* file list */}
      <nav className="shrink-0 border-b border-white/5 bg-black/20 p-2 font-mono text-xs sm:w-52 sm:border-b-0 sm:border-r">
        <div className="mb-1 px-2 py-1 text-[10px] uppercase tracking-wider text-gray-500">
          ~/projects
        </div>
        <ul className="flex gap-1 overflow-x-auto sm:flex-col sm:overflow-visible">
          {projects.map((proj, i) => {
            const l = proj[language] || proj.fr;
            const on = i === selected;
            return (
              <li key={proj.id} className="shrink-0">
                <button
                  onClick={() => setSelected(i)}
                  className={`flex w-full items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1.5 text-left transition-colors ${
                    on ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5"
                  }`}
                  style={on ? { color: secondaryColor } : undefined}
                >
                  <ChevronRight
                    className={`h-3 w-3 transition-transform ${on ? "rotate-90" : ""}`}
                  />
                  {l.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* detail */}
      <article className="min-h-0 flex-1 overflow-auto p-5">
        <h2 className="text-lg font-semibold text-white">{loc.label}</h2>
        <p className="mt-0.5 text-sm text-gray-400">{loc.value}</p>

        <p className="mt-3 text-sm leading-relaxed text-gray-300">
          {loc.explanation || loc.description}
        </p>

        <div className="mt-4">
          <div className="mb-1.5 text-[11px] uppercase tracking-wider text-gray-500">
            stack
          </div>
          <div className="flex flex-wrap gap-1.5">
            {p.technologies.map((t) => (
              <Tag key={t} tone="accent">
                {t}
              </Tag>
            ))}
            {(p.tools || []).map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>

        {loc.improvements?.length > 0 && (
          <div className="mt-4">
            <div className="mb-1.5 text-[11px] uppercase tracking-wider text-gray-500">
              {language === "fr" ? "roadmap" : "roadmap"}
            </div>
            <ul className="space-y-1 text-sm text-gray-400">
              {loc.improvements.map((imp, i) => (
                <li key={i} className="flex gap-2">
                  <span style={{ color: secondaryColor }}>›</span>
                  {imp}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {p.link && (
            <a
              href={p.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-black transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: secondaryColor }}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {language === "fr" ? "Voir le site" : "Live demo"}
            </a>
          )}
          {(p.github || []).map((g) => (
            <a
              key={g}
              href={g}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-sm text-gray-200 hover:bg-white/5"
            >
              <Github className="h-3.5 w-3.5" />
              {g.split("/").pop()}
            </a>
          ))}
        </div>
      </article>
    </div>
  );
};

export default ProjectsApp;
