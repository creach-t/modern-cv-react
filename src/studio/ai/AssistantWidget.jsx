import React, { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, X, Send, Bot, Trash2, Check, Play } from "lucide-react";
import { useColor } from "../../contexts/ColorContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useOS } from "../../os/osContext";
import { useData } from "../../os/data/DataContext";
import { streamChat, isAIConfigured } from "./aiClient";
import {
  buildSystemPrompt,
  INTROS,
  SUGGESTION_POOL,
  ACTION_SECTIONS,
  CONFIRM_ACTIONS,
} from "./persona";
import { downloadCV } from "../pdf";
import { useContactOverlay } from "../contact/ContactOverlay";

const MAX_INPUT = 500;
const MAX_HISTORY = 8;
const STORE_MAX = 40;
const STORAGE_KEY = "studio_chat_v1";
const ACTION_RE = /\[\[do:([a-z_]+)(?::([a-z]+))?\]\]/gi;
const PLAN_RE = /\[\[plan:([^\]]+)\]\]/i;
const TOUR_RE = /\[\[do:tour\]\]/i;
const KNOWN = ["launch_os", "goto", "color", "download_cv", "lang", "email"];
// Non invasives : exécutées directement si demandées seules (pas de bouton).
const NON_INVASIVE = ["goto", "project", "color", "lang", "email"];
const ROLES = ["user", "assistant", "action"];

// noms de couleurs → hex (mot unique, fr + en)
const COLOR_NAMES = {
  mauve: "#B57EDC", violet: "#7C3AED", purple: "#7C3AED",
  bleu: "#2563EB", blue: "#2563EB", ciel: "#38BDF8", sky: "#38BDF8",
  rouge: "#DC2626", red: "#DC2626", vert: "#16A34A", green: "#16A34A",
  orange: "#F97316", rose: "#EC4899", pink: "#EC4899",
  jaune: "#EAB308", yellow: "#EAB308", cyan: "#06B6D4", turquoise: "#06B6D4",
  indigo: "#6366F1", corail: "#FF6F61", coral: "#FF6F61",
  magenta: "#D946EF", or: "#D4AF37", gold: "#D4AF37",
  emeraude: "#10B981", emerald: "#10B981",
};

const TOUR_NOTES = {
  fr: {
    about: "Voici son histoire — une reconversion peu banale, du commerce au code.",
    projects: "Ses projets, tous en ligne et cliquables. Jette un œil à VectoKid.",
    journey: "Son parcours et sa formation, étape par étape.",
    skills: "Les technos qu'il manie au quotidien.",
    contact: "Et si le profil te parle, c'est ici qu'on se rencontre 👇",
  },
  en: {
    about: "Here's his story — an unusual switch, from retail to code.",
    projects: "His projects, all live and clickable. Check out VectoKid.",
    journey: "His path and training, step by step.",
    skills: "The tech he uses day to day.",
    contact: "And if the profile clicks, this is where we meet 👇",
  },
};

const GENERIC_NOTES = {
  fr: { goto: "Et voilà 👍", project: "Jette un œil 👀", visit: "Ça s'ouvre dans un onglet 🔗", color: "Nouvelle ambiance 🎨", launch_os: "Bienvenue côté dev 🖥️", download_cv: "C'est parti pour le PDF 📄", lang: "Langue changée 🌐", email: "À toi de jouer ✉️" },
  en: { goto: "There we go 👍", project: "Have a look 👀", visit: "Opening in a tab 🔗", color: "New vibe 🎨", launch_os: "Welcome to dev side 🖥️", download_cv: "PDF on its way 📄", lang: "Language switched 🌐", email: "Over to you ✉️" },
};

const stripActions = (text = "") =>
  text
    .replace(/\[\[plan:[^\]]*\]\]/gi, "")
    .replace(/\[\[do:[^\]]*\]\]/gi, "")
    .replace(/\[\[[^\]]*$/i, "")
    .replace(/[ \t]+\n/g, "\n")
    .trim();

// Étapes d'un plan : chaque item = "action[:arg] | note perso" (note optionnelle).
const parseSteps = (full, projectIds = []) => {
  let raw = [];
  const pm = full.match(PLAN_RE);
  if (pm) raw = pm[1].split(";");
  else {
    ACTION_RE.lastIndex = 0;
    let m;
    while ((m = ACTION_RE.exec(full))) raw.push(m[1] + (m[2] ? ":" + m[2] : ""));
  }
  return raw
    .map((s) => {
      const [left, ...rest] = s.split("|");
      // note = phrase seule : on retire tout résidu d'action (do:xxx, |, tags)
      const note =
        rest
          .join(" ")
          .replace(/\[\[[^\]]*\]\]/g, "")
          .replace(/\bdo:[a-z_]+(?::[a-z0-9-]+)?/gi, "")
          .replace(/\s{2,}/g, " ")
          .trim() || undefined;
      const [name, arg] = left.trim().toLowerCase().split(":");
      return { name, arg, note };
    })
    .filter((s) =>
      s.name === "project" || s.name === "visit"
        ? projectIds.includes(s.arg)
        : KNOWN.includes(s.name) &&
          (s.name !== "goto" || ACTION_SECTIONS.includes(s.arg)) &&
          (s.name !== "lang" || ["fr", "en"].includes(s.arg))
    )
    .slice(0, 6);
};

// section actuellement à l'écran (pour un tour qui part de la position réelle)
const currentSectionId = () => {
  const mid = window.innerHeight / 2;
  let cur = null;
  for (const id of ACTION_SECTIONS) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= mid) cur = id;
  }
  return cur;
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickN = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);

const loadHistory = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((m) => m && ROLES.includes(m.role) && typeof m.content === "string")
      .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))
      .slice(-STORE_MAX);
  } catch {
    return [];
  }
};
const saveHistory = (messages) => {
  try {
    const clean = messages
      .filter((m) => m.content && ROLES.includes(m.role))
      .slice(-STORE_MAX)
      .map((m) => ({ role: m.role, content: String(m.content).slice(0, 2000) }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
  } catch {
    /* ignore */
  }
};

const COPY = {
  fr: {
    fab: "Discuter avec mon IA",
    title: "L'assistant de Théo",
    subtitle: "Malin, concis — et il pilote la page",
    placeholder: "Votre question…",
    clear: "Effacer la discussion",
    confirm: "Confirmer",
    cancel: "Annuler",
    cancelled: "✖️ Annulé",
    stop: "arrêter le parcours",
    offline: "Assistant hors-ligne. Le plus simple : creach.t@gmail.com — Théo répond vite !",
    confirmText: {
      download_cv: "Télécharger le CV de Théo en PDF ?",
      email: "Ouvrir votre messagerie pour écrire à Théo ?",
    },
    sections: { about: "À propos", projects: "Projets", journey: "Parcours", skills: "Compétences", contact: "Contact" },
    errors: {
      quota: "Beaucoup de monde là 😅 réessayez dans un instant.",
      auth: "Assistant indisponible. Contact direct : creach.t@gmail.com",
      unavailable: "Le modèle fait une pause. Réessayez bientôt.",
      error: "Aïe, un souci. Réessayez ou écrivez à creach.t@gmail.com",
    },
  },
  en: {
    fab: "Chat with my AI",
    title: "Théo's assistant",
    subtitle: "Sharp, concise — and it drives the page",
    placeholder: "Your question…",
    clear: "Clear conversation",
    confirm: "Confirm",
    cancel: "Cancel",
    cancelled: "✖️ Cancelled",
    stop: "stop the tour",
    offline: "Assistant offline. Easiest: creach.t@gmail.com — Théo replies fast!",
    confirmText: {
      download_cv: "Download Théo's CV as PDF?",
      email: "Open your email app to write to Théo?",
    },
    sections: { about: "About", projects: "Work", journey: "Journey", skills: "Skills", contact: "Contact" },
    errors: {
      quota: "Busy right now 😅 try again in a moment.",
      auth: "Assistant unavailable. Direct contact: creach.t@gmail.com",
      unavailable: "The model is taking a break. Try again soon.",
      error: "Oops, something broke. Try again or email creach.t@gmail.com",
    },
  },
};

const AssistantWidget = () => {
  const { secondaryColor, changeColor, setSecondaryColor, saveUserColor } = useColor();
  const { language, changeLanguage } = useLanguage();
  const { setMode } = useOS();
  const { data } = useData();
  const { openContact } = useContactOverlay();
  const t = COPY[language] || COPY.fr;

  const projectIds = useMemo(() => (data?.projects || []).map((p) => p.id), [data]);
  const projectLabel = (id) => {
    const p = (data?.projects || []).find((x) => x.id === id);
    return p ? (p[language] || p.fr).label : id;
  };
  const currentColorName = () => {
    const hex = (secondaryColor || "").toLowerCase();
    const found = Object.entries(COLOR_NAMES).find(([, v]) => v.toLowerCase() === hex);
    return found ? found[0] : secondaryColor;
  };

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(loadHistory);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(null); // { name, arg, flow?, note? }
  const [flow, setFlow] = useState(null); // { steps:[{name,arg,note}], index }
  const [intro, setIntro] = useState(() => pick(INTROS.fr));
  const [suggestions, setSuggestions] = useState(() => pickN(SUGGESTION_POOL.fr, 4));
  const abortRef = useRef(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const hasChat = useMemo(
    () => messages.some((m) => m.role === "user" || m.role === "assistant"),
    [messages]
  );

  const refresh = React.useCallback(() => {
    setIntro(pick(INTROS[language] || INTROS.fr));
    setSuggestions(pickN(SUGGESTION_POOL[language] || SUGGESTION_POOL.fr, 4));
  }, [language]);

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => {
    if (open && !hasChat) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open, pending, flow]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 150); }, [open]);
  useEffect(() => saveHistory(messages), [messages]);
  useEffect(() => () => abortRef.current?.abort(), []);

  const pushAction = (label) =>
    label && setMessages((m) => [...m, { role: "action", content: label }]);
  const pushNote = (text) =>
    text && setMessages((m) => [...m, { role: "assistant", content: text }]);

  const actionLabel = (name, arg) => {
    switch (name) {
      case "launch_os": return language === "fr" ? "🖥️ creachOS lancé" : "🖥️ creachOS launched";
      case "goto": return `🧭 ${t.sections[arg] || arg}`;
      case "project": return `🔎 ${projectLabel(arg)}`;
      case "visit": return `🔗 ${projectLabel(arg)}`;
      case "color": return language === "fr" ? "🎨 Couleur mise à jour" : "🎨 Color updated";
      case "download_cv": return language === "fr" ? "📄 CV téléchargé" : "📄 CV downloaded";
      case "lang": return `🌐 ${(arg || "").toUpperCase()}`;
      case "email": return language === "fr" ? "✉️ Email ouvert" : "✉️ Email opened";
      default: return null;
    }
  };

  const stepLabel = (s) => {
    switch (s.name) {
      case "launch_os": return language === "fr" ? "Lancer creachOS" : "Launch creachOS";
      case "goto": return (language === "fr" ? "Aller à " : "Go to ") + (t.sections[s.arg] || s.arg);
      case "project": return (language === "fr" ? "Voir " : "See ") + projectLabel(s.arg);
      case "visit": return (language === "fr" ? "Ouvrir le site de " : "Open ") + projectLabel(s.arg);
      case "color": return language === "fr" ? "Changer la couleur" : "Change the color";
      case "download_cv": return language === "fr" ? "Télécharger le CV" : "Download the CV";
      case "lang": return (language === "fr" ? "Passer en " : "Switch to ") + (s.arg || "").toUpperCase();
      case "email": return language === "fr" ? "Ouvrir l'email" : "Open email";
      default: return s.name;
    }
  };

  const runAction = (name, arg, opts = {}) => {
    switch (name) {
      case "launch_os": setMode("os"); break;
      case "goto":
        if (ACTION_SECTIONS.includes(arg))
          document.getElementById(arg)?.scrollIntoView({ behavior: "smooth" });
        break;
      case "project":
        document.getElementById(`project-${arg}`)?.scrollIntoView({ behavior: "smooth" });
        break;
      case "visit": {
        const p = (data?.projects || []).find((x) => x.id === arg);
        if (p?.link) window.open(p.link, "_blank", "noopener,noreferrer");
        break;
      }
      case "color": {
        const hex = arg && COLOR_NAMES[arg];
        if (hex) { setSecondaryColor(hex); saveUserColor(hex); }
        else changeColor();
        break;
      }
      case "download_cv": downloadCV(language, secondaryColor); break;
      case "lang": if (arg === "fr" || arg === "en") changeLanguage(arg); break;
      case "email": openContact?.(); break;
      default: return;
    }
    if (!opts.silent) pushAction(actionLabel(name, arg));
  };

  const buildTour = () => {
    const cur = currentSectionId();
    const start = cur ? ACTION_SECTIONS.indexOf(cur) + 1 : 0;
    let ids = ACTION_SECTIONS.slice(start);
    if (ids.length === 0) ids = ACTION_SECTIONS.slice();
    const notes = TOUR_NOTES[language] || TOUR_NOTES.fr;
    return ids.map((id) => ({ name: "goto", arg: id, note: notes[id] }));
  };

  const advanceFlow = () =>
    setFlow((f) => {
      if (!f) return null;
      const ni = f.index + 1;
      return ni >= f.steps.length ? null : { ...f, index: ni };
    });

  const doFlowStep = () => {
    if (!flow) return;
    const s = flow.steps[flow.index];
    if (CONFIRM_ACTIONS.includes(s.name)) {
      setPending({ ...s, flow: true });
      return;
    }
    runAction(s.name, s.arg); // laisse une pastille (trace de l'action)
    pushNote(s.note);
    advanceFlow();
  };

  const confirmPending = () => {
    if (!pending) return;
    runAction(pending.name, pending.arg); // pastille = trace de l'action
    if (pending.flow) { pushNote(pending.note); advanceFlow(); }
    setPending(null);
  };
  const cancelPending = () => {
    pushAction(t.cancelled);
    if (pending?.flow) advanceFlow();
    setPending(null);
  };

  const send = async (text) => {
    const content = (text ?? input).replace(ACTION_RE, "").trim().slice(0, MAX_INPUT);
    if (!content || loading) return;
    setInput("");
    setPending(null);
    setFlow(null);

    if (!isAIConfigured()) {
      setMessages((m) => [...m, { role: "user", content }, { role: "assistant", content: t.offline }]);
      return;
    }

    const history = [...messages, { role: "user", content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const apiMessages = [
      { role: "system", content: buildSystemPrompt(data, language, { color: currentColorName() }) },
      ...history
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-MAX_HISTORY)
        .map((m) => ({ role: m.role, content: stripActions(m.content) })),
    ];

    try {
      const full = await streamChat({
        messages: apiMessages,
        signal: controller.signal,
        onToken: (tok) => {
          setMessages((m) => {
            const next = [...m];
            const last = next[next.length - 1];
            if (last?.role === "assistant") next[next.length - 1] = { ...last, content: last.content + tok };
            return next;
          });
        },
      });

      setMessages((m) => {
        const next = [...m];
        const last = next[next.length - 1];
        if (last?.role === "assistant") next[next.length - 1] = { ...last, content: stripActions(full) };
        return next;
      });

      if (TOUR_RE.test(full)) {
        const steps = buildTour();
        if (steps.length) setFlow({ steps, index: 0 });
      } else {
        const steps = parseSteps(full, projectIds);
        const notes = GENERIC_NOTES[language] || GENERIC_NOTES.fr;
        if (steps.length === 1) {
          const s = steps[0];
          if (NON_INVASIVE.includes(s.name)) runAction(s.name, s.arg); // directe, sans bouton
          else if (CONFIRM_ACTIONS.includes(s.name)) setPending({ ...s });
          else setFlow({ steps: [{ ...s, note: s.note || notes[s.name] || notes.goto }], index: 0 });
        } else if (steps.length > 1) {
          setFlow({
            steps: steps.map((s) => ({ ...s, note: s.note || notes[s.name] || notes.goto })),
            index: 0,
          });
        }
      }
    } catch (err) {
      if (err.name === "AbortError") return;
      const msg = t.errors[err.kind] || t.errors.error;
      setMessages((m) => {
        const next = [...m];
        const last = next[next.length - 1];
        if (last?.role === "assistant" && !last.content) next[next.length - 1] = { ...last, content: msg };
        else next.push({ role: "assistant", content: msg });
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    abortRef.current?.abort();
    setMessages([]);
    setPending(null);
    setFlow(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    refresh();
  };

  const confirmMessage = () => {
    if (!pending) return "";
    if (pending.name === "visit")
      return language === "fr"
        ? `Ouvrir le site de ${projectLabel(pending.arg)} dans un nouvel onglet ?`
        : `Open ${projectLabel(pending.arg)}'s site in a new tab?`;
    return t.confirmText[pending.name] || "?";
  };

  const showSuggestions = !hasChat && !flow && !pending;

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-[80] flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-black shadow-xl transition-transform hover:scale-[1.04]"
        style={{ backgroundColor: secondaryColor }}
        aria-label={t.fab}
      >
        {open ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
        <span className="hidden sm:inline">{t.fab}</span>
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-[80] flex h-[min(560px,75vh)] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e1017] shadow-2xl">
          <div className="flex items-center gap-3 border-b border-white/10 p-4">
            <span className="grid h-9 w-9 place-items-center rounded-full" style={{ backgroundColor: `${secondaryColor}22` }}>
              <Bot className="h-5 w-5" style={{ color: secondaryColor }} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-white">{t.title}</div>
              <div className="truncate text-xs text-gray-500">{t.subtitle}</div>
            </div>
            {hasChat && (
              <button onClick={clearChat} className="grid h-8 w-8 place-items-center rounded-lg text-gray-500 hover:bg-white/5 hover:text-gray-300" aria-label={t.clear} title={t.clear}>
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-auto p-4">
            <div className="flex gap-2">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white/[0.06] px-3 py-2 text-sm text-gray-200">{intro}</div>
            </div>

            {messages.map((m, i) => {
              if (m.role === "action") {
                return (
                  <div key={i} className="flex justify-center">
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium" style={{ color: secondaryColor }}>
                      {m.content}
                    </span>
                  </div>
                );
              }
              const display = m.role === "assistant" ? stripActions(m.content) : m.content;
              return (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                      m.role === "user" ? "rounded-tr-sm text-black" : "rounded-tl-sm bg-white/[0.06] text-gray-200"
                    }`}
                    style={m.role === "user" ? { backgroundColor: secondaryColor } : undefined}
                  >
                    {display ||
                      (loading && i === messages.length - 1 ? (
                        <span className="inline-flex gap-1">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.2s]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.1s]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
                        </span>
                      ) : null)}
                  </div>
                </div>
              );
            })}

            {/* parcours guidé : une action à la fois, derrière un bouton (non-intrusif) */}
            {flow && !pending && flow.index < flow.steps.length && (
              <div className="flex flex-col items-start gap-1.5">
                <button
                  onClick={doFlowStep}
                  className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold transition-transform hover:scale-[1.02]"
                  style={{ color: secondaryColor, borderColor: `${secondaryColor}66`, backgroundColor: `${secondaryColor}14` }}
                >
                  <Play className="h-3.5 w-3.5" />
                  {stepLabel(flow.steps[flow.index])}
                  <span className="text-[11px] font-normal opacity-70">
                    · {flow.index + 1}/{flow.steps.length}
                  </span>
                </button>
                <button onClick={() => setFlow(null)} className="pl-1 text-[11px] text-gray-500 hover:text-gray-300">
                  {t.stop}
                </button>
              </div>
            )}

            {/* confirmation (action sensible) */}
            {pending && (
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <div className="mb-2 text-sm text-gray-200">{confirmMessage()}</div>
                <div className="flex gap-2">
                  <button onClick={confirmPending} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-black" style={{ backgroundColor: secondaryColor }}>
                    <Check className="h-3.5 w-3.5" />
                    {t.confirm}
                  </button>
                  <button onClick={cancelPending} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/5">
                    {t.cancel}
                  </button>
                </div>
              </div>
            )}

            {showSuggestions && (
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestions.map((q) => (
                  <button key={q} onClick={() => send(q)} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-300 hover:bg-white/[0.08]">
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-white/10 p-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                maxLength={MAX_INPUT}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder={t.placeholder}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-gray-100 outline-none placeholder:text-gray-600"
              />
              <button
                onClick={() => send()}
                disabled={loading || !input.trim()}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-black transition-opacity disabled:opacity-40"
                style={{ backgroundColor: secondaryColor }}
                aria-label="Envoyer"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssistantWidget;
