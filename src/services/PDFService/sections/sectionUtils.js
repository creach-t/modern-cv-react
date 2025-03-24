// src/services/PDFService/sections/sectionUtils.js

import React from 'react';
import { Text, View } from '@react-pdf/renderer';

/**
 * Récupère la configuration d'une section spécifique
 * @param {string} sectionName - Nom de la section
 * @param {Object} config - Configuration globale
 * @returns {Object} - Configuration de la section
 */
export const getSectionConfig = (sectionName, config) => {
  return config?.sections?.[sectionName] || {};
};

/**
 * Détermine si une section est visible
 * @param {string} sectionName - Nom de la section
 * @param {Object} config - Configuration globale
 * @returns {boolean} - True si la section est visible
 */
export const isSectionVisible = (sectionName, config) => {
  const sectionConfig = getSectionConfig(sectionName, config);
  return sectionConfig.visible !== false; // Par défaut, considéré comme visible
};

/**
 * Génère un badge de période (intervalle de temps)
 * @param {Object} period - Informations de période
 * @param {Object} styles - Style de base du badge
 * @param {Object} backgroundStyle - Style supplémentaire pour le fond
 * @returns {React.Element} - Badge de période formaté
 */
export const renderPeriodBadge = (period, styles, backgroundStyle) => {
  if (!period) return null;
  
  const startDate = period.start || '';
  const endDate = period.end || 'Present';
  
  return (
    <Text style={[styles, backgroundStyle]}>
      {startDate} - {endDate}
    </Text>
  );
};

/**
 * Génère des badges pour technologies/compétences/outils
 * @param {Array} items - Liste des éléments à afficher
 * @param {Object} styles - Style de base des badges
 * @param {Object} backgroundStyle - Style supplémentaire pour le fond
 * @returns {React.Element} - Liste de badges formatés
 */
export const renderBadges = (items, styles, backgroundStyle) => {
  if (!items || !items.length) return null;
  
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {items.map((item, index) => (
        <Text key={index} style={[styles, backgroundStyle]}>
          {typeof item === 'string' ? item : item.name}
        </Text>
      ))}
    </View>
  );
};

/**
 * Répartit des éléments équitablement en deux colonnes
 * @param {Array} items - Liste des éléments à répartir
 * @returns {Array} - Tableau de deux tableaux (colonnes gauche et droite)
 */
export const createBalancedColumns = (items) => {
  if (!items || !items.length) return [[], []];
  
  const itemsCopy = [...items];
  const leftColumn = [];
  const rightColumn = [];
  
  // Pour une répartition équilibrée, on alterne l'ajout dans les colonnes
  itemsCopy.forEach((item, index) => {
    if (index % 2 === 0) {
      leftColumn.push(item);
    } else {
      rightColumn.push(item);
    }
  });
  
  return [leftColumn, rightColumn];
};

/**
 * Tronque un texte à une longueur maximale
 * @param {string} text - Texte à tronquer
 * @param {number} maxLength - Longueur maximale
 * @returns {string} - Texte tronqué avec ellipse si nécessaire
 */
export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Formate une date selon le format souhaité
 * @param {string} dateStr - Chaîne de date à formater
 * @param {string} format - Format souhaité (par défaut: 'MM/YYYY')
 * @returns {string} - Date formatée
 */
export const formatDate = (dateStr, format = 'MM/YYYY') => {
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    
    if (isNaN(date.getTime())) return dateStr; // Si la date est invalide, retourner la chaîne originale
    
    // Mois au format 2 chiffres
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    if (format === 'MM/YYYY') {
      return `${month}/${year}`;
    } else if (format === 'YYYY') {
      return `${year}`;
    } else if (format === 'MM/DD/YYYY') {
      const day = String(date.getDate()).padStart(2, '0');
      return `${month}/${day}/${year}`;
    }
    
    return dateStr; // Format non pris en charge
  } catch (error) {
    return dateStr; // En cas d'erreur, retourner la chaîne originale
  }
};
