import React from "react";

// Voiles sombres organiques (blobs flous) qui enveloppent le texte et
// atténuent les rouages juste derrière — sans bords nets ni rectangle.
const PRESETS = {
  center:
    "radial-gradient(75% 65% at 50% 44%, rgba(5,6,10,0.74), transparent 78%)," +
    "radial-gradient(48% 52% at 28% 66%, rgba(5,6,10,0.55), transparent 76%)," +
    "radial-gradient(40% 42% at 72% 30%, rgba(5,6,10,0.5), transparent 74%)",
  left:
    "radial-gradient(62% 72% at 26% 44%, rgba(5,6,10,0.85), transparent 74%)," +
    "radial-gradient(46% 46% at 46% 70%, rgba(5,6,10,0.6), transparent 76%)",
};

const TextScrim = ({ align = "center" }) => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 -z-10"
    style={{ background: PRESETS[align] || PRESETS.center, filter: "blur(36px)" }}
  />
);

export default TextScrim;
