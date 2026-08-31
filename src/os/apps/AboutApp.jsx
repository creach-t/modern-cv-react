import React from "react";
import { Wrench, Cpu, Leaf, Heart } from "lucide-react";
import { useColor } from "../../contexts/ColorContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useData } from "../data/DataContext";
import { Loading, Tag } from "./ui";

// Bio de secours si les données ne sont pas encore chargées. Le texte de
// référence vit dans public/data/journey.json (bloc "story").
const BIO_FALLBACK = {
  fr: "Développeur full-stack JavaScript, arrivé au code après un détour par le commerce. En réalité, je bidouille des ordinateurs depuis mes 10 ans.",
  en: "Full-stack JavaScript developer, came to code after a detour through retail. Truth is, I've been tinkering with computers since I was 10.",
};

const HOBBY_ICONS = { tool: Wrench, cpu: Cpu, leaf: Leaf };

const AboutApp = () => {
  const { data } = useData();
  const { language } = useLanguage();
  const { secondaryColor } = useColor();

  if (!data) return <Loading label="whoami…" />;

  const softSkills = data.softSkills.filter((s) => s.id !== "hobbies");
  const story = data.story?.[language] || data.story?.fr;
  const paragraphs = story?.paragraphs || [];

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

      {paragraphs.length > 0 ? (
        <div className="mt-4 space-y-2.5 text-sm leading-relaxed text-gray-300">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm leading-relaxed text-gray-300">
          {story?.bio || BIO_FALLBACK[language] || BIO_FALLBACK.fr}
        </p>
      )}

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
        <div className="grid gap-2 sm:grid-cols-3">
          {data.hobbies.map((h) => {
            const Icon = HOBBY_ICONS[h.icon] || Heart;
            const desc = h.description?.[language] || h.description?.fr;
            return (
              <div
                key={h.id}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2"
              >
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-200">
                  <Icon className="h-3.5 w-3.5" style={{ color: secondaryColor }} />
                  {h.title[language] || h.title.fr}
                </div>
                {desc && (
                  <p className="mt-1 text-[11px] leading-snug text-gray-500">{desc}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AboutApp;
