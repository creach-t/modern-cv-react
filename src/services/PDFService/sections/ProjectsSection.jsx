// src/services/PDFService/sections/ProjectsSection.jsx

import React from 'react';
import { Text, View } from '@react-pdf/renderer';

/**
 * Section des projets
 * @param {Array} projects - Liste des projets
 * @param {Object} styles - Styles de base
 * @param {Object} dynamicStyles - Styles dynamiques basés sur la couleur
 * @param {Object} translations - Traductions
 * @param {string} language - Langue actuelle ('fr' ou 'en')
 * @returns {React.Component} - Section des projets
 */
export const ProjectsSection = ({ projects, styles, dynamicStyles, translations, language }) => (
  <View style={styles.section}>
    <Text style={[styles.sectionTitle, dynamicStyles.borderColorAccent, dynamicStyles.colorAccent]}>
      {translations.projects}
    </Text>
    {projects.map((project, index) => (
      <View key={index} style={styles.educationItem}>
        <Text style={[styles.schoolName, dynamicStyles.colorAccent]}>
          {project[language].label}
        </Text>
        <Text style={styles.degree}>
          {project[language].value}
        </Text>
        {project.technologies && project.technologies.length > 0 && (
          <Text style={styles.skillItem}>
            {`${translations.technologies}: ${project.technologies.slice(0, 3).join(', ')}${project.technologies.length > 3 ? '...' : ''}`}
          </Text>
        )}
      </View>
    ))}
  </View>
);