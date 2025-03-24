// src/services/PDFService/sections/ProjectsSection.jsx

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { BaseSection } from './BaseSection';
import { renderBadges, createBalancedColumns, getSectionConfig } from './sectionUtils';

/**
 * Section des projets
 * @param {Object} userData - Données utilisateur formatées
 * @param {Object} styles - Styles de base
 * @param {Object} dynamicStyles - Styles dynamiques basés sur la couleur
 * @param {Object} translations - Traductions
 * @param {string} language - Langue actuelle ('fr' ou 'en')
 * @param {Object} config - Configuration complète
 * @returns {React.Component} - Section des projets
 */
export const ProjectsSection = ({ userData, styles, dynamicStyles, translations, language, config }) => {
  const projects = userData?.projects || [];
  const secondaryColor = config?.style?.colors?.secondary || '#0077cc';
  const sectionConfig = getSectionConfig('projects', config);
  
  // Rendu d'un projet en format carte
  const renderProject = (project) => (
    <View style={{ 
      marginBottom: 3,
      border: '0.5pt solid #e0e0e0',
      borderRadius: 3,
      padding: 3,
      backgroundColor: 'white'
    }}>
      {/* Titre du projet */}
      <Text style={{ 
        fontSize: 9, 
        fontWeight: 700, 
        color: secondaryColor,
        marginBottom: 1
      }}>
        {project[language]?.label || project.label || ""}
      </Text>
      
      {/* Description du projet */}
      <Text style={{ 
        fontSize: 7, 
        lineHeight: 1.2, 
        color: '#555555',
        marginBottom: 2
      }}>
        {project[language]?.value || project.value || ""}
      </Text>
      
      {/* Technologies utilisées */}
      {project.technologies && project.technologies.length > 0 && (
        <View style={{ marginTop: 1, borderTop: '0.5pt dotted #e0e0e0', paddingTop: 2 }}>
          <Text style={{ fontSize: 6, fontWeight: 600, color: '#555555', marginBottom: 1 }}>
            {translations.technologies}:
          </Text>
          {renderBadges(project.technologies, secondaryColor)}
        </View>
      )}
      
      {/* Lien du projet (si disponible) */}
      {project.link && (
        <View style={{ marginTop: 2 }}>
          <Text style={{ 
            fontSize: 6, 
            color: secondaryColor,
            textDecoration: 'underline'
          }}>
            URL: {project.link}
          </Text>
        </View>
      )}
    </View>
  );
  
  // Diviser les projets en colonnes
  const [leftColumn, rightColumn] = createBalancedColumns(projects);
  
  return (
    <BaseSection
      title={translations.projects}
      sectionName="projects"
      config={config}
      styles={styles}
      dynamicStyles={dynamicStyles}
      customStyle={{ padding: 4, backgroundColor: '#f8f8f8' }}
    >
      <View style={{ flexDirection: 'row', width: '100%', gap: 4 }}>
        <View style={{ width: '49%' }}>
          {leftColumn.map((project, i) => (
            <View key={`left-${i}`}>{renderProject(project)}</View>
          ))}
        </View>
        <View style={{ width: '49%' }}>
          {rightColumn.map((project, i) => (
            <View key={`right-${i}`}>{renderProject(project)}</View>
          ))}
        </View>
      </View>
    </BaseSection>
  );
};