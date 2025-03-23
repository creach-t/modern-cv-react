// src/services/PDFService/dataFormatter.js

/**
 * Identifie le type d'icône à utiliser pour un contact donné
 * @param {Object} contact - Objet contact
 * @returns {string} - Type d'icône à utiliser
 */
export const getContactIconType = (contact) => {
  if (!contact) return 'document';

  const { type, value, label } = contact;

  // Si le type est déjà défini, on le retourne
  if (type) return type;

  // Sinon, on le détermine en fonction de la valeur ou du label
  const lowerValue = (value || '').toLowerCase();
  const lowerLabel = (label || '').toLowerCase();

  if (lowerValue.includes('@') || lowerLabel.includes('email') || lowerLabel.includes('mail')) {
    return 'email';
  }

  if (lowerLabel.includes('tél') || lowerLabel.includes('tel') || lowerLabel.includes('phone') ||
    /^\+?[\d\s()-]{8,}$/.test(lowerValue)) {
    return 'phone';
  }

  if (lowerValue.includes('linkedin.com') || lowerLabel.includes('linkedin')) {
    return 'linkedin';
  }

  if (lowerValue.includes('github.com') || lowerLabel.includes('github')) {
    return 'github';
  }

  if (lowerLabel.includes('site') || lowerLabel.includes('web') ||
    lowerValue.startsWith('http') || lowerValue.includes('.com') || lowerValue.includes('.fr')) {
    return 'website';
  }

  if (lowerLabel.includes('adresse') || lowerLabel.includes('location') || lowerLabel.includes('ville')) {
    return 'location';
  }

  if (lowerValue.includes('twitter.com') || lowerLabel.includes('twitter') ||
    lowerValue.includes('x.com') || lowerLabel.includes('x ')) {
    return 'twitter';
  }

  // Valeur par défaut
  return 'document';
};

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
      fetch('/data/contacts.json').then(res => res.json()),
    ]);

    // Formattage des données de titre en fonction de la langue
    const titleData = language === 'fr'
      ? {
        prefix: 'Développeur ',
        highlight: 'Full Stack ',
        suffix: 'JavaScript'
      }
      : {
        prefix: 'Full Stack ',
        highlight: 'JavaScript ',
        suffix: 'Developer'
      };

    // Ajouter le type d'icône à chaque contact s'il n'est pas déjà défini
    const formattedContacts = contacts.map(contact => ({
      ...contact,
      type: contact.type || getContactIconType(contact)
    }));

    // Construction de l'objet contenant toutes les données pour le CV
    return {
      name: 'Théo Créac\'h',
      title: titleData,
      profilePicture: '/img/profil_picture.png',
      contacts: formattedContacts,
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