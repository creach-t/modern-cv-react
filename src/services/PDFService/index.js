// src/services/PDFService/index.js

import { pdf } from '@react-pdf/renderer';
import { registerFonts } from './fonts';
import { buildUserData } from './dataFormatter';
import CVDocument from './CVDocument';

// Enregistrer les polices
registerFonts();

/**
 * Génère et télécharge un CV au format PDF
 * @param {string} language - Langue du CV ('fr' ou 'en')
 * @param {Object} userConfig - Configuration personnalisée du PDF
 * @returns {Promise<boolean>} - Indique si le PDF a été généré avec succès
 */
const generatePDF = async (language, userConfig = {}) => {
  try {
    // Extraire la configuration du secondaryColor si c'est juste une chaîne (pour rétrocompatibilité)
    const config = typeof userConfig === 'string' 
      ? { style: { colors: { secondary: userConfig } } }
      : userConfig;
    
    // Charger et construire les données utilisateur
    const userData = await buildUserData(language);
    
    // Créer le document PDF
    const pdfDocument = <CVDocument 
      userData={userData} 
      userConfig={config} 
      language={language} 
    />;
    
    // Générer le blob PDF
    const blob = await pdf(pdfDocument).toBlob();
    
    // Télécharger le fichier
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CV_Theo_CREACH_${language.toUpperCase()}_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    return false;
  }
};

/**
 * Génère un aperçu du CV au format Blob
 * @param {string} language - Langue du CV ('fr' ou 'en')
 * @param {Object} userConfig - Configuration personnalisée du PDF
 * @returns {Promise<Blob>} - Blob du PDF
 */
export const generatePDFPreview = async (language, userConfig = {}) => {
  try {
    // Extraire la configuration du secondaryColor si c'est juste une chaîne (pour rétrocompatibilité)
    const config = typeof userConfig === 'string' 
      ? { style: { colors: { secondary: userConfig } } }
      : userConfig;
    
    // Charger et construire les données utilisateur
    const userData = await buildUserData(language);
    
    // Créer le document PDF
    const pdfDocument = <CVDocument 
      userData={userData} 
      userConfig={config} 
      language={language} 
    />;
    
    // Retourner le blob PDF
    return await pdf(pdfDocument).toBlob();
  } catch (error) {
    console.error('Erreur lors de la génération de l\'aperçu PDF:', error);
    throw error;
  }
};

export default generatePDF;