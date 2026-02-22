import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { BaseSection } from './BaseSection';
import { renderBadges, createBalancedColumns, renderPeriodBadge } from './sectionUtils';

/**
 * Section des expériences professionnelles
 */
export const ExperienceSection = ({ userData, styles, dynamicStyles, translations, language, config }) => {
  const experiences = userData?.experiences || [];
  const secondaryColor = config?.style?.colors?.secondary || '#0077cc';
  
  // Estimez la hauteur maximale potentielle
  const calculateContentHeight = (exp) => {
    let height = 0;
    // Hauteur du titre
    height += 12; // Titre avec marge
    // Hauteur de l'entreprise et période
    height += 15; // Entreprise avec marge
    // Hauteur de la description
    if (exp[language]?.explanation) {
      const lines = Math.ceil(exp[language].explanation.length / 40); // ~40 caractères par ligne
      height += lines * 9;
    }
    // Hauteur des détails
    if (exp[language]?.details && exp[language].details.length > 0) {
      height += exp[language].details.length * 10;
    }
    // Hauteur des technologies
    if (exp.technologies && exp.technologies.length > 0) {
      const techLines = Math.ceil(exp.technologies.length / 3); // Environ 3 badges par ligne
      height += 12 + (techLines * 12); // Titre + badges
    }
    // Hauteur des outils
    // Utiliser les outils traduits depuis l'objet de langue
    if (exp[language]?.tools && exp[language].tools.length > 0) {
      const toolLines = Math.ceil(exp[language].tools.length / 3); // Environ 3 badges par ligne
      height += 12 + (toolLines * 12); // Titre + badges
    }
    
    return height + 20; // Ajout de marge de sécurité
  };
  
  // Diviser les expériences en colonnes
  const [leftColumn, rightColumn] = createBalancedColumns(experiences);
  
  // Trouver la hauteur maximale par ligne
  const maxHeightPerRow = [];
  for (let i = 0; i < Math.max(leftColumn.length, rightColumn.length); i++) {
    const leftHeight = i < leftColumn.length ? calculateContentHeight(leftColumn[i]) : 0;
    const rightHeight = i < rightColumn.length ? calculateContentHeight(rightColumn[i]) : 0;
    maxHeightPerRow.push(Math.max(leftHeight, rightHeight));
  }

  // Rendu d'une expérience en format carte avec hauteur fixe
  const renderExperience = (exp, fixedHeight) => (
    <View style={{
      marginBottom: 3,
      border: '0.5pt solid #e0e0e0',
      borderRadius: 3,
      padding: 3,
      backgroundColor: 'white',
      height: fixedHeight,
      position: 'relative' // Pour s'assurer que les éléments restent à l'intérieur
    }}>
      {/* En-tête avec titre et période */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
        {/* Titre du poste */}
        <Text style={{
          fontSize: 9,
          fontWeight: 600,
          color: '#444444',
          flex: 1
        }}>
          {exp[language]?.label || ""}
        </Text>
        {/* Badge de période */}
        {renderPeriodBadge(exp.period, secondaryColor)}
      </View>
      
      {/* Nom de l'entreprise */}
      <Text style={{
        fontSize: 8,
        fontWeight: 700,
        color: secondaryColor,
        marginBottom: 3
      }}>
        {exp.company?.name || ""}
      </Text>
      
      {/* Description très compacte */}
      <Text style={{ fontSize: 8, lineHeight: 1.2, color: '#555555' }}>
        {exp[language]?.explanation || ""}
      </Text>
      
      {/* Détails en liste très compacte */}
      {exp[language]?.details && exp[language].details.length > 0 && (
        <View style={{ marginTop: 3 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {exp[language].details.map((detail, idx) => (
              <Text key={idx} style={{
                fontSize: 7.5,
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
            <Text style={{ fontSize: 8, fontWeight: 600, color: '#555555', marginBottom: 1 }}>
              {translations.technologies}:
            </Text>
            {renderBadges(exp.technologies, secondaryColor)}
          </View>
        )}
        {/* Utiliser les outils traduits depuis l'objet de langue */}
        {exp[language]?.tools && exp[language].tools.length > 0 && (
          <View>
            <Text style={{ fontSize: 8, fontWeight: 600, color: '#555555', marginBottom: 1 }}>
              {translations.tools}:
            </Text>
            {renderBadges(exp[language].tools, secondaryColor)}
          </View>
        )}
      </View>
    </View>
  );

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
            <View key={`left-${i}`}>
              {renderExperience(exp, maxHeightPerRow[i])}
            </View>
          ))}
        </View>
        <View style={{ width: '49%' }}>
          {rightColumn.map((exp, i) => (
            <View key={`right-${i}`}>
              {renderExperience(exp, maxHeightPerRow[i])}
            </View>
          ))}
        </View>
      </View>
    </BaseSection>
  );
};