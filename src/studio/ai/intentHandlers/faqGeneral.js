import { buildScopedPrompt, profileFacts, skillsFacts } from "../promptFragments";

/**
 * Questions générales (dispo, contact, localisation…) ET repli universel
 * quand un handler "deterministic" (nav_section/action_ui/project_show) n'a
 * pas réussi à résoudre son slot : le socle commun (toujours inclus par
 * buildScopedPrompt) porte déjà les règles d'action [[do:goto/project/...]],
 * donc le LLM peut encore agir correctement à partir de ce contexte général.
 */
export const resolve = ({ language, data, state }) => ({
  type: "llm",
  systemPrompt: buildScopedPrompt(language, state, [profileFacts(), skillsFacts(data, language)]),
});
