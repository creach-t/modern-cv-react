import { buildScopedPrompt, profileFacts, skillsFacts } from "../promptFragments";

/** Compétences / stack technique. */
export const resolve = ({ language, data, state }) => ({
  type: "llm",
  systemPrompt: buildScopedPrompt(language, state, [profileFacts(), skillsFacts(data, language)]),
});
