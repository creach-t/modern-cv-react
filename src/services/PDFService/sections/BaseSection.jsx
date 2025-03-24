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
          fontSize: 12, 
          fontWeight: 700, 
          marginBottom: 3,
          color: '#000',
          textAlign: 'center',
          padding: 1,
          paddingTop: 1
        }
      ]}>
        {title}
      </Text>
      {children}
    </View>
  );
};