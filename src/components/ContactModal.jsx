import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Send } from "lucide-react";
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
  
  // Gestion des changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Génération du lien mailto avec les données du formulaire
  const generateMailtoLink = () => {
    const recipientEmail = "votre.email@example.com"; // Votre adresse email
    const subject = encodeURIComponent(formData.subject || "Message depuis le portfolio");
    
    // Construction du corps du message avec les informations du formulaire
    const body = encodeURIComponent(
      `De: ${formData.name} (${formData.email})\n\n${formData.message}`
    );
    
    return `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
  };
  
  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici on ne soumet pas réellement le formulaire, on ouvre simplement le lien mailto
    window.location.href = generateMailtoLink();
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
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105 shadow-lg"
                      style={{
                        backgroundColor: secondaryColor,
                        color: getTextColor(secondaryColor),
                      }}
                    >
                      <Mail size={20} />
                      Envoyer via ma messagerie
                    </button>
                  </div>
                </div>
              </form>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 text-center">
                En cliquant sur "Envoyer", votre client de messagerie s'ouvrira avec votre message.
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;