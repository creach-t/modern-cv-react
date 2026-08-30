import React, { useEffect, useState } from "react";
import { useColor } from "../../contexts/ColorContext";

/** Fine barre de progression de lecture en haut de page. */
const ScrollProgress = () => {
  const { secondaryColor } = useColor();
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setPct(max > 0 ? (h.scrollTop / max) * 100 : 0);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent">
      <div
        className="h-full origin-left"
        style={{ width: `${pct}%`, backgroundColor: secondaryColor }}
      />
    </div>
  );
};

export default ScrollProgress;
