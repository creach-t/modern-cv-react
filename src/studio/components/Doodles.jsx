import React from "react";

/**
 * Petits croquis "carnet de bricoleur" tracés à la main.
 * Couleur = currentColor, taille via className.
 */
const PATHS = {
  // étincelle / créativité (about)
  spark: (
    <path d="M24 11c1.5 8 4 10.5 12 12-8 1.5-10.5 4-12 12-1.5-8-4-10.5-12-12 8-1.5 10.5-4 12-12Z" />
  ),
  // tournevis (projets)
  screwdriver: (
    <>
      <path d="M29 8l7 7-4 4-7-7z" />
      <path d="M25 12 12 25" />
      <path d="M12 25l-4 9 9-4z" />
    </>
  ),
  // chemin pointillé (parcours)
  route: (
    <>
      <path d="M11 36c9-6 5-16 13-18s6-10 13-8" strokeDasharray="1.5 5" />
      <circle cx="11" cy="36" r="2.2" />
      <circle cx="37" cy="10" r="2.2" />
    </>
  ),
  // puce électronique (compétences)
  chip: (
    <>
      <rect x="16" y="16" width="16" height="16" rx="2" />
      <circle cx="24" cy="24" r="3" />
      <path d="M20 16v-5M28 16v-5M20 32v5M28 32v5M16 20h-5M16 28h-5M32 20h5M32 28h5" />
    </>
  ),
  // feuille / nature (contact)
  leaf: (
    <>
      <path d="M13 35C13 20 28 12 37 12c0 15-14 23-24 23Z" />
      <path d="M15 33c8-8 15-13 21-19" />
    </>
  ),
};

const Doodle = ({ name, className = "", style }) => {
  const content = PATHS[name];
  if (!content) return null;
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {content}
    </svg>
  );
};

export default Doodle;
