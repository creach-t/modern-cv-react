import { resolve } from "../intentHandlers/navSection";

describe("navSection handler — conscience d'état", () => {
  test("delegates to a generated micro-reply when already on the requested section", () => {
    const result = resolve({
      message: "emmène-moi aux projets",
      language: "fr",
      state: { currentSection: "projects" },
    });
    expect(result.type).toBe("llm");
    expect(typeof result.systemPrompt).toBe("string");
    expect(result.systemPrompt.length).toBeGreaterThan(0);
  });

  test("navigates normally when on a different section", () => {
    const result = resolve({
      message: "emmène-moi aux projets",
      language: "fr",
      state: { currentSection: "about" },
    });
    expect(result).toEqual({ type: "deterministic", steps: [{ name: "goto", arg: "projects" }] });
  });

  test("navigates normally when the current section is unknown", () => {
    const result = resolve({ message: "va à la section contact", language: "fr", state: {} });
    expect(result).toEqual({ type: "deterministic", steps: [{ name: "goto", arg: "contact" }] });
  });

  test("falls back to empty steps when no section is recognized", () => {
    expect(resolve({ message: "bla bla bla", language: "fr", state: {} })).toEqual({
      type: "deterministic",
      steps: [],
    });
  });
});
