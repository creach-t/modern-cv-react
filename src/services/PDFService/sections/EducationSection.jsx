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

  // Estimez la hauteur maximale potentielle avec une estimation plus serrée
  const calculateContentHeight = (edu) => {
    let height = 0;
    // Hauteur du diplôme
    height += 11; // Diplôme avec marge
    // Hauteur de l'école et période
    height += 11; // École avec marge
    // Hauteur de la description
    if (edu[language]?.explanation) {
      const lines = Math.ceil(edu[language].explanation.length / 45); // ~45 caractères par ligne
      height += lines * 8;
    }
    // Hauteur des technologies
    if (edu.technologies && edu.technologies.length > 0) {
      const techLines = Math.ceil(edu.technologies.length / 3); // Environ 3 badges par ligne
      height += 9 + (techLines * 10); // Titre + badges
    }

    return height + 10; // Marge de sécurité réduite
  };

  // Diviser les formations en colonnes
  const [leftColumn, rightColumn] = createBalancedColumns(education);

  // Trouver la hauteur maximale par ligne
  const maxHeightPerRow = [];
  for (let i = 0; i < Math.max(leftColumn.length, rightColumn.length); i++) {
    const leftHeight = i < leftColumn.length ? calculateContentHeight(leftColumn[i]) : 0;
    const rightHeight = i < rightColumn.length ? calculateContentHeight(rightColumn[i]) : 0;
    maxHeightPerRow.push(Math.max(leftHeight, rightHeight));
  }

  // Rendu d'une formation en format carte avec hauteur fixe
  const renderEducation = (edu, fixedHeight) => (
    <View style={{
      marginBottom: 3,
      border: '0.5pt solid #e0e0e0',
      borderRadius: 3,
      padding: 3,
      backgroundColor: 'white',
      height: fixedHeight,
      position: 'relative' // Pour s'assurer que les éléments restent à l'intérieur
    }}>
      {/* Intitulé du diplôme et période */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
        <Text style={{
          fontSize: 9,
          fontWeight: 600,
          color: '#444444'
        }}>
          {edu[language]?.label || ""}
        </Text>
        {renderPeriodBadge(edu.period, secondaryColor)}
      </View>

      {/* École*/}
      <Text style={{
        fontSize: 8,
        fontWeight: 700,
        color: secondaryColor,
        flex: 1
      }}>
        {edu.school?.name || ""}
      </Text>


      {/* Description */}
      <Text style={{ fontSize: 8, lineHeight: 1.2, color: '#555555' }}>
        {edu[language]?.explanation || ""}
      </Text>

      {/* Technologies utilisées */}
      {edu.technologies && edu.technologies.length > 0 && (
        <View style={{ marginTop: 2, borderTop: '0.5pt dotted #e0e0e0', paddingTop: 2 }}>
          <Text style={{ fontSize: 8, fontWeight: 600, color: '#555555', marginBottom: 1 }}>
            {translations.technologies}:
          </Text>
          {renderBadges(edu.technologies, secondaryColor)}
        </View>
      )}
    </View>
  );

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
            <View key={`left-${i}`}>{renderEducation(edu, maxHeightPerRow[i])}</View>
          ))}
        </View>
        <View style={{ width: '49%' }}>
          {rightColumn.map((edu, i) => (
            <View key={`right-${i}`}>{renderEducation(edu, maxHeightPerRow[i])}</View>
          ))}
        </View>
      </View>
    </BaseSection>
  );
};