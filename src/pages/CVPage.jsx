// src/pages/CVPage.jsx

import React, { useState, useEffect } from 'react';
import { buildUserData } from '../services/PDFService/dataFormatter';
import CVPreview from '../components/CVPreview';
import generatePDF from '../services/PDFService';
import './CVPage.css'; // Styles pour la page

const CVPage = () => {
  const [userData, setUserData] = useState(null);
  const [language, setLanguage] = useState('fr');
  const [secondaryColor, setSecondaryColor] = useState('#0066cc');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState(null);
  
  // Charger les données utilisateur au chargement de la page
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const data = await buildUserData(language);
        setUserData(data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setMessage({
          type: 'error',
          content: 'Erreur lors du chargement des données du CV.'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [language]);
  
  // Gérer le changement de langue
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };
  
  // Gérer le changement de couleur
  const handleColorChange = (newColor) => {
    setSecondaryColor(newColor);
  };
  
  // Gérer la génération du PDF
  const handleGeneratePDF = async () => {
    try {
      setGenerating(true);
      setMessage({
        type: 'info',
        content: 'Génération du PDF en cours...'
      });
      
      const success = await generatePDF(language, secondaryColor);
      
      if (success) {
        setMessage({
          type: 'success',
          content: 'Le PDF a été généré et téléchargé avec succès!'
        });
      } else {
        setMessage({
          type: 'error',
          content: 'Erreur lors de la génération du PDF.'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      setMessage({
        type: 'error',
        content: 'Erreur lors de la génération du PDF.'
      });
    } finally {
      setGenerating(false);
      // Effacer le message après 5 secondes
      setTimeout(() => setMessage(null), 5000);
    }
  };
  
  // Styles prédéfinis pour tester rapidement
  const predefinedColors = [
    { name: 'Bleu', value: '#0066cc' },
    { name: 'Vert', value: '#2e8b57' },
    { name: 'Rouge', value: '#cc3333' },
    { name: 'Violet', value: '#6a5acd' },
    { name: 'Orange', value: '#ff7f50' }
  ];
  
  return (
    <div className="cv-page-container">
      <header className="cv-page-header">
        <h1>Générateur de CV PDF</h1>
        
        {/* Afficher les messages */}
        {message && (
          <div className={`message ${message.type}`}>
            {message.content}
          </div>
        )}
      </header>
      
      <div className="cv-page-content">
        {/* Panneau de contrôle */}
        <div className="cv-controls">
          <h2>Personnalisation</h2>
          
          <div className="control-group">
            <h3>Langue</h3>
            <div className="language-buttons">
              <button 
                className={language === 'fr' ? 'active' : ''} 
                onClick={() => handleLanguageChange('fr')}
              >
                Français
              </button>
              <button 
                className={language === 'en' ? 'active' : ''} 
                onClick={() => handleLanguageChange('en')}
              >
                English
              </button>
            </div>
          </div>
          
          <div className="control-group">
            <h3>Couleur secondaire</h3>
            <div className="color-input">
              <input 
                type="color" 
                value={secondaryColor} 
                onChange={(e) => handleColorChange(e.target.value)} 
              />
              <span>{secondaryColor}</span>
            </div>
            
            <div className="predefined-colors">
              <h4>Couleurs prédéfinies:</h4>
              <div className="color-buttons">
                {predefinedColors.map((color) => (
                  <button 
                    key={color.value}
                    className="color-button" 
                    style={{ backgroundColor: color.value }}
                    onClick={() => handleColorChange(color.value)}
                    title={color.name}
                  >
                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="control-group">
            <button 
              className="generate-button" 
              onClick={handleGeneratePDF} 
              disabled={loading || generating}
            >
              {generating ? 'Génération en cours...' : 'Générer et télécharger le PDF'}
            </button>
          </div>
        </div>
        
        {/* Aperçu du CV */}
        <div className="cv-preview-wrapper">
          <h2>Aperçu du CV</h2>
          
          {loading ? (
            <div className="loading">Chargement des données...</div>
          ) : userData ? (
            <div className="preview-container">
              <CVPreview 
                userData={userData} 
                secondaryColor={secondaryColor} 
                language={language}
                onColorChange={handleColorChange}
                onLanguageChange={handleLanguageChange}
              />
            </div>
          ) : (
            <div className="error">Impossible de charger les données du CV.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVPage;