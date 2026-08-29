import Terminal from "./Terminal/Terminal";
import ProjectsApp from "./ProjectsApp";
import SkillsMonitorApp from "./SkillsMonitorApp";
import ExperienceApp from "./ExperienceApp";
import EducationApp from "./EducationApp";
import ContactApp from "./ContactApp";
import AboutApp from "./AboutApp";
import InfraApp from "./InfraApp";

// Mapping id (registry) -> composant React. Séparé de registry.js
// pour éviter les cycles d'import avec le contexte OS.
export const APP_COMPONENTS = {
  terminal: Terminal,
  projects: ProjectsApp,
  skills: SkillsMonitorApp,
  experience: ExperienceApp,
  education: EducationApp,
  contact: ContactApp,
  about: AboutApp,
  infra: InfraApp,
};
