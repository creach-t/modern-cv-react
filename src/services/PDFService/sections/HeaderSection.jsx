import React from 'react';
import { Text, View, Image, Link } from '@react-pdf/renderer';
import { getContactIcon } from '../icons/ContactIcons';
import { getTextColor } from '../../../utils/color';

export const HeaderSection = ({ userData, styles, dynamicStyles, config }) => {
  // Configuration et données
  const profilePictureSource = userData.profilePicture || '/img/profil_picture.png';
  const headerOptions = config?.sections?.header?.options || {};
  const secondaryColor = config?.style?.colors?.secondary || '#0077cc';
  const profileSize = headerOptions.profilePictureSize || 70;
  const iconSize = headerOptions.contactIconSize || 14;
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
    <View style={[styles.header, dynamicStyles.headerBackground, { padding: 10 }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        
        {/* SECTION GAUCHE: PHOTO + NOM/TITRE */}
        <View style={{ 
          width: '45%', 
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          {/* Container pour la photo et sa bordure */}
          <View style={{ 
            width: profileSize, 
            height: profileSize,
            marginRight: 15
          }}>
            {/* Image de profil */}
            <Image
              source={profilePictureSource}
              style={{
                width: profileSize - 4, 
                height: profileSize - 4,
                borderRadius: (profileSize - 4) / 2,
                margin: 2  // Marge pour laisser de la place à la bordure
              }}
            />
            
            {/* Bordure stylisée */}
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: profileSize / 2,
              border: `2px solid ${secondaryColor}`
            }} />
          </View>
          
          {/* Nom et titre */}
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { fontSize: 18, marginBottom: 4 }]}>
              {userData.name}
            </Text>
            
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              <Text style={[styles.title, { fontSize: 12 }]}>
                {userData.title.prefix}
              </Text>
              <Text style={[styles.title, { fontSize: 12 }]}> </Text>
              <Text style={[styles.titleHighlight, { 
                fontSize: 12, 
                color: secondaryColor,
                fontWeight: 'bold'
              }]}>
                {userData.title.highlight}
              </Text>
              <Text style={[styles.title, { fontSize: 12 }]}>
                {userData.title.suffix}
              </Text>
            </View>
          </View>
        </View>
        
        {/* SECTION DROITE: CONTACTS */}
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
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 4
              }}>
                <View style={{ marginRight: 6 }}>
                  {getContactIcon(iconType, {
                    color: iconColor,
                    size: iconSize
                  })}
                </View>
                
                <Text style={[
                  styles.contactText, 
                  dynamicStyles.headerTextColor,
                  { fontSize: 9 }
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
  );
};