// src/services/PDFService/styles.js

import { StyleSheet } from '@react-pdf/renderer';

/**
 * Styles de base pour le document PDF
 */
export const baseStyles = StyleSheet.create({
  // Styles généraux de la page
  page: {
    flexDirection: 'column',
    backgroundColor: 'white',
    padding: 30,
    fontFamily: 'Roboto',
  },
  
  // Style du footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: 'grey',
  },
  
  // Layout général
  twoColumns: {
    flexDirection: 'row',
    marginTop: 10,
    columnGap: 15,
  },
  leftColumn: {
    width: '30%',
    borderRight: '1pt dotted #dddddd',
    paddingRight: 8,
  },
  rightColumn: {
    width: '70%',
  },
  section: {
    marginBottom: 15,
    padding: 8,
    borderRadius: 4,
  },
  
  // Styles d'en-tête (header)
  header: {
    padding: 20,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  profilePicture: {
    width: 70,
    height: 70,
    borderRadius: 35,
    border: '2pt solid white',
  },
  nameSection: {
    gap: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 3,
  },
  title: {
    fontSize: 14,
    opacity: 0.85,
  },
  titleHighlight: {
    fontSize: 14,
    fontWeight: 'medium',
  },
  contactsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#f8f8f8',
    padding: 3,
    borderRadius: 3,
  },
  contactIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconShape: {
    width: 10,
    height: 10,
  },
  contactText: {
    fontSize: 10,
  },
  contactLink: {
    textDecoration: 'none',
  },
  
  // Styles de titres de section
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  // Styles spécifiques pour la section Expérience
  experienceSection: {
    backgroundColor: '#fcfcfc',
    borderLeft: '3pt solid #e0e0e0',
  },
  experienceItem: {
    marginBottom: 15,
    padding: 5,
    borderBottom: '1pt dotted #eeeeee',
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    alignItems: 'flex-start',
  },
  companyName: {
    fontSize: 14,
    fontWeight: 500,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 400,
    fontStyle: 'italic',
  },
  period: {
    fontSize: 10,
    fontStyle: 'normal',
    backgroundColor: '#f0f0f0',
    padding: 3,
    borderRadius: 2,
  },
  description: {
    fontSize: 10,
    marginTop: 5,
    lineHeight: 1.4,
  },
  bulletPoint: {
    fontSize: 10,
    marginLeft: 10,
    marginTop: 2,
  },
  
  // Styles spécifiques pour la section Éducation
  educationSection: {
    backgroundColor: '#fafafa',
    borderLeft: '3pt solid #e8e8e8',
  },
  educationItem: {
    marginBottom: 10,
    padding: 5,
  },
  schoolName: {
    fontSize: 12,
    fontWeight: 500,
  },
  degree: {
    fontSize: 10,
    fontStyle: 'italic',
  },
  
  // Styles spécifiques pour la section Skills
  skillsSection: {
    backgroundColor: '#f8f8f8',
    borderRadius: 4,
  },
  skillCategory: {
    width: '100%',
    marginBottom: 10,
  },
  skillCategoryTitle: {
    fontSize: 12,
    fontWeight: 500,
    marginBottom: 5,
    backgroundColor: '#f0f0f0',
    padding: 3,
    borderRadius: 3,
  },
  skillItem: {
    fontSize: 10,
    marginBottom: 2,
    marginLeft: 5,
  },
  
  // Styles spécifiques pour la section Soft Skills
  softSkillsSection: {
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  softSkillItem: {
    marginBottom: 5,
    padding: 3,
    borderLeft: '2pt solid #e0e0e0',
  },
  softSkillTitle: {
    fontSize: 11,
    fontWeight: 500,
  },
  
  // Styles spécifiques pour la section Projets
  projectsSection: {
    backgroundColor: '#f7f7f7',
    borderRadius: 4,
  },
  projectItem: {
    marginBottom: 8,
    padding: 4,
    border: '1pt solid #eeeeee',
    borderRadius: 3,
  },
  projectTitle: {
    fontSize: 12,
    fontWeight: 500,
  },
  projectDescription: {
    fontSize: 10,
    marginTop: 2,
  },
  technologyTag: {
    fontSize: 9,
    backgroundColor: '#eaeaea',
    padding: '2 4',
    borderRadius: 2,
    marginRight: 4,
    marginTop: 3,
    display: 'inline-block',
  },
  technologiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 3,
  }
});

/**
 * Génère des styles dynamiques basés sur la couleur secondaire
 * @param {string} secondaryColor - Couleur secondaire
 * @returns {Object} - Styles dynamiques
 */
export const getDynamicStyles = (secondaryColor) => StyleSheet.create({
  colorAccent: {
    color: secondaryColor,
  },
  borderColorAccent: {
    borderBottomColor: secondaryColor,
  },
  headerBackground: {
    backgroundColor: secondaryColor + '15',  // Plus transparent
  },
  leftColumnBorder: {
    borderRightColor: secondaryColor + '30',
  },
  sectionTitleBorder: {
    borderBottomColor: secondaryColor,
    borderBottomWidth: 2,
  },
  experienceSectionBorder: {
    borderLeftColor: secondaryColor + '60',
  },
  educationSectionBorder: {
    borderLeftColor: secondaryColor + '40',
  },
  skillCategoryBackground: {
    backgroundColor: secondaryColor + '15',
  },
  softSkillBorder: {
    borderLeftColor: secondaryColor + '50',
  },
  projectItemBorder: {
    borderColor: secondaryColor + '30',
  },
  periodBackground: {
    backgroundColor: secondaryColor + '15',
  },
  contactItemBackground: {
    backgroundColor: secondaryColor + '10',
  }
});