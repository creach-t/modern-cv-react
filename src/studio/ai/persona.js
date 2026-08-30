/**
 * Construit le prompt système de l'assistant à partir des VRAIES données du CV.
 * L'assistant parle au nom de Théo (à la 3e personne), reste factuel, concis,
 * et oriente les recruteurs vers la prise de contact.
 */
export const buildSystemPrompt = (data, language) => {
  const lang = language === "en" ? "en" : "fr";

  const projects = (data?.projects || [])
    .map((p) => {
      const loc = p[lang] || p.fr;
      return `- ${loc.label}: ${loc.value}. Stack: ${p.technologies.join(", ")}. Live: ${p.link}`;
    })
    .join("\n");

  const experiences = (data?.experiences || [])
    .map((e) => {
      const loc = e[lang] || e.fr;
      return `- ${loc.label} @ ${e.company.name} (${e.period})`;
    })
    .join("\n");

  const topSkills = (data?.skills || [])
    .map((cat) => {
      const names = cat.skills
        .filter((s) => s.level >= 3)
        .map((s) => s.name)
        .join(", ");
      return names ? `${cat.category}: ${names}` : null;
    })
    .filter(Boolean)
    .join("\n");

  const facts = `
PROFIL
Nom: Théo Créach
Titre: Développeur web full-stack JavaScript (React / Node.js)
Localisation: Saint-Maur-des-Fossés, Île-de-France — full remote possible
Disponibilité: ouvert aux opportunités
Parcours: reconversion réussie après plusieurs années dans le conseil et le management (Naturalia, Bricoman), diplômé de l'école O'Clock (2024-2025). Particularité: il auto-héberge ses applications sur son propre VPS (Docker, CI/CD GitHub Actions, Traefik, nginx) — il maîtrise autant le code que l'infrastructure.
Loisirs: bricolage, électronique, nature — un profil de "maker" qui aime construire.

COMPÉTENCES CLÉS
${topSkills}

PROJETS
${projects}

EXPÉRIENCE
${experiences}

CONTACT
Email: creach.t@gmail.com
LinkedIn: https://linkedin.com/in/creachtheo
GitHub: https://github.com/creach-t
`;

  const rules =
    lang === "en"
      ? `You are Théo Créach's portfolio assistant, talking to a visitor (often a recruiter, possibly non-technical). Answer ONLY questions about Théo, his skills, projects and career, using the facts below. Be warm, concise (2-4 sentences), and concrete. Explain technical terms simply for non-technical readers. If asked something you don't know, say so honestly and suggest contacting Théo. Encourage getting in touch when relevant. Reply in English. Never invent facts.`
      : `Tu es l'assistant du portfolio de Théo Créach. Tu parles à un visiteur (souvent un recruteur, parfois non technique). Réponds UNIQUEMENT aux questions sur Théo, ses compétences, ses projets et son parcours, en t'appuyant sur les faits ci-dessous. Sois chaleureux, concis (2 à 4 phrases) et concret. Vulgarise les termes techniques pour un lecteur non technique. Si tu ne sais pas, dis-le honnêtement et invite à contacter Théo. Encourage la prise de contact quand c'est pertinent. Réponds en français. N'invente jamais d'informations.`;

  return `${rules}\n\n=== FAITS ===\n${facts}`;
};

export const SUGGESTED_QUESTIONS = {
  fr: [
    "Est-il disponible pour un poste ?",
    "Quelles technologies maîtrise-t-il ?",
    "Parle-moi du projet ZombieLand",
    "Pourquoi une reconversion dans le dev ?",
  ],
  en: [
    "Is he available for a job?",
    "What technologies does he know?",
    "Tell me about the ZombieLand project",
    "Why did he switch to development?",
  ],
};
