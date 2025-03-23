// src/services/PDFService/sections/ProjectsSection.jsx

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { SkillIconColored } from '../icons/SkillIcons';

/**
 * Section des projets (style cartes)
 * @param {Object} userData - Données utilisateur formatées
 * @param {Object} styles - Styles de base
 * @param {Object} dynamicStyles - Styles dynamiques basés sur la couleur
 * @param {Object} translations - Traductions
 * @param {string} language - Langue actuelle ('fr' ou 'en')
 * @param {Object} config - Configuration complète
 * @returns {React.Component} - Section des projets
 */
export const ProjectsSection = ({ userData, styles, dynamicStyles, translations, language, config }) => {
  // Vérifier si userData.projects existe, sinon utiliser un tableau vide
  const projects = userData?.projects || [];
  const secondaryColor = config?.style?.colors?.secondary || '#0077cc';
  const iconSize = 9;
  
  // Distribution des projets en colonnes
  const createBalancedColumns = (items) => {
    if (!items || !Array.isArray(items) || items.length === 0) return [[], []];
    const midpoint = Math.ceil(items.length / 2);
    return [items.slice(0, midpoint), items.slice(midpoint)];
  };
  
  // Rendu d'icône avec gestion d'erreur
  const renderSkillIcon = (name) => {
    try {
      return <SkillIconColored name={name} size={iconSize} color={secondaryColor} />;
    } catch (error) {
      return <View style={{ width: iconSize, height: iconSize }} />;
    }
  };
  
  // Rendu des badges de compétences
  const renderBadges = (items) => {
    if (!items || items.length === 0) return null;
    
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 2, marginTop: 1 }}>
        {items.map((item, i) => (
          <View key={i} style={{ 
            flexDirection: 'row', 
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
            padding: '1 3',
            borderRadius: 3
          }}>
            {renderSkillIcon(item)}
            <Text style={{ fontSize: 6, marginLeft: 1 }}>{item}</Text>
          </View>
        ))}
      </View>
    );
  };
  
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
          {renderBadges(project.technologies)}
        </View>
      )}
      
      {/* Lien du projet (si disponible) */}
      {project.url && (
        <View style={{ marginTop: 2 }}>
          <Text style={{ 
            fontSize: 6, 
            color: secondaryColor,
            textDecoration: 'underline'
          }}>
            URL: {project.url}
          </Text>
        </View>
      )}
    </View>
  );
  
  // Diviser les projets en colonnes
  const [leftColumn, rightColumn] = createBalancedColumns(projects);
  
  return (
    <View style={[styles.section, { padding: 4, backgroundColor: '#f8f8f8' }]}>
      <Text style={[styles.sectionTitle, { 
        fontSize: 10, 
        fontWeight: 700, 
        marginBottom: 4,
        color: secondaryColor,
        textAlign: 'center',
        padding: 2,
        textTransform: 'uppercase'
      }]}>
        {translations.projects}
      </Text>
      
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
    </View>
  );
};