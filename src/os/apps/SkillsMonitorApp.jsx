import React, { useMemo, useState } from "react";
import { useColor } from "../../contexts/ColorContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useData } from "../data/DataContext";
import { Loading } from "./ui";

const LEVEL_LABEL = {
  fr: { 4: "expert", 3: "avancé", 2: "intermédiaire", 1: "notions" },
  en: { 4: "expert", 3: "advanced", 2: "intermediate", 1: "basics" },
};

const SkillsMonitorApp = () => {
  const { data } = useData();
  const { secondaryColor } = useColor();
  const { language } = useLanguage();
  const [cat, setCat] = useState(0);

  const categories = useMemo(() => data?.skills || [], [data]);

  const rows = useMemo(() => {
    const group = categories[cat];
    if (!group) return [];
    return group.skills
      .filter((s) => s.level >= 1)
      .sort((a, b) => b.level - a.level);
  }, [categories, cat]);

  if (!data) return <Loading label="starting system-monitor…" />;

  const totalActive = categories.reduce(
    (n, g) => n + g.skills.filter((s) => s.level >= 1).length,
    0
  );
  const avgLoad =
    rows.length > 0
      ? (rows.reduce((n, s) => n + s.level, 0) / rows.length / 4) * 100
      : 0;

  return (
    <div className="flex h-full flex-col font-mono text-sm">
      {/* top header */}
      <div className="shrink-0 border-b border-white/5 bg-black/20 px-4 py-2 text-xs text-gray-400">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>
            <span style={{ color: secondaryColor }}>top</span> — {totalActive}{" "}
            processes,{" "}
            <span className="text-gray-200">{rows.length}</span> running
          </span>
          <span>
            avg load{" "}
            <span style={{ color: secondaryColor }}>{avgLoad.toFixed(0)}%</span>
          </span>
        </div>
      </div>

      {/* category tabs */}
      <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-white/5 px-2 py-1.5">
        {categories.map((g, i) => (
          <button
            key={g.category}
            onClick={() => setCat(i)}
            className={`whitespace-nowrap rounded-md px-2.5 py-1 text-xs transition-colors ${
              i === cat ? "text-white" : "text-gray-500 hover:text-gray-300"
            }`}
            style={
              i === cat
                ? { backgroundColor: `${secondaryColor}22`, color: secondaryColor }
                : undefined
            }
          >
            {g.category}
          </button>
        ))}
      </div>

      {/* process table */}
      <div className="min-h-0 flex-1 overflow-auto px-3 py-2">
        <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 px-1 pb-1 text-[10px] uppercase tracking-wider text-gray-600">
          <span>pid</span>
          <span>process</span>
          <span>cpu</span>
        </div>
        {rows.map((s, i) => {
          const pct = (s.level / 4) * 100;
          return (
            <div
              key={s.name}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 rounded px-1 py-1 hover:bg-white/5"
            >
              <span className="text-gray-600">
                {String(1000 + cat * 100 + i).padStart(4, "0")}
              </span>
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-gray-200">{s.name}</span>
                  <span className="shrink-0 text-[10px] text-gray-500">
                    {LEVEL_LABEL[language]?.[s.level] || ""}
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full transition-[width] duration-700 ease-out"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: secondaryColor,
                      opacity: 0.55 + (s.level / 4) * 0.45,
                    }}
                  />
                </div>
              </div>
              <span className="tabular-nums text-gray-300">{pct.toFixed(0)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillsMonitorApp;
