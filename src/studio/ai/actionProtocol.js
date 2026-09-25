/**
 * Protocole d'actions partagé (tags [[do:...]] / [[plan:...]]), whitelists et
 * résolution de couleur. Extrait de AssistantWidget.jsx pour être réutilisé
 * par les handlers d'intention ET par le widget (parsing des réponses LLM,
 * quel que soit le handler qui a streamé la réponse).
 */
import { stripDia } from "./textUtils";

// Après normalisation, tous les tags sont canoniques : [[do:name:arg]] / [[plan:…]].
export const ACTION_RE = /\[\[do:([a-z_]+)(?::([a-z0-9_-]+))?\]\]/gi;
export const PLAN_RE = /\[\[plan:([\s\S]+?)\]\]/i;
export const TOUR_RE = /\[\[do:tour\]\]/i;
export const KNOWN = ["launch_os", "goto", "color", "download_cv", "lang", "email"];
// Non invasives : exécutées directement si demandées seules (pas de bouton).
export const NON_INVASIVE = ["goto", "project", "color", "lang", "email"];

// Actions autorisées côté client (liste blanche stricte).
export const ACTION_SECTIONS = ["about", "projects", "journey", "skills", "contact"];

// Actions qui exigent une confirmation explicite (téléchargement / lien externe).
export const CONFIRM_ACTIONS = ["download_cv", "visit"];

// Noms d'action pilotables (pour rattraper un tag sans préfixe "do:").
export const DO_NAMES = new Set([
  "launch_os", "goto", "color", "download_cv", "lang", "email", "project", "visit", "tour",
]);

export { stripDia };

// noms de couleurs → hex (token unique en minuscules, fr + en + variantes)
export const COLOR_NAMES = {
  mauve: "#B57EDC", violet: "#7C3AED", purple: "#7C3AED",
  bleu: "#2563EB", blue: "#2563EB", ciel: "#38BDF8", sky: "#38BDF8",
  rouge: "#DC2626", red: "#DC2626", vert: "#16A34A", green: "#16A34A",
  orange: "#F97316", rose: "#EC4899", pink: "#EC4899",
  jaune: "#EAB308", yellow: "#EAB308", cyan: "#06B6D4", turquoise: "#06B6D4",
  indigo: "#6366F1", corail: "#FF6F61", coral: "#FF6F61",
  magenta: "#D946EF", or: "#D4AF37", gold: "#D4AF37",
  emeraude: "#10B981", emerald: "#10B981",
  marron: "#A0522D", brun: "#A0522D", brown: "#A0522D",
  // bleu nuit / marine : alternative sombre mais lisible proposée à la place du noir
  "bleu-nuit": "#1E3A8A", bleunuit: "#1E3A8A", marine: "#1E3A8A", navy: "#1E3A8A",
};

// Résout un nom de couleur (possiblement multi-mots / accentué) en hex, de façon
// FIABLE : jamais d'aléatoire quand un nom précis est demandé. Renvoie null si
// vraiment introuvable (l'appelant décide alors du repli).
export const resolveColor = (raw) => {
  if (!raw) return null;
  const a = stripDia(String(raw).toLowerCase()).replace(/[^a-z]+/g, "-").replace(/^-+|-+$/g, "");
  if (!a) return null;
  if (COLOR_NAMES[a]) return COLOR_NAMES[a]; // ex. "bleu-nuit"
  const flat = a.replace(/-/g, "");
  if (COLOR_NAMES[flat]) return COLOR_NAMES[flat]; // ex. "bleunuit"
  // "bleu marine", "bleu foncé"… → mappe sur un nom connu présent dans la valeur.
  // On lit le qualificatif d'abord (en français il est en dernier : "bleu marine").
  for (const w of a.split("-").reverse()) if (COLOR_NAMES[w]) return COLOR_NAMES[w];
  return null;
};

// --- Parser tolérant (petit modèle 8B FP8) ---
// Un 8B produit souvent des quasi-tags : crochets simples [do:color], "do:"
// manquant [[goto:projects]], espaces [[do: color]], casse variable, etc.
// On normalise TOUT vers la forme canonique [[do:name:arg]] / [[plan:…]] AVANT
// parsing. La sécurité reste assurée par les whitelists en aval (KNOWN,
// ACTION_SECTIONS, projectIds, COLOR_NAMES) : un tag inconnu est ignoré.
export const normalizeTags = (text = "") =>
  String(text)
    // plan : 1-2 crochets, espaces, note pouvant contenir un ] simple (borne sur ]]).
    .replace(/\[{1,2}\s*plan\s*:\s*([\s\S]+?)\]{2}/gi, (_, body) => `[[plan:${body.trim()}]]`)
    // couleur : la valeur peut être multi-mots ("bleu nuit", "bleu foncé") → on
    // la ramène à un token unique en tirets (bleu-nuit) résoluble par resolveColor.
    .replace(
      /\[{1,2}\s*(?:do\s*:\s*)?colou?r\s*:\s*([a-zà-ÿ][a-zà-ÿ '-]*?)\s*\]{1,2}/gi,
      (_, val) => {
        const norm = stripDia(val.toLowerCase()).replace(/[^a-z]+/g, "-").replace(/^-+|-+$/g, "");
        return norm ? `[[do:color:${norm}]]` : "[[do:color]]";
      }
    )
    // tags avec préfixe "do:" explicite (n'importe quel nom/arg).
    .replace(
      /\[{1,2}\s*do\s*:\s*([a-z_]+)(?:\s*:\s*([a-z0-9_-]+))?\s*\]{1,2}/gi,
      (_, name, arg) => `[[do:${name.toLowerCase()}${arg ? ":" + arg.toLowerCase() : ""}]]`
    )
    // tags sans "do:" mais nom d'action connu + arg (ex. [[goto:contact]], [color:mauve]).
    .replace(
      /\[{1,2}\s*([a-z_]+)\s*:\s*([a-z0-9_-]+)\s*\]{1,2}/gi,
      (m, name, arg) =>
        DO_NAMES.has(name.toLowerCase())
          ? `[[do:${name.toLowerCase()}:${arg.toLowerCase()}]]`
          : m
    )
    // actions sans arg ni "do:" (ex. [launch_os], [[email]]) : noms explicites only.
    .replace(
      /\[{1,2}\s*(launch_os|download_cv|email|tour|color)\s*\]{1,2}/gi,
      (_, name) => `[[do:${name.toLowerCase()}]]`
    );

export const stripActions = (text = "") =>
  normalizeTags(text)
    .replace(/\[\[plan:[\s\S]*?\]\]/gi, "")
    .replace(/\[\[do:[^\]]*\]\]/gi, "")
    .replace(/\[\[[^\]]*$/i, "") // tag tronqué en fin de flux (streaming)
    .replace(/[ \t]+\n/g, "\n")
    .trim();

// Étapes d'un plan : chaque item = "action[:arg] | note perso" (note optionnelle).
// `full` doit être normalisé (normalizeTags) au préalable.
export const parseSteps = (full, projectIds = []) => {
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
          .replace(/[[\]]/g, "") // crochets isolés résiduels (note contenant un ])
          .replace(/\s{2,}/g, " ")
          .trim() || undefined;
      // left = "action[:arg]" ; tolère un "do:" résiduel et des espaces autour du ":".
      const [name, arg] = left
        .trim()
        .toLowerCase()
        .replace(/^do\s*:\s*/, "")
        .split(/\s*:\s*/);
      return { name, arg, note };
    })
    .filter((s) =>
      s.name === "project" || s.name === "visit"
        ? projectIds.includes(s.arg)
        : KNOWN.includes(s.name) &&
          (s.name !== "goto" || ACTION_SECTIONS.includes(s.arg)) &&
          (s.name !== "lang" || ["fr", "en"].includes(s.arg))
    )
    // dédoublonne : un 8B répète parfois la même étape (ex. project:vectokid ×3)
    .filter((s, i, arr) => arr.findIndex((x) => x.name === s.name && x.arg === s.arg) === i)
    .slice(0, 6);
};
