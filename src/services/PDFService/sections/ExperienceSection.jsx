import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { SkillIconColored } from '../icons/SkillIcons';

/**
 * Section des expériences professionnelles (style cartes)
 */
export const ExperienceSection = ({ userData, styles, dynamicStyles, translations, language, config }) => {
  const experiences = userData?.experiences || [];
  const secondaryColor = config?.style?.colors?.secondary || '#0077cc';
  const iconSize = 9;
  
  // Distribution des expériences en colonnes
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
  
  // Rendu d'une expérience en format carte
  const renderExperience = (exp) => (
    <View style={{ 
      marginBottom: 3,
      border: '0.5pt solid #e0e0e0',
      borderRadius: 3,
      padding: 3,
      backgroundColor: 'white'
    }}>
      {/* Période en haut à droite comme badge */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Text style={{ 
          fontSize: 9, 
          fontWeight: 700, 
          color: secondaryColor 
        }}>
          {exp.company?.name || ""}
        </Text>
        
        <Text style={{ 
          fontSize: 6, 
          backgroundColor: secondaryColor,
          color: 'white',
          padding: '1 3',
          borderRadius: 2,
        }}>
          {exp.period || ""}
        </Text>
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
            {renderBadges(exp.technologies)}
          </View>
        )}
        
        {exp.tools && exp.tools.length > 0 && (
          <View>
            <Text style={{ fontSize: 6, fontWeight: 600, color: '#555555', marginBottom: 1 }}>
              {translations.tools}:
            </Text>
            {renderBadges(exp.tools)}
          </View>
        )}
      </View>
    </View>
  );
  
  // Diviser les expériences en colonnes
  const [leftColumn, rightColumn] = createBalancedColumns(experiences);
  
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
        {translations.experience}
      </Text>
      
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
    </View>
  );
};