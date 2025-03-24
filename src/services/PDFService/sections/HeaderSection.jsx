import React from 'react';
import { Text, View, Image, Link } from '@react-pdf/renderer';
import { getContactIcon } from '../icons/ContactIcons';
import { getTextColor } from '../../../utils/color';

export const HeaderSection = ({ userData, styles, dynamicStyles, config }) => {
  // Configuration et données
  const profilePictureSource = userData.profilePicture || '/img/profil_picture.png';
  const headerOptions = config?.sections?.header?.options || {};
  const secondaryColor = config?.style?.colors?.secondary || '#0077cc';
  const profileSize = headerOptions.profilePictureSize || 65; // Taille réduite
  const iconSize = headerOptions.contactIconSize || 12; // Taille réduite
  const iconColor = getTextColor(secondaryColor);
  
  // Filtrer les contacts (exclure téléphone)
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
    <View style={[styles.header, dynamicStyles.headerBackground, { padding: 8 }]}> {/* Padding réduit */}
      <View style={{ flexDirection: 'row' }}>
        {/* PHOTO DE PROFIL AVEC DOUBLE CERCLE */}
        <View style={{ 
          width: profileSize + 8, // Bordure réduite
          height: profileSize + 8, // Bordure réduite
          position: 'relative',
          marginRight: 12 // Marge réduite
        }}>
          {/* Cercle extérieur coloré */}
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: profileSize + 8, // Bordure réduite
            height: profileSize + 8, // Bordure réduite
            borderRadius: (profileSize + 8) / 2,
            backgroundColor: secondaryColor
          }} />
          
          {/* Cercle blanc intermédiaire */}
          <View style={{
            position: 'absolute',
            top: 2,
            left: 2,
            width: profileSize + 4, // Bordure réduite
            height: profileSize + 4, // Bordure réduite
            borderRadius: (profileSize + 4) / 2,
            backgroundColor: 'white'
          }} />
          
          {/* Image de profil */}
          <Image
            source={profilePictureSource}
            style={{
              position: 'absolute',
              top: 4,
              left: 4,
              width: profileSize,
              height: profileSize,
              borderRadius: profileSize / 2
            }}
          />
        </View>
        
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          {/* NOM ET TITRE */}
          <View>
            <Text style={[styles.name, { 
              fontSize: 16, // Taille réduite
              fontWeight: 'bold',
              marginBottom: 3 // Marge réduite
            }]}>
              {userData.name}
            </Text>
            
            <View style={{ 
              flexDirection: 'row', 
              flexWrap: 'wrap', 
              backgroundColor: secondaryColor,
              padding: '1 5', // Padding réduit
              borderRadius: 3,
              alignSelf: 'flex-start'
            }}>
              <Text style={[styles.title, { 
                fontSize: 10, // Taille réduite
                color: getTextColor(secondaryColor)
              }]}>
                {userData.title.prefix}
              </Text>
              <Text style={[styles.title, { 
                fontSize: 10, // Taille réduite
                color: getTextColor(secondaryColor)
              }]}> </Text>
              <Text style={[styles.titleHighlight, { 
                fontSize: 10, // Taille réduite
                fontWeight: 'bold',
                color: getTextColor(secondaryColor)
              }]}>
                {userData.title.highlight}
              </Text>
              <Text style={[styles.title, { 
                fontSize: 10, // Taille réduite
                color: getTextColor(secondaryColor)
              }]}>
                {userData.title.suffix}
              </Text>
            </View>
          </View>
          
          {/* CONTACTS - STYLE HORIZONTAL */}
          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap',
            marginTop: 6 // Marge réduite
          }}>
            {contacts.map((contact, index) => {
              const iconType = contact.type || 'document';
              const formattedUrl = contact.url && !contact.url.startsWith('http') 
                ? `https://${contact.url}` 
                : contact.url;
              const displayValue = getContactDisplayValue(contact);
              
              const contactItem = (
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 3,
                  marginBottom: 3, // Marge réduite
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  padding: '1 4', // Padding réduit
                  borderRadius: 3
                }}>
                  <View style={{ 
                    marginRight: 4, // Marge réduite
                    width: iconSize + 2,
                    height: iconSize + 2,
                    borderRadius: (iconSize + 2) / 2,
                    backgroundColor: secondaryColor,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getContactIcon(iconType, {
                      color: getTextColor(secondaryColor),
                      size: iconSize - 2
                    })}
                  </View>
                  
                  <Text style={[
                    styles.contactText, 
                    dynamicStyles.headerTextColor,
                    { fontSize: 7.5 } // Taille réduite
                  ]}>
                    {displayValue}
                  </Text>
                </View>
              );
              
              return contact.url ? (
                <Link 
                  key={`contact-${index}`} 
                  src={formattedUrl} 
                  style={{ textDecoration: 'none' }}
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
        </View>
      </View>
    </View>
  );
};