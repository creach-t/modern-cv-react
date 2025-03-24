// src/services/PDFService/translations.js

/**
 * Récupère les traductions en fonction de la langue
 * @param {string} language - Langue ('fr' ou 'en')
 * @returns {Object} - Objet de traductions
 */
export const getTranslations = (language) => {
    return {
      experience: language === 'fr' ? 'Expérience professionnelle' : 'Professional Experience',
      education: language === 'fr' ? 'Formation' : 'Education',
      skills: language === 'fr' ? 'Hard Skills' : 'Hard Skills',
      softSkills: language === 'fr' ? 'Soft Skills' : 'Soft Skills',
      projects: language === 'fr' ? 'Projets' : 'Projects',
      contact: language === 'fr' ? 'Contact' : 'Contact',
      tools: language === 'fr' ? 'Outils' : 'Tools',
      technologies: language === 'fr' ? 'Technologies' : 'Technologies',
      generatedWith: language === 'fr' ? 'Généré avec' : 'Generated with',
    };
  };