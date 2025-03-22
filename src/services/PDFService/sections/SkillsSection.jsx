// src/services/PDFService/sections/SkillsSection.jsx

import React from 'react';
import { Text, View } from '@react-pdf/renderer';

/**
 * Section des compétences techniques
 * @param {Array} skills - Liste des compétences techniques
 * @param {Object} styles - Styles de base
 * @param {Object} dynamicStyles - Styles dynamiques basés sur la couleur
 * @param {Object} translations - Traductions
 * @returns {React.Component} - Section des compétences
 */
export const SkillsSection = ({ skills, styles, dynamicStyles, translations }) => (
  <View style={[styles.section, styles.skillsSection]}>
    <Text style={[styles.sectionTitle, dynamicStyles.sectionTitleBorder, dynamicStyles.colorAccent]}>
      {translations.skills}
    </Text>
    {skills
      .filter(category => category.skills.some(skill => skill.level > 2))
      .map((category, index) => (
      <View key={index} style={styles.skillCategory}>
        <Text style={[styles.skillCategoryTitle, dynamicStyles.skillCategoryBackground, dynamicStyles.colorAccent]}>
          {category.category}
        </Text>
        {category.skills
          .filter(skill => skill.level > 2)
          .sort((a, b) => b.level - a.level)
          .map((skill, skillIndex) => (
            <Text key={skillIndex} style={styles.skillItem}>
              • {skill.name}
            </Text>
          ))
        }
      </View>
    ))}
  </View>
);