// src/services/PDFService/sections/BaseSection.jsx

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { getSectionConfig } from './sectionUtils';

export const BaseSection = ({ 
  title,
  children,
  config,
  styles,
  dynamicStyles,
  sectionName,
  customStyle = {}
}) => {
  // Obtenir la configuration de la section spécifique
  const sectionConfig = getSectionConfig(sectionName, config);
  const sectionStyle = sectionConfig?.style || {};
  
  // Obtenir les styles de titre configurés
  const titleStyle = config?.theme?.sectionTitle || {};
  
  return (
    <View style={[
      styles.section, 
      styles[`${sectionName}Section`] || {},
      customStyle
    ]}>
      <Text style={[
        styles.sectionTitle, 
        dynamicStyles.sectionTitleBorder, 
        dynamicStyles.colorAccent
      ]}>
        {title}
      </Text>
      {children}
    </View>
  );
};
