import { generateFollowUps } from "../followUpsLLM";
import { chatOnce } from "../aiClient";

jest.mock("../aiClient", () => ({ chatOnce: jest.fn() }));

describe("generateFollowUps", () => {
  afterEach(() => jest.resetAllMocks());

  test("parses a strict JSON array response", async () => {
    chatOnce.mockResolvedValue('["Montre-moi VectoKid", "Quel est son parcours ?", "Contacte-le"]');
    const result = await generateFollowUps({ language: "fr", history: [] });
    expect(result).toEqual(["Montre-moi VectoKid", "Quel est son parcours ?", "Contacte-le"]);
  });

  test("tolerates surrounding prose around the JSON array", async () => {
    chatOnce.mockResolvedValue('Sure! ["Show me PARADE", "Download the CV"] hope that helps');
    const result = await generateFollowUps({ language: "en", history: [] });
    expect(result).toEqual(["Show me PARADE", "Download the CV"]);
  });

  test("caps the result at n suggestions", async () => {
    chatOnce.mockResolvedValue('["a", "b", "c", "d", "e"]');
    const result = await generateFollowUps({ language: "fr", history: [] }, { n: 2 });
    expect(result).toHaveLength(2);
  });

  test("returns an empty array on invalid JSON (no static fallback)", async () => {
    chatOnce.mockResolvedValue("not json at all");
    const result = await generateFollowUps({ language: "fr", history: [] });
    expect(result).toEqual([]);
  });

  test("returns an empty array when the response isn't an array", async () => {
    chatOnce.mockResolvedValue('{"intent": "not an array"}');
    const result = await generateFollowUps({ language: "fr", history: [] });
    expect(result).toEqual([]);
  });

  test("returns an empty array when the LLM call fails, never throws", async () => {
    chatOnce.mockRejectedValue(new Error("worker down"));
    await expect(generateFollowUps({ language: "fr", history: [] })).resolves.toEqual([]);
  });

  test("filters out non-string entries", async () => {
    chatOnce.mockResolvedValue('["valid", 42, null, "also valid"]');
    const result = await generateFollowUps({ language: "fr", history: [] });
    expect(result).toEqual(["valid", "also valid"]);
  });

  test("forwards project blurbs, avoid notes and an action hint into the system prompt", async () => {
    chatOnce.mockResolvedValue("[]");
    await generateFollowUps({
      language: "fr",
      projects: [
        { label: "VectoKid", blurb: "App pour enfants" },
        { label: "PARADE", blurb: "Outil de gestion" },
      ],
      avoid: ["remontrer VectoKid (déjà montré)"],
      history: [{ role: "user", content: "montre VectoKid" }],
      actionHint: "[Action venant d'être exécutée : project:vectokid]",
    });
    const sentMessages = chatOnce.mock.calls[0][0].messages;
    const systemMsg = sentMessages.find(
      (m) => m.role === "system" && m.content.includes("VectoKid (App pour enfants)")
    );
    expect(systemMsg).toBeDefined();
    expect(systemMsg.content).toContain("PARADE (Outil de gestion)");
    expect(systemMsg.content).toContain("remontrer VectoKid");
    expect(sentMessages.some((m) => m.content.includes("Action venant d'être exécutée"))).toBe(true);
    expect(sentMessages.some((m) => m.role === "user" && m.content === "montre VectoKid")).toBe(true);
  });
});
