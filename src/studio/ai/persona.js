/**
 * Contenu statique de l'UI de l'assistant (intros, suggestions). Le prompt
 * système est désormais composé par intentHandlers/* via promptFragments.js
 * (un fragment de faits par intention, plus le socle commun style/actions).
 */

// Messages d'accueil (tirés au hasard à chaque ouverture).
export const INTROS = {
  fr: [
    "Salut 👋 Je sais (presque) tout sur Théo, et je peux piloter la page. Essayez « lance le mode dev ».",
    "Hello 👋 Une question sur Théo ? Ou envie que je change la couleur du site ? Je m'en occupe.",
    "Bienvenue 👋 Je réponds franc sur Théo, ses projets, ses skills. Et je fais quelques tours de magie sur la page.",
    "Coucou 👋 Posez-moi vos questions de recruteur, ou dites-moi « montre-moi les projets ».",
  ],
  en: [
    "Hi 👋 I know (almost) everything about Théo, and I can drive the page. Try “launch dev mode”.",
    "Hello 👋 A question about Théo? Or want me to change the site color? On it.",
    "Welcome 👋 I answer straight about Théo, his projects, his skills. Plus a few page tricks.",
    "Hey 👋 Ask me your recruiter questions, or say “show me the projects”.",
  ],
};

// Vivier de suggestions (on en tire quelques-unes au hasard à chaque fois).
export const SUGGESTION_POOL = {
  fr: [
    "Il est dispo pour un poste ?",
    "Montre-moi le mode développeur 🖥️",
    "Parle-moi de VectoKid",
    "Change la couleur du site 🎨",
    "C'est quoi PARADE ?",
    "Quelles technologies il maîtrise ?",
    "Pourquoi une reconversion ?",
    "Emmène-moi aux projets",
    "Télécharge son CV 📄",
    "Il héberge vraiment tout lui-même ?",
  ],
  en: [
    "Is he available for a job?",
    "Show me the developer mode 🖥️",
    "Tell me about VectoKid",
    "Change the site color 🎨",
    "What is PARADE?",
    "Which technologies does he know?",
    "Why the career change?",
    "Take me to the projects",
    "Download his CV 📄",
    "Does he really self-host everything?",
  ],
};
