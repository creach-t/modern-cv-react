import React, { useRef } from "react";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Enfant incliné en 3D selon la position du curseur (désactivé si reduced-motion). */
const TiltCard = ({ children, className = "", max = 9 }) => {
  const ref = useRef(null);
  const off = useRef(false);

  const onMove = (e) => {
    if (off.current) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${
      -py * max
    }deg) scale(1.01)`;
  };

  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
  };

  if (reduced()) off.current = true;

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
};

export default TiltCard;
