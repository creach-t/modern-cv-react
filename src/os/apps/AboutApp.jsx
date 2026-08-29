import React from "react";
import { Wrench, Cpu, Leaf, Heart } from "lucide-react";
import { useColor } from "../../contexts/ColorContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useData } from "../data/DataContext";
import { Loading, Tag } from "./ui";

const BIO = {
  fr: "Développeur web full-stack JavaScript, reconverti après plusieurs années dans le conseil et le management. Je conçois des applications React / Node de bout en bout — et je les héberge moi-même sur mon VPS (Docker, CI/CD, Traefik). Curieux, rigoureux, j'aime autant coder une feature que comprendre l'infra qui la fait tourner.",
  en: "Full-stack JavaScript web developer, career-changer after several years in advising and management. I build React / Node applications end to end — and self-host them on my own VPS (Docker, CI/CD, Traefik). Curious and rigorous, I enjoy shipping a feature as much as understanding the infra that runs it.",
};

const HOBBY_ICONS = { tool: Wrench, cpu: Cpu, leaf: Leaf };

const AboutApp = () => {
  const { data } = useData();
  const { language } = useLanguage();
  const { secondaryColor } = useColor();

  if (!data) return <Loading label="whoami…" />;

  const softSkills = data.softSkills.filter((s) => s.id !== "hobbies");

  return (
    <div className="p-5">
      <div className="flex items-center gap-4">
        <div
          className="grid h-14 w-14 shrink-0 place-items-center rounded-xl text-xl font-bold text-black"
          style={{ backgroundColor: secondaryColor }}
        >
          TC
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Théo Créach</h2>
          <p className="font-mono text-xs" style={{ color: secondaryColor }}>
            full-stack js developer · self-hoster
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            Saint-Maur-des-Fossés, France
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-gray-300">
        {BIO[language] || BIO.fr}
      </p>

      <div className="mt-5">
        <div className="mb-2 text-[11px] uppercase tracking-wider text-gray-500">
          {language === "fr" ? "soft skills" : "soft skills"}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {softSkills.map((s) => (
            <Tag key={s.id} tone="accent">
              {s.title[language] || s.title.fr}
            </Tag>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-gray-500">
          <Heart className="h-3 w-3" />
          {language === "fr" ? "hobbies" : "hobbies"}
        </div>
        <div className="flex flex-wrap gap-2">
          {data.hobbies.map((h) => {
            const Icon = HOBBY_ICONS[h.icon] || Heart;
            return (
              <span
                key={h.id}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-gray-300"
              >
                <Icon className="h-3.5 w-3.5" style={{ color: secondaryColor }} />
                {h.title[language] || h.title.fr}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AboutApp;
