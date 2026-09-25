/**
 * Routeur d'intentions : embeddings (ou repli lexical) contre les exemples de
 * intents.config.js ; en zone grise (score bas ou top1/top2 trop proches),
 * bascule sur le classifieur LLM. Toute erreur/incertitude retombe sur
 * hors_scope (jamais d'exception qui remonte à l'appelant).
 */
import {
  INTENTS,
  INTENT_IDS,
  GREY_ZONE_MARGIN,
  MIN_CONFIDENCE,
  HORS_SCOPE_DOMINANCE_MARGIN,
} from "./intents.config";
import { remoteSimilarities, lexicalSimilarities } from "./embeddings";
import { classifyWithLLM } from "./intentClassifierLLM";
import { matchProject } from "./slots";
import { stripDia } from "./textUtils";

const SHOW_VERB_RE = /\b(montre|montrer|presente|presenter|affiche|voir|show|present|display)\b/i;

const buildCandidateList = (language) => {
  const lang = language === "en" ? "en" : "fr";
  const list = [];
  for (const id of INTENT_IDS) {
    const examples = INTENTS[id].examples[lang] || INTENTS[id].examples.fr || [];
    for (const text of examples) list.push({ intent: id, text });
  }
  return list;
};

const maxScoreByIntent = (candidates, scores) => {
  const best = {};
  candidates.forEach((c, i) => {
    const s = scores[i] ?? 0;
    if (best[c.intent] === undefined || s > best[c.intent]) best[c.intent] = s;
  });
  return best;
};

/**
 * Décide localement (sans LLM) à partir de scores de similarité déjà
 * calculés (peu importe leur source : embeddings distants ou repli lexical).
 * Retourne `null` quand la situation est ambiguë (→ le classifieur LLM
 * doit trancher). Exportée séparément pour être testable indépendamment
 * de l'origine des scores.
 *
 * Règle d'or : un vrai intent (top1) confiant et net devant le second
 * l'emporte toujours, MÊME si hors_scope a un score correct — un faux refus
 * (ex. "contacte-le" classé hors_scope) coûte bien plus cher en UX qu'un
 * faux négatif hors_scope (rattrapé par le classifieur LLM juste après).
 * hors_scope ne court-circuite le classifieur QUE si son signal est
 * écrasant : la similarité sur une phrase courte est bruitée.
 */
export const decideFromScores = (byIntent) => {
  const ranked = INTENT_IDS.filter((id) => id !== "hors_scope")
    .map((id) => ({ id, score: byIntent[id] ?? 0 }))
    .sort((a, b) => b.score - a.score);
  const [top1, top2] = ranked;

  const ambiguous =
    !top1 ||
    top1.score < MIN_CONFIDENCE ||
    (top2 && top1.score - top2.score < GREY_ZONE_MARGIN);

  if (!ambiguous && top1.score >= (INTENTS[top1.id]?.threshold ?? MIN_CONFIDENCE)) {
    return { intent: top1.id, confidence: top1.score };
  }

  const horsScopeScore = byIntent.hors_scope ?? 0;
  if (
    horsScopeScore >= INTENTS.hors_scope.threshold &&
    horsScopeScore - (top1?.score ?? 0) >= HORS_SCOPE_DOMINANCE_MARGIN
  ) {
    return { intent: "hors_scope", confidence: horsScopeScore };
  }

  return null;
};

/**
 * Filet de sécurité posé APRÈS la classification sémantique : un nom de
 * projet réel peut sémantiquement "coller" à quelque chose de bien plus
 * connu pour un modèle généraliste (ex. "Zombieland" = le film de zombies de
 * 2009 avec Woody Harrelson, pas le projet de Théo) et se faire classer
 * hors_scope/faq_general malgré une correspondance de nom évidente. Si
 * matchProject() (fautes de frappe tolérées) identifie un projet avec
 * confiance mais que la classification est partie ailleurs, on corrige —
 * project_show pour "montre/présente X" (rapide, sans LLM), project_info
 * sinon (question ouverte : "c'est quoi X", "et zombieland ?"…).
 * Exportée séparément : ne dépend d'aucun état réseau, testable en isolation.
 */
export const applyProjectNameOverride = (routing, message, language, data) => {
  if (routing.intent === "project_show" || routing.intent === "project_info") return routing;
  const id = matchProject(message, data?.projects || [], language);
  if (!id) return routing;
  const intent = SHOW_VERB_RE.test(stripDia(message.toLowerCase())) ? "project_show" : "project_info";
  return { intent, confidence: 1, method: `${routing.method}+project_name_override` };
};

/**
 * @param {Array<{role,content}>} [history] - derniers échanges (SANS le
 * message courant), transmis au classifieur LLM de zone grise pour résoudre
 * les relances courtes/elliptiques ("et rose ?", "n'importe quoi") qui n'ont
 * de sens qu'à la lumière du tour précédent. L'étape embeddings/lexicale
 * reste, elle, sans mémoire (elle compare le message seul aux exemples).
 * @param {object} [data] - données CV (data.projects), pour le filet de
 * sécurité applyProjectNameOverride ci-dessus. Optionnel : sans data, ce
 * filet ne s'applique simplement pas.
 * @returns {Promise<{intent: string, confidence: number, method: string}>}
 */
export const classifyIntent = async (message, language, { signal, history = [], data } = {}) => {
  const candidates = buildCandidateList(language);
  const texts = candidates.map((c) => c.text);

  let scores;
  let method = "embeddings";
  try {
    scores = await remoteSimilarities(message, texts, { signal });
  } catch {
    scores = lexicalSimilarities(message, texts);
    method = "lexical";
  }

  const byIntent = maxScoreByIntent(candidates, scores);
  const decided = decideFromScores(byIntent);
  if (decided) return applyProjectNameOverride({ ...decided, method }, message, language, data);

  // Zone grise : classifieur LLM à sortie JSON contrainte, avec contexte.
  let result;
  try {
    result = { ...(await classifyWithLLM(message, language, { signal, history })), method: `${method}+llm` };
  } catch {
    result = { intent: "hors_scope", confidence: 0, method: `${method}+llm_failed` };
  }
  return applyProjectNameOverride(result, message, language, data);
};
