import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { SkillIconColored } from '../icons/SkillIcons';
import { getTextColor } from '../../../utils/color';
/**
 * Section des soft skills avec icônes
 * @param {Object} userData - Données utilisateur formatées
 * @param {Object} styles - Styles de base
 * @param {Object} dynamicStyles - Styles dynamiques basés sur la couleur
 * @param {Object} translations - Traductions
 * @param {string} language - Langue actuelle ('fr' ou 'en')
 * @returns {React.Component} - Section des soft skills
 */
export const SoftSkillsSection = ({ userData, styles, dynamicStyles, translations, language }) => {
  // Vérifier si userData.softSkills existe, sinon utiliser un tableau vide
  const softSkills = userData?.softSkills || [];
  
  // Utiliser la couleur d'accent depuis les styles dynamiques
  // On s'assure que c'est une chaîne de caractères de couleur valide
  const circleColor = typeof dynamicStyles.colorAccent === 'string' ? 
    dynamicStyles.colorAccent : 
    (dynamicStyles.colorAccent?.color || '#000000');
  
  // Styles locaux pour la section
  const localStyles = {
    skillsGrid: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 5,
    },
    softSkillItem: {
      width: '50%',
      marginBottom: 4,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingRight: 2,
    },
    skillIconContainer: {
      width: 16,
      height: 16,
      marginRight: 3,
      marginTop: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 7, // La moitié de la largeur/hauteur pour un cercle parfait
      backgroundColor: circleColor, // Appliquer la couleur d'accent au cercle en s'assurant qu'elle est valide
    },
    softSkillContent: {
      flex: 1,
    },
    softSkillTitle: {
      fontSize: 8,
      fontWeight: 'bold',
      marginBottom: 1,
    },
    skillDescription: {
      fontSize: 6,
      lineHeight: 1.1,
    },
  };
  
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, dynamicStyles.borderColorAccent, dynamicStyles.colorAccent]}>
        {translations.softSkills}
      </Text>
      <View style={localStyles.skillsGrid}>
        {softSkills
          .filter(skill => skill.id !== "hobbies")
          .map((skill, index) => (
            <View key={index} style={localStyles.softSkillItem}>
              <View style={localStyles.skillIconContainer}>
                <SkillIconColored 
                  name={skill.icon} 
                  size={12} 
                  color={getTextColor(circleColor)}
                />
              </View>
              <View style={localStyles.softSkillContent}>
                <Text style={[localStyles.softSkillTitle, dynamicStyles.colorAccent]}>
                  {skill.title[language]}
                </Text>
                {skill.description[language] && (
                  <Text style={localStyles.skillDescription}>
                    {skill.description[language]}
                  </Text>
                )}
              </View>
            </View>
          ))}
      </View>
    </View>
  );
};