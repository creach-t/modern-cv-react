// src/services/PDFService/styles.js

import { StyleSheet } from '@react-pdf/renderer';
import { getTextColor } from '../../utils/color';

/**
 * Calcule l'espacement en fonction de la densité depuis la configuration
 * @param {string} density - Densité (compact, normal, spacious)
 * @param {Object} theme - Configuration du thème
 * @returns {number} - Valeur d'espacement
 */
const getDensitySpacing = (density, theme) => {
  if (!density || !theme?.density) return 10; // Valeur par défaut
  
  return theme.density[density] || theme.density.normal || 10;
};

/**
 * Traite la couleur avec l'opacité si spécifiée
 * @param {string} color - Couleur de base
 * @param {string} opacity - Opacité en pourcentage
 * @returns {string} - Couleur avec opacité appliquée
 */
const processColorWithOpacity = (color, opacity) => {
  if (!opacity) return color;
  
  // Si l'opacité est en pourcentage, la convertir en valeur hexadécimale
  if (opacity.endsWith('%')) {
    const percentage = parseInt(opacity.replace('%', ''), 10);
    const opacityHex = Math.round((percentage / 100) * 255).toString(16).padStart(2, '0');
    return `${color}${opacityHex}`;
  }
  
  return color + opacity;
};

/**
 * Applique les réglages de couleur du thème aux styles de section
 * @param {Object} style - Style à traiter
 * @param {Object} colors - Couleurs du thème
 * @returns {Object} - Style avec couleurs appliquées
 */
const applyThemeColors = (style, colors) => {
  const result = { ...style };
  
  // Remplacer les références aux couleurs thématiques
  Object.keys(result).forEach(key => {
    // Traiter les propriétés qui ont une référence de couleur et d'opacité
    if (key.includes('Color') && result[key] === 'primary') {
      result[key] = colors.primary;
    } else if (key.includes('Color') && result[key] === 'secondary') {
      result[key] = colors.secondary;
    } else if (key.includes('Color') && result[key] === 'auto') {
      // Pour 'auto', déterminer la meilleure couleur de texte en fonction du fond
      // Si aucun fond n'est spécifié, utiliser la couleur de texte primaire
      const background = result.backgroundColor || colors.background.page;
      result[key] = getTextColor(background);
    }
    
    // Traiter les propriétés de fond avec opacité
    const opacityKey = key + 'Opacity';
    if (key === 'backgroundColor' && result[opacityKey]) {
      result[key] = processColorWithOpacity(result[key], result[opacityKey]);
      delete result[opacityKey]; // Supprimer la propriété d'opacité traitée
    }
    
    // Traiter les bordures avec couleur et opacité
    if (key.startsWith('border') && key.endsWith('Color') && result[key]) {
      const opacityKey = key + 'Opacity';
      if (result[opacityKey]) {
        result[key] = processColorWithOpacity(result[key], result[opacityKey]);
        delete result[opacityKey];
      }
    }
  });
  
  return result;
};

/**
 * Construit les styles de base et dynamiques à partir de la configuration
 * @param {Object} config - Configuration complète
 * @returns {Object} - Styles de base et dynamiques
 */
export const buildStylesFromConfig = (config) => {
  const { theme, sections } = config;
  const { colors, fonts, sectionTitle } = theme;
  
  // Styles pour le header avec traitement des couleurs
  const headerConfig = sections.header || {};
  const headerStyle = applyThemeColors({ ...headerConfig.style }, colors);
  
  // Styles pour les différentes sections avec leurs spécificités
  const stylesObj = {
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
    
    // Styles d'en-tête (header) en utilisant les styles de la section header
    header: headerStyle,
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
      width: headerConfig.profile?.size || 70,
      height: headerConfig.profile?.size || 70,
      borderRadius: (headerConfig.profile?.size || 70) / 2,
      border: `${headerConfig.profile?.borderWidth || 2}pt solid ${headerConfig.profile?.borderColor || colors.secondary}`,
      objectFit: 'cover',
      margin: headerConfig.profile?.margin || 2,
    },
    nameSection: {
      gap: 5,
    },
    name: {
      fontSize: headerConfig.name?.fontSize || fonts.sizes.name,
      fontWeight: headerConfig.name?.fontWeight || 'bold',
      color: headerConfig.name?.color === 'auto' ? getTextColor(headerStyle.backgroundColor) : (headerConfig.name?.color || colors.text.primary),
      marginBottom: headerConfig.name?.marginBottom || 0,
    },
    titleContainer: {
      flexDirection: 'row',
      gap: 3,
    },
    title: {
      fontSize: headerConfig.title?.fontSize || fonts.sizes.title,
      color: headerConfig.title?.color === 'auto' ? getTextColor(headerStyle.backgroundColor) : (headerConfig.title?.color || colors.text.primary),
    },
    titleHighlight: {
      fontSize: headerConfig.title?.fontSize || fonts.sizes.title,
      fontWeight: headerConfig.title?.highlight?.fontWeight || 'medium',
      color: headerConfig.title?.highlight?.color || colors.secondary,
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
      marginBottom: headerConfig.contact?.itemSpacing || 4,
    },
    contactIcon: {
      width: headerConfig.contact?.iconSize || 16,
      height: headerConfig.contact?.iconSize || 16,
      marginRight: headerConfig.contact?.iconMargin || 6,
      justifyContent: 'center',
      alignItems: 'center',
    },
    contactText: {
      fontSize: headerConfig.contact?.textSize || fonts.sizes.small,
      color: headerConfig.contact?.color === 'auto' ? getTextColor(headerStyle.backgroundColor) : (headerConfig.contact?.color || colors.text.primary),
    },
    contactLink: {
      textDecoration: 'none',
    },
    
    // Styles de titres de section
    sectionTitle: {
      fontSize: sectionTitle.fontSize || fonts.sizes.sectionTitle,
      fontWeight: sectionTitle.fontWeight || 700,
      marginBottom: sectionTitle.marginBottom || 10,
      paddingBottom: sectionTitle.paddingBottom || 5,
      borderBottomWidth: sectionTitle.borderBottom ? (sectionTitle.borderBottomWidth || 1) : 0,
      borderBottomColor: sectionTitle.borderBottomColor || colors.secondary,
      textTransform: sectionTitle.uppercase ? 'uppercase' : 'none',
      letterSpacing: sectionTitle.letterSpacing || 1,
      textAlign: sectionTitle.textAlign || 'left',
      padding: sectionTitle.padding || 0,
      color: sectionTitle.color || colors.text.primary,
    },
  };
  
  // Ajouter les styles spécifiques pour chaque section
  // Pour chaque section définir son style général et les styles de ses éléments
  
  // Expérience
  const expConfig = sections.experience || {};
  const expStyle = applyThemeColors({ ...expConfig.style }, colors);
  stylesObj.experienceSection = expStyle;
  stylesObj.experienceItem = applyThemeColors({ ...expConfig.item }, colors);
  stylesObj.experienceHeader = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    alignItems: 'flex-start',
  };
  stylesObj.companyName = applyThemeColors({ ...expConfig.company }, colors);
  stylesObj.jobTitle = applyThemeColors({ ...expConfig.jobTitle }, colors);
  stylesObj.period = applyThemeColors({ ...expConfig.period }, colors);
  stylesObj.explanation = applyThemeColors({ ...expConfig.explanation }, colors);
  stylesObj.bulletPoint = applyThemeColors({ ...expConfig.detail }, colors);
  stylesObj.technicalSection = applyThemeColors({ ...expConfig.technical }, colors);
  stylesObj.techLabel = applyThemeColors({ ...expConfig.techLabel }, colors);
  stylesObj.technologyBadge = applyThemeColors({ ...expConfig.technology }, colors);
  
  // Éducation
  const eduConfig = sections.education || {};
  const eduStyle = applyThemeColors({ ...eduConfig.style }, colors);
  stylesObj.educationSection = eduStyle;
  stylesObj.educationItem = {
    ...applyThemeColors({ ...eduConfig.item }, colors),
    marginBottom: getDensitySpacing(eduConfig.options?.density, theme),
  };
  stylesObj.schoolName = applyThemeColors({ ...eduConfig.schoolName }, colors);
  stylesObj.degree = applyThemeColors({ ...eduConfig.degree }, colors);
  stylesObj.eduPeriod = applyThemeColors({ ...eduConfig.period }, colors);
  stylesObj.location = applyThemeColors({ ...eduConfig.location }, colors);
  
  // Compétences (Skills)
  const skillsConfig = sections.skills || {};
  const skillsStyle = applyThemeColors({ ...skillsConfig.style }, colors);
  stylesObj.skillsSection = skillsStyle;
  stylesObj.skillCategory = {
    width: '100%',
    marginBottom: 10,
  };
  stylesObj.skillCategoryTitle = applyThemeColors({ ...skillsConfig.category }, colors);
  stylesObj.skillItemContainer = {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    marginLeft: 5,
  };
  stylesObj.skillIconContainer = {
    width: (skillsConfig.icon?.size || 16) + 2,
    height: (skillsConfig.icon?.size || 16) + 2,
    marginRight: skillsConfig.icon?.margin || 5,
    justifyContent: 'center',
    alignItems: 'center',
  };
  stylesObj.skillItem = applyThemeColors({ ...skillsConfig.item }, colors);
  
  // Soft Skills
  const softSkillsConfig = sections.softSkills || {};
  const softSkillsStyle = applyThemeColors({ ...softSkillsConfig.style }, colors);
  stylesObj.softSkillsSection = softSkillsStyle;
  stylesObj.softSkillItem = {
    ...applyThemeColors({ ...softSkillsConfig.item }, colors),
    marginBottom: getDensitySpacing(softSkillsConfig.options?.density, theme),
  };
  stylesObj.softSkillTitle = applyThemeColors({ ...softSkillsConfig.title }, colors);
  stylesObj.softSkillDescription = applyThemeColors({ ...softSkillsConfig.description }, colors);
  
  // Projets
  const projectsConfig = sections.projects || {};
  const projectsStyle = applyThemeColors({ ...projectsConfig.style }, colors);
  stylesObj.projectsSection = projectsStyle;
  stylesObj.projectItem = {
    ...applyThemeColors({ ...projectsConfig.item }, colors),
    marginBottom: getDensitySpacing(projectsConfig.options?.density, theme),
  };
  stylesObj.projectTitle = applyThemeColors({ ...projectsConfig.title }, colors);
  stylesObj.projectDescription = applyThemeColors({ ...projectsConfig.description }, colors);
  stylesObj.technologyTag = applyThemeColors({ ...projectsConfig.technology }, colors);
  stylesObj.technologiesContainer = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 3,
  };
  
  // Création des styles avec StyleSheet
  const baseStyles = StyleSheet.create(stylesObj);
  
  // Styles dynamiques qui peuvent être combinés avec les styles de base
  const dynamicStylesObj = {
    colorAccent: {
      color: colors.secondary,
    },
    borderColorAccent: {
      borderColor: colors.secondary,
    },
    headerBackground: {
      backgroundColor: headerConfig.options?.useFullSecondaryColor ? colors.secondary : processColorWithOpacity(colors.secondary, '15%'),
    },
    headerTextColor: {
      color: getTextColor(headerConfig.options?.useFullSecondaryColor ? colors.secondary : processColorWithOpacity(colors.secondary, '15%')),
    },
    leftColumnBorder: {
      borderRightColor: processColorWithOpacity(colors.secondary, '30%'),
    },
    sectionTitleBorder: {
      borderBottomColor: colors.secondary,
    },
    experienceSectionBorder: {
      borderLeftColor: processColorWithOpacity(colors.secondary, '60%'),
    },
    educationSectionBorder: {
      borderLeftColor: processColorWithOpacity(colors.secondary, '40%'),
    },
    skillCategoryBackground: {
      backgroundColor: processColorWithOpacity(colors.secondary, '15%'),
    },
    softSkillBorder: {
      borderLeftColor: processColorWithOpacity(colors.secondary, '50%'),
    },
    projectItemBorder: {
      borderColor: processColorWithOpacity(colors.secondary, '30%'),
    },
    periodBackground: {
      backgroundColor: processColorWithOpacity(colors.secondary, '15%'),
    },
    technologyBackground: {
      backgroundColor: processColorWithOpacity(colors.secondary, '15%'),
    }
  };
  
  const dynamicStyles = StyleSheet.create(dynamicStylesObj);
  
  return { baseStyles, dynamicStyles };
};
