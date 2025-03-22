// src/services/PDFService/CVDocument.jsx

import React from 'react';
import { Document, Page } from '@react-pdf/renderer';
import { buildStylesFromConfig } from './styles';
import { getTranslations } from './translations';
import LayoutManager from './layout/layoutManager';
import ConfigManager from './config/configManager';

/**
 * Composant principal du document PDF
 * @param {Object} userData - Données utilisateur formatées
 * @param {Object} userConfig - Configuration personnalisée (optionnel)
 * @param {string} language - Langue ('fr' ou 'en')
 * @returns {React.Component} - Document PDF
 */
const CVDocument = ({ userData, userConfig = {}, language }) => {
  // Créer le gestionnaire de configuration avec les paramètres utilisateur
  const configManager = new ConfigManager(userConfig);
  const config = configManager.getConfig();
  
  // Obtenir les styles basés sur la configuration
  const { baseStyles, dynamicStyles } = buildStylesFromConfig(config);
  
  // Obtenir les traductions
  const translations = getTranslations(language);
  
  // Créer le gestionnaire de layout
  const layoutManager = new LayoutManager(
    configManager,
    baseStyles,
    dynamicStyles,
    translations,
    language
  );

  return (
    <Document>
      <Page 
        size={config.document.size} 
        style={{
          ...baseStyles.page,
          padding: config.document.padding
        }}
      >
        {/* En-tête (sections communes) */}
        {layoutManager.createHeader(userData)}
        
        {/* Contenu principal */}
        {layoutManager.createMainLayout(userData)}
        
        {/* Footer */}
        {layoutManager.createFooter()}
      </Page>
    </Document>
  );
};

export default CVDocument;