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
  const sectionConfig = getSectionConfig('experience', config);
  const options = sectionConfig?.options || {};
  
  // Déterminer si on affiche les expériences sur deux colonnes
  const twoColumns = options.twoColumns !== undefined ? options.twoColumns : true;
  
  // Rendu d'une expérience en format carte
  const renderExperience = (exp) => (
    <View style={styles.experienceItem}>
      {/* Entreprise et période */}
      <View style={styles.experienceHeader}>
        <Text style={styles.companyName}>
          {exp.company?.name || ""}
        </Text>
        
        {renderPeriodBadge(exp.period, styles.period, dynamicStyles.periodBackground)}
      </View>
      
      {/* Titre du poste */}
      {options.showJobTitle !== false && (
        <Text style={styles.jobTitle}>
          {exp[language]?.label || ""}
        </Text>
      )}
      
      {/* Explication */}
      {options.showExplanation !== false && exp[language]?.explanation && (
        <Text style={styles.explanation}>
          {exp[language]?.explanation || ""}
        </Text>
      )}
      
      {/* Détails en liste */}
      {options.showDetails !== false && exp[language]?.details && exp[language].details.length > 0 && (
        <View style={{ marginTop: 1 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {exp[language].details.map((detail, idx) => (
              <Text key={idx} style={styles.bulletPoint}>
                • {detail}
              </Text>
            ))}
          </View>
        </View>
      )}
      
      {/* Section technique */}
      {(options.showTechnologies !== false || options.showTools !== false) && 
       ((exp.technologies && exp.technologies.length > 0) || (exp.tools && exp.tools.length > 0)) && (
        <View style={styles.technicalSection}>
          {options.showTechnologies !== false && exp.technologies && exp.technologies.length > 0 && (
            <View style={{ marginBottom: 1 }}>
              <Text style={styles.techLabel}>
                {translations.technologies}:
              </Text>
              {renderBadges(exp.technologies, styles.technologyBadge, dynamicStyles.technologyBackground)}
            </View>
          )}
          
          {options.showTools !== false && exp.tools && exp.tools.length > 0 && (
            <View>
              <Text style={styles.techLabel}>
                {translations.tools}:
              </Text>
              {renderBadges(exp.tools, styles.technologyBadge, dynamicStyles.technologyBackground)}
            </View>
          )}
        </View>
      )}
    </View>
  );
  
  // Si deux colonnes, diviser les expériences équitablement
  const renderExperiences = () => {
    if (twoColumns) {
      const [leftColumn, rightColumn] = createBalancedColumns(experiences);
      return (
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
      );
    } else {
      // Une seule colonne
      return experiences.map((exp, i) => (
        <View key={i}>{renderExperience(exp)}</View>
      ));
    }
  };
  
  return (
    <BaseSection
      title={translations.experience}
      sectionName="experience"
      config={config}
      styles={styles}
      dynamicStyles={dynamicStyles}
    >
      {renderExperiences()}
    </BaseSection>
  );
};
