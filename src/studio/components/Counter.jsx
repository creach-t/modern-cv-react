import React, { useEffect, useRef, useState } from "react";
import anime from "animejs";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Compteur qui s'incrémente quand il devient visible (anime.js). */
const Counter = ({ value, suffix = "", duration = 1400 }) => {
  const ref = useRef(null);
  const [display, setDisplay] = useState(reduced() ? value : 0);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            const obj = { v: 0 };
            anime({
              targets: obj,
              v: value,
              duration,
              easing: "easeOutExpo",
              round: 1,
              update: () => setDisplay(obj.v),
            });
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
};

export default Counter;
