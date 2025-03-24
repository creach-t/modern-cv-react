// src/services/PDFService/sections/SoftSkillsSection.jsx

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { SkillIconColored } from '../icons/SkillIcons';
import { getTextColor } from '../../../utils/color';
import { BaseSection } from './BaseSection';
import { getSectionConfig } from './sectionUtils';

/**
 * Section des soft skills avec icônes
 * @param {Object} userData - Données utilisateur formatées
 * @param {Object} styles - Styles de base
 * @param {Object} dynamicStyles - Styles dynamiques basés sur la couleur
 * @param {Object} translations - Traductions
 * @param {string} language - Langue actuelle ('fr' ou 'en')
 * @param {Object} config - Configuration complète
 * @returns {React.Component} - Section des soft skills
 */
export const SoftSkillsSection = ({ userData, styles, dynamicStyles, translations, language, config }) => {
  // Vérifier si userData.softSkills existe, sinon utiliser un tableau vide
  const softSkills = userData?.softSkills || [];
  const secondaryColor = config?.style?.colors?.secondary || '#0077cc'; 
  const sectionConfig = getSectionConfig('softSkills', config);
  
  // Utiliser la couleur d'accent pour le cercle
  const circleColor = secondaryColor;
  
  // Styles locaux pour la section
  const localStyles = {
    skillsGrid: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 5,
    },
    softSkillItem: {
      width: '50%',
      marginBottom: 4,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingRight: 2,
    },
    skillIconContainer: {
      width: 16,
      height: 16,
      marginRight: 3,
      marginTop: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 7, // La moitié de la largeur/hauteur pour un cercle parfait
      backgroundColor: circleColor, // Appliquer la couleur d'accent au cercle
    },
    softSkillContent: {
      flex: 1,
    },
    softSkillTitle: {
      fontSize: 8,
      fontWeight: 'bold',
      marginBottom: 1,
    },
    skillDescription: {
      fontSize: 6,
      lineHeight: 1.1,
    },
  };
  
  return (
    <BaseSection
      title={translations.softSkills}
      sectionName="softSkills"
      config={config}
      styles={styles}
      dynamicStyles={dynamicStyles}
    >
      <View style={localStyles.skillsGrid}>
        {softSkills
          .filter(skill => skill.id !== "hobbies")
          .map((skill, index) => (
            <View key={index} style={localStyles.softSkillItem}>
              <View style={localStyles.skillIconContainer}>
                <SkillIconColored 
                  name={skill.icon} 
                  size={12} 
                  color={getTextColor(circleColor)}
                />
              </View>
              <View style={localStyles.softSkillContent}>
                <Text style={[localStyles.softSkillTitle, dynamicStyles.colorAccent]}>
                  {skill.title[language]}
                </Text>
                {skill.description[language] && (
                  <Text style={localStyles.skillDescription}>
                    {skill.description[language]}
                  </Text>
                )}
              </View>
            </View>
          ))}
      </View>
    </BaseSection>
  );
};