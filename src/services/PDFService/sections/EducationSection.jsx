// src/services/PDFService/sections/EducationSection.jsx

import React from 'react';
import { Text, View } from '@react-pdf/renderer';

/**
 * Section de formation
 * @param {Object} userData - Données utilisateur formatées
 * @param {Object} styles - Styles de base
 * @param {Object} dynamicStyles - Styles dynamiques basés sur la couleur
 * @param {Object} translations - Traductions
 * @param {string} language - Langue actuelle ('fr' ou 'en')
 * @returns {React.Component} - Section de formation
 */
export const EducationSection = ({ userData, styles, dynamicStyles, translations, language }) => {
  // Vérifier si userData.education existe, sinon utiliser un tableau vide
  const education = userData?.education || [];
  
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, dynamicStyles.borderColorAccent, dynamicStyles.colorAccent]}>
        {translations.education}
      </Text>
      {education.map((edu, index) => (
        <View key={index} style={styles.educationItem}>
          <View style={styles.experienceHeader}>
            <View>
              <Text style={[styles.schoolName, dynamicStyles.colorAccent]}>
                {edu.school?.name || ""}
              </Text>
              <Text style={styles.degree}>{edu[language]?.label || ""}</Text>
            </View>
            <Text style={styles.period}>{edu.period || ""}</Text>
          </View>
          <Text style={styles.description}>{edu[language]?.explanation || ""}</Text>
          
          {/* Technologies et outils utilisés dans la formation */}
          {edu.technologies && edu.technologies.length > 0 && (
            <View style={{ marginTop: 3 }}>
              <Text style={[styles.skillItem, { fontWeight: 500 }]}>
                {translations.technologies}: {edu.technologies.join(', ')}
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};
