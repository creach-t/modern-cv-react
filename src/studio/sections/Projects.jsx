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
    subtitle: "Chacun est né d'un besoin ou d'une envie. Tous sont en ligne, vous pouvez les essayer.",
    live: "Voir le site",
    code: "Code",
    wip: "En développement",
  },
  en: {
    title: "My work",
    subtitle: "Each one started from a real need or a genuine urge. They're all live, go ahead and try them.",
    live: "Live site",
    code: "Code",
    wip: "In progress",
  },
};

const ProjectRow = ({ project, reversed }) => {
  const { secondaryColor } = useColor();
  const { language } = useLanguage();
  const t = COPY[language] || COPY.fr;
  const loc = project[language] || project.fr;
  const base = `/img/projects/opt/${project.id}`;
  const webpSrcSet = `${base}-480.webp 480w, ${base}-800.webp 800w, ${base}-1200.webp 1200w`;
  const fallback = `${base}-1200.jpg`;

  return (
    <Reveal
      id={`project-${project.id}`}
      className="scroll-mt-24 grid items-center gap-6 md:grid-cols-2 md:gap-10"
    >
      {/* image */}
      <TiltCard className={reversed ? "md:order-2" : ""}>
        <a
          href={project.link}
          target="_blank"
          rel="noreferrer"
          className="group relative block overflow-hidden rounded-2xl border border-white/10"
        >
          {project.wip && (
            <span className="absolute left-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
              <span
                className="h-1.5 w-1.5 animate-pulse rounded-full"
                style={{ backgroundColor: secondaryColor }}
              />
              {t.wip}
            </span>
          )}
          <div
            className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ boxShadow: `inset 0 0 0 2px ${secondaryColor}` }}
          />
          <picture>
            <source type="image/webp" srcSet={webpSrcSet} sizes="(min-width: 768px) 46vw, 92vw" />
            <img
              src={fallback}
              alt={loc.label}
              loading="lazy"
              decoding="async"
              width="1200"
              height="750"
              className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </picture>
        </a>
      </TiltCard>

      {/* text */}
      <div className={reversed ? "md:order-1" : ""}>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-2xl font-bold text-white">{loc.label}</h3>
          {project.wip && (
            <span
              className="rounded-full border px-2 py-0.5 text-[11px] font-semibold"
              style={{
                color: secondaryColor,
                borderColor: `${secondaryColor}66`,
                backgroundColor: `${secondaryColor}14`,
              }}
            >
              {t.wip}
            </span>
          )}
        </div>
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
