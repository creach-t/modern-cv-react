// src/services/PDFService/config/configManager.js

/**
 * Gestionnaire de configuration pour le PDF CV
 * Ce fichier permet de centraliser toutes les configurations liées au PDF
 */

import defaultConfig from './defaultConfig';
import { deepMerge } from '../utils';

/**
 * Classe permettant de gérer la configuration du CV PDF
 */
class ConfigManager {
  constructor(userConfig = {}) {
    // Fusionner la configuration par défaut avec la configuration fournie par l'utilisateur
    this.config = deepMerge(defaultConfig, userConfig);
  }

  /**
   * Obtient la configuration complète
   * @returns {Object} Configuration complète
   */
  getConfig() {
    return this.config;
  }

  /**
   * Obtient la configuration du layout
   * @returns {Object} Configuration du layout
   */
  getLayoutConfig() {
    return this.config.layout;
  }

  /**
   * Obtient la configuration des sections
   * @returns {Object} Configuration des sections
   */
  getSectionsConfig() {
    return this.config.sections;
  }

  /**
   * Obtient la configuration d'une section spécifique
   * @param {string} sectionName - Nom de la section
   * @returns {Object} Configuration de la section
   */
  getSectionConfig(sectionName) {
    return this.config.sections[sectionName] || {};
  }

  /**
   * Obtient la configuration de style
   * @returns {Object} Configuration de style
   */
  getStyleConfig() {
    return this.config.style;
  }

  /**
   * Obtient la liste des sections visibles dans l'ordre
   * @returns {Array} Liste des sections visibles dans l'ordre
   */
  getVisibleSections() {
    const { sections, layout } = this.config;
    
    // Obtenir l'ordre des sections pour chaque colonne
    const columns = layout.columns.map(column => 
      column.sections
        .filter(sectionName => sections[sectionName] && sections[sectionName].visible !== false)
    );
    
    return {
      columns,
      columnWidths: layout.columns.map(column => column.width)
    };
  }

  /**
   * Met à jour la configuration
   * @param {Object} newConfig - Nouvelle configuration
   */
  updateConfig(newConfig) {
    this.config = deepMerge(this.config, newConfig);
  }
}

export default ConfigManager;