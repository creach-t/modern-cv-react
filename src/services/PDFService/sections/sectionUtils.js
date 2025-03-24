// src/services/PDFService/sections/sectionUtils.js

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { SkillIconColored } from '../icons/SkillIcons';

/**
 * Récupère la configuration d'une section spécifique
 * @param {string} sectionName - Nom de la section
 * @param {Object} config - Configuration complète
 * @returns {Object} - Configuration de la section
 */
export const getSectionConfig = (sectionName, config) => {
  return config?.sections?.[sectionName] || {};
};

/**
 * Crée un badge de période
 * @param {string} period - Texte de la période
 * @param {string} color - Couleur d'arrière-plan du badge
 * @returns {React.Component} - Badge de période
 */
export const renderPeriodBadge = (period, color) => {
  if (!period) return null;
  
  return (
    <Text style={{ 
      fontSize: 6, 
      backgroundColor: color,
      color: 'white',
      padding: '1 3',
      borderRadius: 2,
    }}>
      {period}
    </Text>
  );
};

/**
 * Crée un rendu de badges pour les compétences/technologies
 * @param {Array} items - Liste des éléments à afficher
 * @param {string} secondaryColor - Couleur secondaire
 * @param {number} iconSize - Taille de l'icône
 * @returns {React.Component} - Composant de badges
 */
export const renderBadges = (items, secondaryColor, iconSize = 9) => {
  if (!items || items.length === 0) return null;
  
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 2, marginTop: 1 }}>
      {items.map((item, i) => (
        <View key={i} style={{ 
          flexDirection: 'row', 
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
          padding: '1 3',
          borderRadius: 3
        }}>
          {renderSkillIcon(item, iconSize, secondaryColor)}
          <Text style={{ fontSize: 6, marginLeft: 1 }}>{item}</Text>
        </View>
      ))}
    </View>
  );
};

/**
 * Crée un rendu d'icône pour une compétence
 * @param {string} name - Nom de la compétence
 * @param {number} iconSize - Taille de l'icône
 * @param {string} color - Couleur de l'icône
 * @returns {React.Component} - Composant d'icône
 */
export const renderSkillIcon = (name, iconSize, color) => {
  try {
    return <SkillIconColored name={name} size={iconSize} color={color} />;
  } catch (error) {
    return <View style={{ width: iconSize, height: iconSize }} />;
  }
};

/**
 * Distribue les éléments en colonnes équilibrées
 * @param {Array} items - Liste des éléments
 * @returns {Array} - Tableau de colonnes
 */
export const createBalancedColumns = (items) => {
  if (!items || !Array.isArray(items) || items.length === 0) return [[], []];
  const midpoint = Math.ceil(items.length / 2);
  return [items.slice(0, midpoint), items.slice(midpoint)];
};