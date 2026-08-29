import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useColor } from "../../../contexts/ColorContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useData } from "../../data/DataContext";
import { useOS } from "../../osContext";

const APP_IDS = [
  "projects",
  "skills",
  "experience",
  "education",
  "infra",
  "about",
  "contact",
];

let LINE_ID = 0;
const nextId = () => ++LINE_ID;

const Terminal = () => {
  const { secondaryColor, changeColor, setColorByName, isDark, setIsDark } =
    useColor();
  const { language, changeLanguage } = useLanguage();
  const { data } = useData();
  const { openApp, setMode } = useOS();

  const version = process.env.REACT_APP_VERSION || "dev";
  const projects = useMemo(() => data?.projects || [], [data]);
  const projectIds = useMemo(() => projects.map((p) => p.id), [projects]);

  const commandNames = useMemo(
    () => [
      "help",
      "whoami",
      "ls",
      "cat",
      "open",
      "skills",
      "experience",
      "education",
      "projects",
      "infra",
      "status",
      "contact",
      "cv",
      "color",
      "theme",
      "lang",
      "neofetch",
      "clear",
      "sudo",
      "matrix",
      "echo",
      "date",
    ],
    []
  );

  const prompt = useMemo(
    () => (
      <span>
        <span style={{ color: secondaryColor }}>theo@creachOS</span>
        <span className="text-gray-500">:</span>
        <span className="text-sky-400">~</span>
        <span className="text-gray-500">$ </span>
      </span>
    ),
    [secondaryColor]
  );

  const banner = useMemo(
    () => [
      <span className="text-gray-400" key="b1">
        creachOS {version} — {language === "fr" ? "session interactive" : "interactive session"}
      </span>,
      <span className="text-gray-500" key="b2">
        {language === "fr"
          ? "Tape `help` pour la liste des commandes. `open projects` pour explorer."
          : "Type `help` for commands. `open projects` to explore."}
      </span>,
    ],
    [version, language]
  );

  const [lines, setLines] = useState(() =>
    banner.map((node) => ({ id: nextId(), node }))
  );
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [, setHistIdx] = useState(-1);
  const inputRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  const push = useCallback((nodes) => {
    const arr = Array.isArray(nodes) ? nodes : [nodes];
    setLines((prev) => [
      ...prev,
      ...arr.map((node) => ({ id: nextId(), node })),
    ]);
  }, []);

  const echo = useCallback(
    (raw) =>
      push(
        <span>
          {prompt}
          <span className="text-gray-200">{raw}</span>
        </span>
      ),
    [push, prompt]
  );

  const openTarget = useCallback(
    (target) => {
      if (!target) return `usage: open <app|project> (${APP_IDS.join(", ")})`;
      if (target === "cv") {
        setMode("cv");
        return "→ switching to CV mode…";
      }
      if (APP_IDS.includes(target) || target === "terminal") {
        openApp(target);
        return `→ opening ${target}.app`;
      }
      const proj = projects.find((p) => p.id === target);
      if (proj) {
        window.open(proj.link, "_blank", "noopener");
        return `→ launching ${target} (${proj.link})`;
      }
      const contact = (data?.contacts || []).find(
        (c) => c.label.toLowerCase() === target
      );
      if (contact) {
        window.open(contact.link, "_blank", "noopener");
        return `→ opening ${contact.label}`;
      }
      return `open: '${target}' not found`;
    },
    [openApp, setMode, projects, data]
  );

  const run = useCallback(
    (raw) => {
      const trimmed = raw.trim();
      if (!trimmed) return;
      echo(raw);
      const [cmd, ...args] = trimmed.split(/\s+/);
      const arg = args[0]?.toLowerCase();

      switch (cmd.toLowerCase()) {
        case "help":
          push([
            <span className="text-gray-300" key="h">
              {language === "fr" ? "Commandes disponibles :" : "Available commands:"}
            </span>,
            <div className="grid grid-cols-2 gap-x-4 text-gray-400 sm:grid-cols-3" key="hg">
              {[
                "help", "whoami", "ls", "cat <id>", "open <id>", "projects",
                "skills", "experience", "education", "infra", "contact", "cv",
                "color [name]", "theme", "lang <fr|en>", "neofetch", "clear", "sudo hire",
              ].map((c) => (
                <span key={c}>
                  <span style={{ color: secondaryColor }}>{c.split(" ")[0]}</span>
                  {c.includes(" ") ? " " + c.split(" ").slice(1).join(" ") : ""}
                </span>
              ))}
            </div>,
          ]);
          break;

        case "whoami":
          push(
            <span className="text-gray-300">
              théo créach — {language === "fr" ? "développeur full-stack js, self-hoster" : "full-stack js developer, self-hoster"}. `open about` ↵
            </span>
          );
          break;

        case "ls":
        case "projects":
          if (cmd.toLowerCase() === "projects" || arg === "projects" || !arg) {
            push(
              <div className="text-gray-300">
                {projects.map((p) => (
                  <div key={p.id}>
                    <span style={{ color: secondaryColor }}>{p.id}</span>
                    <span className="text-gray-500">/ — {(p[language] || p.fr).value}</span>
                  </div>
                ))}
              </div>
            );
          } else {
            push(<span className="text-gray-400">apps: {APP_IDS.join("  ")}</span>);
          }
          break;

        case "cat": {
          const p = projects.find((x) => x.id === arg);
          if (!p) {
            push(<span className="text-red-400">cat: {arg || ""}: No such file</span>);
            break;
          }
          const loc = p[language] || p.fr;
          push([
            <span className="font-semibold" style={{ color: secondaryColor }} key="t">
              {loc.label}
            </span>,
            <span className="text-gray-300" key="d">{loc.description}</span>,
            <span className="text-gray-500" key="s">stack: {p.technologies.join(", ")}</span>,
            <span className="text-gray-500" key="l">live: {p.link} · `open {p.id}`</span>,
          ]);
          break;
        }

        case "open":
          push(<span className="text-gray-300">{openTarget(arg)}</span>);
          break;

        case "skills":
        case "experience":
        case "education":
        case "infra":
        case "contact":
        case "about":
          push(<span className="text-gray-300">{openTarget(cmd.toLowerCase())}</span>);
          break;

        case "status":
          push(<span className="text-gray-300">{openTarget("infra")}</span>);
          break;

        case "cv":
          setMode("cv");
          push(<span className="text-gray-300">→ switching to CV mode…</span>);
          break;

        case "color":
          if (arg) {
            const ok = setColorByName(args.join(" "));
            push(
              <span className="text-gray-300">
                {ok ? `→ accent set to ${args.join(" ")}` : `color: '${args.join(" ")}' not in palette — randomizing`}
              </span>
            );
            if (!ok) changeColor();
          } else {
            const c = changeColor();
            push(<span className="text-gray-300">→ accent randomized: {c.name}</span>);
          }
          break;

        case "theme":
          setIsDark();
          push(<span className="text-gray-300">→ theme: {isDark ? "light" : "dark"}</span>);
          break;

        case "lang":
          if (arg === "fr" || arg === "en") {
            changeLanguage(arg);
            push(<span className="text-gray-300">→ language: {arg}</span>);
          } else {
            push(<span className="text-gray-400">usage: lang &lt;fr|en&gt;</span>);
          }
          break;

        case "neofetch":
          push(
            <pre className="whitespace-pre leading-tight text-gray-300">
{`      ___       theo@creachOS
     /   \\      ---------------
    | ${"◍".padEnd(1)} |     `}<span style={{ color: secondaryColor }}>OS</span>{`     creachOS ${version}
    | ___ |     `}<span style={{ color: secondaryColor }}>Host</span>{`   creachtheo.fr
     \\___/      `}<span style={{ color: secondaryColor }}>Shell</span>{`  creach-sh
                `}<span style={{ color: secondaryColor }}>Stack</span>{`  React · Node · Docker
                `}<span style={{ color: secondaryColor }}>Infra</span>{`  VPS · Traefik · CI/CD`}
            </pre>
          );
          break;

        case "echo":
          push(<span className="text-gray-300">{args.join(" ")}</span>);
          break;

        case "date":
          push(<span className="text-gray-300">{new Date().toString()}</span>);
          break;

        case "clear":
          setLines([]);
          break;

        case "sudo":
          if (args.join(" ").toLowerCase().includes("hire")) {
            push([
              <span style={{ color: secondaryColor }} key="s1">
                [sudo] {language === "fr" ? "permission accordée ✓" : "permission granted ✓"}
              </span>,
              <span className="text-gray-300" key="s2">
                {language === "fr"
                  ? "Excellente décision. → creach.t@gmail.com · `open linkedin`"
                  : "Great choice. → creach.t@gmail.com · `open linkedin`"}
              </span>,
            ]);
          } else {
            push(<span className="text-gray-400">{language === "fr" ? "sudo: on se calme 😄 essaie `sudo hire`" : "sudo: nice try 😄 try `sudo hire`"}</span>);
          }
          break;

        case "matrix":
          push(
            <span className="text-green-400">
              {Array.from({ length: 48 }, () =>
                String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96))
              ).join("")}
            </span>
          );
          break;

        default:
          push(
            <span className="text-red-400">
              {cmd}: command not found — {language === "fr" ? "tape `help`" : "type `help`"}
            </span>
          );
      }
    },
    [
      echo, push, language, secondaryColor, projects, openTarget, setMode,
      setColorByName, changeColor, setIsDark, isDark, changeLanguage, version,
    ]
  );

  const complete = useCallback(() => {
    const parts = input.split(/\s+/);
    if (parts.length <= 1) {
      const m = commandNames.filter((c) => c.startsWith(parts[0]));
      if (m.length === 1) setInput(m[0] + " ");
      else if (m.length > 1) push(<span className="text-gray-500">{m.join("  ")}</span>);
    } else {
      const last = parts[parts.length - 1];
      const pool = [...projectIds, ...APP_IDS, "cv"];
      const m = pool.filter((c) => c.startsWith(last));
      if (m.length === 1) {
        parts[parts.length - 1] = m[0];
        setInput(parts.join(" ") + " ");
      } else if (m.length > 1) {
        push(<span className="text-gray-500">{m.join("  ")}</span>);
      }
    }
  }, [input, commandNames, projectIds, push]);

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      run(input);
      if (input.trim()) {
        setHistory((h) => [input, ...h]);
      }
      setHistIdx(-1);
      setInput("");
    } else if (e.key === "Tab") {
      e.preventDefault();
      complete();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHistIdx((i) => {
        const ni = Math.min(i + 1, history.length - 1);
        if (history[ni] !== undefined) setInput(history[ni]);
        return ni;
      });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHistIdx((i) => {
        const ni = Math.max(i - 1, -1);
        setInput(ni === -1 ? "" : history[ni] || "");
        return ni;
      });
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div
      className="h-full bg-[#0b0d13] p-3 font-mono text-[13px] leading-relaxed"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex min-h-full flex-col">
        <div className="flex-1 space-y-0.5">
          {lines.map((l) => (
            <div key={l.id} className="break-words">
              {l.node}
            </div>
          ))}
        </div>
        <div className="mt-1 flex items-center">
          {prompt}
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            aria-label="Terminal input"
            className="ml-1 flex-1 border-none bg-transparent text-gray-100 outline-none"
            style={{ caretColor: secondaryColor }}
          />
        </div>
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default Terminal;
