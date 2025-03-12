import React, { createContext, useContext, useState } from 'react';
import ContactModal from '../components/ContactModal';

// Création du contexte
const ContactModalContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useContactModal = () => {
  const context = useContext(ContactModalContext);
  if (!context) {
    throw new Error("useContactModal doit être utilisé à l'intérieur d'un ContactModalProvider");
  }
  return context;
};

// Provider qui va envelopper l'application
export const ContactModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <ContactModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      {/* Une seule instance du modal pour toute l'application */}
      <ContactModal isOpen={isOpen} onClose={closeModal} />
    </ContactModalContext.Provider>
  );
};

export default ContactModalProvider;