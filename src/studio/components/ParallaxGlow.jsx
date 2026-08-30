import React, { useEffect, useRef } from "react";
import { useColor } from "../../contexts/ColorContext";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Lueurs douces fixes qui dérivent légèrement au scroll (parallax discret).
const ParallaxGlow = () => {
  const { secondaryColor } = useColor();
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const blobs = Array.from(el.children);
    const factors = [0.06, 0.14, 0.1];
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        blobs.forEach((b, i) => {
          b.style.transform = `translateY(${-y * factors[i % factors.length]}px)`;
        });
        raf = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const blob = (extra, opacity) => ({
    backgroundColor: secondaryColor,
    opacity,
    mixBlendMode: "screen",
    ...extra,
  });

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0" style={{ zIndex: 0 }}>
      <div className="absolute -left-24 top-24 h-72 w-72 rounded-full blur-[120px]" style={blob({}, 0.1)} />
      <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full blur-[130px]" style={blob({}, 0.08)} />
      <div className="absolute bottom-10 left-1/3 h-64 w-64 rounded-full blur-[120px]" style={blob({}, 0.07)} />
    </div>
  );
};

export default ParallaxGlow;
