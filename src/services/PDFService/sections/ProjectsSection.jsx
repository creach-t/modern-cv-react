import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { BaseSection } from './BaseSection';
import { createBalancedColumns } from './sectionUtils';
import { SkillIconColored, getTechnologyIconName } from '../icons/SkillIcons';

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
  
  // Rendu d'un projet en format carte avec exactement 4 lignes compactes
  const renderProject = (project) => (
    <View style={{ 
      marginBottom: 2,
      border: '0.5pt solid #e0e0e0',
      borderRadius: 2,
      padding: 2,
      backgroundColor: 'white',
    }}>
      {/* Ligne 1: Titre du projet */}
      <Text style={{ 
        fontSize: 9, 
        fontWeight: 700, 
        color: secondaryColor,
        marginBottom: 0
      }}>
        {project[language]?.label || project.label || ""}
      </Text>
      
      {/* Ligne 2: Description du projet (limitée à 1 ligne) */}
      <Text style={{ 
        fontSize: 8, 
        lineHeight: 1, 
        color: '#555555',
        marginTop: 0,
        marginBottom: 0
      }}>
        {project[language]?.value || project.value || ""}
      </Text>
      
      {/* Ligne 3: Technologies utilisées (logos) */}
      <View style={{ 
        marginTop: 1, 
        borderTop: '0.3pt dotted #e0e0e0', 
        paddingTop: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}>
        {(project.technologies || []).slice(0, 6).map((tech, index) => (
          <View 
            key={`tech-${index}`}
            style={{
              width: 14,
              height: 14,
              marginRight: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <SkillIconColored name={getTechnologyIconName(tech)} size={12} color={secondaryColor} />
          </View>
        ))}
      </View>
      
      {/* Ligne 4: Lien du projet */}
      <View style={{ 
        marginTop: 1,
        backgroundColor: '#f5f5f5',
        padding: '0 2',
        borderRadius: 1,
        borderLeft: `1pt solid ${secondaryColor}`,
        alignSelf: 'flex-start'
      }}>
        <Text style={{ 
          fontSize: 8, 
          color: secondaryColor,
          fontWeight: 600
        }}>
          {project.link || ""}
        </Text>
      </View>
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
      customStyle={{ padding: 2, backgroundColor: '#f8f8f8' }}
    >
      <View style={{ flexDirection: 'row', width: '100%', gap: 2 }}>
        <View style={{ width: '49%' }}>
          {leftColumn.map((project, i) => (
            <View key={`left-${i}`}>
              {renderProject(project)}
            </View>
          ))}
        </View>
        <View style={{ width: '49%' }}>
          {rightColumn.map((project, i) => (
            <View key={`right-${i}`}>
              {renderProject(project)}
            </View>
          ))}
        </View>
      </View>
    </BaseSection>
  );
};