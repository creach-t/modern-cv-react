import { extractActionUI, isColorInfoQuestion } from "../slots";
import { resolveColor } from "../actionProtocol";
import { generateReadableHex } from "../colorGenerator";
import { buildMicroPrompt } from "../promptFragments";

const ALREADY_STATE_INSTRUCTION = {
  color: {
    fr: "Le visiteur redemande une couleur déjà active sur le site. Dis-le en 1 phrase courte et amusante, sans changer quoi que ce soit.",
    en: "The visitor asked for a color that's already active. Say so in 1 short, funny sentence, without changing anything.",
  },
  lang: {
    fr: "Le visiteur redemande de passer dans la langue déjà active. Dis-le en 1 phrase courte et amusante.",
    en: "The visitor asked to switch to the language that's already active. Say so in 1 short, funny sentence.",
  },
  launch_os: {
    fr: "Le visiteur redemande de lancer creachOS (mode développeur) alors qu'il tourne déjà. Dis-le en 1 phrase courte et amusante.",
    en: "The visitor asked to launch creachOS (dev mode) but it's already running. Say so in 1 short, funny sentence.",
  },
};

const alreadyThere = (kind, language) => {
  const lang = language === "en" ? "en" : "fr";
  return { type: "llm", systemPrompt: buildMicroPrompt(language, ALREADY_STATE_INSTRUCTION[kind][lang]) };
};

const sameColor = (hex, state) => hex && state.colorHex && hex.toLowerCase() === state.colorHex.toLowerCase();

// "tu as quoi comme couleur ?" : une question sur l'état ACTUEL, pas une
// demande de changement — répond avec la VRAIE couleur (state.color),
// jamais une couleur inventée ni un changement non désiré.
const currentColorReply = (language, state) => {
  const lang = language === "en" ? "en" : "fr";
  const colorName = state.color || (lang === "en" ? "an unknown color" : "une couleur inconnue");
  const instruction =
    lang === "en"
      ? `The visitor asks about the site's current color (even if they say "background"/"theme" — there is only ONE controllable color, the ACCENT: buttons, highlights, links; the page background itself stays dark, it never changes). In 1 short sentence, tell them the accent color is "${colorName}" — this is the REAL current color, state it as a plain fact, don't invent anything else, and don't change it.`
      : `Le visiteur demande la couleur actuelle du site (même s'il dit "fond"/"thème" — il n'y a qu'UNE seule couleur pilotable, celle D'ACCENT : boutons, surlignages, liens ; le fond de page lui-même reste sombre, il ne change jamais). En 1 phrase courte, dis-lui que la couleur d'accent est "${colorName}" — c'est la VRAIE couleur actuelle, énonce-la comme un simple fait, n'invente rien d'autre, et ne la change pas.`;
  return { type: "llm", systemPrompt: buildMicroPrompt(language, instruction) };
};

/**
 * Résout l'action couleur : un nom connu l'emporte (extractActionUI ne
 * renvoie jamais un `arg` que resolveColor ne sait pas résoudre). Sans nom
 * précis, une vraie QUESTION sur l'état actuel ("tu as quoi comme couleur ?")
 * répond avec le fait réel plutôt que de changer la couleur ; sinon (demande
 * aléatoire, "change la couleur") on GÉNÈRE un hex lisible (colorGenerator.js)
 * plutôt que de se limiter à une petite palette figée.
 */
const resolveColorAction = (action, message, language, state) => {
  if (!action.arg && isColorInfoQuestion(message)) return currentColorReply(language, state);

  if (action.arg) {
    const hex = resolveColor(action.arg);
    if (sameColor(hex, state)) return alreadyThere("color", language);
    return { type: "deterministic", steps: [{ name: "color", arg: action.arg }] };
  }

  const generated = generateReadableHex();
  if (sameColor(generated, state)) return alreadyThere("color", language); // collision rarissime, gratuite à couvrir
  return { type: "deterministic", steps: [{ name: "color", arg: generated }] };
};

/**
 * Aucun appel LLM pour DÉCIDER de l'action (couleur/langue/CV/contact/
 * creachOS résolus par regex, instantané). "Conscience d'état" : si l'action
 * demandée ne changerait rien (déjà cette couleur/langue/mode), pas
 * d'exécution inutile — un court passage LLM formule alors une réplique qui
 * le dit, générée à chaque fois plutôt que piochée dans un pool figé.
 */
export const resolve = ({ message, language, state = {} }) => {
  const action = extractActionUI(message);
  if (!action) return { type: "deterministic", steps: [] };

  if (action.name === "launch_os" && state.osMode === "os") return alreadyThere("launch_os", language);

  if (action.name === "lang") {
    const current = language === "en" ? "en" : "fr";
    if (action.arg === current) return alreadyThere("lang", language);
  }

  if (action.name === "color") return resolveColorAction(action, message, language, state);

  return { type: "deterministic", steps: [action] };
};
