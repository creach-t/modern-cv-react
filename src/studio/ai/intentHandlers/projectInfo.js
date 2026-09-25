import { buildScopedPrompt, profileFacts, projectsFacts } from "../promptFragments";
import { matchProject, referencesPreviousProject, wantsExternalVisit } from "../slots";

/**
 * Questions ouvertes sur un/plusieurs projets. Si un projet précis est cité,
 * le prompt n'injecte QUE ce projet (économie de tokens) ; sinon la liste
 * complète (ex. "montre-moi tes projets React").
 * Mémoire contextuelle : "quelles technos sur CE projet ?" ou "et ouvre-le"
 * sans nom explicite retombe sur state.lastProjectId plutôt que de lister
 * tous les projets (voir projectShow.js pour le rationale complet).
 */
export const resolve = ({ message, language, data, state = {} }) => {
  const projects = data?.projects || [];
  // Seuil légèrement plus strict que project_show (0.5 par défaut) : ici une
  // correspondance ambiguë doit retomber sur "tous les projets" plutôt que
  // scoper le prompt au mauvais projet.
  let id = matchProject(message, projects, language, 0.6);
  if (!id && state.lastProjectId && (referencesPreviousProject(message) || wantsExternalVisit(message))) {
    id = state.lastProjectId;
  }
  const systemPrompt = buildScopedPrompt(language, state, [
    profileFacts(),
    projectsFacts(data, language, id ? [id] : null),
  ]);
  // meta.projectId (si résolu) : voir projectShow.js pour le rationale.
  return { type: "llm", systemPrompt, meta: { projectId: id } };
};
