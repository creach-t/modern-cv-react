import { titleAnimations, hoverConfig } from "../config/animationConfig";

// Titles qui s'alternent dans le header
export const titles = [
  { prefix: "Full", suffix: "Stack" },
  { prefix: "Front", suffix: "end" },
  { prefix: "Back", suffix: "end" },
];

// Animation simple pour les titres avec glissement horizontal
export const animations = [
  { 
    initial: { opacity: 0, x: -titleAnimations.slideDistance }, 
    animate: { opacity: 1, x: 0 }, 
    exit: { opacity: 0, x: titleAnimations.slideDistance }
  }
];

// Animation simple pour les boutons
export const wiggleAnimation = {
  hover: {
    scale: hoverConfig.scaleFactorHover,
    transition: {
      duration: hoverConfig.hoverTransitionDuration,
      ease: hoverConfig.hoverTransitionTiming
    }
  }
};