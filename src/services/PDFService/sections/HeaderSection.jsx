// src/services/PDFService/sections/HeaderSection.jsx

import React from 'react';
import { Text, View, Image, Link, Svg, Path } from '@react-pdf/renderer';
import icons from '../icons';

// Composant simple d'icône
const ContactIcon = ({ type, color = 'white', backgroundColor = '#0077cc', size = 16 }) => {
  // Fallback pour les types d'icônes non reconnus
  const iconType = icons[type] ? type : 'document';
  
  // Créer l'icône
  const IconComponent = icons[iconType];
  
  return IconComponent ? 
    <IconComponent color={color} backgroundColor={backgroundColor} size={size} /> :
    <View style={{ width: size, height: size, backgroundColor, borderRadius: size/2 }} />;
};

/**
 * Section d'en-tête du CV inspirée du header du site web
 * @param {Object} userData - Données utilisateur formatées
 * @param {Object} styles - Styles de base
 * @param {Object} dynamicStyles - Styles dynamiques basés sur la couleur
 * @param {Object} config - Configuration complète
 * @returns {React.Component} - Section d'en-tête
 */
export const HeaderSection = ({ userData, styles, dynamicStyles, config }) => {
  // Utiliser l'image de profil définie ou l'image par défaut
  const profilePictureSource = userData.profilePicture || '/img/profil_picture.png';
  
  // Options du header
  const headerOptions = config?.sections?.header?.options || {};
  const contactIcons = config?.contactIcons || {};
  
  // Couleur secondaire pour les icônes
  const secondaryColor = config?.style?.colors?.secondary || '#0077cc';
  
  return (
    <View style={[styles.header, dynamicStyles.headerBackground]}>
      <View style={styles.headerContent}>
        {/* Section profil avec photo et nom */}
        <View style={styles.profileSection}>
          {/* Toujours afficher l'image de profil */}
          <Image
            source={profilePictureSource}
            style={styles.profilePicture}
          />
          
          <View style={styles.nameSection}>
            <Text style={[styles.name]}>{userData.name}</Text>
            
            {/* Titre avec préfixe et suffixe similaire au site */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{userData.title.prefix}</Text>
              <Text style={styles.titleHighlight}>{userData.title.highlight}</Text>
              <Text style={styles.title}>{userData.title.suffix}</Text>
            </View>
          </View>
        </View>

        {/* Liens de contact */}
        <View style={styles.contactsContainer}>
          {userData.contacts.map((contact, index) => (
            <View key={index} style={[styles.contactItem, dynamicStyles.contactItemBackground]}>
              {/* Test 1: Icône simple */}
              <View style={{
                width: 16,
                height: 16,
                backgroundColor: secondaryColor,
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center'
              }} />
              
              {contact.url ? (
                <Link src={contact.url} style={styles.contactLink}>
                  <Text style={[styles.contactText, dynamicStyles.headerTextColor]}>{contact.value}</Text>
                </Link>
              ) : (
                <Text style={[styles.contactText, dynamicStyles.headerTextColor]}>{contact.value}</Text>
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
