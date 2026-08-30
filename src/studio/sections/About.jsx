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
    subtitle: "Un parcours atypique, un moteur simple : construire des choses utiles.",
    p1: "J'ai passé plusieurs années à conseiller des clients et à manager des équipes dans le commerce. J'y ai appris l'écoute, la rigueur et le sens du concret — puis j'ai décidé d'en faire un métier de création.",
    p2: "Aujourd'hui je développe des applications web complètes en React et Node.js. Ma particularité : je ne m'arrête pas au code. Je déploie et j'héberge moi-même mes projets sur mon propre serveur, avec des outils professionnels (Docker, intégration continue).",
    p3: "Un vrai réflexe de bricoleur : comprendre toute la chaîne, de la première ligne de code jusqu'à la mise en ligne.",
    s1: "projets en ligne",
    s2: "auto-hébergés",
    s3: "technologies clés",
  },
  en: {
    title: "My story",
    subtitle: "An unusual path, a simple drive: building useful things.",
    p1: "I spent several years advising customers and managing teams in retail. I learned to listen, to be rigorous and pragmatic — then I decided to turn creation into my craft.",
    p2: "Today I build complete web applications with React and Node.js. What sets me apart: I don't stop at the code. I deploy and self-host my projects on my own server, with professional tooling (Docker, continuous integration).",
    p3: "A real maker's instinct: understanding the whole chain, from the first line of code to going live.",
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
          <p className="font-medium text-white">{t.p3}</p>
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
