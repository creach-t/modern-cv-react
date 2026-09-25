/**
 * Petits utilitaires texte partagés (slot-filling déterministe + repli
 * lexical du routeur d'intentions quand les embeddings distants sont
 * indisponibles).
 */

// Retire les accents (é→e).
export const stripDia = (s = "") => s.normalize("NFD").replace(/[̀-ͯ]/g, "");

export const tokenize = (s = "") =>
  new Set(
    stripDia(String(s).toLowerCase())
      .replace(/[^a-z0-9]+/g, " ")
      .split(" ")
      .filter((w) => w.length > 1)
  );

export const jaccard = (a, b) => {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const w of a) if (b.has(w)) inter++;
  return inter / (a.size + b.size - inter);
};

// Coefficient de chevauchement (intersection / plus petit ensemble) : contrairement
// à Jaccard, un message long truffé de mots-outils ("ouvre le site en ligne de
// VectoKid") ne dilue pas le score dès lors que les tokens distinctifs de `b`
// (ex. le nom du projet) sont couverts. Utilisé pour matchProject() : on
// cherche "est-ce que ce projet est cité dans ce message ?", pas une
// similarité globale entre les deux textes.
export const overlap = (a, b) => {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const w of a) if (b.has(w)) inter++;
  return inter / Math.min(a.size, b.size);
};

// Ajoute, à un ensemble de tokens ORDONNÉ, la concaténation de chaque paire
// de mots adjacents ("zombie","land" → aussi "zombieland"). Certains noms de
// projets sont un seul mot que l'utilisateur tape naturellement en plusieurs
// ("zombie land", "vecto kid") : sans ça, aucun token du message n'égale
// jamais l'id/label mono-mot, et matchProject() rate le projet entièrement.
export const withAdjacentBigrams = (tokens) => {
  const ordered = [...tokens];
  const out = new Set(tokens);
  for (let i = 0; i < ordered.length - 1; i++) out.add(ordered[i] + ordered[i + 1]);
  return out;
};

// Distance d'édition (Levenshtein) classique.
export const levenshtein = (a, b) => {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const row = [i];
    for (let j = 1; j <= n; j++) {
      row[j] =
        a[i - 1] === b[j - 1]
          ? prev[j - 1]
          : 1 + Math.min(prev[j - 1], prev[j], row[j - 1]);
    }
    prev = row;
  }
  return prev[n];
};

// Tolère une faute de frappe/orthographe ("zombiland" pour "zombieland") sans
// jamais matcher deux mots courts qui se ressemblent par coïncidence : pas de
// tolérance sous 4 caractères, 1 faute jusqu'à 7, 2 au-delà.
const fuzzyEquals = (a, b) => {
  if (a === b) return true;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen < 4) return false;
  const tolerance = maxLen <= 7 ? 1 : 2;
  return levenshtein(a, b) <= tolerance;
};

// Comme overlap(), mais l'égalité token-à-token tolère une faute de frappe
// (voir fuzzyEquals). Utilisé UNIQUEMENT pour matcher des noms propres (id/
// label de projet) — jamais pour des mots-outils, où une tolérance en ferait
// coïncider trop facilement deux mots sans rapport.
export const fuzzyOverlap = (a, b) => {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const w of a) {
    for (const w2 of b) {
      if (fuzzyEquals(w, w2)) {
        inter++;
        break;
      }
    }
  }
  return inter / Math.min(a.size, b.size);
};
