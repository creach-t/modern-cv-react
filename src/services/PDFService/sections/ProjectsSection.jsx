import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { BaseSection } from './BaseSection';
import { createBalancedColumns, getSectionConfig } from './sectionUtils';
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
  const sectionConfig = getSectionConfig('projects', config);
  
  // Fonction pour rendre uniquement les logos des technologies
  const renderTechLogos = (technologies) => {
    if (!technologies || technologies.length === 0) return null;
    
    return (
      <View style={{ 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        gap: 2
      }}>
        {technologies.map((tech, index) => {
          const iconName = getTechnologyIconName(tech);
          
          return (
            <View 
              key={`tech-${index}`}
              style={{
                width: 16,
                height: 16,
                marginRight: 2,
                marginBottom: 2,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <SkillIconColored name={iconName} size={14} color={secondaryColor} />
            </View>
          );
        })}
      </View>
    );
  };
  
  // Calculer la hauteur maximale pour chaque colonne
  const calculateContentHeight = (project) => {
    let height = 0;
    // Hauteur du titre
    height += 11;
    // Hauteur de la description
    if (project[language]?.value || project.value) {
      const text = project[language]?.value || project.value;
      const lines = Math.ceil(text.length / 45);
      height += lines * 8;
    }
    // Hauteur pour les technologies (logos)
    if (project.technologies && project.technologies.length > 0) {
      height += Math.ceil(project.technologies.length / 6) * 18; // Environ 6 logos par ligne
    }
    // Hauteur pour le lien (style mis en valeur prend plus de place)
    if (project.link) {
      height += 14;
    }
    
    return height + 10; // Marge de sécurité
  };
  
  // Diviser les projets en colonnes
  const [leftColumn, rightColumn] = createBalancedColumns(projects);
  
  // Trouver la hauteur maximale par ligne
  const maxHeightPerRow = [];
  for (let i = 0; i < Math.max(leftColumn.length, rightColumn.length); i++) {
    const leftHeight = i < leftColumn.length ? calculateContentHeight(leftColumn[i]) : 0;
    const rightHeight = i < rightColumn.length ? calculateContentHeight(rightColumn[i]) : 0;
    maxHeightPerRow.push(Math.max(leftHeight, rightHeight));
  }
  
  // Rendu d'un projet en format carte
  const renderProject = (project, fixedHeight) => (
    <View style={{ 
      marginBottom: 3,
      border: '0.5pt solid #e0e0e0',
      borderRadius: 3,
      padding: 3,
      backgroundColor: 'white',
      height: fixedHeight,
      position: 'relative'
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
        lineHeight: 1.1, 
        color: '#555555',
        marginBottom: 1
      }}>
        {project[language]?.value || project.value || ""}
      </Text>
      
      {/* Technologies utilisées (logos) */}
      {project.technologies && project.technologies.length > 0 && (
        <View style={{ marginTop: 1, borderTop: '0.5pt dotted #e0e0e0', paddingTop: 2 }}>
          {renderTechLogos(project.technologies)}
        </View>
      )}
      
      {/* Lien du projet (si disponible) - mis en valeur */}
      {project.link && (
        <View style={{ 
          marginTop: 2,
          backgroundColor: '#f5f5f5',
          padding: '1 3',
          borderRadius: 2,
          borderLeft: `2pt solid ${secondaryColor}`,
          alignSelf: 'flex-start'
        }}>
          <Text style={{ 
            fontSize: 8, 
            color: secondaryColor,
            fontWeight: 600
          }}>
            {project.link}
          </Text>
        </View>
      )}
    </View>
  );
  
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
            <View key={`left-${i}`}>
              {renderProject(project, maxHeightPerRow[i])}
            </View>
          ))}
        </View>
        <View style={{ width: '49%' }}>
          {rightColumn.map((project, i) => (
            <View key={`right-${i}`}>
              {renderProject(project, maxHeightPerRow[i])}
            </View>
          ))}
        </View>
      </View>
    </BaseSection>
  );
};