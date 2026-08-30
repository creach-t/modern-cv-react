/**
 * Client de l'assistant IA (api-llm.creachtheo.fr).
 *
 * SÉCURITÉ : la clé n'est JAMAIS en dur. Elle est lue depuis
 * process.env.REACT_APP_LLM_API_KEY (fichier .env, non commité).
 * ⚠️ En CRA, cette variable est injectée dans le bundle public au build :
 * elle est donc extractible côté client. Pour un vrai secret, passer par un
 * proxy nginx qui ajoute le header Authorization côté serveur — il suffira
 * alors de pointer REACT_APP_LLM_API_URL vers "/api" et de retirer la clé.
 */
const BASE_URL = (
  process.env.REACT_APP_LLM_API_URL || "https://api-llm.creachtheo.fr"
).replace(/\/$/, "");
const API_KEY = process.env.REACT_APP_LLM_API_KEY || "";

// Modèle par défaut : un modèle "malin" (configurable via .env).
export const DEFAULT_MODEL = process.env.REACT_APP_LLM_MODEL || "llama-70b";

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
    body: JSON.stringify({ messages, model, stream: true }),
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
