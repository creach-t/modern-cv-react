// src/services/PDFService/styles.js

import { StyleSheet } from '@react-pdf/renderer';

/**
 * Calcule l'espacement en fonction de la densité
 * @param {string} density - Densité (compact, normal, spacious)
 * @returns {number} - Valeur d'espacement
 */
const getDensitySpacing = (density) => {
  switch (density) {
    case 'compact':
      return 5;
    case 'spacious':
      return 20;
    case 'normal':
    default:
      return 10;
  }
};

/**
 * Construit les styles de base et dynamiques à partir de la configuration
 * @param {Object} config - Configuration de styles
 * @returns {Object} - Styles de base et dynamiques
 */
export const buildStylesFromConfig = (config) => {
  const { style, sections } = config;
  const { colors, fonts, sectionTitle } = style;
  
  // Construire les styles de base
  const baseStyles = StyleSheet.create({
    // Styles généraux de la page
    page: {
      flexDirection: 'column',
      backgroundColor: colors.background.page,
      padding: config.document.padding,
      fontFamily: fonts.primary,
    },
    
    // Style du footer
    footer: {
      position: 'absolute',
      bottom: config.document.footer.position === 'bottom' ? config.document.padding : 0,
      left: config.document.padding,
      right: config.document.padding,
      textAlign: 'center',
      fontSize: config.document.footer.fontSize,
      color: config.document.footer.color,
    },
    
    // Layout général
    singleColumn: {
      flexDirection: 'column',
      marginTop: 10,
    },
    twoColumns: {
      flexDirection: 'row',
      marginTop: 10,
      columnGap: config.layout.spaceBetweenColumns,
    },
    leftColumn: {
      width: config.layout.columns[0].width,
      borderRight: '1pt dotted #dddddd',
      paddingRight: 8,
    },
    rightColumn: {
      width: config.layout.columns[1].width,
    },
    section: {
      marginBottom: 15,
      padding: 8,
      borderRadius: 4,
    },
    
    // Styles d'en-tête (header)
    header: {
      ...(sections.header?.style || {}),
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
      width: sections.header?.options?.profilePictureSize || 70,
      height: sections.header?.options?.profilePictureSize || 70,
      borderRadius: (sections.header?.options?.profilePictureSize || 70) / 2,
      border: '2pt solid white',
    },
    nameSection: {
      gap: 5,
    },
    name: {
      fontSize: fonts.sizes.name,
      fontWeight: 'bold',
    },
    titleContainer: {
      flexDirection: 'row',
      gap: 3,
    },
    title: {
      fontSize: fonts.sizes.title,
      opacity: 0.85,
    },
    titleHighlight: {
      fontSize: fonts.sizes.title,
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
      fontSize: fonts.sizes.small,
    },
    contactLink: {
      textDecoration: 'none',
    },
    
    // Styles de titres de section
    sectionTitle: {
      fontSize: sectionTitle.fontSize || fonts.sizes.sectionTitle,
      fontWeight: 700,
      marginBottom: sectionTitle.marginBottom || 10,
      paddingBottom: sectionTitle.paddingBottom || 5,
      borderBottomWidth: sectionTitle.borderBottom ? (sectionTitle.borderBottomWidth || 1) : 0,
      borderBottomColor: colors.secondary,
      textTransform: sectionTitle.uppercase ? 'uppercase' : 'none',
      letterSpacing: sectionTitle.letterSpacing || 1,
    },
    
    // Styles spécifiques pour la section Expérience
    experienceSection: {
      ...(sections.experience?.style || {}),
    },
    experienceItem: {
      marginBottom: getDensitySpacing(sections.experience?.options?.density),
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
      fontSize: fonts.sizes.companyName,
      fontWeight: 500,
    },
    jobTitle: {
      fontSize: fonts.sizes.jobTitle,
      fontWeight: 400,
      fontStyle: 'italic',
    },
    period: {
      fontSize: fonts.sizes.small,
      fontStyle: 'normal',
      backgroundColor: '#f0f0f0',
      padding: 3,
      borderRadius: 2,
    },
    description: {
      fontSize: fonts.sizes.normal,
      marginTop: 5,
      lineHeight: 1.4,
    },
    bulletPoint: {
      fontSize: fonts.sizes.normal,
      marginLeft: 10,
      marginTop: 2,
    },
    
    // Styles spécifiques pour la section Éducation
    educationSection: {
      ...(sections.education?.style || {}),
    },
    educationItem: {
      marginBottom: getDensitySpacing(sections.education?.options?.density),
      padding: 5,
    },
    schoolName: {
      fontSize: fonts.sizes.normal + 2,
      fontWeight: 500,
    },
    degree: {
      fontSize: fonts.sizes.normal,
      fontStyle: 'italic',
    },
    
    // Styles spécifiques pour la section Skills
    skillsSection: {
      ...(sections.skills?.style || {}),
    },
    skillCategory: {
      width: '100%',
      marginBottom: 10,
    },
    skillCategoryTitle: {
      fontSize: fonts.sizes.normal + 2,
      fontWeight: 500,
      marginBottom: 5,
      backgroundColor: '#f0f0f0',
      padding: 3,
      borderRadius: 3,
    },
    skillItem: {
      fontSize: fonts.sizes.normal,
      marginBottom: 2,
      marginLeft: 5,
    },
    
    // Styles spécifiques pour la section Soft Skills
    softSkillsSection: {
      ...(sections.softSkills?.style || {}),
    },
    softSkillItem: {
      marginBottom: getDensitySpacing(sections.softSkills?.options?.density),
      padding: 3,
      borderLeft: '2pt solid #e0e0e0',
    },
    softSkillTitle: {
      fontSize: fonts.sizes.normal + 1,
      fontWeight: 500,
    },
    
    // Styles spécifiques pour la section Projets
    projectsSection: {
      ...(sections.projects?.style || {}),
    },
    projectItem: {
      marginBottom: getDensitySpacing(sections.projects?.options?.density),
      padding: 4,
      border: '1pt solid #eeeeee',
      borderRadius: 3,
    },
    projectTitle: {
      fontSize: fonts.sizes.normal + 2,
      fontWeight: 500,
    },
    projectDescription: {
      fontSize: fonts.sizes.normal,
      marginTop: 2,
    },
    technologyTag: {
      fontSize: fonts.sizes.small,
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
  
  // Construire les styles dynamiques
  const dynamicStyles = StyleSheet.create({
    colorAccent: {
      color: colors.secondary,
    },
    borderColorAccent: {
      borderBottomColor: colors.secondary,
    },
    headerBackground: {
      backgroundColor: colors.background.header || (colors.secondary + '15'),
    },
    leftColumnBorder: {
      borderRightColor: colors.secondary + '30',
    },
    sectionTitleBorder: {
      borderBottomColor: colors.secondary,
      borderBottomWidth: 2,
    },
    experienceSectionBorder: {
      borderLeftColor: colors.secondary + '60',
    },
    educationSectionBorder: {
      borderLeftColor: colors.secondary + '40',
    },
    skillCategoryBackground: {
      backgroundColor: colors.secondary + '15',
    },
    softSkillBorder: {
      borderLeftColor: colors.secondary + '50',
    },
    projectItemBorder: {
      borderColor: colors.secondary + '30',
    },
    periodBackground: {
      backgroundColor: colors.secondary + '15',
    },
    contactItemBackground: {
      backgroundColor: colors.secondary + '10',
    }
  });
  
  return { baseStyles, dynamicStyles };
};