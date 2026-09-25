import { resolveHandler } from "../intentHandlers";

const data = {
  projects: [{ id: "vectokid", fr: { label: "VectoKid", value: "app" }, technologies: ["React"] }],
};

describe("resolveHandler — repli quand un handler déterministe ne trouve pas son slot", () => {
  test("project_show with no resolvable project falls back to project_info (keeps project grounding)", () => {
    // Avant : retombait sur faq_general, qui n'a AUCUN fait projet — le LLM
    // pouvait inventer ou régurgiter des bouts de ses règles internes.
    const ctx = { message: "et ouvre le", language: "fr", data, state: {} };
    const result = resolveHandler("project_show", ctx);
    expect(result.type).toBe("llm");
    const factsSection = result.systemPrompt.split("=== FAITS")[1];
    expect(factsSection).toContain("VectoKid");
  });

  test("nav_section/action_ui misses still fall back to faq_general (no richer LLM handler fits)", () => {
    const ctx = { message: "bla bla bla", language: "fr", data, state: {} };
    const result = resolveHandler("nav_section", ctx);
    expect(result.type).toBe("llm");
    // "PROJETS" apparaît toujours dans le socle commun (règles d'action) ;
    // ce qui distingue project_info, c'est le VRAI contenu de projectsFacts().
    const factsSection = result.systemPrompt.split("=== FAITS")[1];
    expect(factsSection).not.toContain("VectoKid");
  });
});
