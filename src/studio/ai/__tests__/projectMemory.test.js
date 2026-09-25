import { resolve as resolveProjectShow } from "../intentHandlers/projectShow";
import { resolve as resolveProjectInfo } from "../intentHandlers/projectInfo";

const data = {
  projects: [
    { id: "vectokid", fr: { label: "VectoKid", value: "app" }, technologies: ["React"] },
    { id: "parade", fr: { label: "PARADE", value: "app" }, technologies: ["Vue"] },
  ],
};

describe("projectShow — mémoire contextuelle (lastProjectId)", () => {
  test("resolves an implicit reference to the last shown project", () => {
    const result = resolveProjectShow({
      message: "et celui-ci, montre-le encore",
      language: "fr",
      data,
      state: { lastProjectId: "vectokid" },
    });
    expect(result).toEqual({
      type: "deterministic",
      steps: [{ name: "project", arg: "vectokid" }],
      meta: { projectId: "vectokid" },
    });
  });

  test("an explicit name always wins over memory", () => {
    const result = resolveProjectShow({
      message: "montre-moi PARADE",
      language: "fr",
      data,
      state: { lastProjectId: "vectokid" },
    });
    expect(result.meta.projectId).toBe("parade");
  });

  test("no memory and no explicit name → unresolved (falls back upstream)", () => {
    const result = resolveProjectShow({ message: "montre-moi un projet", language: "fr", data, state: {} });
    expect(result.steps).toEqual([]);
  });
});

describe("projectInfo — mémoire contextuelle (lastProjectId)", () => {
  test("scopes the prompt to the memorized project on an implicit reference", () => {
    const result = resolveProjectInfo({
      message: "quelles technos sur ce projet ?",
      language: "fr",
      data,
      state: { lastProjectId: "parade" },
    });
    expect(result.meta.projectId).toBe("parade");
    // Seule la section FAITS (source de vérité) doit être scopée à PARADE ;
    // les few-shot EXEMPLES du socle commun peuvent légitimement citer
    // VectoKid, ils ne dépendent pas des faits injectés.
    const factsSection = result.systemPrompt.split("=== FAITS")[1];
    expect(factsSection).toContain("PARADE");
    expect(factsSection).not.toContain("VectoKid");
  });

  test("without memory, an implicit reference falls back to listing every project", () => {
    const result = resolveProjectInfo({
      message: "quelles technos sur ce projet ?",
      language: "fr",
      data,
      state: {},
    });
    expect(result.meta.projectId).toBeNull();
    expect(result.systemPrompt).toContain("VectoKid");
    expect(result.systemPrompt).toContain("PARADE");
  });
});
