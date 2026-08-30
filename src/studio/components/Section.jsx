import React from "react";
import { useColor } from "../../contexts/ColorContext";
import Reveal from "./Reveal";
import SplitText from "./SplitText";
import Doodle from "./Doodles";

/** Conteneur de section + en-tête (numéro + titre animé lettre par lettre). */
const Section = ({ id, index, title, subtitle, doodle, children, className = "" }) => {
  const { secondaryColor } = useColor();
  return (
    <section id={id} className={`mx-auto max-w-5xl px-6 py-20 sm:py-28 ${className}`}>
      <div className="mb-10">
        <div className="flex items-baseline gap-3">
          {index && (
            <span
              className="font-mono text-sm font-semibold"
              style={{ color: secondaryColor }}
            >
              {index}
            </span>
          )}
          <SplitText
            as="h2"
            text={title}
            className="text-3xl font-black tracking-tight text-white sm:text-4xl"
          />
          {doodle && (
            <Reveal className="ml-auto self-center">
              <Doodle
                name={doodle}
                className="h-9 w-9 -rotate-6 opacity-70 sm:h-11 sm:w-11"
                style={{ color: secondaryColor }}
              />
            </Reveal>
          )}
        </div>
        {subtitle && (
          <Reveal>
            <p className="mt-3 max-w-2xl text-base text-gray-400">{subtitle}</p>
          </Reveal>
        )}
        <Reveal>
          <div
            className="mt-5 h-1 w-16 rounded-full"
            style={{ backgroundColor: secondaryColor }}
          />
        </Reveal>
      </div>
      {children}
    </section>
  );
};

export default Section;
