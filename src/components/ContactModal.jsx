import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Send, Check, AlertCircle } from "lucide-react";
import { useColor } from "../contexts/ColorContext";
import { getTextColor } from "../utils/color";

const ContactModal = ({ isOpen, onClose }) => {
  const { secondaryColor, isDark } = useColor();
  
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
  
  // Gestion des changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
  
  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setStatus({
      submitting: true,
      success: false,
      error: false,
      message: ""
    });
    
    try {
      // Utilisez l'URL de votre serveur de mailing ici
      const response = await fetch('https://mail.creachtheo.fr/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus({
          submitting: false,
          success: true,
          error: false,
          message: "Votre message a été envoyé avec succès. Un email de confirmation vous a été adressé."
        });
        resetForm();
      } else {
        throw new Error(data.message || "Une erreur s'est produite");
      }
    } catch (error) {
      setStatus({
        submitting: false,
        success: false,
        error: true,
        message: error.message || "Une erreur s'est produite lors de l'envoi du message"
      });
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
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
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3
                className="text-lg font-bold"
                style={{ color: isDark ? "white" : "black" }}
              >
                Me contacter
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={20} color={isDark ? "white" : "black"} />
              </button>
            </div>

            {/* Formulaire */}
            <div className="p-6">
              {/* Messages de statut */}
              {status.success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded-md flex items-center gap-2">
                  <Check size={18} />
                  <span>{status.message}</span>
                </div>
              )}
              
              {status.error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md flex items-center gap-2">
                  <AlertCircle size={18} />
                  <span>{status.message}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Nom */}
                  <div>
                    <label 
                      htmlFor="name"
                      className="block text-sm font-medium mb-1"
                      style={{ color: isDark ? "white" : "black" }}
                    >
                      Nom
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-black dark:text-white"
                      style={{ focusRingColor: secondaryColor }}
                    />
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label 
                      htmlFor="email"
                      className="block text-sm font-medium mb-1"
                      style={{ color: isDark ? "white" : "black" }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-black dark:text-white"
                      style={{ focusRingColor: secondaryColor }}
                    />
                  </div>
                  
                  {/* Objet */}
                  <div>
                    <label 
                      htmlFor="subject"
                      className="block text-sm font-medium mb-1"
                      style={{ color: isDark ? "white" : "black" }}
                    >
                      Objet
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-black dark:text-white"
                      style={{ focusRingColor: secondaryColor }}
                    />
                  </div>
                  
                  {/* Message */}
                  <div>
                    <label 
                      htmlFor="message"
                      className="block text-sm font-medium mb-1"
                      style={{ color: isDark ? "white" : "black" }}
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-black dark:text-white"
                      style={{ focusRingColor: secondaryColor }}
                    ></textarea>
                  </div>
                  
                  {/* Bouton d'envoi */}
                  <div className="flex justify-center mt-6">
                    <button
                      type="submit"
                      disabled={status.submitting}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-70 disabled:hover:scale-100"
                      style={{
                        backgroundColor: secondaryColor,
                        color: getTextColor(secondaryColor),
                      }}
                    >
                      {status.submitting ? (
                        <>
                          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          Envoyer le message
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 text-center">
                Vos données personnelles sont utilisées uniquement pour traiter votre demande.
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;