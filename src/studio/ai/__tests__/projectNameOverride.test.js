import { applyProjectNameOverride } from "../intentRouter";

const data = {
  projects: [{ id: "zombieland", fr: { label: "ZombieLand", value: "app" }, technologies: ["React"] }],
};

describe("applyProjectNameOverride — collision sémantique (ex. Zombieland le film)", () => {
  test("corrects hors_scope to project_info when a real project is confidently named", () => {
    const routing = { intent: "hors_scope", confidence: 0.7, method: "embeddings" };
    const result = applyProjectNameOverride(routing, "c'est quoi zombieland ?", "fr", data);
    expect(result.intent).toBe("project_info");
    expect(result.method).toContain("project_name_override");
  });

  test("tolerates a typo in the project name (reuses matchProject's fuzzy matching)", () => {
    const routing = { intent: "faq_general", confidence: 0.6, method: "embeddings" };
    const result = applyProjectNameOverride(routing, "zombiland c'est quoi ?", "fr", data);
    expect(result.intent).toBe("project_info");
  });

  test("routes to project_show (fast path, no LLM) for an imperative 'show me X'", () => {
    const routing = { intent: "hors_scope", confidence: 0.7, method: "embeddings" };
    const result = applyProjectNameOverride(routing, "montre-moi zombieland", "fr", data);
    expect(result.intent).toBe("project_show");
  });

  test("leaves the routing untouched when already project_show/project_info", () => {
    const routing = { intent: "project_show", confidence: 0.9, method: "embeddings" };
    expect(applyProjectNameOverride(routing, "montre-moi zombieland", "fr", data)).toBe(routing);
  });

  test("leaves the routing untouched when no project is named at all", () => {
    const routing = { intent: "hors_scope", confidence: 0.7, method: "embeddings" };
    const result = applyProjectNameOverride(routing, "quelle est la météo ?", "fr", data);
    expect(result).toBe(routing);
  });

  test("does nothing when no data/projects are provided (never throws)", () => {
    const routing = { intent: "hors_scope", confidence: 0.7, method: "embeddings" };
    expect(applyProjectNameOverride(routing, "c'est quoi zombieland ?", "fr", undefined)).toBe(routing);
  });
});
