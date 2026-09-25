import { normalizeTags, stripActions, parseSteps, resolveColor, ACTION_SECTIONS } from "../actionProtocol";

describe("normalizeTags", () => {
  test("keeps already-canonical tags unchanged", () => {
    expect(normalizeTags("Salut [[do:color:mauve]]")).toBe("Salut [[do:color:mauve]]");
  });

  test("canonicalizes a single-bracket / missing do: tag", () => {
    expect(normalizeTags("ok [goto:projects]")).toBe("ok [[do:goto:projects]]");
  });

  test("canonicalizes a multi-word color value", () => {
    expect(normalizeTags("[[do:color: bleu nuit]]")).toBe("[[do:color:bleu-nuit]]");
  });

  test("canonicalizes a plan block with a single opening bracket", () => {
    const input = "[plan: goto:projects | ça arrive ; goto:contact | et hop]]";
    expect(normalizeTags(input)).toBe("[[plan:goto:projects | ça arrive ; goto:contact | et hop]]");
  });
});

describe("stripActions", () => {
  test("removes tags and trims", () => {
    expect(stripActions("Va pour du mauve 💜 [[do:color:mauve]]")).toBe("Va pour du mauve 💜");
  });

  test("removes a truncated trailing tag (mid-stream)", () => {
    expect(stripActions("Ça arrive [[do:col")).toBe("Ça arrive");
  });
});

describe("parseSteps", () => {
  const projectIds = ["vectokid", "parade"];

  test("parses a single do: tag", () => {
    expect(parseSteps("[[do:project:vectokid]]", projectIds)).toEqual([
      { name: "project", arg: "vectokid", note: undefined },
    ]);
  });

  test("parses a plan with notes", () => {
    const steps = parseSteps(
      "[[plan:project:vectokid | app perso ; project:parade | jeu ]]",
      projectIds
    );
    expect(steps).toEqual([
      { name: "project", arg: "vectokid", note: "app perso" },
      { name: "project", arg: "parade", note: "jeu" },
    ]);
  });

  test("drops unknown project ids (whitelist)", () => {
    expect(parseSteps("[[do:project:unknown]]", projectIds)).toEqual([]);
  });

  test("drops invalid goto sections", () => {
    expect(parseSteps("[[do:goto:home]]", projectIds)).toEqual([]);
    expect(ACTION_SECTIONS).toContain("about");
  });

  test("deduplicates repeated steps", () => {
    const steps = parseSteps("[[do:project:vectokid]] [[do:project:vectokid]]", projectIds);
    expect(steps).toHaveLength(1);
  });
});

describe("resolveColor", () => {
  test("resolves a known name", () => {
    expect(resolveColor("mauve")).toBe("#B57EDC");
  });

  test("resolves a multi-word / accented name", () => {
    expect(resolveColor("bleu-nuit")).toBe("#1E3A8A");
    expect(resolveColor("bleunuit")).toBe("#1E3A8A");
  });

  test("returns null for an unknown name", () => {
    expect(resolveColor("licorne")).toBeNull();
  });
});
