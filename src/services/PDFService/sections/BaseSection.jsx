// src/services/PDFService/sections/BaseSection.jsx

import React from 'react';
import { Text, View } from '@react-pdf/renderer';

export const BaseSection = ({ 
  title,
  children,
  config,
  styles,
  dynamicStyles,
  sectionName,
  customStyle = {}
}) => {
  const sectionConfig = config?.sections?.[sectionName] || {};
  const sectionStyle = sectionConfig.style || {};
  
  return (
    <View style={[
      styles.section, 
      sectionStyle,
      customStyle
    ]}>
      <Text style={[
        styles.sectionTitle, 
        dynamicStyles.sectionTitleBorder, 
        dynamicStyles.colorAccent,
        { 
          fontSize: 13, 
          fontWeight: 700, 
          marginBottom: 4,
          color: '#000',
          textAlign: 'center',
          padding: 2,
        }
      ]}>
        {title}
      </Text>
      {children}
    </View>
  );
};