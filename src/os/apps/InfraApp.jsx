import React, { useEffect, useRef, useState } from "react";
import { Check, GitBranch, ShieldCheck, Container, Globe } from "lucide-react";
import { useColor } from "../../contexts/ColorContext";
import { useLanguage } from "../../contexts/LanguageContext";

const PIPELINE = [
  { id: "test", label: "test", detail: "npm ci · jest · build" },
  { id: "build-image", label: "build-image", detail: "docker → ghcr.io" },
  { id: "deploy", label: "deploy", detail: "ssh vps · compose up" },
];

const SERVICES = [
  { icon: Globe, name: "traefik", detail: "v2.10 · reverse proxy · TLS" },
  { icon: Container, name: "nginx", detail: "1.25-alpine · :2585" },
  { icon: Container, name: "modern-cv-react", detail: "container · healthy" },
  { icon: ShieldCheck, name: "let's encrypt", detail: "certresolver · https" },
];

const Dot = ({ color }) => (
  <span className="relative flex h-2 w-2">
    <span
      className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
      style={{ backgroundColor: color }}
    />
    <span
      className="relative inline-flex h-2 w-2 rounded-full"
      style={{ backgroundColor: color }}
    />
  </span>
);

const InfraApp = () => {
  const { secondaryColor } = useColor();
  const { language } = useLanguage();
  const version = process.env.REACT_APP_VERSION || "dev";
  const green = "#28c840";

  const [pings, setPings] = useState([]);
  const nRef = useRef(0);

  useEffect(() => {
    const tick = () => {
      nRef.current += 1;
      const latency = 2 + Math.floor(Math.random() * 6);
      setPings((p) =>
        [
          { n: nRef.current, latency, ts: new Date().toLocaleTimeString() },
          ...p,
        ].slice(0, 4)
      );
    };
    tick();
    const id = setInterval(tick, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="p-5 font-mono text-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-200">
          <Dot color={green} />
          <span className="font-semibold">creachtheo.fr</span>
          <span className="text-xs text-gray-500">· {language === "fr" ? "en ligne" : "online"}</span>
        </div>
        <span className="rounded-md border border-white/10 px-2 py-0.5 text-[11px] text-gray-400">
          {version}
        </span>
      </div>

      {/* CI/CD pipeline */}
      <div className="mt-4">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-gray-500">
          <GitBranch className="h-3 w-3" /> github actions · push → main
        </div>
        <div className="flex items-stretch gap-1.5">
          {PIPELINE.map((stage, i) => (
            <React.Fragment key={stage.id}>
              <div className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className="grid h-4 w-4 place-items-center rounded-full"
                    style={{ backgroundColor: green }}
                  >
                    <Check className="h-2.5 w-2.5 text-black" />
                  </span>
                  <span className="text-xs text-gray-200">{stage.label}</span>
                </div>
                <div className="mt-1 text-[10px] text-gray-500">{stage.detail}</div>
              </div>
              {i < PIPELINE.length - 1 && (
                <div className="flex items-center text-gray-600">→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* services */}
      <div className="mt-4">
        <div className="mb-2 text-[11px] uppercase tracking-wider text-gray-500">
          docker · traefik-public
        </div>
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.name}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2"
              >
                <Icon className="h-4 w-4" style={{ color: secondaryColor }} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs text-gray-200">{s.name}</div>
                  <div className="truncate text-[10px] text-gray-500">
                    {s.detail}
                  </div>
                </div>
                <Dot color={green} />
              </div>
            );
          })}
        </div>
      </div>

      {/* live healthcheck */}
      <div className="mt-4 rounded-lg border border-white/10 bg-black/30 p-3">
        <div className="mb-1.5 text-[11px] uppercase tracking-wider text-gray-500">
          healthcheck · curl -f /health
        </div>
        <div className="space-y-0.5 text-xs">
          {pings.map((p) => (
            <div key={p.n} className="flex items-center gap-2 text-gray-400">
              <span className="text-gray-600">{p.ts}</span>
              <span>GET /health</span>
              <span style={{ color: green }}>200 OK</span>
              <span className="text-gray-600">· {p.latency}ms</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfraApp;
