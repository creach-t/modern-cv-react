import { resolve } from "../intentHandlers/projectShow";
import { CONFIRM_ACTIONS } from "../actionProtocol";

const data = {
  projects: [{ id: "vectokid", fr: { label: "VectoKid", value: "app" }, technologies: ["React"] }],
};

describe("projectShow — visit (invasif) vs project (scroll sur la page)", () => {
  test('"montre-moi X" scrolls in-page (project), no confirmation needed', () => {
    const result = resolve({ message: "montre-moi VectoKid", language: "fr", data, state: {} });
    expect(result.steps).toEqual([{ name: "project", arg: "vectokid" }]);
    expect(CONFIRM_ACTIONS.includes("project")).toBe(false);
  });

  test('"ouvre le lien/la démo" resolves to visit (invasive: leaves the site)', () => {
    const result = resolve({ message: "ouvre la démo de VectoKid", language: "fr", data, state: {} });
    expect(result.steps).toEqual([{ name: "visit", arg: "vectokid" }]);
  });

  test("visit is in CONFIRM_ACTIONS, so AssistantWidget requires user confirmation before opening it", () => {
    expect(CONFIRM_ACTIONS.includes("visit")).toBe(true);
  });

  test.each([
    "ouvre le site en ligne de VectoKid",
    "va sur le vrai site de VectoKid",
    "open VectoKid's live demo",
    "open the link to VectoKid",
  ])('detects the invasive intent in: "%s"', (message) => {
    const result = resolve({ message, language: "fr", data, state: {} });
    expect(result.steps[0]?.name).toBe("visit");
  });
});

describe("projectShow — mémoire : 'ouvre-le' sans nom de projet", () => {
  // Bug rapporté : "et ouvre le" (aucun nom cité, juste un pronom "le") ne
  // matchait rien et ne déclenchait pas referencesPreviousProject() non plus
  // → repli faq_general (aucune notion de projet) → le LLM régurgitait des
  // bouts de ses propres règles internes ("ouvre le lien / la démo / le vrai
  // site", copié verbatim du prompt) faute de grounding.
  test('"et ouvre le" resolves to visit on the last shown project via memory', () => {
    const result = resolve({
      message: "et ouvre le",
      language: "fr",
      data,
      state: { lastProjectId: "vectokid" },
    });
    expect(result.steps).toEqual([{ name: "visit", arg: "vectokid" }]);
  });

  test('without any memory, "ouvre-le" still resolves to nothing (no silent wrong guess)', () => {
    const result = resolve({ message: "et ouvre le", language: "fr", data, state: {} });
    expect(result.steps).toEqual([]);
  });
});

describe("projectShow — une question sur un projet ne doit PAS juste scroller en silence", () => {
  // Bug rapporté : une suggestion générée ("Est-ce que ZombieLand est
  // ouvert ?") atterrissait sur project_show, qui scrolle silencieusement
  // (pastille seule) sans jamais répondre à la question posée.
  test("returns 0 steps for a real question (so resolveHandler falls back to project_info)", () => {
    const result = resolve({
      message: "est-ce que VectoKid est ouvert ?",
      language: "fr",
      data,
      state: {},
    });
    expect(result.steps).toEqual([]);
    expect(result.meta.projectId).toBe("vectokid"); // le projet reste identifié pour le repli
  });

  test("a show command with a trailing '?' still resolves normally (has an action verb)", () => {
    const result = resolve({ message: "montre-moi VectoKid ?", language: "fr", data, state: {} });
    expect(result.steps).toEqual([{ name: "project", arg: "vectokid" }]);
  });
});
