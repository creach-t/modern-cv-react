import React from "react";
import { useColor } from "../../contexts/ColorContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useData } from "../../os/data/DataContext";
import Section from "../components/Section";
import Reveal from "../components/Reveal";
import Counter from "../components/Counter";

const COPY = {
  fr: {
    title: "Mon histoire",
    subtitle: "Apprendre, construire, réparer, partager — depuis toujours.",
    p1: "Depuis tout petit, j'ai ce besoin de comprendre comment les choses marchent. Une télécommande en panne, un vieux PC sous MS-DOS ? Je démontais tout — quitte à ne pas toujours réussir à remonter. Mais à chaque fois, j'apprenais.",
    p2: "Bac électrotechnique, BTS informatique de gestion, puis un long détour par le commerce (vendeur, responsable, menuiserie). Sans jamais lâcher : je réparais tout ce qui me tombait sous la main, je bricolais avec Arduino et Raspberry Pi, je montais des sites et des petites applis.",
    p3: "En 2024, j'ai suivi mon instinct : reconversion en développement web à l'école O'clock. Depuis, je me sens totalement à ma place — et je continue en auto-formation (DevOps, Spring Boot, React, React Native). Je code, et j'héberge moi-même mes projets, de la première ligne jusqu'à la mise en ligne.",
    p4: "Apprendre, construire, réparer, partager : c'est ce qui me fait vibrer.",
    s1: "projets en ligne",
    s2: "auto-hébergés",
    s3: "technologies clés",
  },
  en: {
    title: "My story",
    subtitle: "Learning, building, fixing, sharing — always have.",
    p1: "Ever since I was a kid, I've needed to understand how things work. A broken remote, an old MS-DOS PC? I'd take it all apart — even if I couldn't always put it back together. But every time, I learned.",
    p2: "An electrical-engineering diploma, an IT/business degree, then a long detour through retail (sales, store manager, joinery). Without ever letting go: I repaired whatever came my way, tinkered with Arduino and Raspberry Pi, built sites and small apps.",
    p3: "In 2024 I followed my instinct: a career switch to web development at O'clock. Since then I feel completely in my place — and I keep self-teaching (DevOps, Spring Boot, React, React Native). I write the code, and I self-host my projects, from the first line to going live.",
    p4: "Learning, building, fixing, sharing: that's what drives me.",
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

  const projectCount = data?.projects?.length || 5;
  const coreSkills =
    data?.skills?.reduce(
      (n, cat) => n + cat.skills.filter((s) => s.level >= 3).length,
      0
    ) || 12;

  return (
    <Section id="about" index="01" title={t.title} subtitle={t.subtitle} doodle="spark">
      <div className="max-w-3xl">
        <Reveal stagger className="space-y-4 text-base leading-relaxed text-gray-300">
          <p>{t.p1}</p>
          <p>{t.p2}</p>
          <p>{t.p3}</p>
          <p className="font-medium text-white">{t.p4}</p>
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
