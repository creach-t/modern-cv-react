import React, { useState } from "react";
import { ChevronLeft, Palette, FileText } from "lucide-react";
import { useColor } from "../../contexts/ColorContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useOS } from "../osContext";
import { APPS } from "../registry";
import { APP_COMPONENTS } from "../apps/appComponents";

const MobileShell = () => {
  const { secondaryColor, changeColor } = useColor();
  const { language, toggleLanguage } = useLanguage();
  const { setMode } = useOS();
  const [active, setActive] = useState(null);

  const app = APPS.find((a) => a.id === active);
  const Comp = active ? APP_COMPONENTS[active] : null;

  return (
    <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-[#0a0b10] text-gray-100">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(600px 400px at 80% 0%, ${secondaryColor}22, transparent 60%)`,
        }}
      />

      {/* status bar */}
      <div className="relative z-10 flex h-11 shrink-0 items-center justify-between border-b border-white/10 px-3">
        {active ? (
          <button
            onClick={() => setActive(null)}
            className="flex items-center gap-1 text-sm text-gray-300"
          >
            <ChevronLeft className="h-4 w-4" />
            {language === "fr" ? "Accueil" : "Home"}
          </button>
        ) : (
          <span className="flex items-center gap-1.5 font-mono text-sm font-semibold">
            <span
              className="grid h-5 w-5 place-items-center rounded text-[11px] text-black"
              style={{ backgroundColor: secondaryColor }}
            >
              /
            </span>
            creachOS
          </span>
        )}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleLanguage}
            className="rounded-md px-2 py-1 font-mono text-xs text-gray-300"
            aria-label="Langue"
          >
            {language.toUpperCase()}
          </button>
          <button
            onClick={changeColor}
            className="grid h-8 w-8 place-items-center rounded-md"
            aria-label="Couleur d'accent"
          >
            <Palette className="h-4 w-4" style={{ color: secondaryColor }} />
          </button>
        </div>
      </div>

      {/* content */}
      <div className="relative z-10 min-h-0 flex-1 overflow-auto">
        {active && Comp ? (
          <div className="min-h-full bg-[#12141c]">
            <div className="border-b border-white/5 px-4 py-2 font-mono text-xs text-gray-400">
              {app?.title}
            </div>
            <Comp />
          </div>
        ) : (
          <div className="p-4">
            <div className="mb-4 mt-2">
              <h1 className="text-xl font-bold">Théo Créach</h1>
              <p className="font-mono text-xs" style={{ color: secondaryColor }}>
                full-stack js developer · self-hoster
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {APPS.map((a) => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.id}
                    onClick={() => setActive(a.id)}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <span
                      className="grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]"
                      style={{ boxShadow: `0 8px 24px -10px ${secondaryColor}66` }}
                    >
                      <Icon className="h-6 w-6" style={{ color: secondaryColor }} />
                    </span>
                    <span className="w-full truncate text-center font-mono text-[10px] text-gray-300">
                      {a.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* dock */}
      <div className="relative z-10 shrink-0 border-t border-white/10 p-3">
        <button
          onClick={() => setMode("cv")}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-black"
          style={{ backgroundColor: secondaryColor }}
        >
          <FileText className="h-4 w-4" />
          {language === "fr" ? "Voir le CV classique" : "View classic résumé"}
        </button>
      </div>
    </div>
  );
};

export default MobileShell;
