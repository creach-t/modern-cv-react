// src/services/PDFService/sections/ProjectsSection.jsx

import React from 'react';
import { Text, View } from '@react-pdf/renderer';

/**
 * Section des projets
 * @param {Object} userData - Données utilisateur formatées
 * @param {Object} styles - Styles de base
 * @param {Object} dynamicStyles - Styles dynamiques basés sur la couleur
 * @param {Object} translations - Traductions
 * @param {string} language - Langue actuelle ('fr' ou 'en')
 * @returns {React.Component} - Section des projets
 */
export const ProjectsSection = ({ userData, styles, dynamicStyles, translations, language }) => {
  // Vérifier si userData.projects existe, sinon utiliser un tableau vide
  const projects = userData?.projects || [];
  
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, dynamicStyles.borderColorAccent, dynamicStyles.colorAccent]}>
        {translations.projects}
      </Text>
      {projects.map((project, index) => (
        <View key={index} style={styles.educationItem}>
          <Text style={[styles.schoolName, dynamicStyles.colorAccent]}>
            {project[language]?.label || project.label || ""}
          </Text>
          <Text style={styles.degree}>
            {project[language]?.value || project.value || ""}
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
};
