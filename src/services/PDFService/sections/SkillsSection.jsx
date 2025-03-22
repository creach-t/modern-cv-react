// src/services/PDFService/sections/SkillsSection.jsx

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { SkillIconColored, getTechnologyIconName } from '../icons/SkillIcons';

/**
 * Section des compétences techniques
 * @param {Object} userData - Données utilisateur formatées
 * @param {Object} styles - Styles de base
 * @param {Object} dynamicStyles - Styles dynamiques basés sur la couleur
 * @param {Object} translations - Traductions
 * @param {Object} config - Configuration complète
 * @returns {React.Component} - Section des compétences
 */
export const SkillsSection = ({ userData, styles, dynamicStyles, translations, config }) => {
  // Vérifier si userData.skills existe, sinon utiliser un tableau vide
  const skills = userData?.skills || [];
  
  // Options de la section skills
  const skillsOptions = config?.sections?.skills?.options || {};
  const showIcons = skillsOptions.showIcons !== false; // Par défaut true
  const iconSize = skillsOptions.iconSize || 16;
  const secondaryColor = config?.style?.colors?.secondary || '#0077cc';

  return (
    <View style={[styles.section, styles.skillsSection]}>
      <Text style={[styles.sectionTitle, dynamicStyles.sectionTitleBorder, dynamicStyles.colorAccent]}>
        {translations.skills}
      </Text>
      {skills
        .filter(category => category.skills && category.skills.some(skill => skill.level > 2))
        .map((category, index) => (
        <View key={index} style={styles.skillCategory}>
          <Text style={[styles.skillCategoryTitle, dynamicStyles.skillCategoryBackground, dynamicStyles.colorAccent]}>
            {category.category}
          </Text>
          {category.skills
            .filter(skill => skill.level > 2)
            .sort((a, b) => b.level - a.level)
            .map((skill, skillIndex) => (
              <View key={skillIndex} style={styles.skillItemContainer}>
                {showIcons && (
                  <View style={styles.skillIconContainer}>
                    <SkillIconColored 
                      name={skill.name} 
                      size={iconSize} 
                      color={secondaryColor}
                    />
                  </View>
                )}
                <Text style={styles.skillItem}>
                  {skill.name}
                </Text>
              </View>
            ))}
        </View>
      ))}
    </View>
  );
};
