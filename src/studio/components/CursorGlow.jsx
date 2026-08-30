import React, { useEffect, useRef } from "react";
import { useColor } from "../../contexts/ColorContext";

const finePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Halo accent-color qui suit le curseur (desktop uniquement). */
const CursorGlow = () => {
  const { secondaryColor } = useColor();
  const ref = useRef(null);
  const enabled = useRef(finePointer());

  useEffect(() => {
    if (!enabled.current) return;
    const el = ref.current;
    if (!el) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const cur = { ...target };
    let raf;
    let shown = false;

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!shown) {
        shown = true;
        el.style.opacity = "1";
      }
    };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      cur.x += (target.x - cur.x) * 0.15;
      cur.y += (target.y - cur.y) * 0.15;
      el.style.transform = `translate(${cur.x}px, ${cur.y}px) translate(-50%, -50%)`;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  if (!enabled.current) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 opacity-0 transition-opacity duration-500"
      style={{
        zIndex: 45,
        width: 460,
        height: 460,
        borderRadius: "9999px",
        background: `radial-gradient(circle, ${secondaryColor}22 0%, transparent 65%)`,
        mixBlendMode: "screen",
        willChange: "transform",
      }}
    />
  );
};

export default CursorGlow;
