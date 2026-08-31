import React, { useEffect, useRef } from "react";
import { ArrowDown, FolderGit2, Send } from "lucide-react";
import anime from "animejs";
import { useColor } from "../../contexts/ColorContext";
import { useLanguage } from "../../contexts/LanguageContext";
import Magnetic from "../components/Magnetic";
import TextScrim from "../components/TextScrim";

const COPY = {
  fr: {
    eyebrow: "Bonjour, moi c'est",
    role: "Développeur web full-stack",
    tagline:
      "Je conçois des applications React / Node et je les héberge de bout en bout, du premier commit à la mise en production. Arrivé au dev après un détour par le commerce, je démonte des machines depuis mes 10 ans : comprendre et construire, c'est une vieille histoire.",
    projects: "Voir mes projets",
    contact: "Me contacter",
    scroll: "Défiler",
  },
  en: {
    eyebrow: "Hi, I'm",
    role: "Full-stack web developer",
    tagline:
      "I build React / Node applications and host them end to end, from the first commit to production. I came to dev after a detour through retail, but I've been taking machines apart since I was 10 — the urge to understand and build has never left.",
    projects: "See my work",
    contact: "Get in touch",
    scroll: "Scroll",
  },
};

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const Hero = () => {
  const { secondaryColor } = useColor();
  const { language } = useLanguage();
  const t = COPY[language] || COPY.fr;
  const rootRef = useRef(null);

  useEffect(() => {
    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = rootRef.current?.querySelectorAll("[data-hero]");
    if (!items) return;
    if (reduce) {
      anime.set(items, { opacity: 1, translateY: 0 });
      return;
    }
    anime.set(items, { opacity: 0, translateY: 24 });
    anime({
      targets: items,
      opacity: [0, 1],
      translateY: [24, 0],
      delay: anime.stagger(120, { start: 250 }),
      duration: 800,
      easing: "easeOutCubic",
    });
  }, [language]);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      <TextScrim align="left" />

      {/* content (ombre portée sur le texte pour la lisibilité, sans voile noir) */}
      <div
        className="relative z-10 mx-auto w-full max-w-5xl px-6"
        style={{ textShadow: "0 1px 24px rgba(5,6,10,0.9)" }}
      >
        <p
          data-hero
          className="mb-3 font-mono text-sm tracking-wide"
          style={{ color: secondaryColor }}
        >
          {t.eyebrow}
        </p>
        <h1
          data-hero
          className="text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-7xl"
        >
          Théo Créach
        </h1>
        <p
          data-hero
          className="mt-3 text-2xl font-semibold text-gray-200 sm:text-3xl"
        >
          {t.role}
        </p>
        <p
          data-hero
          className="mt-5 max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg"
        >
          {t.tagline}
        </p>
        <div data-hero className="mt-8 flex flex-wrap gap-3">
          <Magnetic>
            <button
              onClick={() => scrollTo("projects")}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-black transition-colors hover:brightness-110"
              style={{ backgroundColor: secondaryColor }}
            >
              <FolderGit2 className="h-4 w-4" />
              {t.projects}
            </button>
          </Magnetic>
          <Magnetic>
            <button
              onClick={() => scrollTo("contact")}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5"
            >
              <Send className="h-4 w-4" />
              {t.contact}
            </button>
          </Magnetic>
        </div>
      </div>

      {/* scroll cue */}
      <button
        onClick={() => scrollTo("about")}
        aria-label={t.scroll}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-gray-500 hover:text-gray-300"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest">
          {t.scroll}
        </span>
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </button>
    </section>
  );
};

export default Hero;
