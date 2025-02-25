import React, { useState, useEffect } from "react";
import { useColor } from "../contexts/ColorContext";
import { Github, Linkedin, Mail } from "lucide-react";
import { getTextColor } from "../utils/color";
import { motion, AnimatePresence } from "framer-motion";

const titles = [
  { prefix: "Full", suffix: "Stack" },
  { prefix: "Front", suffix: "end" },
  { prefix: "Back", suffix: "end" },
];

const animations = [
  { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 10 } },
  { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 1.2 } },
  { initial: { opacity: 0, rotateX: 90 }, animate: { opacity: 1, rotateX: 0 }, exit: { opacity: 0, rotateX: -90 } }
];

const Header = () => {
  const { secondaryColor } = useColor();
  const textColor = getTextColor(secondaryColor);
  const [index, setIndex] = useState(0);
  const [animation, setAnimation] = useState(animations[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % titles.length);
      setAnimation(animations[Math.floor(Math.random() * animations.length)]); // Animation aléatoire
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className="py-8 transition-colors duration-200"
      style={{ backgroundColor: secondaryColor, color: textColor }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <img
              src="/img/profil_picture.png"
              alt="Théo Créac'h"
              className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-lg"
            />
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-1" style={{ color: textColor }}>
                Théo Créac'h
              </h1>
              <h2 className="text-lg md:text-xl font-medium opacity-80 flex gap-2" style={{ color: textColor }}>
                <span>Développeur</span>
                <span className="flex gap-1">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={index}
                      initial={animation.initial}
                      animate={animation.animate}
                      exit={animation.exit}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                      {titles[index].prefix}
                    </motion.span>
                  </AnimatePresence>
                  <span>{titles[index].suffix}</span>
                </span>
              </h2>
            </div>
          </div>

          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="https://github.com/creach-t" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition">
              <Github className="w-6 h-6" style={{ color: textColor }} />
            </a>
            <a href="https://linkedin.com/in/creachtheo" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition">
              <Linkedin className="w-6 h-6" style={{ color: textColor }} />
            </a>
            <a href="mailto:creach.t@gmail.com" className="hover:opacity-80 transition">
              <Mail className="w-6 h-6" style={{ color: textColor }} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
