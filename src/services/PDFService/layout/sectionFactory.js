// src/services/PDFService/layout/sectionFactory.js

import { HeaderSection } from '../sections/HeaderSection';
import { SkillsSection } from '../sections/SkillsSection';
import { SoftSkillsSection } from '../sections/SoftSkillsSection';
import { ProjectsSection } from '../sections/ProjectsSection';
import { ExperienceSection } from '../sections/ExperienceSection';
import { EducationSection } from '../sections/EducationSection';

/**
 * Registre des sections disponibles dans l'application
 */
const sectionsRegistry = {
  header: HeaderSection,
  skills: SkillsSection,
  softSkills: SoftSkillsSection,
  projects: ProjectsSection,
  experience: ExperienceSection,
  education: EducationSection,
};

/**
 * Crée un composant de section en fonction de son nom
 * 
 * @param {string} sectionName - Nom de la section à créer
 * @returns {React.Component|null} - Composant de section ou null si le nom est invalide
 */
export const createSectionComponent = (sectionName) => {
  if (!sectionName || !sectionsRegistry[sectionName]) {
    console.warn(`Section non trouvée: ${sectionName}`);
    return null;
  }
  
  return sectionsRegistry[sectionName];
};

/**
 * Enregistre une nouvelle section dans le registre
 * 
 * @param {string} sectionName - Nom de la section
 * @param {React.Component} component - Composant de section
 */
export const registerSection = (sectionName, component) => {
  if (!sectionName || !component) {
    throw new Error('Nom de section et composant requis pour l\'enregistrement');
  }
  
  sectionsRegistry[sectionName] = component;
};

/**
 * Supprime une section du registre
 * 
 * @param {string} sectionName - Nom de la section à supprimer
 */
export const unregisterSection = (sectionName) => {
  if (!sectionName) {
    throw new Error('Nom de section requis pour la suppression');
  }
  
  delete sectionsRegistry[sectionName];
};

/**
 * Obtient la liste de toutes les sections enregistrées
 * 
 * @returns {Object} - Liste des sections enregistrées
 */
export const getAllRegisteredSections = () => {
  return { ...sectionsRegistry };
};