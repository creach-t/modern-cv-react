import React, { useEffect, useRef } from "react";
import anime from "animejs";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Révèle son contenu quand il entre dans le viewport (anime.js).
 * `stagger` anime les enfants directs en cascade. Respecte prefers-reduced-motion.
 */
const Reveal = ({
  children,
  className = "",
  as: Tag = "div",
  id,
  delay = 0,
  y = 28,
  stagger = false,
  once = true,
}) => {
  const ref = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = stagger ? Array.from(el.children) : el;

    if (reduced()) {
      anime.set(targets, { opacity: 1, translateY: 0 });
      return;
    }

    anime.set(targets, { opacity: 0, translateY: y });

    const reveal = () => {
      if (once && done.current) return;
      done.current = true;
      anime({
        targets,
        opacity: [0, 1],
        translateY: [y, 0],
        delay: stagger ? anime.stagger(90, { start: delay }) : delay,
        duration: 750,
        easing: "easeOutCubic",
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal();
            if (once) io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);

    // filet de sécurité : révèle si l'élément est à l'écran mais pas encore animé
    const inView = () => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight * 0.9 && r.bottom > 0;
    };
    const guard = setInterval(() => {
      if (once && done.current) return clearInterval(guard);
      if (inView()) {
        reveal();
        if (once) clearInterval(guard);
      }
    }, 500);

    return () => {
      clearInterval(guard);
      io.disconnect();
    };
  }, [delay, y, stagger, once]);

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
};

export default Reveal;
