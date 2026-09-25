import { buildScopedPrompt, profileFacts, journeyFacts } from "../promptFragments";

/** Parcours, formation, reconversion, expérience. */
export const resolve = ({ language, data, state }) => ({
  type: "llm",
  systemPrompt: buildScopedPrompt(language, state, [profileFacts(), journeyFacts(data, language)]),
});
