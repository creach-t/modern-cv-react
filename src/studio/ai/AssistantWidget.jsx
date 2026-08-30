import React, { useEffect, useRef, useState } from "react";
import { Sparkles, X, Send, Bot } from "lucide-react";
import { useColor } from "../../contexts/ColorContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useOS } from "../../os/osContext";
import { useData } from "../../os/data/DataContext";
import { streamChat, isAIConfigured } from "./aiClient";
import { buildSystemPrompt, SUGGESTED_QUESTIONS, ACTION_SECTIONS } from "./persona";
import { downloadCV } from "../pdf";

const MAX_INPUT = 500; // anti-abus : longueur max d'un message
const MAX_HISTORY = 8; // messages de contexte envoyés
const ACTION_RE = /\[\[do:([a-z_]+)(?::([a-z]+))?\]\]/gi;

// Masque les tags d'action (complets ou partiels en cours de stream).
const stripActions = (text = "") =>
  text
    .replace(/\[\[do:[^\]]*\]\]/gi, "")
    .replace(/\[\[[^\]]*$/i, "")
    .replace(/[ \t]+\n/g, "\n")
    .trim();

const COPY = {
  fr: {
    fab: "Discuter avec mon IA",
    title: "L'assistant de Théo",
    subtitle: "Malin, concis — et il pilote la page",
    placeholder: "Votre question…",
    intro:
      "Salut 👋 Je réponds à tout sur Théo — et je peux agir sur la page (essayez « lance le mode dev » ou « change la couleur »).",
    offline:
      "Assistant hors-ligne pour l'instant. Le plus simple : creach.t@gmail.com — Théo répond vite !",
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
    intro:
      "Hi 👋 Ask me anything about Théo — I can also act on the page (try “launch dev mode” or “change the color”).",
    offline:
      "Assistant is offline right now. Easiest path: creach.t@gmail.com — Théo replies fast!",
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
  const [messages, setMessages] = useState([]); // {role, content}
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  // Exécute une action (liste blanche stricte).
  const runAction = (name, arg) => {
    switch (name) {
      case "launch_os":
        setMode("os");
        break;
      case "goto":
        if (ACTION_SECTIONS.includes(arg)) {
          setOpen(false);
          document.getElementById(arg)?.scrollIntoView({ behavior: "smooth" });
        }
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
        break; // action inconnue → ignorée
    }
  };

  const send = async (text) => {
    // nettoyage + plafonnement anti-injection
    const content = (text ?? input)
      .replace(ACTION_RE, "")
      .trim()
      .slice(0, MAX_INPUT);
    if (!content || loading) return;
    setInput("");

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
            if (last?.role === "assistant") {
              next[next.length - 1] = { ...last, content: last.content + tok };
            }
            return next;
          });
        },
      });

      // exécuter la 1re action valide, puis nettoyer le message affiché
      ACTION_RE.lastIndex = 0;
      const match = ACTION_RE.exec(full);
      if (match) runAction(match[1].toLowerCase(), match[2]?.toLowerCase());

      setMessages((m) => {
        const next = [...m];
        const last = next[next.length - 1];
        if (last?.role === "assistant") {
          next[next.length - 1] = { ...last, content: stripActions(full) };
        }
        return next;
      });
    } catch (err) {
      if (err.name === "AbortError") return;
      const msg = t.errors[err.kind] || t.errors.error;
      setMessages((m) => {
        const next = [...m];
        const last = next[next.length - 1];
        if (last?.role === "assistant" && !last.content) {
          next[next.length - 1] = { ...last, content: msg };
        } else {
          next.push({ role: "assistant", content: msg });
        }
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  const suggestions = SUGGESTED_QUESTIONS[language] || SUGGESTED_QUESTIONS.fr;

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
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white">{t.title}</div>
              <div className="truncate text-xs text-gray-500">{t.subtitle}</div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-auto p-4">
            <div className="flex gap-2">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white/[0.06] px-3 py-2 text-sm text-gray-200">
                {t.intro}
              </div>
            </div>

            {messages.map((m, i) => {
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

            {messages.length === 0 && (
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
