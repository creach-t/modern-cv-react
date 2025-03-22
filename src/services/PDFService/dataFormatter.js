// src/services/PDFService/dataFormatter.js

/**
 * Charge les données depuis les fichiers JSON et les formate pour le PDF
 * @param {string} language - Langue ('fr' ou 'en')
 * @returns {Promise<Object>} - Données utilisateur formatées
 */
export const buildUserData = async (language) => {
    try {
      // Chargement de toutes les données nécessaires
      const [skills, softSkills, experiences, education, projects, contacts] = await Promise.all([
        fetch('/data/skills.json').then(res => res.json()),
        fetch('/data/softSkills.json').then(res => res.json()),
        fetch('/data/experiences.json').then(res => res.json()),
        fetch('/data/education.json').then(res => res.json()),
        fetch('/data/projects.json').then(res => res.json()),
        fetch('/data/contacts.json').then(res => res.json()),
      ]);
  
      // Construction de l'objet contenant toutes les données pour le CV
      return {
        name: 'Théo CREACH',
        title: language === 'fr' ? 'Développeur Full Stack JavaScript' : 'Full Stack JavaScript Developer',
        contacts,
        skills,
        softSkills,
        experiences: experiences.experiences,
        education: education.education,
        projects: projects.projects,
      };
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      throw error;
    }
  };