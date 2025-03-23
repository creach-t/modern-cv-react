import React, { useState } from "react";
import { FileDown } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useColor } from "../../contexts/ColorContext";
import generatePDF from "../../services/PDFService";

const PdfExportButton = ({ onClick, pdfConfig = null }) => {
  const { language } = useLanguage();
  const { secondaryColor } = useColor();
  const [isExporting, setIsExporting] = useState(false);
  
  const exportToPdf = async () => {
    // Notifier la fonction parent si fournie
    if (onClick) {
      onClick();
    }
    
    if (isExporting) return; // Éviter les clics multiples
    
    try {
      setIsExporting(true);
      
      // Afficher un message de traitement
      const exportingMessage = document.createElement("div");
      exportingMessage.innerHTML = language === "fr" 
        ? "Export PDF en cours..." 
        : "PDF export in progress...";
      exportingMessage.style.position = "fixed";
      exportingMessage.style.top = "20px";
      exportingMessage.style.left = "50%";
      exportingMessage.style.transform = "translateX(-50%)";
      exportingMessage.style.padding = "10px 20px";
      exportingMessage.style.backgroundColor = "rgba(0,0,0,0.7)";
      exportingMessage.style.color = "#fff";
      exportingMessage.style.borderRadius = "5px";
      exportingMessage.style.zIndex = "9999";
      document.body.appendChild(exportingMessage);
      
      // Délai pour permettre au message de s'afficher
      setTimeout(async () => {
        try {
          // Utiliser uniquement secondaryColor comme configuration
          // Cette approche est plus sûre car elle garde la configuration par défaut et ne modifie que ce qui est nécessaire
          const config = {
            style: { 
              colors: { 
                secondary: secondaryColor 
              } 
            }
          };
          
          // Appel à la fonction generatePDF du service avec la configuration
          const success = await generatePDF(language, config);
          
          // Supprimer le message d'exportation
          document.body.removeChild(exportingMessage);
          
          // Afficher un message de succès ou d'erreur
          const resultMessage = document.createElement("div");
          resultMessage.innerHTML = success
            ? (language === "fr" ? "Export PDF terminé!" : "PDF export completed!")
            : (language === "fr" ? "Erreur lors de l'export PDF" : "Error during PDF export");
          resultMessage.style.position = "fixed";
          resultMessage.style.top = "20px";
          resultMessage.style.left = "50%";
          resultMessage.style.transform = "translateX(-50%)";
          resultMessage.style.padding = "10px 20px";
          resultMessage.style.backgroundColor = success ? "rgba(0,128,0,0.7)" : "rgba(255,0,0,0.7)";
          resultMessage.style.color = "#fff";
          resultMessage.style.borderRadius = "5px";
          resultMessage.style.zIndex = "9999";
          document.body.appendChild(resultMessage);
          
          // Supprimer le message après 3 secondes
          setTimeout(() => {
            document.body.removeChild(resultMessage);
            setIsExporting(false);
          }, 3000);
        } catch (error) {
          console.error("Erreur dans l'export PDF:", error);
          document.body.removeChild(exportingMessage);
          setIsExporting(false);
        }
      }, 100);
    } catch (error) {
      console.error(language === "fr" ? "Erreur lors de l'export PDF:" : "Error during PDF export:", error);
      setIsExporting(false);
    }
  };
  
  return (
    <button
      onClick={exportToPdf}
      disabled={isExporting}
      className={`
        p-2 bg-white rounded-full shadow-lg 
        hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 
        transition-all transform hover:scale-105 relative group
        ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      aria-label={language === "fr" ? "Exporter en PDF" : "Export as PDF"}
      title={language === "fr" ? "Exporter en PDF" : "Export as PDF"}
    >
      <FileDown className="w-6 h-6 text-gray-700 dark:text-gray-200" />
    </button>
  );
};

export default PdfExportButton;