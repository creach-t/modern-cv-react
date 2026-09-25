import {
  extractSection,
  extractActionUI,
  matchProject,
  referencesPreviousProject,
  isProjectQuestion,
} from "../slots";

describe("extractSection", () => {
  test.each([
    ["emmène-moi aux projets", "projects"],
    ["va à la section contact", "contact"],
    ["montre le parcours", "journey"],
    ["descends aux compétences", "skills"],
    ["parle-moi de la section à propos", "about"],
  ])("%s -> %s", (text, expected) => {
    expect(extractSection(text)).toBe(expected);
  });

  test("returns null when no section keyword matches", () => {
    expect(extractSection("bonjour, ça va ?")).toBeNull();
  });
});

describe("extractActionUI", () => {
  test("detects launch_os", () => {
    expect(extractActionUI("lance le mode dev")).toEqual({ name: "launch_os", arg: undefined });
    expect(extractActionUI("active creachOS")).toEqual({ name: "launch_os", arg: undefined });
  });

  test("detects download_cv", () => {
    expect(extractActionUI("télécharge le cv")).toEqual({ name: "download_cv", arg: undefined });
  });

  test("detects lang fr/en", () => {
    expect(extractActionUI("passe le site en anglais")).toEqual({ name: "lang", arg: "en" });
    expect(extractActionUI("switch to french")).toEqual({ name: "lang", arg: "fr" });
  });

  test("detects color with a known name", () => {
    expect(extractActionUI("mets le site en bleu")).toEqual({ name: "color", arg: "bleu" });
    expect(extractActionUI("mets une couleur mauve")).toEqual({ name: "color", arg: "mauve" });
  });

  test("detects color intent without a resolvable name", () => {
    expect(extractActionUI("change la couleur du site")).toEqual({ name: "color", arg: undefined });
  });

  test("detects email/contact", () => {
    expect(extractActionUI("je veux le contacter")).toEqual({ name: "email", arg: undefined });
    expect(extractActionUI("contacte-le")).toEqual({ name: "email", arg: undefined });
    expect(extractActionUI("écris-lui un message")).toEqual({ name: "email", arg: undefined });
    expect(extractActionUI("send him a message")).toEqual({ name: "email", arg: undefined });
  });

  test("returns null for unrelated text", () => {
    expect(extractActionUI("quel temps fait-il")).toBeNull();
  });
});

describe("matchProject", () => {
  // Stack volontairement longue (comme les vraies données) : vérifie que le
  // nom du projet reste le signal décisif même quand les technologies, prises
  // seules, dilueraient un score "sac de mots" classique.
  const projects = [
    {
      id: "vectokid",
      fr: { label: "VectoKid", value: "app" },
      technologies: ["React", "Node.js", "Express.js", "PostgreSQL", "Sequelize", "Tailwind CSS"],
    },
    {
      id: "zombieland",
      fr: { label: "ZombieLand", value: "app" },
      technologies: ["React", "Node.js", "Express.Js", "PostgreSQL", "Sequelize", "Tailwind CSS", "EJS"],
    },
  ];

  test("matches a project cited by name", () => {
    expect(matchProject("montre-moi VectoKid", projects, "fr")).toBe("vectokid");
    expect(matchProject("présente ZombieLand", projects, "fr")).toBe("zombieland");
  });

  test("matches a one-word id/label typed as two words (regression)", () => {
    // Bug rapporté : "zombie land" (deux mots) ne matchait plus jamais
    // l'id/label "zombieland" (un mot) → 0 grounding → le LLM inventait
    // un tout autre projet ("jeu de survie zombie post-apocalyptique").
    expect(matchProject("tu peux m'en dire plus sur zombie land ?", projects, "fr")).toBe("zombieland");
    expect(matchProject("vecto kid, c'est quoi ?", projects, "fr")).toBe("vectokid");
  });

  test("tolerates a one-letter typo in a one-word id/label (regression)", () => {
    // Bug rapporté : "zombiland" (lettre manquante) ne matchait toujours pas
    // "zombieland" malgré le fix espace/mot-composé — même symptôme,
    // fabrication du projet par le LLM faute de grounding.
    expect(matchProject("zombiland c'est quoi ?", projects, "fr")).toBe("zombieland");
  });

  test("does not fuzzy-match unrelated short words (no false positives)", () => {
    expect(matchProject("il fait du vélo ?", projects, "fr")).toBeNull();
  });

  test("returns null when no project is confidently referenced", () => {
    expect(matchProject("montre-moi tes projets", projects, "fr")).toBeNull();
  });

  test("a shared technology alone never confidently identifies ONE project", () => {
    // Les deux projets partagent React/Node/PostgreSQL/Sequelize/Tailwind :
    // une techno commune ne doit jamais trancher entre les deux.
    expect(matchProject("il a un projet en React ?", projects, "fr")).toBeNull();
  });
});

describe("referencesPreviousProject", () => {
  test.each([
    "quelles technos sur ce projet ?",
    "et cette appli, elle utilise quoi ?",
    "what tech does this project use?",
    "tell me more about that project",
  ])("detects an implicit reference in: %s", (text) => {
    expect(referencesPreviousProject(text)).toBe(true);
  });

  test.each([
    "quel est son parcours ?", // pronom possessif générique (Théo), pas un projet
    "montre-moi tes projets",
    "c'est quoi PARADE ?",
  ])("does not misfire on: %s", (text) => {
    expect(referencesPreviousProject(text)).toBe(false);
  });
});

describe("isProjectQuestion", () => {
  test.each([
    "est-ce que ZombieLand est ouvert ?",
    "Premier Portfolio est à jour ?",
    "il fonctionne encore ce projet ?",
  ])("detects a real question: %s", (text) => {
    expect(isProjectQuestion(text)).toBe(true);
  });

  test.each([
    "montre-moi VectoKid",
    "montre-moi VectoKid ?", // verbe d'action présent même avec un "?"
    "ouvre la démo de PARADE",
    "présente ce projet",
  ])("does not misfire on a show/open command: %s", (text) => {
    expect(isProjectQuestion(text)).toBe(false);
  });

  test("no question mark at all is never a question", () => {
    expect(isProjectQuestion("parle-moi de zombieland")).toBe(false);
  });
});
