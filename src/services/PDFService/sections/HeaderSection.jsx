// src/services/PDFService/sections/HeaderSection.jsx

import React from 'react';
import { Text, View, Image, Link } from '@react-pdf/renderer';
import { getContactIcon } from '../icons/ContactIcons';
import { getSectionConfig } from './sectionUtils';

export const HeaderSection = ({ userData, styles, dynamicStyles, config }) => {
  // Configuration et données
  const profilePictureSource = userData.profilePicture || '/img/profil_picture.png';
  const sectionConfig = getSectionConfig('header', config);
  const options = sectionConfig?.options || {};
  
  // Filtrer les contacts (exclure téléphone si demandé)
  const contacts = userData.contacts?.filter(c => c.type !== 'phone') || [];
  
  // Fonctions utilitaires
  const formatDisplayValue = (url) => {
    if (!url) return '';
    return url.replace(/^(https?:\/\/|mailto:|tel:)/, '').replace(/\/$/, '');
  };
  
  const getContactDisplayValue = (contact) => {
    if (contact.value) return contact.value;
    if (contact.url) return formatDisplayValue(contact.url);
    
    // Valeurs par défaut basées sur le type
    const typeToLabel = {
      github: 'GitHub',
      website: 'Website',
      linkedin: 'LinkedIn'
    };
    
    return typeToLabel[contact.type] || '';
  };
  
  return (
    <View style={[styles.header, dynamicStyles.headerBackground]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        
        {/* SECTION GAUCHE: PHOTO + NOM/TITRE */}
        <View style={{ 
          width: '45%', 
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          {/* Photo de profil */}
          {options.showProfilePicture !== false && (
            <View style={{ 
              width: styles.profilePicture.width, 
              height: styles.profilePicture.height,
              marginRight: 15
            }}>
              <Image
                source={profilePictureSource}
                style={styles.profilePicture}
              />
            </View>
          )}
          
          {/* Nom et titre */}
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>
              {userData.name}
            </Text>
            
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {userData.title.prefix}
              </Text>
              {userData.title.prefix && userData.title.highlight && (
                <Text style={styles.title}> </Text>
              )}
              <Text style={styles.titleHighlight}>
                {userData.title.highlight}
              </Text>
              {userData.title.highlight && userData.title.suffix && (
                <Text style={styles.title}> </Text>
              )}
              <Text style={styles.title}>
                {userData.title.suffix}
              </Text>
            </View>
          </View>
        </View>
        
        {/* SECTION DROITE: CONTACTS */}
        {options.showContacts !== false && (
          <View style={{ 
            width: '45%',
            alignItems: 'flex-end',
            justifyContent: 'center'
          }}>
            {contacts.map((contact, index) => {
              const iconType = contact.type || 'document';
              const formattedUrl = contact.url && !contact.url.startsWith('http') 
                ? `https://${contact.url}` 
                : contact.url;
              const displayValue = getContactDisplayValue(contact);
              
              const contactItem = (
                <View style={styles.contactItem}>
                  <View style={styles.contactIcon}>
                    {getContactIcon(iconType, {
                      color: styles.contactText.color,
                      size: styles.contactIcon.width
                    })}
                  </View>
                  
                  <Text style={styles.contactText}>
                    {displayValue}
                  </Text>
                </View>
              );
              
              return contact.url ? (
                <Link 
                  key={`contact-${index}`} 
                  src={formattedUrl} 
                  style={styles.contactLink}
                >
                  {contactItem}
                </Link>
              ) : (
                <View key={`contact-${index}`}>
                  {contactItem}
                </View>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};
