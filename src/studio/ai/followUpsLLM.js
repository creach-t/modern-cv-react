/**
 * Suggestions de relance générées par un passage LLM léger (remplace le pool
 * statique de l'ancien followUps.js) : après chaque réponse, un appel court
 * (pas de streaming, peu de tokens) propose 2-3 relances plausibles à partir
 * de la conversation. Échec/JSON invalide → tableau vide, pas de chips ce
 * tour-ci (aucun texte figé de secours : cohérent avec le reste du routeur,
 * qui retombe déjà sur hors_scope plutôt que d'inventer un filet de sécurité).
 */
import { chatOnce } from "./aiClient";
import { buildFollowUpsPrompt } from "./promptFragments";

const parseArray = (raw, n) => {
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) return [];
  try {
    const arr = JSON.parse(match[0]);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((s) => typeof s === "string" && s.trim())
      .map((s) => s.trim())
      .slice(0, n);
  } catch {
    return [];
  }
};

/**
 * @param {object} ctx
 * @param {string} ctx.language
 * @param {Array<{label,blurb}>} [ctx.projects] - projets disponibles AVEC leur
 * vrai descriptif court (pas juste le nom : un nom seul laisse le modèle
 * free-associer sur des thèmes proches — ex. "ZombieLand" évoque le film de
 * zombies de 2009 pour un LLM généraliste, pas le vrai projet de Théo).
 * @param {string[]} [ctx.avoid] - notes "ne propose pas ça" (conscience d'état, voir AssistantWidget.jsx).
 * @param {Array<{role,content}>} [ctx.history] - derniers échanges (contexte conversationnel).
 * @param {string} [ctx.actionHint] - résumé de l'action venant d'être exécutée quand il n'y a pas de texte assistant (branche "deterministic").
 * @returns {Promise<string[]>}
 */
export const generateFollowUps = async (
  { language, projects, avoid, history = [], actionHint },
  { signal, n = 3 } = {}
) => {
  const system = buildFollowUpsPrompt(language, { projects, avoid, n });
  const hint = actionHint
    ? [{ role: "system", content: actionHint }]
    : [];
  const messages = [{ role: "system", content: system }, ...hint, ...history];

  try {
    const raw = await chatOnce({ messages, signal, maxTokens: 200 });
    return parseArray(raw, n);
  } catch {
    return [];
  }
};
