/**
 * Régression bout-en-bout du bug rapporté : "tu peux m'en dire plus sur
 * zombie land ?" (id réel "zombieland", un seul mot) ne trouvait aucun
 * projet → le LLM répondait sans le moindre fait réel, et inventait un jeu
 * de survie zombie post-apocalyptique développé en équipe — alors que
 * ZombieLand est en réalité un site e-commerce/billetterie, projet de fin de
 * formation solo à O'Clock.
 */
import { resolve as resolveProjectInfo } from "../intentHandlers/projectInfo";
import realProjectsData from "../../../../public/data/projects.json";

describe("ZombieLand — 'zombie land' (deux mots) doit grounder le vrai projet", () => {
  test("resolves the real project id despite the word-boundary mismatch", () => {
    const result = resolveProjectInfo({
      message: "tu peux m'en dire plus sur zombie land ?",
      language: "fr",
      data: realProjectsData,
      state: {},
    });
    expect(result.meta.projectId).toBe("zombieland");
  });

  test("the generated prompt is grounded in the real explanation, not empty/generic", () => {
    const result = resolveProjectInfo({
      message: "tu peux m'en dire plus sur zombie land ?",
      language: "fr",
      data: realProjectsData,
      state: {},
    });
    const factsSection = result.systemPrompt.split("=== FAITS")[1];
    expect(factsSection).toContain("billetterie");
    expect(factsSection).toContain("projet de fin de formation");
    // Ne doit PAS contenir les 6 autres projets (prompt scopé, pas générique).
    expect(factsSection).not.toContain("VectoKid");
  });
});
