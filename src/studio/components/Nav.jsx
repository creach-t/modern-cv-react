import React, { useEffect, useState } from "react";
import { Menu, X, Palette } from "lucide-react";
import { useColor } from "../../contexts/ColorContext";
import { useLanguage } from "../../contexts/LanguageContext";
import useDeviceTier from "../hooks/useDeviceTier";

const LINKS = [
  { id: "about", fr: "À propos", en: "About" },
  { id: "projects", fr: "Projets", en: "Work" },
  { id: "journey", fr: "Parcours", en: "Journey" },
  { id: "skills", fr: "Compétences", en: "Skills" },
  { id: "contact", fr: "Contact", en: "Contact" },
];

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const Nav = () => {
  const { secondaryColor, changeColor } = useColor();
  const { language, toggleLanguage } = useLanguage();
  const { fx } = useDeviceTier();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    setOpen(false);
    scrollTo(id);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? fx.navBlur
            ? "border-b border-white/10 bg-[#05060a]/85 backdrop-blur-md"
            : "border-b border-white/10 bg-[#05060a]/95" // opaque : évite le backdrop-filter live
          : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2"
        >
          <span
            className="grid h-8 w-8 place-items-center rounded-lg text-sm font-black text-black"
            style={{ backgroundColor: secondaryColor }}
          >
            TC
          </span>
          <span className="font-bold text-white">Théo Créach</span>
        </button>

        {/* desktop links */}
        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:text-white"
            >
              {l[language] || l.fr}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleLanguage}
            className="rounded-lg px-2 py-1.5 font-mono text-xs text-gray-300 hover:bg-white/10"
            aria-label="Changer de langue"
          >
            {language.toUpperCase()}
          </button>
          <button
            onClick={changeColor}
            className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white/10"
            aria-label="Changer la couleur d'accent"
          >
            <Palette className="h-4 w-4" style={{ color: secondaryColor }} />
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-8 w-8 place-items-center rounded-lg text-gray-200 hover:bg-white/10 md:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* mobile panel */}
      {open && (
        <div
          className={`border-t border-white/10 px-6 py-3 md:hidden ${
            fx.navBlur ? "bg-[#05060a]/95 backdrop-blur-md" : "bg-[#05060a]"
          }`}
        >
          <nav className="flex flex-col">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="rounded-lg px-2 py-2.5 text-left text-sm text-gray-200 hover:bg-white/5"
              >
                {l[language] || l.fr}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Nav;
