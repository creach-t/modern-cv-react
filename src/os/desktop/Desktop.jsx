import React, { useEffect } from "react";
import { useColor } from "../../contexts/ColorContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useOS } from "../osContext";
import { APPS } from "../registry";
import { APP_COMPONENTS } from "../apps/appComponents";
import Window from "./Window";
import Taskbar from "./Taskbar";

const Wallpaper = ({ accent }) => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-[#0a0b10]" />
    <div
      className="absolute inset-0 opacity-70"
      style={{
        background: `radial-gradient(900px 500px at 78% 12%, ${accent}26, transparent 60%), radial-gradient(700px 500px at 12% 88%, ${accent}1a, transparent 55%)`,
      }}
    />
    <div
      className="absolute inset-0 opacity-[0.06]"
      style={{
        backgroundImage:
          "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
        backgroundSize: "44px 44px",
      }}
    />
    <div
      className="absolute bottom-16 right-6 select-none font-mono text-[18vw] font-black leading-none tracking-tighter text-white/[0.02] sm:text-[12vw]"
      aria-hidden="true"
    >
      creachOS
    </div>
  </div>
);

const Desktop = () => {
  const { secondaryColor } = useColor();
  const { language } = useLanguage();
  const { windows, activeId, openApp } = useOS();

  // Ouvre le terminal au premier affichage pour ne pas laisser un bureau vide
  useEffect(() => {
    openApp("terminal");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#0a0b10] text-gray-100">
      <Wallpaper accent={secondaryColor} />

      {/* desktop icons */}
      <div className="absolute left-3 top-3 grid grid-cols-1 gap-1">
        {APPS.filter((a) => a.onDesktop).map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.id}
              onClick={() => openApp(a.id)}
              className="group flex w-20 flex-col items-center gap-1 rounded-lg p-2 text-center hover:bg-white/5 focus:bg-white/10 focus:outline-none"
            >
              <span
                className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] transition-transform group-hover:scale-105"
                style={{ boxShadow: `0 6px 20px -8px ${secondaryColor}55` }}
              >
                <Icon className="h-5 w-5" style={{ color: secondaryColor }} />
              </span>
              <span className="w-full truncate font-mono text-[10px] text-gray-300">
                {a.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* hint */}
      {windows.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="font-mono text-sm text-gray-600">
            {language === "fr"
              ? "cliquez une icône ou tapez `help` dans le terminal"
              : "click an icon or type `help` in the terminal"}
          </p>
        </div>
      )}

      {/* windows */}
      {windows.map((w) => {
        const Comp = APP_COMPONENTS[w.id];
        return (
          <Window key={w.id} win={w} active={activeId === w.id}>
            {Comp ? <Comp /> : null}
          </Window>
        );
      })}

      <Taskbar />
    </div>
  );
};

export default Desktop;
