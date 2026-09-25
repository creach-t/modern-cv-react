/**
 * Révélation progressive d'un texte déjà connu (réponses "fixed" : hors_scope,
 * meta, notes de flow) pour un rendu cohérent avec les réponses "llm" qui,
 * elles, streament token par token depuis le Worker.
 */
export const typeOut = async (text, { onToken, signal, chunkSize = 2, intervalMs = 18 } = {}) => {
  for (let i = 0; i < text.length; i += chunkSize) {
    if (signal?.aborted) {
      const err = new Error("Aborted");
      err.name = "AbortError";
      throw err;
    }
    onToken?.(text.slice(i, i + chunkSize));
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
};
