import React, { useEffect, useRef } from "react";
import anime from "animejs";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Titre révélé lettre par lettre quand il entre dans le viewport (anime.js). */
const SplitText = ({ text, className = "", as: Tag = "span" }) => {
  const ref = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = el.querySelectorAll("[data-char]");

    if (reduced()) {
      anime.set(chars, { opacity: 1, translateY: 0 });
      return;
    }
    anime.set(chars, { opacity: 0, translateY: "0.6em" });

    const reveal = () => {
      if (done.current) return;
      done.current = true;
      anime({
        targets: chars,
        opacity: [0, 1],
        translateY: ["0.6em", 0],
        rotateZ: [6, 0],
        duration: 700,
        delay: anime.stagger(28),
        easing: "easeOutExpo",
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          reveal();
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);

    // filet de sécurité : si le titre est à l'écran mais pas encore révélé
    // (IO manqué), on le révèle — sans casser le reveal au scroll.
    const inView = () => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight * 0.9 && r.bottom > 0;
    };
    const guard = setInterval(() => {
      if (done.current) return clearInterval(guard);
      if (inView()) {
        reveal();
        clearInterval(guard);
      }
    }, 500);

    return () => {
      clearInterval(guard);
      io.disconnect();
    };
  }, [text]);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          data-char
          aria-hidden="true"
          className="inline-block will-change-transform"
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </Tag>
  );
};

export default SplitText;
