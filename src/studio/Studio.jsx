import React, { useEffect, useState } from "react";
import { Github, Linkedin, TerminalSquare, FileDown } from "lucide-react";
import { useColor } from "../contexts/ColorContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useOS } from "../os/osContext";
import { downloadCV } from "./pdf";
import Nav from "./components/Nav";
import ScrollProgress from "./components/ScrollProgress";
import Ambiance from "./components/Ambiance";
import CursorGlow from "./components/CursorGlow";
import GearField from "./hero/GearField";
import Hero from "./hero/Hero";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Journey from "./sections/Journey";
import Skills from "./sections/Skills";
import Contact from "./sections/Contact";
import AssistantWidget from "./ai/AssistantWidget";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
];

const Studio = () => {
  const { secondaryColor } = useColor();
  const { language } = useLanguage();
  const { setMode } = useOS();
  const version = process.env.REACT_APP_VERSION || "dev";
  const [pdfBusy, setPdfBusy] = useState(false);

  const onDownloadCV = async () => {
    if (pdfBusy) return;
    setPdfBusy(true);
    try {
      await downloadCV(language, secondaryColor);
    } finally {
      setPdfBusy(false);
    }
  };

  // Easter egg : Konami code → creachOS
  useEffect(() => {
    let idx = 0;
    const onKey = (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      idx = key === KONAMI[idx] ? idx + 1 : key === KONAMI[0] ? 1 : 0;
      if (idx === KONAMI.length) {
        idx = 0;
        setMode("os");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setMode]);

  // Clin d'œil aux dev qui ouvrent la console
  useEffect(() => {
    console.log(
      "%c👋 Salut, curieux·se !",
      `color:${secondaryColor};font-size:16px;font-weight:bold`
    );
    console.log(
      "%cTu inspectes le code ? On devrait se parler → creach.t@gmail.com\nPsst : tape le Konami code (↑↑↓↓←→←→ B A) pour lancer creachOS 🖥️",
      "color:#94a3b8"
    );
  }, [secondaryColor]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05060a] text-gray-100">
      <GearField color={secondaryColor} />
      <Ambiance />
      <CursorGlow />
      <ScrollProgress />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Journey />
        <Skills />
        <Contact />
      </main>

      <footer className="relative z-10 border-t border-white/10 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <span
                className="grid h-7 w-7 place-items-center rounded-lg text-xs font-black text-black"
                style={{ backgroundColor: secondaryColor }}
              >
                TC
              </span>
              <span className="font-bold text-white">Théo Créach</span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              © {new Date().getFullYear()} · {language === "fr" ? "Fait main, auto-hébergé" : "Handcrafted, self-hosted"} ·{" "}
              <span className="font-mono">{version}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <a
              href="https://github.com/creach-t"
              target="_blank"
              rel="noreferrer"
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-gray-300 hover:bg-white/5"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com/in/creachtheo"
              target="_blank"
              rel="noreferrer"
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-gray-300 hover:bg-white/5"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <button
              onClick={onDownloadCV}
              disabled={pdfBusy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-300 hover:bg-white/5 disabled:opacity-50"
            >
              <FileDown className="h-3.5 w-3.5" />
              {pdfBusy
                ? language === "fr"
                  ? "Génération…"
                  : "Generating…"
                : language === "fr"
                ? "Télécharger le CV"
                : "Download CV"}
            </button>
            <button
              onClick={() => setMode("os")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-300 hover:bg-white/5"
            >
              <TerminalSquare className="h-3.5 w-3.5" style={{ color: secondaryColor }} />
              creachOS
            </button>
          </div>
        </div>
      </footer>

      <AssistantWidget />
    </div>
  );
};

export default Studio;
