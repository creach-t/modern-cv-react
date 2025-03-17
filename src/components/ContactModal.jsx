import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Send, Check, AlertCircle, User, AtSign, FileText, MessageSquare, Copy } from "lucide-react";
import { useColor } from "../contexts/ColorContext";
import { useLanguage } from "../contexts/LanguageContext";
import { getTextColor } from "../utils/color";
// Contenu multilingue
const translations = {
  fr: {
    title: "Nouveau message",
    name: "Nom",
    email: "Email",
    subject: "Objet",
    message: "Message",
    sendButton: "Envoyer",
    sending: "Envoi en cours...",
    thankYouTitle: "Message envoyé !",
    thankYouMessage: "Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.",
    dataPolicy: "Vos données personnelles sont utilisées uniquement pour traiter votre demande.",
    successMessage: "Votre message a été envoyé avec succès.",
    defaultError: "Une erreur s'est produite lors de l'envoi du message",
    to: "À",
    from: "De",
    confirmTitle: "Confirmer l'envoi",
    confirmMessage: "Êtes-vous sûr de vouloir envoyer ce message ?",
    confirmYes: "Oui, envoyer",
    confirmNo: "Non, annuler",
    emailCopied: "Email copié dans le presse-papiers !"
  },
  en: {
    title: "New message",
    name: "Name",
    email: "Email",
    subject: "Subject",
    message: "Message",
    sendButton: "Send",
    sending: "Sending...",
    thankYouTitle: "Message sent!",
    thankYouMessage: "Your message has been sent. We will get back to you as soon as possible.",
    dataPolicy: "Your personal data is used only to process your request.",
    successMessage: "Your message has been sent successfully.",
    defaultError: "An error occurred while sending the message",
    to: "To",
    from: "From",
    confirmTitle: "Confirm sending",
    confirmMessage: "Are you sure you want to send this message?",
    confirmYes: "Yes, send",
    confirmNo: "No, cancel",
    emailCopied: "Email copied to clipboard!"
  }
};
const ContactModal = ({ isOpen, onClose }) => {
  const { secondaryColor, isDark } = useColor();
  const { language } = useLanguage();
  const t = translations[language];
  
  // Définition des couleurs en fonction du thème
  const textColor = isDark ? "white" : "black";
  const inputBgColor = isDark ? "rgba(255, 255, 255, 0.05)" : "white";
  const placeholderColor = isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)";
  const borderColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
  const modalBgColor = isDark ? "#1f2937" : "white"; // dark:bg-gray-800 équivalent
  const detailsColor = isDark ? "rgb(209 213 219)" : "rgb(55 65 81)";
  
  // État pour les champs du formulaire
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  // État pour la gestion du statut d'envoi
  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: false,
    message: ""
  });
  
  // État pour les différentes étapes modales
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  
  // État pour le message de copie d'email
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  
  // Gestion des changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Fonction pour copier l'email
  const handleCopyEmail = () => {
    navigator.clipboard.writeText("creach.t@gmail.com")
      .then(() => {
        setShowCopyMessage(true);
        setTimeout(() => setShowCopyMessage(false), 2000);
      })
      .catch(err => {
        console.error('Erreur lors de la copie:', err);
      });
  };
  
  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };
  
  // Fermer le message de remerciement et la modale après 5 secondes
  useEffect(() => {
    let timer;
    if (showThankYou) {
      timer = setTimeout(() => {
        setShowThankYou(false);
        onClose();
      }, 5000); // Ferme après 5 secondes
    }
    return () => clearTimeout(timer);
  }, [showThankYou, onClose]);
  
  // Afficher le modal de confirmation
  const handleSubmitRequest = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };
  
  // Gestion de la soumission du formulaire
  const handleConfirmedSubmit = async () => {
    setShowConfirmation(false);
    
    setStatus({
      submitting: true,
      success: false,
      error: false,
      message: ""
    });
    
    try {
      const response = await fetch('https://mail.creachtheo.fr/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          language
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus({
          submitting: false,
          success: true,
          error: false,
          message: t.successMessage
        });
        resetForm();
        setShowThankYou(true);
      } else {
        throw new Error(data.message || t.defaultError);
      }
    } catch (error) {
      setStatus({
        submitting: false,
        success: false,
        error: true,
        message: error.message || t.defaultError
      });
    }
  };
  
  // Annuler la confirmation
  const handleCancelSubmit = () => {
    setShowConfirmation(false);
  };
  
  // Rendu de la modal de confirmation
  const renderConfirmation = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        style={{ backgroundColor: modalBgColor }}
        className="rounded-lg shadow-xl max-w-sm w-full p-6 text-center"
      >
        <h3 
          className="text-xl font-bold mb-3"
          style={{ color: textColor }}
        >
          {t.confirmTitle}
        </h3>
        <p style={{ color: detailsColor }} className="mb-6">
          {t.confirmMessage}
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleCancelSubmit}
            className="px-4 py-2 rounded-md font-medium transition-colors"
            style={{ 
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
              color: textColor
            }}
          >
            {t.confirmNo}
          </button>
          <button
            onClick={handleConfirmedSubmit}
            className="px-4 py-2 rounded-md font-medium transition-colors"
            style={{
              backgroundColor: secondaryColor,
              color: getTextColor(secondaryColor),
            }}
          >
            {t.confirmYes}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
  
  // Rendu du message de remerciement
  const renderThankYou = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        style={{ backgroundColor: modalBgColor }}
        className="rounded-lg shadow-xl max-w-sm w-full p-6 text-center"
      >
        <div className="flex flex-col items-center gap-4">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: secondaryColor }}
          >
            <Check size={32} color={getTextColor(secondaryColor)} />
          </div>
          <h3 
            className="text-xl font-bold"
            style={{ color: textColor }}
          >
            {t.thankYouTitle}
          </h3>
          <p style={{ color: detailsColor }}>
            {t.thankYouMessage}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
  
  return (
    <AnimatePresence>
      {showConfirmation && renderConfirmation()}
      {showThankYou && renderThankYou()}
      
      {isOpen && !showConfirmation && !showThankYou && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{ backgroundColor: modalBgColor }}
            className="rounded-lg shadow-xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Email-like Header */}
            <div 
              className="p-4 border-b flex items-center justify-between"
              style={{ 
                backgroundColor: secondaryColor,
                borderColor: borderColor
              }}
            >
              <div className="flex items-center gap-2">
                <Mail size={20} color={getTextColor(secondaryColor)} />
                <h3
                  className="text-lg font-bold"
                  style={{ color: getTextColor(secondaryColor) }}
                >
                  {t.title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              >
                <X size={20} color={getTextColor(secondaryColor)} />
              </button>
            </div>
            
            {/* Formulaire style email */}
            <div className="p-6">
              {/* Messages d'erreur - pas d'infobulles de succès */}
              {status.error && (
                <div 
                  className="mb-4 p-3 rounded-md flex items-center gap-2"
                  style={{ 
                    backgroundColor: isDark ? "rgba(220, 38, 38, 0.2)" : "rgba(254, 226, 226, 1)",
                    color: isDark ? "rgba(252, 165, 165, 1)" : "rgba(185, 28, 28, 1)" 
                  }}
                >
                  <AlertCircle size={18} />
                  <span>{status.message}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmitRequest}>
                <div className="space-y-4">
                  {/* À: (destinataire) avec copie au clic */}
                  <div 
                    className="flex items-center pb-3 relative"
                    style={{ borderBottom: `1px solid ${borderColor}` }}
                  >
                    <span 
                      className="text-sm font-medium mr-2 w-16"
                      style={{ color: textColor }}
                    >
                      {t.to}:
                    </span>
                    <div 
                      onClick={handleCopyEmail}
                      className="px-3 py-1 rounded-md text-sm flex-1 flex items-center justify-between cursor-pointer hover:bg-opacity-80 transition-all"
                      style={{ 
                        backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
                        color: detailsColor
                      }}
                      title="Cliquer pour copier"
                    >
                      <span>creach.t@gmail.com</span>
                      <Copy size={14} style={{ color: detailsColor }} className="ml-2" />
                    </div>
                    
                    {/* Message de confirmation de copie */}
                    <AnimatePresence>
                      {showCopyMessage && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 -bottom-8 z-10 text-xs px-2 py-1 rounded"
                          style={{
                            backgroundColor: secondaryColor,
                            color: getTextColor(secondaryColor)
                          }}
                        >
                          {t.emailCopied}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* De: (expéditeur) */}
                  <div className="flex items-center">
                    <span 
                      className="text-sm font-medium mr-2 w-16"
                      style={{ color: textColor }}
                    >
                      {t.from}:
                    </span>
                    
                    <div className="flex flex-col flex-1 gap-2">
                      {/* Nom */}
                      <div className="flex items-center gap-2 w-full">
                        <User size={16} style={{ color: detailsColor }} />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          placeholder={t.name}
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm"
                          style={{ 
                            backgroundColor: inputBgColor,
                            color: textColor,
                            borderColor: borderColor,
                            border: `1px solid ${borderColor}`,
                            "::placeholder": { color: placeholderColor }
                          }}
                        />
                      </div>
                      
                      {/* Email */}
                      <div className="flex items-center gap-2 w-full">
                        <AtSign size={16} style={{ color: detailsColor }} />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder={t.email}
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm"
                          style={{ 
                            backgroundColor: inputBgColor,
                            color: textColor,
                            borderColor: borderColor,
                            border: `1px solid ${borderColor}`,
                            "::placeholder": { color: placeholderColor }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Objet */}
                  <div 
                    className="py-3"
                    style={{ 
                      borderTop: `1px solid ${borderColor}`,
                      borderBottom: `1px solid ${borderColor}` 
                    }}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <FileText size={16} style={{ color: detailsColor }} />
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        placeholder={t.subject}
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm"
                        style={{ 
                          backgroundColor: inputBgColor,
                          color: textColor,
                          borderColor: borderColor,
                          border: `1px solid ${borderColor}`,
                          "::placeholder": { color: placeholderColor }
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Message */}
                  <div className="flex items-start gap-2 w-full">
                    <MessageSquare size={16} style={{ color: detailsColor }} className="mt-3" />
                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      placeholder={t.message}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm"
                      style={{ 
                        backgroundColor: inputBgColor,
                        color: textColor,
                        borderColor: borderColor,
                        border: `1px solid ${borderColor}`,
                        "::placeholder": { color: placeholderColor }
                      }}
                    ></textarea>
                  </div>
                  
                  {/* Bouton d'envoi */}
                  <div className="flex justify-end items-center pt-2">
                    <button
                      type="submit"
                      disabled={status.submitting}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 text-sm"
                      style={{
                        backgroundColor: secondaryColor,
                        color: getTextColor(secondaryColor),
                      }}
                    >
                      {status.submitting ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          {t.sending}
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          {t.sendButton}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
              
              <div 
                className="mt-6 pt-4 text-xs text-center"
                style={{ 
                  borderTop: `1px solid ${borderColor}`,
                  color: detailsColor
                }}
              >
                {t.dataPolicy}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default ContactModal;