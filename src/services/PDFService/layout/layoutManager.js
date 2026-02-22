// src/services/PDFService/layout/LayoutManager.jsx

import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { createSectionComponent } from './sectionFactory';

/**
 * Gestionnaire de layout pour le document PDF
 */
class LayoutManager {
  constructor(configManager, styles, dynamicStyles, translations, language) {
    this.configManager = configManager;
    this.styles = styles;
    this.dynamicStyles = dynamicStyles;
    this.translations = translations;
    this.language = language;
  }

  /**
   * Crée l'en-tête du document (sections communes)
   * @param {Object} userData - Données utilisateur formatées
   * @returns {React.Component} - En-tête du document
   */
  createHeader(userData) {
    const commonSections = this.configManager.getLayoutConfig().commonSections;
    const fullConfig = this.configManager.getConfig();
    
    return commonSections.map(sectionName => {
      const SectionComponent = createSectionComponent(sectionName);
      const sectionConfig = this.configManager.getSectionConfig(sectionName);
      
      if (!SectionComponent || !sectionConfig.visible) {
        return null;
      }
      
      return (
        <SectionComponent
          key={sectionName}
          userData={userData}
          styles={this.styles}
          dynamicStyles={this.dynamicStyles}
          translations={this.translations}
          language={this.language}
          config={fullConfig}
        />
      );
    });
  }

  /**
   * Crée le footer du document
   * @returns {React.Component} - Footer du document
   */
  createFooter() {
    const footerConfig = this.configManager.getConfig().document.footer;
    
    if (!footerConfig.enabled) {
      return null;
    }
    
    return (
      <Text style={this.styles.footer}>
        {this.translations.generatedWith} Modern CV React - {new Date().toLocaleDateString()}
      </Text>
    );
  }

  /**
   * Crée le layout principal selon la configuration
   * @param {Object} userData - Données utilisateur formatées
   * @returns {React.Component} - Layout principal
   */
  createMainLayout(userData) {
    const { layout } = this.configManager.getConfig();
    
    switch (layout.type) {
      case 'single-column':
        return this.createSingleColumnLayout(userData);
      case 'grid':
        return this.createGridLayout(userData);
      case 'multi-column':
      default:
        return this.createMultiColumnLayout(userData);
    }
  }

  /**
   * Crée un layout à une seule colonne
   * @param {Object} userData - Données utilisateur formatées
   * @returns {React.Component} - Layout à une colonne
   */
  createSingleColumnLayout(userData) {
    const { columns } = this.configManager.getVisibleSections();
    const fullConfig = this.configManager.getConfig();
    const allSections = [...columns[0], ...(columns[1] || [])].sort((a, b) => {
      const orderA = this.configManager.getSectionConfig(a).order;
      const orderB = this.configManager.getSectionConfig(b).order;
      return orderA - orderB;
    });
    
    return (
      <View style={this.styles.singleColumn}>
        {allSections.map(sectionName => {
          const SectionComponent = createSectionComponent(sectionName);
          
          if (!SectionComponent) {
            return null;
          }
          
          return (
            <SectionComponent
              key={sectionName}
              userData={userData}
              styles={this.styles}
              dynamicStyles={this.dynamicStyles}
              translations={this.translations}
              language={this.language}
              config={fullConfig}
            />
          );
        })}
      </View>
    );
  }

  /**
   * Crée un layout à plusieurs colonnes
   * @param {Object} userData - Données utilisateur formatées
   * @returns {React.Component} - Layout à plusieurs colonnes
   */
  createMultiColumnLayout(userData) {
    const { columns, columnWidths } = this.configManager.getVisibleSections();
    const spaceBetween = this.configManager.getLayoutConfig().spaceBetweenColumns;
    const fullConfig = this.configManager.getConfig();
    
    return (
      <View style={{
        flexDirection: 'row',
        marginTop: 10,
        columnGap: spaceBetween,
      }}>
        {columns.map((columnSections, columnIndex) => (
          <View 
            key={columnIndex} 
            style={{
              width: columnWidths[columnIndex],
              ...(columnIndex < columns.length - 1 ? { 
                borderRight: '1pt dotted #dddddd',
                paddingRight: 8,
              } : {})
            }}
          >
            {columnSections.map(sectionName => {
              const SectionComponent = createSectionComponent(sectionName);
                  
              if (!SectionComponent) {
                return null;
              }
              
              return (
                <SectionComponent
                  key={sectionName}
                  userData={userData}
                  styles={this.styles}
                  dynamicStyles={this.dynamicStyles}
                  translations={this.translations}
                  language={this.language}
                  config={fullConfig}
                />
              );
            })}
          </View>
        ))}
      </View>
    );
  }

  /**
   * Crée un layout en grille
   * @param {Object} userData - Données utilisateur formatées
   * @returns {React.Component} - Layout en grille
   */
  createGridLayout(userData) {
    // Implémentation à venir pour un layout en grille
    // Pour l'instant, retourne le même résultat que multiColumn
    return this.createMultiColumnLayout(userData);
  }
}

export default LayoutManager;