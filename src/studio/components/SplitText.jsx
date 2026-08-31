import React, { useEffect, useRef } from "react";
import anime from "animejs";
import useDeviceTier from "../hooks/useDeviceTier";

/**
 * Titre révélé à l'entrée dans le viewport (anime.js).
 * - high            : lettre par lettre (chaque char promu en couche).
 * - mid / low       : révélation du titre entier (1 seule couche) → évite
 *                     la multiplication de `will-change` coûteuse sur mobile.
 * - reduced-motion  : affiché tel quel, sans animation.
 */
const SplitText = ({ text, className = "", as: Tag = "span" }) => {
  const { fx } = useDeviceTier();
  const perChar = fx.splitChars;
  const animate = fx.animate;
  const ref = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = perChar
      ? el.querySelectorAll("[data-char]")
      : el.querySelectorAll("[data-word]");

    if (!animate) {
      anime.set(targets, { opacity: 1, translateY: 0 });
      return;
    }
    anime.set(targets, { opacity: 0, translateY: perChar ? "0.6em" : 18 });

    const reveal = () => {
      if (done.current) return;
      done.current = true;
      anime({
        targets,
        opacity: [0, 1],
        translateY: [perChar ? "0.6em" : 18, 0],
        rotateZ: perChar ? [6, 0] : 0,
        duration: 700,
        delay: perChar ? anime.stagger(28) : 0,
        easing: "easeOutExpo",
        complete: () => {
          // libère les couches composited une fois l'anim terminée
          targets.forEach((t) => (t.style.willChange = "auto"));
        },
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
  }, [text, perChar, animate]);

  if (!perChar) {
    return (
      <Tag ref={ref} className={className}>
        <span data-word className="inline-block will-change-transform">
          {text}
        </span>
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          data-char
          aria-hidden="true"
          className="inline-block will-change-transform"
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </Tag>
  );
};

export default SplitText;
