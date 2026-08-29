import React, { useEffect, useMemo, useRef, useState } from "react";
import { useColor } from "../../contexts/ColorContext";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const OK = "[  ok  ]";

const BootSequence = ({ onDone }) => {
  const { secondaryColor } = useColor();
  const version = process.env.REACT_APP_VERSION || "dev";

  const lines = useMemo(
    () => [
      { t: `creachOS ${version} — booting kernel...`, c: "accent" },
      { t: `${OK} mounting /dev/creach ................ done` },
      { t: `${OK} loading modules: react node express docker` },
      { t: `${OK} starting traefik reverse proxy ....... creachtheo.fr` },
      { t: `${OK} TLS handshake (let's encrypt) ........ secured` },
      { t: `${OK} healthcheck GET /health .............. 200` },
      { t: `${OK} mounting /projects ................... 5 repos` },
      { t: `${OK} user: theo.creach .................... full-stack js` },
      { t: "" },
      { t: "welcome — type `help` or explore the desktop.", c: "muted" },
    ],
    [version]
  );

  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const finished = useRef(false);

  const finish = useRef(() => {
    if (finished.current) return;
    finished.current = true;
    setLeaving(true);
    setTimeout(onDone, 320);
  }).current;

  useEffect(() => {
    if (prefersReducedMotion()) {
      setCount(lines.length);
      const id = setTimeout(finish, 250);
      return () => clearTimeout(id);
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= lines.length) {
        clearInterval(id);
        setTimeout(finish, 550);
      }
    }, 190);
    return () => clearInterval(id);
  }, [lines.length, finish]);

  useEffect(() => {
    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("click", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("click", skip);
    };
  }, [finish]);

  return (
    <div
      role="status"
      aria-label="Démarrage de creachOS"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0b10] transition-opacity duration-300 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-full max-w-2xl px-6 font-mono text-[13px] leading-relaxed sm:text-sm">
        {lines.slice(0, count).map((line, idx) => (
          <div
            key={idx}
            style={line.c === "accent" ? { color: secondaryColor } : undefined}
            className={
              line.c === "muted"
                ? "mt-2 text-gray-400"
                : line.c === "accent"
                ? "font-semibold"
                : "text-gray-300"
            }
          >
            {line.t || " "}
          </div>
        ))}
        <div className="mt-3 text-[11px] text-gray-600">
          press any key to skip
        </div>
      </div>
    </div>
  );
};

export default BootSequence;
