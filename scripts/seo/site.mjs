// Configuration SEO partagée par scripts/seo-build.mjs.
// Les projets déjà présents dans public/data/projects.json sont enrichis ici
// (slug, titre/description uniques, ancre descriptive). Le projet absent de
// projects.json (makemelearn) porte son contenu complet.

export const SITE = {
  url: "https://creachtheo.fr",
  name: "Théo Créac'h",
  author: "Théo Créac'h",
  jobTitle: "Développeur web full-stack JavaScript",
  locality: "Saint-Maur-des-Fossés",
  sameAs: ["https://linkedin.com/in/creachtheo", "https://github.com/creach-t"],
  ogImage: "/img/social-preview.jpg",
  ogImageAlt: "Théo Créac'h, développeur web full-stack JavaScript",
  // Date de repli si ni git ni SEO_LASTMOD ne sont disponibles au build.
  fallbackLastmod: "2026-10-08",
};

// Ordre = ordre d'affichage sur la page /projets/ et sur l'accueil.
export const PROJECTS = [
  {
    slug: "ocoffee",
    dataId: "ocoffee",
    title: "O'Coffee, boutique de cafés de spécialité | Théo Créac'h",
    description:
      "O'Coffee est une boutique en ligne de cafés de spécialité, créée en JavaScript vanilla avec Node.js, Express et PostgreSQL. Un projet de Théo Créac'h.",
    anchor: "Visiter O'Coffee, la boutique de cafés de spécialité",
    imageAlt: "Page d'accueil d'O'Coffee, boutique en ligne de cafés de spécialité",
  },
  {
    slug: "zombieland",
    dataId: "zombieland",
    title: "ZombieLand, parc d'attractions et billetterie | Théo Créac'h",
    description:
      "ZombieLand est un site immersif de parc d'attractions sur le thème des zombies, avec billetterie et back-office. Développé en React, Node.js et PostgreSQL.",
    anchor: "Explorer ZombieLand, le parc d'attractions et sa billetterie",
    imageAlt: "Site ZombieLand, parc d'attractions sur le thème des zombies",
  },
  {
    slug: "queens-game",
    dataId: "queensgame",
    title: "Queens Game Web, le puzzle Queens en ligne | Théo Créac'h",
    description:
      "Queens Game Web est une version web responsive du puzzle Queens de LinkedIn, avec génération automatique de grilles toujours résolubles. React, TypeScript.",
    anchor: "Jouer à Queens Game Web, le puzzle Queens en ligne",
    imageAlt: "Grille de Queens Game Web, puzzle de reines coloré",
  },
  {
    slug: "devjobs",
    dataId: "devjobs",
    title: "DevJobs, recherche d'offres d'emploi tech | Théo Créac'h",
    description:
      "DevJobs reconstruit la recherche d'offres d'emploi tech via l'API France Travail : filtres par technologie et lieu, offres enregistrables, OAuth 2.0.",
    anchor: "Essayer DevJobs, la recherche d'offres d'emploi pour développeurs",
    imageAlt: "Interface de recherche d'offres de DevJobs",
  },
  {
    slug: "makemelearn",
    title: "makemelearn, jeu de ferme gratuit en ligne | Théo Créac'h",
    description:
      "makemelearn est un jeu de ferme gratuit, jouable dans le navigateur sans installation ni compte, façon Stardew Valley : cultiver, pêcher, miner, cuisiner.",
    anchor: "Jouer à makemelearn, le jeu de ferme gratuit en ligne",
    link: "https://makemelearn.fr",
    label: "makemelearn",
    value: "Jeu de ferme gratuit, jouable dans le navigateur",
    summary:
      "Un jeu de ferme gratuit, jouable directement dans le navigateur, sans installation ni compte. On part de rien, avec un simple couteau et aucune pièce d'or.",
    paragraphs: [
      "makemelearn est un jeu de ferme gratuit, inspiré de Stardew Valley, qui se joue directement dans le navigateur, sans installation ni création de compte. Le joueur démarre de rien : un simple couteau, aucune pièce d'or.",
      "On y ramasse de l'herbe, des branches et des pierres pour fabriquer ses premiers outils, puis on cultive et on arrose ses champs, dont la fertilité évolue avec le temps. On y pêche, on mine des minerais, on fond des lingots pour améliorer ses outils, on cuisine et on vend sa production au marché. Il faut aussi agrandir son sac, choisir des métiers, rencontrer les habitants du village et nouer des amitiés pour accomplir des objectifs.",
      "Le jeu se joue au clavier, à la souris, à l'écran tactile sur mobile et tablette, ou à la manette. La partie est sauvegardée automatiquement dans le navigateur.",
    ],
    technologies: [],
    github: [],
    imageAlt: "",
  },
  {
    slug: "vectokid",
    dataId: "vectokid",
    title: "VectoKid, dessin vectoriel pour enfants | Théo Créac'h",
    description:
      "VectoKid est un éditeur de dessin vectoriel pensé pour les enfants : calques, formes, couleurs, sauvegarde en ligne et comptes. React, TypeScript, Node.js.",
    anchor: "Dessiner avec VectoKid, l'éditeur vectoriel pour enfants",
    imageAlt: "Éditeur de dessin vectoriel VectoKid pour enfants",
  },
];
