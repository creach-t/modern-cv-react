import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { titles, wiggleAnimation } from "../../constants/headerConstants";
import { headerTranslations } from "../../constants/headerTranslations";
import { useLanguage } from "../../contexts/LanguageContext";
import { titleAnimations, slideConfig, opacityConfig } from "../../config/animationConfig";

const ProfileSection = ({ textColor, index, animation, scrollProgress }) => {
  const { language } = useLanguage();
  const t = headerTranslations[language];
  
  return (
    <div className="flex flex-col md:flex-row items-center gap-4">
      <motion.div 
        className="relative group"
        whileHover="hover"
        variants={wiggleAnimation}
        style={{
          transform: `translateX(${-slideConfig.profileDistance * scrollProgress}px)`,
          opacity: 1 - (opacityConfig.profileOpacityFactor * scrollProgress),
          transition: `transform ${slideConfig.slideTransitionDuration}s ${slideConfig.slideTransitionTiming}, opacity ${opacityConfig.opacityTransitionDuration}s ${opacityConfig.opacityTransitionTiming}`
        }}
      >
        <img
          src="/img/profil_picture.png"
          alt="Théo Créac'h"
          className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 text-white font-medium transition-opacity duration-300">{t.hello}</span>
        </div>
      </motion.div>
      
      <div className="text-center md:text-left">
        <motion.h1 
          className="text-3xl md:text-4xl font-bold mb-1" 
          style={{ 
            color: textColor,
            transform: `translateX(${-slideConfig.nameDistance * scrollProgress}px)`,
            opacity: 1 - (opacityConfig.nameOpacityFactor * scrollProgress),
            transition: `transform ${slideConfig.slideTransitionDuration}s ${slideConfig.slideTransitionTiming}, opacity ${opacityConfig.opacityTransitionDuration}s ${opacityConfig.opacityTransitionTiming}`
          }}
        >
          Théo Créac'h
        </motion.h1>
        <motion.h2 
          className="text-lg md:text-xl font-medium opacity-80 flex gap-2" 
          style={{ 
            color: textColor,
            transform: `translateX(${-slideConfig.titleDistance * scrollProgress}px)`,
            opacity: 1 - (opacityConfig.titleOpacityFactor * scrollProgress),
            transition: `transform ${slideConfig.slideTransitionDuration}s ${slideConfig.slideTransitionTiming}, opacity ${opacityConfig.opacityTransitionDuration}s ${opacityConfig.opacityTransitionTiming}`
          }}
        >
          <span>{t.developer}</span>
          <span className="flex gap-1">
            <AnimatePresence mode="wait">
              <motion.span
                key={index}
                initial={animation.initial}
                animate={animation.animate}
                exit={animation.exit}
                transition={{ duration: titleAnimations.transitionSpeed, ease: "easeInOut" }}
              >
                {titles[index].prefix}
              </motion.span>
            </AnimatePresence>
            <span>{titles[index].suffix}</span>
          </span>
        </motion.h2>
      </div>
    </div>
  );
};

export default ProfileSection;