import { matchProject, referencesPreviousProject, wantsExternalVisit, isProjectQuestion } from "../slots";

/**
 * Aucun appel LLM : identifie le projet cité par similarité lexicale.
 * Mémoire contextuelle : si le message ne nomme rien mais y fait référence
 * implicitement ("ce projet"…) OU demande juste à l'ouvrir ("et ouvre-le",
 * sans nommer QUOI — le "ouvre" est déjà un signal fort qu'on parle du
 * dernier projet évoqué), retombe sur state.lastProjectId. Sans ce repli, un
 * "ouvre-le" sans projet identifiable tombait en fallback faq_general (voir
 * intentHandlers/index.js), qui n'a aucune notion de projet et pouvait même
 * régurgiter des bouts de ses propres règles internes faute de grounding.
 *
 * "montre/présente X" → project (scroll vers la section, sur la page).
 * "ouvre le lien/la démo/le vrai site de X" → visit (quitte le site, nouvel
 * onglet) : action INVASIVE, dans CONFIRM_ACTIONS → AssistantWidget affiche
 * automatiquement une confirmation avant de l'exécuter (voir send()/applySteps).
 */
export const resolve = ({ message, language, data, state = {} }) => {
  const projects = data?.projects || [];
  const visitRequested = wantsExternalVisit(message);
  let id = matchProject(message, projects, language);
  if (!id && state.lastProjectId && (referencesPreviousProject(message) || visitRequested)) {
    id = state.lastProjectId;
  }

  // "Est-ce que X est ouvert ?" veut une RÉPONSE, pas un scroll silencieux :
  // on renvoie 0 step (même si `id` est connu) pour laisser resolveHandler
  // basculer sur project_info (LLM, répond ET peut encore agir si pertinent) —
  // voir intentHandlers/index.js::DETERMINISTIC_FALLBACK.
  if (id && !visitRequested && isProjectQuestion(message)) {
    return { type: "deterministic", steps: [], meta: { projectId: id } };
  }

  const action = visitRequested ? "visit" : "project";
  // meta.projectId : permet aux suggestions de relance et à la mémoire du
  // tour suivant (voir followUpsLLM.js et AssistantWidget.jsx) de savoir
  // quel projet vient d'être montré.
  return {
    type: "deterministic",
    steps: id ? [{ name: action, arg: id }] : [],
    meta: { projectId: id },
  };
};
