import React, { useEffect, useRef, useState } from "react";
import { Palette, FileText, Power } from "lucide-react";
import { useColor } from "../../contexts/ColorContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useOS } from "../osContext";
import { APPS } from "../registry";

const Clock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="hidden font-mono text-xs text-gray-400 sm:inline">
      {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
    </span>
  );
};

const Taskbar = () => {
  const { secondaryColor, changeColor } = useColor();
  const { language, toggleLanguage } = useLanguage();
  const { windows, activeId, openApp, focusWindow, minimizeWindow, setMode } =
    useOS();
  const [menu, setMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const onTaskClick = (win) => {
    if (win.minimized) focusWindow(win.id);
    else if (activeId === win.id) minimizeWindow(win.id);
    else focusWindow(win.id);
  };

  return (
    <div className="absolute inset-x-0 bottom-0 z-[9999] flex h-11 items-center gap-2 border-t border-white/10 bg-[#0b0d13]/90 px-2 backdrop-blur-md">
      {/* start menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenu((m) => !m)}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold text-white hover:bg-white/10"
        >
          <span
            className="grid h-5 w-5 place-items-center rounded font-mono text-[11px] text-black"
            style={{ backgroundColor: secondaryColor }}
          >
            /
          </span>
          <span className="hidden font-mono sm:inline">creachOS</span>
        </button>

        {menu && (
          <div className="absolute bottom-12 left-0 w-56 overflow-hidden rounded-lg border border-white/10 bg-[#12141c]/98 p-1.5 shadow-2xl backdrop-blur-md">
            <div className="px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-gray-500">
              applications
            </div>
            {APPS.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.id}
                  onClick={() => {
                    openApp(a.id);
                    setMenu(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm text-gray-300 hover:bg-white/10"
                >
                  <Icon className="h-4 w-4" style={{ color: secondaryColor }} />
                  <span className="font-mono">{a.title}</span>
                </button>
              );
            })}
            <div className="my-1 border-t border-white/10" />
            <button
              onClick={() => {
                setMode("cv");
                setMenu(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm text-gray-300 hover:bg-white/10"
            >
              <FileText className="h-4 w-4 text-gray-400" />
              {language === "fr" ? "Basculer en Mode CV" : "Switch to CV mode"}
            </button>
          </div>
        )}
      </div>

      {/* open windows */}
      <div className="flex flex-1 items-center gap-1 overflow-x-auto">
        {windows.map((w) => {
          const Icon = w.icon;
          const on = activeId === w.id && !w.minimized;
          return (
            <button
              key={w.id}
              onClick={() => onTaskClick(w)}
              title={w.title}
              className={`flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-xs transition-colors ${
                on
                  ? "border-white/15 bg-white/10 text-white"
                  : "border-transparent text-gray-400 hover:bg-white/5"
              }`}
            >
              {Icon && (
                <Icon
                  className="h-3.5 w-3.5"
                  style={on ? { color: secondaryColor } : undefined}
                />
              )}
              <span className="hidden font-mono sm:inline">{w.title}</span>
            </button>
          );
        })}
      </div>

      {/* tray */}
      <div className="flex items-center gap-1">
        <button
          onClick={toggleLanguage}
          className="rounded-md px-2 py-1.5 font-mono text-xs text-gray-300 hover:bg-white/10"
          aria-label="Changer de langue"
        >
          {language.toUpperCase()}
        </button>
        <button
          onClick={changeColor}
          className="grid h-8 w-8 place-items-center rounded-md text-gray-300 hover:bg-white/10"
          aria-label="Changer la couleur d'accent"
        >
          <Palette className="h-4 w-4" style={{ color: secondaryColor }} />
        </button>
        <button
          onClick={() => setMode("cv")}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-black transition-transform hover:scale-[1.03]"
          style={{ backgroundColor: secondaryColor }}
        >
          <Power className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">
            {language === "fr" ? "Mode CV" : "CV mode"}
          </span>
        </button>
        <Clock />
      </div>
    </div>
  );
};

export default Taskbar;
