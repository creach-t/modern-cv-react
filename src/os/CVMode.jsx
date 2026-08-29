import React from "react";
import { MonitorPlay } from "lucide-react";
import { useColor } from "../contexts/ColorContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useOS } from "./osContext";
import SettingPanel from "../components/SettingsPanel";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Skills from "../components/sections/Skills";
import Experience from "../components/sections/Experience";
import Education from "../components/sections/Education";
import Contact from "../components/contact/Contact";
import Project from "../components/sections/Project";
import SoftSkills from "../components/sections/SoftSkills";

/**
 * Mode CV : ancien layout, conservé tel quel comme vue lisible/imprimable.
 * Sert de fallback accessible pour les recruteurs pressés ou non-techniques.
 */
const CVMode = () => {
  const { isDark, secondaryColor } = useColor();
  const { language } = useLanguage();
  const { setMode } = useOS();

  return (
    <div className={`min-h-screen ${isDark ? "dark" : ""}`}>
      <div className="bg-white transition-colors duration-200 dark:bg-gray-900">
        <button
          onClick={() => setMode("os")}
          className="fixed right-4 top-4 z-[70] flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-black shadow-lg transition-transform hover:scale-[1.03]"
          style={{ backgroundColor: secondaryColor }}
        >
          <MonitorPlay className="h-4 w-4" />
          {language === "fr" ? "Ouvrir creachOS" : "Launch creachOS"}
        </button>

        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <Skills />
              <SoftSkills />
              <Project />
              <div className="hidden md:block">
                <Contact />
              </div>
            </div>
            <div>
              <Experience />
              <Education />
            </div>
          </div>
          <div className="mt-8 md:hidden">
            <Contact />
          </div>
        </main>
        <SettingPanel />
        <Footer />
      </div>
    </div>
  );
};

export default CVMode;
