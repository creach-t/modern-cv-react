import React from "react";
import { Mail, Linkedin, Github, MapPin } from "lucide-react";
import { useColor } from "../../contexts/ColorContext";
import { useLanguage } from "../../contexts/LanguageContext";
import Section from "../components/Section";
import Reveal from "../components/Reveal";
import Magnetic from "../components/Magnetic";
import { useContactOverlay } from "../contact/ContactOverlay";

const COPY = {
  fr: {
    title: "Contact",
    available: "Disponible pour un poste",
    heading: "Travaillons ensemble.",
    text: "Un poste, une mission ou simplement une question ? Écrivez-moi, je réponds vite.",
    email: "M'écrire",
  },
  en: {
    title: "Contact",
    available: "Available for a job",
    heading: "Let's work together.",
    text: "A role, a mission or just a question? Drop me a line, I reply fast.",
    email: "Email me",
  },
};

const LINKS = [
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/creachtheo" },
  { icon: Github, label: "GitHub", href: "https://github.com/creach-t" },
];

const Contact = () => {
  const { secondaryColor } = useColor();
  const { language } = useLanguage();
  const { openContact } = useContactOverlay();
  const t = COPY[language] || COPY.fr;

  return (
    <Section id="contact" index="05" title={t.title} doodle="leaf">
      <Reveal className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-12">
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
          style={{ color: secondaryColor, backgroundColor: `${secondaryColor}1c` }}
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: secondaryColor }}
          />
          {t.available}
        </span>

        <h3 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
          {t.heading}
        </h3>
        <p className="mt-3 max-w-lg text-base text-gray-400">{t.text}</p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Magnetic>
            <button
              onClick={openContact}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-black transition-colors hover:brightness-110"
              style={{ backgroundColor: secondaryColor }}
            >
              <Mail className="h-4 w-4" />
              {t.email}
            </button>
          </Magnetic>
          {LINKS.map((l) => {
            const Icon = l.icon;
            return (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:bg-white/5"
              >
                <Icon className="h-4 w-4" />
                {l.label}
              </a>
            );
          })}
        </div>

        <div className="mt-6 flex items-center gap-1.5 text-sm text-gray-500">
          <MapPin className="h-4 w-4" />
          Saint-Maur-des-Fossés, Île-de-France · full remote
        </div>
      </Reveal>
    </Section>
  );
};

export default Contact;
