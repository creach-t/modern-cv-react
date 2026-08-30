import React from "react";
import { useColor } from "../../contexts/ColorContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useData } from "../../os/data/DataContext";
import Section from "../components/Section";
import Reveal from "../components/Reveal";

const COPY = {
  fr: {
    title: "Mon parcours",
    subtitle: "Du commerce au code : chaque étape a construit ma façon de travailler.",
    exp: "Expérience",
    edu: "Formation",
  },
  en: {
    title: "My journey",
    subtitle: "From retail to code: every step shaped the way I work.",
    exp: "Experience",
    edu: "Education",
  },
};

const TimelineItem = ({ period, title, org, location, description, chips }) => {
  const { secondaryColor } = useColor();
  return (
    <li className="relative pl-6">
      <span
        className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: secondaryColor }}
      />
      <span className="absolute left-[4.5px] top-4 h-full w-px bg-white/10" />
      <div className="pb-8">
        <span className="font-mono text-xs text-gray-500">{period}</span>
        <h4 className="mt-1 text-base font-semibold text-white">{title}</h4>
        <p className="text-sm" style={{ color: secondaryColor }}>
          {org}
          {location ? ` · ${location}` : ""}
        </p>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-gray-400">{description}</p>
        )}
        {chips?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {chips.map((c) => (
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

  return (
    <Section id="journey" index="03" title={t.title} subtitle={t.subtitle} doodle="route">
      <div className="grid gap-10 md:grid-cols-2">
        <Reveal>
          <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-gray-400">
            {t.exp}
          </h3>
          <ol>
            {(data?.experiences || []).map((e) => {
              const loc = e[language] || e.fr;
              return (
                <TimelineItem
                  key={e.id}
                  period={e.period}
                  title={loc.label}
                  org={e.company.name}
                  location={e.company.location}
                  description={loc.description}
                  chips={e.technologies}
                />
              );
            })}
          </ol>
        </Reveal>

        <Reveal delay={120}>
          <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-gray-400">
            {t.edu}
          </h3>
          <ol>
            {(data?.education || []).map((e) => {
              const loc = e[language] || e.fr;
              return (
                <TimelineItem
                  key={e.id}
                  period={e.period}
                  title={loc.label}
                  org={e.school.name}
                  location={e.school.location}
                  description={loc.description}
                  chips={e.technologies}
                />
              );
            })}
          </ol>
        </Reveal>
      </div>
    </Section>
  );
};

export default Journey;
