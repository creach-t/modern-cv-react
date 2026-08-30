import React, { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, X, Send, Bot, Trash2, Check } from "lucide-react";
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

const MAX_INPUT = 500; // anti-abus : longueur max d'un message
const MAX_HISTORY = 8; // messages de contexte envoyés à l'API
const STORE_MAX = 40; // messages conservés en localStorage
const STORAGE_KEY = "studio_chat_v1";
const ACTION_RE = /\[\[do:([a-z_]+)(?::([a-z]+))?\]\]/gi;
const ROLES = ["user", "assistant", "action"];

const stripActions = (text = "") =>
  text
    .replace(/\[\[do:[^\]]*\]\]/gi, "")
    .replace(/\[\[[^\]]*$/i, "")
    .replace(/[ \t]+\n/g, "\n")
    .trim();

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickN = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);

// --- persistance locale (défensive) ---
const loadHistory = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(raw)) return [];
    return raw
      .filter(
        (m) => m && ROLES.includes(m.role) && typeof m.content === "string"
      )
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
    /* stockage indisponible : on ignore */
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
    offline:
      "Assistant hors-ligne pour l'instant. Le plus simple : creach.t@gmail.com — Théo répond vite !",
    confirmText: {
      download_cv: "Télécharger le CV de Théo en PDF ?",
      email: "Ouvrir votre messagerie pour écrire à Théo ?",
    },
    sections: {
      about: "À propos",
      projects: "Projets",
      journey: "Parcours",
      skills: "Compétences",
      contact: "Contact",
    },
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
    offline:
      "Assistant is offline right now. Easiest path: creach.t@gmail.com — Théo replies fast!",
    confirmText: {
      download_cv: "Download Théo's CV as PDF?",
      email: "Open your email app to write to Théo?",
    },
    sections: {
      about: "About",
      projects: "Work",
      journey: "Journey",
      skills: "Skills",
      contact: "Contact",
    },
    errors: {
      quota: "Busy right now 😅 try again in a moment.",
      auth: "Assistant unavailable. Direct contact: creach.t@gmail.com",
      unavailable: "The model is taking a break. Try again soon.",
      error: "Oops, something broke. Try again or email creach.t@gmail.com",
    },
  },
};

const AssistantWidget = () => {
  const { secondaryColor, changeColor } = useColor();
  const { language, changeLanguage } = useLanguage();
  const { setMode } = useOS();
  const { data } = useData();
  const t = COPY[language] || COPY.fr;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(loadHistory);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(null); // { name, arg }
  const [intro, setIntro] = useState(() => pick(INTROS.fr));
  const [suggestions, setSuggestions] = useState(() => pickN(SUGGESTION_POOL.fr, 4));
  const abortRef = useRef(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // messages "conversationnels" (hors notifications d'action)
  const hasChat = useMemo(
    () => messages.some((m) => m.role === "user" || m.role === "assistant"),
    [messages]
  );

  // tirer un accueil + suggestions dans la bonne langue (change à chaque ouverture)
  const refresh = React.useCallback(() => {
    setIntro(pick(INTROS[language] || INTROS.fr));
    setSuggestions(pickN(SUGGESTION_POOL[language] || SUGGESTION_POOL.fr, 4));
  }, [language]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (open && !hasChat) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open, pending]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  useEffect(() => saveHistory(messages), [messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const pushAction = (label) =>
    label && setMessages((m) => [...m, { role: "action", content: label }]);

  const actionLabel = (name, arg) => {
    switch (name) {
      case "launch_os":
        return language === "fr" ? "🖥️ creachOS lancé" : "🖥️ creachOS launched";
      case "goto":
        return `🧭 ${t.sections[arg] || arg}`;
      case "color":
        return language === "fr" ? "🎨 Couleur mise à jour" : "🎨 Color updated";
      case "download_cv":
        return language === "fr" ? "📄 CV téléchargé" : "📄 CV downloaded";
      case "lang":
        return `🌐 ${(arg || "").toUpperCase()}`;
      case "email":
        return language === "fr" ? "✉️ Email ouvert" : "✉️ Email opened";
      default:
        return null;
    }
  };

  const runAction = (name, arg) => {
    switch (name) {
      case "launch_os":
        setMode("os");
        break;
      case "goto":
        if (ACTION_SECTIONS.includes(arg))
          document.getElementById(arg)?.scrollIntoView({ behavior: "smooth" });
        break;
      case "color":
        changeColor();
        break;
      case "download_cv":
        downloadCV(language, secondaryColor);
        break;
      case "lang":
        if (arg === "fr" || arg === "en") changeLanguage(arg);
        break;
      case "email":
        window.location.href = "mailto:creach.t@gmail.com";
        break;
      default:
        return; // action inconnue → ignorée
    }
    pushAction(actionLabel(name, arg));
  };

  const confirmPending = () => {
    if (!pending) return;
    runAction(pending.name, pending.arg);
    setPending(null);
  };
  const cancelPending = () => {
    pushAction(t.cancelled);
    setPending(null);
  };

  const send = async (text) => {
    const content = (text ?? input).replace(ACTION_RE, "").trim().slice(0, MAX_INPUT);
    if (!content || loading) return;
    setInput("");
    setPending(null);

    if (!isAIConfigured()) {
      setMessages((m) => [
        ...m,
        { role: "user", content },
        { role: "assistant", content: t.offline },
      ]);
      return;
    }

    const history = [...messages, { role: "user", content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const apiMessages = [
      { role: "system", content: buildSystemPrompt(data, language) },
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
            if (last?.role === "assistant")
              next[next.length - 1] = { ...last, content: last.content + tok };
            return next;
          });
        },
      });

      // message final nettoyé (sans tag)
      setMessages((m) => {
        const next = [...m];
        const last = next[next.length - 1];
        if (last?.role === "assistant")
          next[next.length - 1] = { ...last, content: stripActions(full) };
        return next;
      });

      // action éventuelle : confirmation requise ou exécution directe
      ACTION_RE.lastIndex = 0;
      const match = ACTION_RE.exec(full);
      if (match) {
        const name = match[1].toLowerCase();
        const arg = match[2]?.toLowerCase();
        if (CONFIRM_ACTIONS.includes(name)) setPending({ name, arg });
        else runAction(name, arg);
      }
    } catch (err) {
      if (err.name === "AbortError") return;
      const msg = t.errors[err.kind] || t.errors.error;
      setMessages((m) => {
        const next = [...m];
        const last = next[next.length - 1];
        if (last?.role === "assistant" && !last.content)
          next[next.length - 1] = { ...last, content: msg };
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
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    refresh();
  };

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
            <span
              className="grid h-9 w-9 place-items-center rounded-full"
              style={{ backgroundColor: `${secondaryColor}22` }}
            >
              <Bot className="h-5 w-5" style={{ color: secondaryColor }} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-white">{t.title}</div>
              <div className="truncate text-xs text-gray-500">{t.subtitle}</div>
            </div>
            {hasChat && (
              <button
                onClick={clearChat}
                className="grid h-8 w-8 place-items-center rounded-lg text-gray-500 hover:bg-white/5 hover:text-gray-300"
                aria-label={t.clear}
                title={t.clear}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-auto p-4">
            <div className="flex gap-2">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white/[0.06] px-3 py-2 text-sm text-gray-200">
                {intro}
              </div>
            </div>

            {messages.map((m, i) => {
              if (m.role === "action") {
                return (
                  <div key={i} className="flex justify-center">
                    <span
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-gray-400"
                      style={{ color: secondaryColor }}
                    >
                      {m.content}
                    </span>
                  </div>
                );
              }
              const display =
                m.role === "assistant" ? stripActions(m.content) : m.content;
              return (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                      m.role === "user"
                        ? "rounded-tr-sm text-black"
                        : "rounded-tl-sm bg-white/[0.06] text-gray-200"
                    }`}
                    style={
                      m.role === "user" ? { backgroundColor: secondaryColor } : undefined
                    }
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

            {/* carte de confirmation */}
            {pending && (
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <div className="mb-2 text-sm text-gray-200">
                  {t.confirmText[pending.name] || "?"}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={confirmPending}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-black"
                    style={{ backgroundColor: secondaryColor }}
                  >
                    <Check className="h-3.5 w-3.5" />
                    {t.confirm}
                  </button>
                  <button
                    onClick={cancelPending}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/5"
                  >
                    {t.cancel}
                  </button>
                </div>
              </div>
            )}

            {!hasChat && (
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-300 hover:bg-white/[0.08]"
                  >
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
