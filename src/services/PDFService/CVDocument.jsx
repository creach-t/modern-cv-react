// src/services/PDFService/CVDocument.jsx

import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { baseStyles, getDynamicStyles } from './styles';
import { getTranslations } from './translations';
import { HeaderSection } from './sections/HeaderSection';
import { SkillsSection } from './sections/SkillsSection';
import { SoftSkillsSection } from './sections/SoftSkillsSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { EducationSection } from './sections/EducationSection';

/**
 * Composant principal du document PDF
 * @param {Object} userData - Données utilisateur formatées
 * @param {string} secondaryColor - Couleur secondaire du thème
 * @param {string} language - Langue ('fr' ou 'en')
 * @returns {React.Component} - Document PDF
 */
const CVDocument = ({ userData, secondaryColor, language }) => {
  const dynamicStyles = getDynamicStyles(secondaryColor);
  const translations = getTranslations(language);

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        {/* Header section */}
        <HeaderSection 
          userData={userData} 
          styles={baseStyles} 
          dynamicStyles={dynamicStyles} 
        />

        {/* Main content with two columns */}
        <View style={baseStyles.twoColumns}>
          {/* Left column */}
          <View style={baseStyles.leftColumn}>
            <SkillsSection 
              skills={userData.skills} 
              styles={baseStyles} 
              dynamicStyles={dynamicStyles} 
              translations={translations} 
            />
            
            <SoftSkillsSection 
              softSkills={userData.softSkills} 
              styles={baseStyles} 
              dynamicStyles={dynamicStyles} 
              translations={translations} 
              language={language} 
            />
            
            <ProjectsSection 
              projects={userData.projects} 
              styles={baseStyles} 
              dynamicStyles={dynamicStyles} 
              translations={translations} 
              language={language} 
            />
          </View>

          {/* Right column */}
          <View style={baseStyles.rightColumn}>
            <ExperienceSection 
              experiences={userData.experiences} 
              styles={baseStyles} 
              dynamicStyles={dynamicStyles} 
              translations={translations} 
              language={language} 
            />
            
            <EducationSection 
              education={userData.education} 
              styles={baseStyles} 
              dynamicStyles={dynamicStyles} 
              translations={translations} 
              language={language} 
            />
          </View>
        </View>

        {/* Footer with generation information */}
        <Text style={baseStyles.footer}>
          {translations.generatedWith} Modern CV React - {new Date().toLocaleDateString()}
        </Text>
      </Page>
    </Document>
  );
};

export default CVDocument;