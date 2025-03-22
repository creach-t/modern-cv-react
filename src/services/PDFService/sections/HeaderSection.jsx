// src/services/PDFService/sections/HeaderSection.jsx

import React from 'react';
import { Text, View, Image, Link } from '@react-pdf/renderer';

/**
 * Section d'en-tête du CV inspirée du header du site web
 * @param {Object} userData - Données utilisateur formatées
 * @param {Object} styles - Styles de base
 * @param {Object} dynamicStyles - Styles dynamiques basés sur la couleur
 * @returns {React.Component} - Section d'en-tête
 */
export const HeaderSection = ({ userData, styles, dynamicStyles }) => (
  <View style={[styles.header, dynamicStyles.headerBackground]}>
    <View style={styles.headerContent}>
      {/* Section profil avec photo et nom */}
      <View style={styles.profileSection}>
        {userData.profilePicture && (
          <Image
            source={userData.profilePicture}
            style={styles.profilePicture}
          />
        )}
        
        <View style={styles.nameSection}>
          <Text style={[styles.name, dynamicStyles.colorAccent]}>{userData.name}</Text>
          
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
          <View key={index} style={styles.contactItem}>
            {contact.icon && (
              <View style={[styles.contactIcon, dynamicStyles.contactIconColor]}>
                {/* Simuler une icône avec une forme simple */}
                <View style={styles.iconShape} />
              </View>
            )}
            
            {contact.url ? (
              <Link src={contact.url} style={styles.contactLink}>
                <Text style={styles.contactText}>{contact.value}</Text>
              </Link>
            ) : (
              <Text style={styles.contactText}>{contact.value}</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  </View>
);