import React from "react";
import { ExternalLink, Github } from "lucide-react";
import { useColor } from "../../contexts/ColorContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useData } from "../../os/data/DataContext";
import Section from "../components/Section";
import Reveal from "../components/Reveal";
import TiltCard from "../components/TiltCard";

const COPY = {
  fr: {
    title: "Mes projets",
    subtitle: "Des applications complètes, en ligne et utilisables dès maintenant.",
    live: "Voir le site",
    code: "Code",
  },
  en: {
    title: "My work",
    subtitle: "Complete applications, live and usable right now.",
    live: "Live site",
    code: "Code",
  },
};

const ProjectRow = ({ project, reversed }) => {
  const { secondaryColor } = useColor();
  const { language } = useLanguage();
  const t = COPY[language] || COPY.fr;
  const loc = project[language] || project.fr;
  const img = `/img/projects/${project.id}.jpg`;

  return (
    <Reveal className="grid items-center gap-6 md:grid-cols-2 md:gap-10">
      {/* image */}
      <TiltCard className={reversed ? "md:order-2" : ""}>
        <a
          href={project.link}
          target="_blank"
          rel="noreferrer"
          className="group relative block overflow-hidden rounded-2xl border border-white/10"
        >
          <div
            className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ boxShadow: `inset 0 0 0 2px ${secondaryColor}` }}
          />
          <img
            src={img}
            alt={loc.label}
            loading="lazy"
            className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </a>
      </TiltCard>

      {/* text */}
      <div className={reversed ? "md:order-1" : ""}>
        <h3 className="text-2xl font-bold text-white">{loc.label}</h3>
        <p className="mt-1 text-sm font-medium" style={{ color: secondaryColor }}>
          {loc.value}
        </p>
        <p className="mt-3 text-base leading-relaxed text-gray-400">
          {loc.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-300"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-black transition-transform hover:scale-[1.03]"
            style={{ backgroundColor: secondaryColor }}
          >
            <ExternalLink className="h-4 w-4" />
            {t.live}
          </a>
          {(project.github || []).map((g) => (
            <a
              key={g}
              href={g}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm text-gray-200 hover:bg-white/5"
            >
              <Github className="h-4 w-4" />
              {t.code}
            </a>
          ))}
        </div>
      </div>
    </Reveal>
  );
};

const Projects = () => {
  const { language } = useLanguage();
  const { data } = useData();
  const t = COPY[language] || COPY.fr;

  return (
    <Section id="projects" index="02" title={t.title} subtitle={t.subtitle} doodle="screwdriver">
      <div className="space-y-16 sm:space-y-24">
        {(data?.projects || []).map((project, i) => (
          <ProjectRow key={project.id} project={project} reversed={i % 2 === 1} />
        ))}
      </div>
    </Section>
  );
};

export default Projects;
