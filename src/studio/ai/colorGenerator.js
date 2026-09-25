/**
 * Génération de couleurs hexadécimales pour l'action "color" de l'assistant.
 * Teinte libre (aléatoire sur les 360°), mais saturation et luminosité
 * bornées pour GARDER LE CONTRÔLE SUR LA LISIBILITÉ sur le fond sombre du
 * site : jamais de noir/blanc/gris (désaturé) ni de ton trop pâle/trop
 * sombre, sans avoir à maintenir une liste figée de couleurs "sûres".
 */
// Bornes choisies empiriquement sur la luminance perçue (pondération
// 0.299/0.587/0.114 par canal, pas juste "L" en HSL) : les teintes
// jaune/vert lisent beaucoup plus clair qu'un bleu à L identique, donc une
// plage HSL naïve (ex. L 42-68%) peut produire un jaune quasi blanc ou un
// bleu quasi noir. Ces bornes gardent la luminance perçue dans ~0.17-0.83
// sur TOUTES les teintes (voir __tests__/colorGenerator.test.js).
const MIN_SATURATION = 58; // en dessous : vire au gris, illisible en accent
const MAX_SATURATION = 80;
const MIN_LIGHTNESS = 46; // en dessous : trop proche du noir sur fond sombre
const MAX_LIGHTNESS = 56; // au-dessus : trop proche du blanc, perd le contraste

const randomIn = (min, max) => min + Math.random() * (max - min);

const hslToHex = (h, s, l) => {
  const sat = s / 100;
  const light = l / 100;
  const k = (n) => (n + h / 30) % 12;
  const a = sat * Math.min(light, 1 - light);
  const f = (n) => light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x) =>
    Math.round(255 * x)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`.toUpperCase();
};

/**
 * Génère un hex aléatoire garanti lisible (voir bornes ci-dessus). Utilisé
 * quand l'utilisateur demande une couleur sans nom précis, ou un nom que
 * resolveColor() ne connaît pas (voir intentHandlers/actionUI.js) — dans les
 * deux cas, mieux vaut une vraie génération qu'un repli sur une palette figée.
 */
export const generateReadableHex = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = randomIn(MIN_SATURATION, MAX_SATURATION);
  const lightness = randomIn(MIN_LIGHTNESS, MAX_LIGHTNESS);
  return hslToHex(hue, saturation, lightness);
};

export const isHexColor = (value = "") => /^#?[0-9a-f]{6}$/i.test(value);

export const normalizeHex = (value = "") => (value.startsWith("#") ? value.toUpperCase() : `#${value.toUpperCase()}`);

const hexToRgb = (hex) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};

const rgbToHsl = ({ r, g, b }) => {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  return { h: h * 60, s, l };
};

const HUE_FAMILIES = [
  [15, { fr: "rouge", en: "red" }],
  [45, { fr: "orange", en: "orange" }],
  [70, { fr: "jaune", en: "yellow" }],
  [160, { fr: "vert", en: "green" }],
  [200, { fr: "cyan", en: "cyan" }],
  [255, { fr: "bleu", en: "blue" }],
  [290, { fr: "indigo", en: "indigo" }],
  [330, { fr: "magenta", en: "magenta" }],
  [345, { fr: "rose", en: "pink" }],
  [360, { fr: "rouge", en: "red" }],
];

/**
 * Décrit un hex par une famille de teinte + une nuance ("un vert vif", "un
 * bleu profond") plutôt que d'afficher le code brut : nécessaire depuis que
 * generateReadableHex() produit des couleurs hors de la petite palette
 * nommée (COLOR_NAMES), donc sans nom exact disponible la plupart du temps.
 */
export const describeHex = (hex, language = "fr") => {
  const lang = language === "en" ? "en" : "fr";
  const { h, s, l } = rgbToHsl(hexToRgb(hex));
  if (s < 0.12) return lang === "en" ? "a neutral gray tone" : "un ton neutre grisé";
  const family = (HUE_FAMILIES.find(([max]) => h <= max) || HUE_FAMILIES[HUE_FAMILIES.length - 1])[1][lang];
  const modifier =
    l < 0.35
      ? lang === "en"
        ? "deep"
        : "profond"
      : l > 0.65
      ? lang === "en"
        ? "light"
        : "pâle"
      : lang === "en"
      ? "vivid"
      : "vif";
  return lang === "en" ? `a ${modifier} ${family}` : `un ${family} ${modifier}`;
};
