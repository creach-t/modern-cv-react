// src/services/PDFService/sections/EducationSection.jsx

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { BaseSection } from './BaseSection';
import { renderBadges, createBalancedColumns, getSectionConfig, renderPeriodBadge } from './sectionUtils';

/**
 * Section de formation (style cartes)
 */
export const EducationSection = ({ userData, styles, dynamicStyles, translations, language, config }) => {
  // Vérifier si userData.education existe, sinon utiliser un tableau vide
  const education = userData?.education || [];
  const secondaryColor = config?.style?.colors?.secondary || '#0077cc';
  const sectionConfig = getSectionConfig('education', config);
  
  // Rendu d'une formation en format carte
  const renderEducation = (edu) => (
    <View style={{ 
      marginBottom: 3,
      border: '0.5pt solid #e0e0e0',
      borderRadius: 3,
      padding: 3,
      backgroundColor: 'white'
    }}>
      {/* École et période */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Text style={{ 
          fontSize: 9, 
          fontWeight: 700, 
          color: secondaryColor 
        }}>
          {edu.school?.name || ""}
        </Text>
        
        {renderPeriodBadge(edu.period, secondaryColor)}
      </View>
      
      {/* Intitulé du diplôme */}
      <Text style={{ 
        fontSize: 8, 
        fontWeight: 600,
        marginBottom: 2,
        color: '#444444'
      }}>
        {edu[language]?.label || ""}
      </Text>
      
      {/* Description */}
      <Text style={{ fontSize: 7, lineHeight: 1.2, color: '#555555' }}>
        {edu[language]?.explanation || ""}
      </Text>
      
      {/* Technologies utilisées */}
      {edu.technologies && edu.technologies.length > 0 && (
        <View style={{ marginTop: 2, borderTop: '0.5pt dotted #e0e0e0', paddingTop: 2 }}>
          <Text style={{ fontSize: 6, fontWeight: 600, color: '#555555', marginBottom: 1 }}>
            {translations.technologies}:
          </Text>
          {renderBadges(edu.technologies, secondaryColor)}
        </View>
      )}
    </View>
  );
  
  // Diviser les formations en colonnes
  const [leftColumn, rightColumn] = createBalancedColumns(education);
  
  return (
    <BaseSection
      title={translations.education}
      sectionName="education"
      config={config}
      styles={styles}
      dynamicStyles={dynamicStyles}
      customStyle={{ padding: 4, backgroundColor: '#f8f8f8' }}
    >
      <View style={{ flexDirection: 'row', width: '100%', gap: 4 }}>
        <View style={{ width: '49%' }}>
          {leftColumn.map((edu, i) => (
            <View key={`left-${i}`}>{renderEducation(edu)}</View>
          ))}
        </View>
        <View style={{ width: '49%' }}>
          {rightColumn.map((edu, i) => (
            <View key={`right-${i}`}>{renderEducation(edu)}</View>
          ))}
        </View>
      </View>
    </BaseSection>
  );
};