/**
 * Extraction de slots déterministe (aucun appel LLM) pour les intentions
 * "deterministic" : quelle section, quelle action UI, quel projet.
 * Réutilise les whitelists/résolveurs déjà éprouvés d'actionProtocol.js.
 */
import { ACTION_SECTIONS, COLOR_NAMES, resolveColor } from "./actionProtocol";
import { stripDia, tokenize, overlap, fuzzyOverlap, withAdjacentBigrams } from "./textUtils";

const SECTION_KEYWORDS = {
  about: /\b(a propos|about|presentation|qui est il|qui est-il|who is he)\b/i,
  projects: /\b(projets?|projects?|realisations?|works?)\b/i,
  journey: /\b(parcours|journey|formation|etudes?|background)\b/i,
  skills: /\b(competences?|skills?|technos?|technologies?|stack)\b/i,
  contact: /\b(contact|ecrire|joindre|reach|email)\b/i,
};

// Détecte la section visée par un message de navigation. `norm` = texte sans
// accents/minuscule (cf. stripDia) pour matcher indépendamment des accents.
export const extractSection = (text = "") => {
  const norm = stripDia(text.toLowerCase());
  for (const id of ACTION_SECTIONS) {
    if (SECTION_KEYWORDS[id]?.test(norm)) return id;
  }
  return null;
};

// Pas de code court ("en") pour l'anglais : "en" est une préposition française
// omniprésente ("en bleu", "en ligne"…) et déclencherait trop de faux positifs.
const LANG_FR_RE = /\b(francais|french|\bfr\b)\b/i;
const LANG_EN_RE = /\b(anglais|english)\b/i;

// "lumiere"/"ambiance" en plus de "couleur" : phrasing observée en usage réel
// ("changer la lumière du site") qui, sans ça, ne déclenche aucun trigger →
// le message tombe hors action_ui, faq_general répond sans aucune donnée
// couleur et invente une "préférence" de Théo pour justifier un refus.
const COLOR_TRIGGER_RE = /\b(couleur|color|colore|teinte|lumiere|ambiance)\b/i;

// "tu as quoi comme couleur ?" demande l'état ACTUEL, pas un changement — sans
// ce garde-fou, extractActionUI() renvoie {name:"color", arg:undefined}
// (couleur SANS nom = "aléatoire" par convention) et déclenche un changement
// alors que l'utilisateur voulait juste savoir. Signal : "?" + un marqueur de
// question ("quoi"/"quelle"/"as-tu"...), sans nom de couleur résolu.
const COLOR_INFO_QUESTION_RE = /\b(quoi|quelle?|as[\s-]?tu|tu\s+as|what|which)\b/i;
export const isColorInfoQuestion = (text = "") =>
  text.includes("?") && COLOR_INFO_QUESTION_RE.test(stripDia(text.toLowerCase()));
const LAUNCH_OS_RE = /\b(mode dev|dev mode|creachos|creach os|mode developpeur|developer mode)\b/i;
const DOWNLOAD_CV_RE = /\b(telecharge|download).{0,15}\bcv\b|\bcv\b.{0,15}(pdf|telecharge|download)/i;
const EMAIL_RE = /\b(contact|contacter|contacte|ecrire|ecris|envoie|envoyer|send|write|joindre|email|mail|reach|message)\b/i;

// Mots vides à exclure des candidats couleur : resolveColor() est tolérant
// par conception ("bleu foncé" → bleu), donc un mot-outil collé à un vrai nom
// de couleur ("en bleu", "une couleur mauve") formerait un faux bigramme
// ("en-bleu") que resolveColor résoudrait quand même (via son repli sur le
// dernier mot) — mais avec un arg bruité. On filtre ces mots-outils en amont.
const COLOR_STOPWORDS = new Set([
  "mets", "met", "mettre", "une", "un", "le", "la", "les", "des", "du", "de", "en",
  "couleur", "couleurs", "colour", "color", "site", "change", "changer", "passe",
  "the", "a", "an", "in", "of", "make", "set",
]);

// Détecte l'action UI voulue (color/lang/download_cv/email/launch_os) + son
// argument éventuel (couleur, langue). Ne gère PAS goto (→ extractSection),
// ni project/visit (→ matchProject).
export const extractActionUI = (text = "") => {
  const norm = stripDia(text.toLowerCase());

  if (LAUNCH_OS_RE.test(norm)) return { name: "launch_os", arg: undefined };
  if (DOWNLOAD_CV_RE.test(norm)) return { name: "download_cv", arg: undefined };

  if (LANG_FR_RE.test(norm)) return { name: "lang", arg: "fr" };
  if (LANG_EN_RE.test(norm)) return { name: "lang", arg: "en" };

  // Nom de couleur cité explicitement (« mets le site en bleu ») : pas besoin
  // du mot déclencheur "couleur" dans ce cas, l'intention est déjà "action_ui"
  // (décidée en amont par le routeur) donc citer un nom de couleur suffit.
  const words = norm
    .replace(/[^a-z]+/g, " ")
    .split(" ")
    .filter((w) => w && !COLOR_STOPWORDS.has(w));
  for (let i = 0; i < words.length; i++) {
    for (let len = Math.min(2, words.length - i); len >= 1; len--) {
      const candidate = words.slice(i, i + len).join("-");
      if (resolveColor(candidate)) return { name: "color", arg: candidate };
    }
  }
  // Sinon, "couleur" demandée sans nom précis → aléatoire.
  if (COLOR_TRIGGER_RE.test(norm)) return { name: "color", arg: undefined };

  if (EMAIL_RE.test(norm)) return { name: "email", arg: undefined };

  return null;
};

// Distingue "montre/présente X" (rester sur la page, scroll vers la section
// projet) de "ouvre le lien/la démo/le vrai site de X" (action INVASIVE :
// quitter le site dans un nouvel onglet, donc confirmation obligatoire —
// voir CONFIRM_ACTIONS dans actionProtocol.js).
const VISIT_TRIGGER_RE =
  /\b(ouvre|ouvrir|open|lien|link|demo|site en ligne|live (site|demo)|vrai site|real site|visite|visit)\b/i;

export const wantsExternalVisit = (text = "") => VISIT_TRIGGER_RE.test(stripDia(text.toLowerCase()));

const SHOW_OR_VISIT_VERB_RE =
  /\b(montre|montrer|presente|presenter|affiche|voir|show|present|display|ouvre|ouvrir|open)\b/i;

// Une QUESTION sur un projet ("est-ce que ZombieLand est ouvert ?", "X est à
// jour ?") veut une RÉPONSE, pas juste un scroll silencieux vers la section.
// Signal : un "?" sans verbe d'action (montre/ouvre/voir...) — aucun exemple
// project_show n'en contient, donc ce heuristique ne risque pas de confondre
// une vraie commande ("montre-moi X ?" reste une commande grâce au verbe).
export const isProjectQuestion = (text = "") =>
  text.includes("?") && !SHOW_OR_VISIT_VERB_RE.test(stripDia(text.toLowerCase()));

// Retourne l'id du projet le plus proche du message, ou null si aucun score
// n'est jugé assez confiant (évite de "deviner" un projet non cité).
// Le nom (id+label) est le signal FORT et seul décisif : un projet avec une
// stack longue (7-8 technologies) ne doit pas voir son score dilué si on
// mélangeait nom et technologies dans un même sac de mots — une techno
// partagée ("React") ne doit jamais suffire à identifier UN projet précis,
// donc elle ne sert qu'à départager un score de nom déjà nul (repli faible).
// overlap() (pas jaccard), + withAdjacentBigrams() côté message : un nom de
// projet mono-mot ("zombieland") tapé en plusieurs mots ("zombie land")
// matche quand même. fuzzyOverlap() (pas overlap) pour le nom uniquement :
// une faute de frappe ("zombiland") ne doit pas non plus faire échouer le
// match — sans grounding, le LLM invente le projet de toutes pièces.
const NAME_THRESHOLD = 0.5;
const TECH_FALLBACK_THRESHOLD = 0.6; // volontairement haut : juste un départage, jamais un vrai signal d'identification

export const matchProject = (text, projects = [], language = "fr", threshold = NAME_THRESHOLD) => {
  const msgTokens = withAdjacentBigrams(tokenize(text));
  let best = null;
  let bestScore = 0;
  let bestTechScore = 0;
  let bestTechId = null;

  for (const p of projects) {
    const loc = p[language] || p.fr;
    const nameTokens = tokenize([p.id, loc?.label].filter(Boolean).join(" "));
    const nameScore = fuzzyOverlap(msgTokens, nameTokens);
    if (nameScore > bestScore) {
      bestScore = nameScore;
      best = p.id;
    }

    const techTokens = tokenize((p.technologies || []).join(" "));
    const techScore = overlap(msgTokens, techTokens);
    if (techScore > bestTechScore) {
      bestTechScore = techScore;
      bestTechId = p.id;
    }
  }

  if (bestScore >= threshold) return best;
  if (bestTechScore >= TECH_FALLBACK_THRESHOLD) return bestTechId;
  return null;
};

// Mémoire contextuelle (légère) : détecte un pronom/référence implicite vers
// "le projet dont on parlait" ("ce projet", "cette appli", "it", "that
// project"…), utilisé UNIQUEMENT quand matchProject() n'a trouvé aucun nom
// explicite — pour retomber sur state.lastProjectId plutôt qu'ignorer la
// question ou lister tous les projets (voir intentHandlers/projectShow.js et
// projectInfo.js).
// "celui-ci"/"celui-là" sont des pronoms démonstratifs autonomes (ils
// REMPLACENT le nom, jamais suivis de "projet") ; "ce/cet/cette" à l'inverse
// exigent le nom qui suit ("ce projet", pas "ce" tout seul).
const PREVIOUS_PROJECT_RE =
  /\b(ce|cet|cette)\s+(projet|appli|application|site|jeu)\b|\bcelui-(ci|la|là)\b|\b(this|that|the same)\s+project\b/i;

export const referencesPreviousProject = (text = "") => PREVIOUS_PROJECT_RE.test(text.toLowerCase());

export { COLOR_NAMES };
