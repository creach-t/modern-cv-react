import { generateReadableHex, isHexColor, normalizeHex } from "../colorGenerator";

const hexToRgb = (hex) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};

// Luminance relative simplifiée (assez pour détecter "trop clair"/"trop sombre").
const relativeLuminance = ({ r, g, b }) => (0.299 * r + 0.587 * g + 0.114 * b) / 255;

describe("generateReadableHex — contrôle de la lisibilité", () => {
  test("always returns a well-formed 6-digit hex", () => {
    for (let i = 0; i < 50; i++) {
      expect(generateReadableHex()).toMatch(/^#[0-9A-F]{6}$/);
    }
  });

  test("never generates black, white, or a desaturated gray", () => {
    for (let i = 0; i < 200; i++) {
      const { r, g, b } = hexToRgb(generateReadableHex());
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      // Un gris/noir/blanc a un écart quasi nul entre canaux ; une vraie
      // couleur saturée a un écart net (>120 mesuré empiriquement sur la
      // plage HSL du générateur, marge de sécurité à 40).
      expect(max - min).toBeGreaterThan(40);
    }
  });

  test("never generates a color too dark or too light to read as an accent", () => {
    // Plage vérifiée empiriquement sur TOUTES les teintes (0.17-0.83) : marge
    // de sécurité à 0.15/0.85 pour absorber l'arrondi hex.
    for (let i = 0; i < 200; i++) {
      const luminance = relativeLuminance(hexToRgb(generateReadableHex()));
      expect(luminance).toBeGreaterThan(0.15);
      expect(luminance).toBeLessThan(0.85);
    }
  });

  test("is unpredictable: many calls produce many distinct colors", () => {
    const seen = new Set();
    for (let i = 0; i < 30; i++) seen.add(generateReadableHex());
    expect(seen.size).toBeGreaterThan(20);
  });
});

describe("isHexColor / normalizeHex", () => {
  test("recognizes hex colors with or without a leading #", () => {
    expect(isHexColor("#3F7ACD")).toBe(true);
    expect(isHexColor("3F7ACD")).toBe(true);
    expect(isHexColor("mauve")).toBe(false);
    expect(isHexColor("bleu-nuit")).toBe(false);
  });

  test("normalizes to an uppercase, #-prefixed hex", () => {
    expect(normalizeHex("3f7acd")).toBe("#3F7ACD");
    expect(normalizeHex("#3f7acd")).toBe("#3F7ACD");
  });
});
