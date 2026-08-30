import React from "react";

// Voiles sombres organiques (blobs flous) qui enveloppent le texte et
// atténuent les rouages juste derrière — sans bords nets ni rectangle.
const PRESETS = {
  center:
    "radial-gradient(82% 72% at 50% 45%, rgba(4,5,9,0.92), rgba(4,5,9,0.6) 55%, transparent 82%)," +
    "radial-gradient(55% 55% at 26% 68%, rgba(4,5,9,0.78), transparent 80%)," +
    "radial-gradient(48% 48% at 74% 28%, rgba(4,5,9,0.72), transparent 78%)",
  left:
    "radial-gradient(70% 80% at 27% 45%, rgba(4,5,9,0.95), rgba(4,5,9,0.55) 55%, transparent 80%)," +
    "radial-gradient(52% 52% at 50% 70%, rgba(4,5,9,0.8), transparent 80%)",
};

const TextScrim = ({ align = "center" }) => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 -z-10"
    style={{ background: PRESETS[align] || PRESETS.center, filter: "blur(40px)" }}
  />
);

export default TextScrim;
