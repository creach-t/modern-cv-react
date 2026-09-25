/**
 * Similarité texte pour le routeur d'intentions : embeddings distants
 * (Worker Cloudflare, /embed) avec repli automatique sur une similarité
 * lexicale si l'endpoint est indisponible (pas encore déployé, en panne,
 * quota). Le routeur n'a pas à savoir lequel des deux est actif.
 */
import { embedBatch } from "./aiClient";
import { tokenize, jaccard } from "./textUtils";

const cosine = (a, b) => {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
};

/**
 * Calcule la similarité entre `message` et chaque texte de `candidates` en
 * un seul appel réseau groupé (message + candidats dans le même batch).
 * @returns {Promise<number[]>} un score par candidat, même ordre que `candidates`.
 */
export const remoteSimilarities = async (message, candidates) => {
  const { embeddings } = await embedBatch([message, ...candidates]);
  if (!Array.isArray(embeddings) || embeddings.length !== candidates.length + 1) {
    throw new Error("embed: réponse inattendue");
  }
  const [msgVec, ...candidateVecs] = embeddings;
  return candidateVecs.map((v) => cosine(msgVec, v));
};

/** Repli sans réseau : Jaccard sur tokens. Toujours disponible. */
export const lexicalSimilarities = (message, candidates) => {
  const msgTokens = tokenize(message);
  return candidates.map((c) => jaccard(msgTokens, tokenize(c)));
};
