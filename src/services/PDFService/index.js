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
 * @param {string} secondaryColor - Couleur secondaire du thème
 * @returns {Promise<boolean>} - Indique si le PDF a été généré avec succès
 */
const generatePDF = async (language, secondaryColor) => {
  try {
    // Charger et construire les données utilisateur
    const userData = await buildUserData(language);
    
    // Créer le document PDF
    const pdfDocument = <CVDocument 
      userData={userData} 
      secondaryColor={secondaryColor} 
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

export default generatePDF;