import { extractSection } from "../slots";
import { buildMicroPrompt } from "../promptFragments";

const INSTRUCTION = {
  fr: "Le visiteur redemande d'aller vers une section déjà affichée à l'écran. Dis-le en 1 phrase courte et amusante, sans renvoyer nulle part.",
  en: "The visitor asked to go to a section that's already on screen. Say so in 1 short, funny sentence, without navigating anywhere.",
};

/**
 * Aucun appel LLM pour DÉCIDER : résout la section visée par mots-clés
 * (slots.js), instantané. "Conscience d'état" : si la section demandée est
 * déjà celle affichée (state.currentSection), un court passage LLM formule
 * une réplique qui le dit, générée à chaque fois plutôt que figée.
 */
export const resolve = ({ message, language, state = {} }) => {
  const section = extractSection(message);
  if (!section) return { type: "deterministic", steps: [] };

  if (section === state.currentSection) {
    return { type: "llm", systemPrompt: buildMicroPrompt(language, INSTRUCTION[language === "en" ? "en" : "fr"]) };
  }

  return { type: "deterministic", steps: [{ name: "goto", arg: section }] };
};
