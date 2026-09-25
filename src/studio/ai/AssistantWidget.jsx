import React, { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, X, Send, Bot, Trash2, Check, Play, Square } from "lucide-react";
import { useColor } from "../../contexts/ColorContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useOS } from "../../os/osContext";
import { useData } from "../../os/data/DataContext";
import { streamChat, isAIConfigured, MODEL_LABEL } from "./aiClient";
import { INTROS, SUGGESTION_POOL } from "./persona";
import { classifyIntent } from "./intentRouter";
import { resolveHandler } from "./intentHandlers";
import {
  ACTION_RE,
  TOUR_RE,
  NON_INVASIVE,
  ACTION_SECTIONS,
  CONFIRM_ACTIONS,
  COLOR_NAMES,
  resolveColor,
  normalizeTags,
  stripActions,
  parseSteps,
} from "./actionProtocol";
import { typeOut } from "./typeOut";
import { generateFollowUps } from "./followUpsLLM";
import { isHexColor, normalizeHex, describeHex } from "./colorGenerator";
import { downloadCV } from "../pdf";
import { useContactOverlay } from "../contact/ContactOverlay";

const MAX_INPUT = 500;
const MAX_HISTORY = 8;
const STORE_MAX = 40;
const STORAGE_KEY = "studio_chat_v1";
const ROLES = ["user", "assistant", "action"];

// --- Mode veille (worker IA Cloudflare limité) ---
const SLEEP_KEY = "studio_ai_sleep";
const QUOTA_COOLDOWN = 5 * 60 * 1000; // veille après un 429 (quota)
const RATE_WINDOW = 60 * 1000; // fenêtre de comptage
const RATE_MAX = 6; // messages max par fenêtre avant veille préventive
const RATE_COOLDOWN = 90 * 1000; // veille préventive en cas de rafale
const readSleep = () => {
  try {
    const v = parseInt(localStorage.getItem(SLEEP_KEY), 10);
    return Number.isFinite(v) ? v : 0;
  } catch {
    return 0;
  }
};

const TOUR_NOTES = {
  fr: {
    about: "Voici son histoire, une reconversion peu banale, du commerce au code.",
    projects: "Ses projets, tous en ligne et cliquables. Jette un œil à VectoKid.",
    journey: "Son parcours et sa formation, étape par étape.",
    skills: "Les technos qu'il manie au quotidien.",
    contact: "Et si le profil te parle, c'est ici qu'on se rencontre 👇",
  },
  en: {
    about: "Here's his story, an unusual switch from retail to code.",
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
    subtitle: "Malin, concis, et il pilote la page",
    poweredBy: "Propulsé par",
    placeholder: "Votre question…",
    clear: "Effacer la discussion",
    confirm: "Confirmer",
    cancel: "Annuler",
    cancelled: "✖️ Annulé",
    stop: "arrêter le parcours",
    stopGen: "Arrêter la génération",
    sleep: "😴 Je fais une petite sieste pour ménager le quota de l'IA. Je reviens vite. En attendant, écris-moi directement 👇",
    sleepBanner: "En veille",
    sleepPlaceholder: "IA en pause…",
    contactCta: "Me contacter",
    offline: "Assistant hors-ligne. Le plus simple : creach.t@gmail.com, Théo répond vite !",
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
    subtitle: "Sharp, concise, and it drives the page",
    poweredBy: "Powered by",
    placeholder: "Your question…",
    clear: "Clear conversation",
    confirm: "Confirm",
    cancel: "Cancel",
    cancelled: "✖️ Cancelled",
    stop: "stop the tour",
    stopGen: "Stop generating",
    sleep: "😴 Taking a quick nap to spare the AI quota. Back soon. Meanwhile, reach me directly 👇",
    sleepBanner: "Resting",
    sleepPlaceholder: "AI paused…",
    contactCta: "Contact me",
    offline: "Assistant offline. Easiest: creach.t@gmail.com, Théo replies fast!",
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
  const { setMode, mode } = useOS();
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
    // Sans nom exact dans la palette (ex. hex généré par colorGenerator.js) :
    // décrit par famille de teinte ("un vert vif") plutôt que le code brut.
    return found ? found[0] : describeHex(secondaryColor, language);
  };

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(loadHistory);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(null); // { name, arg, flow?, note? }
  const [flow, setFlow] = useState(null); // { steps:[{name,arg,note}], index }
  const [intro, setIntro] = useState(() => pick(INTROS.fr));
  const [suggestions, setSuggestions] = useState(() => pickN(SUGGESTION_POOL.fr, 4));
  const [followUps, setFollowUps] = useState([]); // relances contextuelles après chaque réponse
  const [sleepUntil, setSleepUntil] = useState(readSleep);
  const reqTimes = useRef([]);
  const abortRef = useRef(null);
  // Mémoire contextuelle (légère) : dernier projet montré, pour résoudre
  // "ce projet" au tour suivant sans dépendre d'un état côté serveur (voir
  // intentHandlers/projectShow.js et projectInfo.js).
  const lastProjectRef = useRef(null);

  const sleeping = sleepUntil > Date.now();
  const sleepMins = Math.max(1, Math.ceil((sleepUntil - Date.now()) / 60000));
  const enterSleep = (ms) => {
    const until = Date.now() + ms;
    setSleepUntil(until);
    try {
      localStorage.setItem(SLEEP_KEY, String(until));
    } catch {
      /* ignore */
    }
  };
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

  // réveil automatique à la fin de la veille
  useEffect(() => {
    if (sleepUntil <= Date.now()) return undefined;
    const id = setTimeout(() => {
      setSleepUntil(0);
      try {
        localStorage.removeItem(SLEEP_KEY);
      } catch {
        /* ignore */
      }
    }, sleepUntil - Date.now() + 200);
    return () => clearTimeout(id);
  }, [sleepUntil]);

  const pushAction = (label) =>
    label && setMessages((m) => [...m, { role: "action", content: label }]);
  const pushNote = (text) => {
    if (!text) return;
    setMessages((m) => [...m, { role: "assistant", content: "" }]);
    typeOut(text, {
      onToken: (tok) => {
        setMessages((m) => {
          const next = [...m];
          const last = next[next.length - 1];
          if (last?.role === "assistant") next[next.length - 1] = { ...last, content: last.content + tok };
          return next;
        });
      },
    });
  };

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
        // Deux formes possibles depuis intentHandlers/actionUI.js : un nom
        // connu (résolu via resolveColor, tolérant accents/multi-mots) OU un
        // hex déjà généré à la volée (colorGenerator.js — couleur sans nom,
        // ou nom que resolveColor ne connaît pas).
        const hex = isHexColor(arg) ? normalizeHex(arg) : resolveColor(arg);
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

  // Applique une liste de steps résolue par un handler déterministe OU
  // extraite d'une réponse LLM (parseSteps) : même logique dans les deux cas
  // (1 step non-invasive = directe, 1 step sensible = confirmation, 2+ = flow).
  const applySteps = (steps) => {
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
  };

  // Suggestions de relance générées par un passage LLM léger (non bloquant :
  // la réponse principale s'affiche sans attendre). `thisController` protège
  // contre une réponse tardive qui écraserait les chips d'un tour plus
  // récent (voir abortRef.current === thisController ci-dessous).
  const triggerFollowUps = ({ historyForFollowUps, actionHint, meta, state, thisController }) => {
    // {label, blurb} et pas juste le nom : un nom seul ("ZombieLand") laisse
    // le modèle free-associer sur autre chose (le film de zombies) plutôt
    // que sur le vrai projet — voir buildFollowUpsPrompt.
    const projects = (data?.projects || [])
      .map((p) => {
        const loc = p[language] || p.fr;
        return loc?.label && loc?.value ? { label: loc.label, blurb: loc.value } : null;
      })
      .filter(Boolean);
    const avoid = [];
    if (state.osMode === "os") {
      avoid.push(language === "en" ? "launching dev mode (already running)" : "lancer le mode dev (déjà actif)");
    }
    if (state.currentSection) {
      avoid.push(
        language === "en"
          ? `going to the ${state.currentSection} section (already there)`
          : `aller à la section ${state.currentSection} (déjà là)`
      );
    }
    if (meta?.projectId) {
      const shown = (data?.projects || []).find((p) => p.id === meta.projectId);
      const label = shown && (shown[language] || shown.fr)?.label;
      if (label) {
        avoid.push(
          language === "en" ? `showing ${label} again (just shown)` : `remontrer ${label} (déjà montré)`
        );
      }
    }

    generateFollowUps(
      { language, projects, avoid, history: historyForFollowUps, actionHint },
      { signal: thisController.signal, n: 3 }
    ).then((sugg) => {
      if (abortRef.current === thisController) setFollowUps(sugg);
    });
  };

  const send = async (text) => {
    const content = (text ?? input).replace(ACTION_RE, "").trim().slice(0, MAX_INPUT);
    if (!content || loading || sleeping) return;
    setInput("");
    setPending(null);
    setFlow(null);
    setFollowUps([]);

    if (!isAIConfigured()) {
      setMessages((m) => [...m, { role: "user", content }, { role: "assistant", content: t.offline }]);
      return;
    }

    // garde-fou débit : trop de messages en peu de temps → veille préventive
    const now = Date.now();
    reqTimes.current = reqTimes.current.filter((ts) => now - ts < RATE_WINDOW);
    if (reqTimes.current.length >= RATE_MAX) {
      enterSleep(RATE_COOLDOWN);
      setMessages((m) => [
        ...m,
        { role: "user", content },
        { role: "assistant", content: t.sleep },
      ]);
      return;
    }
    reqTimes.current.push(now);

    const history = [...messages, { role: "user", content }];
    // Écho immédiat du message utilisateur : ne pas attendre la fin de
    // classifyIntent() (réseau) pour l'afficher, sinon la bulle met plusieurs
    // centaines de ms à apparaître — perçu comme un chat qui "traîne".
    setMessages(history);
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;
    let placeholderAdded = false;

    try {
      // Contexte pour la zone grise du routeur (voir intentClassifierLLM.js) :
      // résout les relances courtes/elliptiques ("et rose ?", "n'importe
      // quoi") qui n'ont de sens qu'à la lumière du tour précédent.
      const classifyHistory = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-4)
        .map((m) => ({ role: m.role, content: stripActions(m.content) }));
      const routing = await classifyIntent(content, language, {
        signal: controller.signal,
        history: classifyHistory,
        data,
      });
      const ctx = {
        message: content,
        language,
        data,
        // colorHex/osMode : comparaisons fiables pour la détection "déjà dans
        // cet état" (voir intentHandlers/actionUI.js) ; `color` (le nom) reste
        // pour l'injection dans le prompt LLM (promptFragments.buildStateBlock).
        state: {
          color: currentColorName(),
          colorHex: secondaryColor,
          osMode: mode,
          currentSection: currentSectionId(),
          lastProjectId: lastProjectRef.current,
        },
        signal: controller.signal,
        routing,
      };
      const result = resolveHandler(routing.intent, ctx);
      if (result.meta?.projectId) lastProjectRef.current = result.meta.projectId;

      if (result.type === "deterministic") {
        // Aucun texte streamé : le message utilisateur est déjà affiché (écho
        // immédiat plus haut), l'action pose elle-même sa pastille/note
        // (runAction / applySteps).
        applySteps(result.steps);
        const stepNames = result.steps.map((s) => (s.arg ? `${s.name}:${s.arg}` : s.name)).join(", ");
        triggerFollowUps({
          historyForFollowUps: history
            .filter((m) => m.role === "user" || m.role === "assistant")
            .slice(-4)
            .map((m) => ({ role: m.role, content: stripActions(m.content) })),
          actionHint: `[Action venant d'être exécutée : ${stepNames || routing.intent}]`,
          meta: result.meta,
          state: ctx.state,
          thisController: controller,
        });
        return;
      }

      // result.type === "llm" : même pipeline de streaming/parsing qu'avant,
      // mais avec un prompt système réduit au contexte de l'intention (voir
      // intentHandlers/*.js).
      placeholderAdded = true;
      setMessages((m) => [...m, { role: "assistant", content: "" }]);

      const apiMessages = [
        { role: "system", content: result.systemPrompt },
        ...history
          .filter((m) => m.role === "user" || m.role === "assistant")
          .slice(-MAX_HISTORY)
          .map((m) => ({ role: m.role, content: stripActions(m.content) })),
      ];

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

      const norm = normalizeTags(full);

      setMessages((m) => {
        const next = [...m];
        const last = next[next.length - 1];
        if (last?.role === "assistant") next[next.length - 1] = { ...last, content: stripActions(norm) };
        return next;
      });

      if (TOUR_RE.test(norm)) {
        const steps = buildTour();
        if (steps.length) setFlow({ steps, index: 0 });
      } else {
        applySteps(parseSteps(norm, projectIds));
      }
      triggerFollowUps({
        historyForFollowUps: [...history, { role: "assistant", content: stripActions(norm) }]
          .filter((m) => m.role === "user" || m.role === "assistant")
          .slice(-4)
          .map((m) => ({ role: m.role, content: stripActions(m.content) })),
        meta: result.meta,
        state: ctx.state,
        thisController: controller,
      });
    } catch (err) {
      if (err.name === "AbortError") {
        // Stop utilisateur : ne pas laisser de bulle assistant vide, et garder
        // le partiel éventuel (nettoyé de tout tag) plutôt qu'un blanc. Rien à
        // nettoyer si l'arrêt est survenu avant le streaming (classification).
        if (placeholderAdded) {
          setMessages((m) => {
            const next = [...m];
            const last = next[next.length - 1];
            if (last?.role === "assistant") {
              const clean = stripActions(last.content);
              if (clean) next[next.length - 1] = { ...last, content: clean };
              else next.pop();
            }
            return next;
          });
        }
        return;
      }
      if (err.kind === "quota") enterSleep(QUOTA_COOLDOWN);
      const msg = err.kind === "quota" ? t.sleep : t.errors[err.kind] || t.errors.error;
      setMessages((m) => {
        const next = [...m];
        const last = next[next.length - 1];
        if (placeholderAdded && last?.role === "assistant" && !last.content) next[next.length - 1] = { ...last, content: msg };
        else next.push({ role: "assistant", content: msg });
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  const stopGeneration = () => abortRef.current?.abort();

  const clearChat = () => {
    abortRef.current?.abort();
    setMessages([]);
    setPending(null);
    setFlow(null);
    setFollowUps([]);
    lastProjectRef.current = null;
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

  const showSuggestions = !hasChat && !flow && !pending && !sleeping;
  const showFollowUps = hasChat && !loading && !flow && !pending && !sleeping && followUps.length > 0;

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
        <div className="fixed bottom-20 right-3 z-[80] flex h-[58vh] max-h-[480px] w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e1017] shadow-2xl sm:right-5 sm:h-[min(560px,75vh)] sm:max-h-none sm:w-[min(380px,calc(100vw-2.5rem))]">
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

            {/* relances générées après chaque réponse (voir followUpsLLM.js) */}
            {showFollowUps && (
              <div className="flex flex-wrap gap-2 pt-1">
                {followUps.map((q) => (
                  <button key={q} onClick={() => send(q)} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-300 hover:bg-white/[0.08]">
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {sleeping && (
            <div className="flex items-center gap-2 border-t border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-gray-400">
              <span>
                😴 {t.sleepBanner} · ~{sleepMins} min
              </span>
              <button
                onClick={openContact}
                className="ml-auto rounded-md border border-white/10 px-2 py-1 text-gray-200 hover:bg-white/5"
              >
                {t.contactCta}
              </button>
            </div>
          )}

          <div className="border-t border-white/10 p-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                maxLength={MAX_INPUT}
                disabled={sleeping}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder={sleeping ? t.sleepPlaceholder : t.placeholder}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-gray-100 outline-none placeholder:text-gray-600 disabled:opacity-50"
              />
              {loading ? (
                <button
                  onClick={stopGeneration}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-black transition-opacity hover:opacity-90"
                  style={{ backgroundColor: secondaryColor }}
                  aria-label={t.stopGen}
                  title={t.stopGen}
                >
                  <Square className="h-4 w-4" fill="currentColor" />
                </button>
              ) : (
                <button
                  onClick={() => send()}
                  disabled={sleeping || !input.trim()}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-black transition-opacity disabled:opacity-40"
                  style={{ backgroundColor: secondaryColor }}
                  aria-label="Envoyer"
                >
                  <Send className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="mt-1.5 flex items-center justify-center gap-1 text-[10px] text-gray-600">
              <Sparkles className="h-2.5 w-2.5" style={{ color: `${secondaryColor}99` }} />
              <span>{t.poweredBy} {MODEL_LABEL}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssistantWidget;
