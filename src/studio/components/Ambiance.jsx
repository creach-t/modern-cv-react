import React from "react";

// Grain de film (bruit SVG) en data-URI, ajoute de la matière sur le fond.
const GRAIN =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
  );

/** Grain de film discret par-dessus le contenu (sous la nav/widgets). */
const Ambiance = () => (
  <div
    className="pointer-events-none fixed inset-0 opacity-[0.04] mix-blend-soft-light"
    style={{
      zIndex: 40,
      backgroundImage: `url("${GRAIN}")`,
      backgroundSize: "140px 140px",
    }}
    aria-hidden="true"
  />
);

export default Ambiance;
