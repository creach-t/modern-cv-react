// src/services/PDFService/sections/SkillsSection.jsx

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { SkillIconColored } from '../icons/SkillIcons';
import { BaseSection } from './BaseSection';
import { getSectionConfig } from './sectionUtils';

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
  const secondaryColor = config?.style?.colors?.secondary || '#0077cc';
  
  // Options de la section skills
  const sectionConfig = getSectionConfig('skills', config);
  const showIcons = sectionConfig.options?.showIcons !== false; // Par défaut true
  const iconSize = sectionConfig.options?.iconSize || 16;

  // Fonction pour grouper les compétences par paires
  const createSkillPairs = (skills) => {
    const pairs = [];
    for (let i = 0; i < skills.length; i += 2) {
      pairs.push(skills.slice(i, i + 2));
    }
    return pairs;
  };

  return (
    <BaseSection
      title={translations.skills}
      sectionName="skills"
      config={config}
      styles={styles}
      dynamicStyles={dynamicStyles}
    >
      {skills
        .filter(category => category.skills && category.skills.some(skill => skill.level > 2))
        .map((category, index) => (
        <View key={index} style={styles.skillCategory}>
          <Text style={[styles.skillCategoryTitle, dynamicStyles.skillCategoryBackground, dynamicStyles.colorAccent]}>
            {category.category}
          </Text>
          
          {/* Grouper les compétences par paires */}
          {createSkillPairs(
            category.skills
              .filter(skill => skill.level > 2)
              .sort((a, b) => b.level - a.level)
          ).map((pair, pairIndex) => (
            <View key={pairIndex} style={{ flexDirection: 'row', marginBottom: 4 }}>
              {pair.map((skill, skillIndex) => (
                <View 
                  key={skillIndex} 
                  style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center',
                    width: '50%',
                    paddingLeft: 3,
                  }}
                >
                  {showIcons && (
                    <View style={styles.skillIconContainer}>
                      <SkillIconColored 
                        name={skill.name} 
                        size={iconSize}
                        color={secondaryColor}
                      />
                    </View>
                  )}
                  <Text style={[
                    styles.skillItem,
                    { maxWidth: '80%', fontSize: 8 }
                  ]}>
                    {skill.name}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      ))}
    </BaseSection>
  );
};