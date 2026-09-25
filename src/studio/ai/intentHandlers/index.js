import * as navSection from "./navSection";
import * as actionUI from "./actionUI";
import * as projectShow from "./projectShow";
import * as projectInfo from "./projectInfo";
import * as journey from "./journey";
import * as skillsExperience from "./skillsExperience";
import * as faqGeneral from "./faqGeneral";
import * as meta from "./meta";
import * as horsScope from "./horsScope";

export const HANDLERS = {
  nav_section: navSection,
  action_ui: actionUI,
  project_show: projectShow,
  project_info: projectInfo,
  journey,
  skills_experience: skillsExperience,
  faq_general: faqGeneral,
  meta,
  hors_scope: horsScope,
};

// Repli spécifique par intention quand le handler "deterministic" ne trouve
// pas son slot : project_show échoué (ex. "et ouvre-le" sans mémoire dispo)
// retombe sur project_info plutôt que faq_general, pour garder au moins le
// bloc PROJETS (condensé) dans le prompt — faq_general n'a AUCUNE notion de
// projet, ce qui pousse le LLM à inventer ou, pire, à régurgiter des bouts de
// ses propres règles internes (protocole d'actions) faute de grounding.
const DETERMINISTIC_FALLBACK = {
  project_show: "project_info",
};

/**
 * Résout l'intention classée en un résultat consommable par AssistantWidget :
 * { type: "deterministic", steps, meta? } | { type: "llm", systemPrompt, meta? }
 *
 * "deterministic" : aucun appel LLM, l'action est résolue par regex/whitelist
 * (nav_section, action_ui, project_show). "llm" couvre aussi bien les
 * réponses ouvertes (journey, project_info…) que les répliques courtes
 * générées à la volée (meta, hors_scope, "déjà cet état") via un prompt
 * minimal (promptFragments.buildMicroPrompt) — plus de pool de textes figés.
 *
 * Repli : un handler "deterministic" qui ne trouve pas son slot retombe sur
 * DETERMINISTIC_FALLBACK[intent] si défini, sinon faq_general (LLM, contexte
 * général) — jamais de silence.
 */
export const resolveHandler = (intent, ctx) => {
  const handler = HANDLERS[intent] || HANDLERS.hors_scope;
  const result = handler.resolve(ctx);
  if (result.type === "deterministic" && result.steps.length === 0) {
    const fallbackIntent = DETERMINISTIC_FALLBACK[intent] || "faq_general";
    return HANDLERS[fallbackIntent].resolve(ctx);
  }
  return result;
};
