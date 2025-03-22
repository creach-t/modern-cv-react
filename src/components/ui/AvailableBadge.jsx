import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";

const badgeTranslations = {
  fr: {
    available: "Disponible",
    locations: "Île-de-France • Full Remote"
  },
  en: {
    available: "Available",
    locations: "Paris Region • Full Remote"
  }
};

const SubtleAvailableBadge = () => {
  const { language } = useLanguage();
  const t = badgeTranslations[language];

  return (
    <motion.div
      className="inline-flex items-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-1.5">
        <div className="bg-green-700 border border-green-300 text-white text-xs font-medium px-1 py-0.2 rounded-sm">
          {t.available}
        </div>
        <span className="text-[10px] opacity-60">{t.locations}</span>
      </div>
    </motion.div>
  );
};

export default SubtleAvailableBadge;