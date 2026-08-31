import React from "react";
import { useColor } from "../../contexts/ColorContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useData } from "../../os/data/DataContext";
import Section from "../components/Section";
import Reveal from "../components/Reveal";
import Counter from "../components/Counter";

// Le récit vit dans public/data/journey.json (bloc "story") : source unique,
// partagée avec l'OS (AboutApp) et l'assistant IA (persona). Ici on ne garde
// que le titre de section et les libellés de stats.
const COPY = {
  fr: {
    title: "Mon histoire",
    fallbackSubtitle: "Ce n'était pas un virage. C'était un retour.",
    s1: "projets en ligne",
    s2: "auto-hébergés",
    s3: "technologies clés",
  },
  en: {
    title: "My story",
    fallbackSubtitle: "It wasn't a career switch. It was a homecoming.",
    s1: "live projects",
    s2: "self-hosted",
    s3: "core technologies",
  },
};

const About = () => {
  const { secondaryColor } = useColor();
  const { language } = useLanguage();
  const { data } = useData();
  const t = COPY[language] || COPY.fr;

  const story = data?.story?.[language] || data?.story?.fr;
  const subtitle = story?.subtitle || t.fallbackSubtitle;
  const paragraphs = story?.paragraphs || [];

  const projectCount = data?.projects?.length || 5;
  const coreSkills =
    data?.skills?.reduce(
      (n, cat) => n + cat.skills.filter((s) => s.level >= 3).length,
      0
    ) || 12;

  return (
    <Section id="about" index="01" title={t.title} subtitle={subtitle} doodle="spark">
      <div className="max-w-3xl">
        <Reveal stagger className="space-y-4 text-base leading-relaxed text-gray-300">
          {paragraphs.map((p, i) => (
            <p key={i} className={i === 3 ? "font-medium text-white" : undefined}>
              {p}
            </p>
          ))}
        </Reveal>

        <Reveal className="mt-8 grid grid-cols-3 gap-4">
          {[
            { v: projectCount, suffix: "", label: t.s1 },
            { v: 100, suffix: "%", label: t.s2 },
            { v: coreSkills, suffix: "", label: t.s3 },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center"
            >
              <div
                className="text-3xl font-black sm:text-4xl"
                style={{ color: secondaryColor }}
              >
                <Counter value={s.v} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-xs text-gray-400">{s.label}</div>
            </div>
          ))}
        </Reveal>
      </div>
    </Section>
  );
};

export default About;
