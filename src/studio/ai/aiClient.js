/**
 * Client de l'assistant IA (api-llm.creachtheo.fr).
 *
 * SÉCURITÉ : la clé n'est JAMAIS en dur. Elle est lue depuis
 * process.env.REACT_APP_LLM_API_KEY (fichier .env, non commité).
 * ⚠️ En CRA, cette variable est injectée dans le bundle public au build :
 * elle est donc extractible côté client. Le rate-limit client (AssistantWidget)
 * est donc contournable : ce n'est qu'un garde-fou UX, pas une sécurité.
 *
 * TODO (infra, hors de ce fichier) : ajouter un proxy nginx qui injecte le
 * header Authorization côté serveur, puis pointer REACT_APP_LLM_API_URL vers
 * "/api" et laisser REACT_APP_LLM_API_KEY vide. La clé ne quitte alors plus le
 * VPS et le quota devient réellement protégé (rate-limit à faire côté proxy).
 */
const BASE_URL = (
  process.env.REACT_APP_LLM_API_URL || "https://api-llm.creachtheo.fr"
).replace(/\/$/, "");
const API_KEY = process.env.REACT_APP_LLM_API_KEY || "";

// Modèle par défaut : léger pour ménager le quota du worker Cloudflare
// (configurable via .env : "mistral", "llama-70b", etc.).
export const DEFAULT_MODEL = process.env.REACT_APP_LLM_MODEL || "fast";

// Plafond de tokens en sortie. Workers AI applique un cap par défaut bas
// (~256) qui TRONQUE la réponse : or le tag d'action ([[do:…]] / [[plan:…]])
// est en FIN de message, donc coupé → action annoncée mais jamais exécutée.
// On force donc une valeur plus haute (configurable via .env).
export const MAX_TOKENS =
  parseInt(process.env.REACT_APP_LLM_MAX_TOKENS, 10) > 0
    ? parseInt(process.env.REACT_APP_LLM_MAX_TOKENS, 10)
    : 384;

// Libellé affiché du modèle (« Propulsé par … »). L'alias technique (ex. "fast")
// n'étant pas parlant, on privilégie REACT_APP_LLM_MODEL_LABEL ; sinon on
// retombe sur un libellé lisible connu, puis sur l'alias brut.
const MODEL_LABELS = {
  fast: "Llama 3.1 8B · Cloudflare", // @cf/meta/llama-3.1-8b-instruct-fp8
  "llama-8b": "Llama 3.1 8B · Cloudflare",
  "llama-70b": "Llama 3.3 70B · Cloudflare",
  mistral: "Mistral 7B · Cloudflare",
};
export const MODEL_LABEL =
  process.env.REACT_APP_LLM_MODEL_LABEL ||
  MODEL_LABELS[DEFAULT_MODEL] ||
  DEFAULT_MODEL;

export const isAIConfigured = () => Boolean(API_KEY);

const authHeaders = () => {
  const h = { "Content-Type": "application/json" };
  // Si un proxy gère l'auth (REACT_APP_LLM_API_URL = "/api"), pas de clé côté client.
  if (API_KEY) h.Authorization = `Bearer ${API_KEY}`;
  return h;
};

const errorMessage = (status) => {
  switch (status) {
    case 401:
      return "auth";
    case 429:
      return "quota";
    case 502:
      return "unavailable";
    default:
      return "error";
  }
};

/**
 * Envoie une conversation et streame la réponse token par token.
 * @param {{messages: Array, model?: string, signal?: AbortSignal, onToken?: (t:string)=>void}} opts
 * @returns {Promise<string>} le texte complet
 */
export const streamChat = async ({
  messages,
  model = DEFAULT_MODEL,
  signal,
  onToken,
}) => {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ messages, model, stream: true, max_tokens: MAX_TOKENS }),
    signal,
  });

  if (!res.ok) {
    const err = new Error(`chat failed: ${res.status}`);
    err.kind = errorMessage(res.status);
    throw err;
  }

  // Pas de flux lisible → fallback non-stream
  if (!res.body || !res.body.getReader) {
    const data = await res.json();
    const text = data.response || "";
    onToken?.(text);
    return text;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (payload === "[DONE]") return full;
      try {
        const json = JSON.parse(payload);
        const token = json.response || "";
        if (token) {
          full += token;
          onToken?.(token);
        }
      } catch {
        /* ligne SSE partielle : ignorée */
      }
    }
  }
  return full;
};
