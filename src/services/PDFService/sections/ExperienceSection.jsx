// src/services/PDFService/sections/ExperienceSection.jsx

import React from 'react';
import { Text, View } from '@react-pdf/renderer';

/**
 * Section des expériences professionnelles
 * @param {Object} userData - Données utilisateur formatées
 * @param {Object} styles - Styles de base
 * @param {Object} dynamicStyles - Styles dynamiques basés sur la couleur
 * @param {Object} translations - Traductions
 * @param {string} language - Langue actuelle ('fr' ou 'en')
 * @returns {React.Component} - Section des expériences
 */
export const ExperienceSection = ({ userData, styles, dynamicStyles, translations, language }) => {
  // Vérifier si userData.experiences existe, sinon utiliser un tableau vide
  const experiences = userData?.experiences || [];
  
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, dynamicStyles.borderColorAccent, dynamicStyles.colorAccent]}>
        {translations.experience}
      </Text>
      {experiences.map((exp, index) => (
        <View key={index} style={styles.experienceItem}>
          <View style={styles.experienceHeader}>
            <View>
              <Text style={[styles.companyName, dynamicStyles.colorAccent]}>
                {exp.company?.name || ""}
              </Text>
              <Text style={styles.jobTitle}>{exp[language]?.label || ""}</Text>
            </View>
            <Text style={styles.period}>{exp.period || ""}</Text>
          </View>
          <Text style={styles.description}>{exp[language]?.explanation || ""}</Text>
          {exp[language]?.details && exp[language].details.map((detail, detailIndex) => (
            <Text key={detailIndex} style={styles.bulletPoint}>• {detail}</Text>
          ))}
          
          {/* Technologies et outils utilisés */}
          {exp.technologies && exp.technologies.length > 0 && (
            <View style={{ marginTop: 3 }}>
              <Text style={[styles.skillItem, { fontWeight: 500 }]}>
                {translations.technologies}: {exp.technologies.join(', ')}
              </Text>
            </View>
          )}
          
          {exp.tools && exp.tools.length > 0 && (
            <View style={{ marginTop: 2 }}>
              <Text style={[styles.skillItem, { fontWeight: 500 }]}>
                {translations.tools}: {exp.tools.join(', ')}
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};
