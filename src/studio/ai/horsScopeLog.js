/**
 * Journalisation des messages classés hors_scope. Pas de backend dans ce
 * repo (site statique, cf. CLAUDE.md) : on journalise en localStorage
 * (anneau borné). Utile pour affiner les exemples/seuils de intents.config.js
 * a posteriori en inspectant les faux positifs/négatifs.
 */
const LOG_KEY = "studio_horsscope_log_v1";
const LOG_MAX = 50;

export const logHorsScope = (message, { intent, confidence, method } = {}) => {
  try {
    const raw = JSON.parse(localStorage.getItem(LOG_KEY));
    const list = Array.isArray(raw) ? raw : [];
    list.push({
      at: new Date().toISOString(),
      message: String(message).slice(0, 300),
      routedFrom: intent,
      confidence,
      method,
    });
    localStorage.setItem(LOG_KEY, JSON.stringify(list.slice(-LOG_MAX)));
  } catch {
    /* ignore (quota localStorage, mode privé, etc.) */
  }
};

export const readHorsScopeLog = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(LOG_KEY));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
};
