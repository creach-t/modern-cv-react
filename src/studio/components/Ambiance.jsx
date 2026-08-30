import React from "react";
import { useColor } from "../../contexts/ColorContext";

// Grain de film (bruit SVG) en data-URI, ajoute de la matière sur le fond plat.
const GRAIN =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
  );

/**
 * Ambiance de fond : aurores accent-color en mouvement lent + grain de film.
 * Purement décoratif, sans interception d'événements.
 */
const Ambiance = () => {
  const { secondaryColor } = useColor();
  return (
    <>
      {/* aurores animées (derrière le contenu) */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        <div
          className="absolute -left-1/4 top-[-10%] h-[70vh] w-[70vh] rounded-full opacity-25 blur-[110px] studio-aurora-a"
          style={{ backgroundColor: secondaryColor }}
        />
        <div
          className="absolute bottom-[-15%] right-[-10%] h-[60vh] w-[60vh] rounded-full opacity-20 blur-[120px] studio-aurora-b"
          style={{ backgroundColor: secondaryColor }}
        />
      </div>

      {/* grain de film (au-dessus du contenu, sous la nav/widgets) */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04] mix-blend-soft-light"
        style={{
          zIndex: 40,
          backgroundImage: `url("${GRAIN}")`,
          backgroundSize: "140px 140px",
        }}
        aria-hidden="true"
      />
    </>
  );
};

export default Ambiance;
