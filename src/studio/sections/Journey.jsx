import React from "react";
import {
  Wrench,
  Cpu,
  GraduationCap,
  Globe,
  ShoppingBag,
  Ruler,
  Code,
  Server,
  MapPin,
} from "lucide-react";
import { useColor } from "../../contexts/ColorContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useData } from "../../os/data/DataContext";
import Section from "../components/Section";
import Reveal from "../components/Reveal";

const COPY = {
  fr: {
    title: "Mon parcours",
    subtitle: "À bien y regarder, chaque étape menait déjà quelque part.",
    kinds: {
      origin: "Origine",
      education: "Formation",
      experience: "Expérience",
      today: "Aujourd'hui",
    },
  },
  en: {
    title: "My journey",
    subtitle: "Looking closely, every step was already heading somewhere.",
    kinds: {
      origin: "Origin",
      education: "Education",
      experience: "Experience",
      today: "Today",
    },
  },
};

const ICONS = { Wrench, Cpu, GraduationCap, Globe, ShoppingBag, Ruler, Code, Server };

const MilestoneItem = ({ item, language, isLast }) => {
  const { secondaryColor } = useColor();
  const loc = item[language] || item.fr;
  const t = COPY[language] || COPY.fr;
  const Icon = ICONS[item.icon] || MapPin;
  const kindLabel = t.kinds[item.kind] || item.kind;
  const period = item.period?.[language] || item.period?.fr || "";

  return (
    <li className="relative pl-12">
      {/* ligne verticale */}
      {!isLast && (
        <span className="absolute left-[17px] top-9 h-[calc(100%-1rem)] w-px bg-white/10" />
      )}
      {/* pastille icône */}
      <span
        className="absolute left-0 top-0 grid h-9 w-9 place-items-center rounded-full border"
        style={{
          color: secondaryColor,
          borderColor: `${secondaryColor}55`,
          backgroundColor: `${secondaryColor}12`,
        }}
      >
        <Icon className="h-4 w-4" />
      </span>

      <div className="pb-9">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span
            className="rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{
              color: secondaryColor,
              backgroundColor: `${secondaryColor}18`,
            }}
          >
            {kindLabel}
          </span>
          <span className="font-mono text-xs text-gray-500">{period}</span>
        </div>

        <h4 className="mt-2 text-base font-semibold text-white sm:text-lg">
          {loc.title}
        </h4>
        {loc.org && (
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-400">
            <MapPin className="h-3 w-3 shrink-0 text-gray-500" />
            {loc.org}
          </p>
        )}

        {loc.text && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">
            {loc.text}
          </p>
        )}

        {item.chips?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.chips.map((c) => (
              <span
                key={c}
                className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-gray-300"
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </li>
  );
};

const Journey = () => {
  const { language } = useLanguage();
  const { data } = useData();
  const t = COPY[language] || COPY.fr;
  const milestones = data?.journey || [];

  return (
    <Section id="journey" index="03" title={t.title} subtitle={t.subtitle} doodle="route">
      <Reveal>
        <ol className="max-w-3xl">
          {milestones.map((m, i) => (
            <MilestoneItem
              key={m.id}
              item={m}
              language={language}
              isLast={i === milestones.length - 1}
            />
          ))}
        </ol>
      </Reveal>
    </Section>
  );
};

export default Journey;
