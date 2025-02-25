import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useColor } from "../contexts/ColorContext";

const ContactModal = ({ isOpen, onClose }) => {
  const { secondaryColor, isDark } = useColor();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Message envoyé :", formData);
    onClose(); // Fermer la modale après envoi
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-11/12 max-w-md relative"
      >
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-red-500"
        >
          <X size={24} />
        </button>

        {/* Titre */}
        <h2
          className="text-2xl font-bold mb-4 transition-colors duration-200"
          style={{ color: isDark ? "white" : "black" }}
        >
          Me Contacter
        </h2>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Votre nom"
            value={formData.name}
            onChange={handleChange}
            required
            className="p-3 rounded-lg border bg-gray-100 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2"
            style={{ borderColor: secondaryColor }}
          />
          <input
            type="email"
            name="email"
            placeholder="Votre email"
            value={formData.email}
            onChange={handleChange}
            required
            className="p-3 rounded-lg border bg-gray-100 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2"
            style={{ borderColor: secondaryColor }}
          />
          <textarea
            name="message"
            rows={4}
            placeholder="Votre message"
            value={formData.message}
            onChange={handleChange}
            required
            className="p-3 rounded-lg border bg-gray-100 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2"
            style={{ borderColor: secondaryColor }}
          />
          <button
            type="submit"
            className="p-3 rounded-lg text-white font-bold transition"
            style={{ backgroundColor: secondaryColor }}
          >
            Envoyer
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ContactModal;
