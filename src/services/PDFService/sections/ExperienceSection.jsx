// src/services/PDFService/sections/ExperienceSection.jsx

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { BaseSection } from './BaseSection';
import { renderBadges, createBalancedColumns, getSectionConfig, renderPeriodBadge } from './sectionUtils';

/**
 * Section des expériences professionnelles
 */
export const ExperienceSection = ({ userData, styles, dynamicStyles, translations, language, config }) => {
  const experiences = userData?.experiences || [];
  const secondaryColor = config?.style?.colors?.secondary || '#0077cc';
  const sectionConfig = getSectionConfig('experience', config);
  
  // Rendu d'une expérience en format carte
  const renderExperience = (exp) => (
    <View style={{ 
      marginBottom: 3,
      border: '0.5pt solid #e0e0e0',
      borderRadius: 3,
      padding: 3,
      backgroundColor: 'white'
    }}>
      {/* Entreprise et période */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Text style={{ 
          fontSize: 9, 
          fontWeight: 700, 
          color: secondaryColor 
        }}>
          {exp.company?.name || ""}
        </Text>
        
        {renderPeriodBadge(exp.period, secondaryColor)}
      </View>
      
      {/* Titre du poste */}
      <Text style={{ 
        fontSize: 8, 
        fontWeight: 600,
        marginBottom: 2,
        color: '#444444'
      }}>
        {exp[language]?.label || ""}
      </Text>
      
      {/* Description très compacte */}
      <Text style={{ fontSize: 7, lineHeight: 1.2, color: '#555555' }}>
        {exp[language]?.explanation || ""}
      </Text>
      
      {/* Détails en liste très compacte */}
      {exp[language]?.details && exp[language].details.length > 0 && (
        <View style={{ marginTop: 1 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {exp[language].details.map((detail, idx) => (
              <Text key={idx} style={{ 
                fontSize: 6.5, 
                lineHeight: 1.2,
                width: '100%',
                marginBottom: 1
              }}>
                • {detail}
              </Text>
            ))}
          </View>
        </View>
      )}
      
      {/* Section technique compacte */}
      <View style={{ marginTop: 2, borderTop: '0.5pt dotted #e0e0e0', paddingTop: 2 }}>
        {exp.technologies && exp.technologies.length > 0 && (
          <View style={{ marginBottom: 1 }}>
            <Text style={{ fontSize: 6, fontWeight: 600, color: '#555555', marginBottom: 1 }}>
              {translations.technologies}:
            </Text>
            {renderBadges(exp.technologies, secondaryColor)}
          </View>
        )}
        
        {exp.tools && exp.tools.length > 0 && (
          <View>
            <Text style={{ fontSize: 6, fontWeight: 600, color: '#555555', marginBottom: 1 }}>
              {translations.tools}:
            </Text>
            {renderBadges(exp.tools, secondaryColor)}
          </View>
        )}
      </View>
    </View>
  );
  
  // Diviser les expériences en colonnes
  const [leftColumn, rightColumn] = createBalancedColumns(experiences);
  
  return (
    <BaseSection
      title={translations.experience}
      sectionName="experience"
      config={config}
      styles={styles}
      dynamicStyles={dynamicStyles}
      customStyle={{ padding: 4, backgroundColor: '#f8f8f8' }}
    >
      <View style={{ flexDirection: 'row', width: '100%', gap: 4 }}>
        <View style={{ width: '49%' }}>
          {leftColumn.map((exp, i) => (
            <View key={`left-${i}`}>{renderExperience(exp)}</View>
          ))}
        </View>
        <View style={{ width: '49%' }}>
          {rightColumn.map((exp, i) => (
            <View key={`right-${i}`}>{renderExperience(exp)}</View>
          ))}
        </View>
      </View>
    </BaseSection>
  );
};