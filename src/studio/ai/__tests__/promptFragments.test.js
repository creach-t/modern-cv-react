import { projectsFacts } from "../promptFragments";
import realProjectsData from "../../../../public/data/projects.json";

describe("projectsFacts — grounding sur un projet ciblé", () => {
  test("scoped to one project: injects the real explanation, not just label/value", () => {
    const facts = projectsFacts(realProjectsData, "fr", ["zombieland"]);
    // Sans ce grounding, le LLM n'a que label+value pour une question détaillée
    // ("comment il a développé X ?") et invente des détails plausibles mais
    // faux (ex. hallucination observée : "hébergé sur son propre serveur",
    // "expérience DevOps" — jamais dit dans les FAITS).
    expect(facts).toContain("projet de fin de formation");
    expect(facts).toContain("O'Clock");
    expect(facts).toContain("référencé");
  });

  test("general overview (no ids): stays condensed, no bloated explanations", () => {
    const facts = projectsFacts(realProjectsData, "fr", null);
    expect(facts).not.toContain("projet de fin de formation");
    expect(facts).toContain("ZombieLand");
  });

  test("scoped to 3+ projects: also stays condensed (token budget guard)", () => {
    const ids = realProjectsData.projects.slice(0, 3).map((p) => p.id);
    const facts = projectsFacts(realProjectsData, "fr", ids);
    expect(facts).not.toContain("projet de fin de formation");
  });

  test("falls back to `value` when a project has no explanation", () => {
    const data = { projects: [{ id: "x", fr: { label: "X", value: "un site" }, technologies: [] }] };
    const facts = projectsFacts(data, "fr", ["x"]);
    expect(facts).toContain("un site");
  });
});
