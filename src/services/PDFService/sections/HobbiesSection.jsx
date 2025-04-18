import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { BaseSection } from './BaseSection';
import { getSectionConfig } from './sectionUtils';
import { SkillIconColored } from '../icons/SkillIcons';

/**
 * Section des hobbies pour la sidebar
 * @param {Object} userData - Données utilisateur formatées
 * @param {Object} styles - Styles de base
 * @param {Object} dynamicStyles - Styles dynamiques basés sur la couleur
 * @param {Object} translations - Traductions
 * @param {string} language - Langue actuelle ('fr' ou 'en')
 * @param {Object} config - Configuration complète
 * @returns {React.Component} - Section des hobbies
 */
export const HobbiesSection = ({ userData, styles, dynamicStyles, translations, language, config }) => {
  const secondaryColor = config?.style?.colors?.secondary || '#0077cc';
  const sectionConfig = getSectionConfig('hobbies', config);
  
  // Hobbies avec leurs noms et icônes correspondantes
  const hobbies = [
    {
      name: "fr" === language ? "Électronique" : "Electronics",
      icon: "electronics"
    },
    {
      name: "fr" === language ? "Bricolage" : "DIY",
      icon: "drill" 
    },
    {
      name: "fr" === language ? "Nature" : "Nature",
      icon: "leaf" 
    }
  ];
  
  return (
    <BaseSection
      title={translations.hobbies || "Centres d'intérêt"}
      sectionName="hobbies"
      config={config}
      styles={styles}
      dynamicStyles={dynamicStyles}
    >
      <View style={{ 
        marginTop: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 2
      }}>
        {hobbies.map((hobby, index) => (
          <View 
            key={`hobby-${index}`} 
            style={{ 
              backgroundColor: '#f5f5f5',
              padding: '2 5',
              borderRadius: 3,
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 0.3,
              borderColor: '#e0e0e0'
            }}
          >
            {/* Icône du hobby depuis SkillIcons */}
            <View style={{
              width: 12,
              height: 12,
              marginRight: 2,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <SkillIconColored 
                name={hobby.icon} 
                size={10} 
                color={secondaryColor}
              />
            </View>
            
            {/* Nom du hobby */}
            <Text style={{ 
              fontSize: 9, 
              color: '#444444'
            }}>
              {hobby.name}
            </Text>
          </View>
        ))}
      </View>
    </BaseSection>
  );
};