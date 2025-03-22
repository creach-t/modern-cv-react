// src/services/PDFService/sections/SoftSkillsSection.jsx

import React from 'react';
import { Text, View } from '@react-pdf/renderer';

/**
 * Section des soft skills
 * @param {Array} softSkills - Liste des soft skills
 * @param {Object} styles - Styles de base
 * @param {Object} dynamicStyles - Styles dynamiques basés sur la couleur
 * @param {Object} translations - Traductions
 * @param {string} language - Langue actuelle ('fr' ou 'en')
 * @returns {React.Component} - Section des soft skills
 */
export const SoftSkillsSection = ({ softSkills, styles, dynamicStyles, translations, language }) => (
  <View style={styles.section}>
    <Text style={[styles.sectionTitle, dynamicStyles.borderColorAccent, dynamicStyles.colorAccent]}>
      {translations.softSkills}
    </Text>
    {softSkills
      .filter(skill => skill.id !== "hobbies")
      .map((skill, index) => (
        <View key={index} style={styles.softSkillItem}>
          <Text style={[styles.softSkillTitle, dynamicStyles.colorAccent]}>
            {skill.title[language]}
          </Text>
          {skill.description[language] && (
            <Text style={styles.skillItem}>
              {skill.description[language]}
            </Text>
          )}
        </View>
      ))}
  </View>
);