import { resolve } from "../intentHandlers/actionUI";

describe("actionUI handler — conscience d'état", () => {
  test("delegates to a generated micro-reply when the requested color is already active", () => {
    const result = resolve({
      message: "mets le site en mauve",
      language: "fr",
      state: { colorHex: "#B57EDC" },
    });
    expect(result.type).toBe("llm");
    expect(typeof result.systemPrompt).toBe("string");
    expect(result.systemPrompt.length).toBeGreaterThan(0);
    // pas de FAITS/facts injectés : c'est un micro-prompt, pas le prompt complet.
    expect(result.systemPrompt).not.toContain("FAITS");
  });

  test("executes normally when the requested color differs from the current one", () => {
    const result = resolve({
      message: "mets le site en mauve",
      language: "fr",
      state: { colorHex: "#2563EB" }, // bleu
    });
    expect(result).toEqual({ type: "deterministic", steps: [{ name: "color", arg: "mauve" }] });
  });

  test("a random color request (no name) generates a fresh readable hex, never a no-op", () => {
    const result = resolve({
      message: "change la couleur du site",
      language: "fr",
      state: { colorHex: "#B57EDC" },
    });
    expect(result.type).toBe("deterministic");
    expect(result.steps).toHaveLength(1);
    expect(result.steps[0].name).toBe("color");
    expect(result.steps[0].arg).toMatch(/^#[0-9A-F]{6}$/);
  });

  test("answers a question about the current color instead of changing it (regression)", () => {
    // Bug rapporté : "tu as quoi comme couleur ?" déclenchait un changement
    // de couleur au lieu de répondre à la question posée.
    const result = resolve({ message: "tu as quoi comme couleur ?", language: "fr", state: { color: "mauve" } });
    expect(result.type).toBe("llm");
    expect(result.systemPrompt).toContain("mauve");
  });

  test.each(["c'est quoi la couleur actuelle ?", "quelle couleur as-tu ?", "what color do you have?"])(
    'treats "%s" as an info question, not a change request',
    (message) => {
      const result = resolve({ message, language: "fr", state: { color: "bleu" } });
      expect(result.type).toBe("llm");
    }
  );

  test("delegates to a generated micro-reply when already in the requested language", () => {
    const result = resolve({ message: "passe en français", language: "fr", state: {} });
    expect(result.type).toBe("llm");
  });

  test("executes a real language switch", () => {
    const result = resolve({ message: "passe le site en anglais", language: "fr", state: {} });
    expect(result).toEqual({ type: "deterministic", steps: [{ name: "lang", arg: "en" }] });
  });

  test("delegates to a generated micro-reply when creachOS is already running", () => {
    const result = resolve({ message: "lance le mode dev", language: "fr", state: { osMode: "os" } });
    expect(result.type).toBe("llm");
  });

  test("launches creachOS normally when not already running", () => {
    const result = resolve({ message: "lance le mode dev", language: "fr", state: { osMode: "cv" } });
    expect(result).toEqual({ type: "deterministic", steps: [{ name: "launch_os", arg: undefined }] });
  });

  test("falls back to empty steps when nothing is recognized", () => {
    expect(resolve({ message: "bla bla bla", language: "fr", state: {} })).toEqual({
      type: "deterministic",
      steps: [],
    });
  });
});
