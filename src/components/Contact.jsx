import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useColor } from "../contexts/ColorContext";
import { getTextColor } from "../utils/color";
import { Phone, Mail, MapPin, Linkedin } from "lucide-react";
import ContactModal from "./ContactModal";

const iconMap = {
  Phone: Phone,
  Mail: Mail,
  MapPin: MapPin,
  Linkedin: Linkedin,
};

const Contact = () => {
  const { secondaryColor, isDark } = useColor();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetch("/data/contacts.json")
      .then((response) => response.json())
      .then((data) => setContacts(data))
      .catch((error) =>
        console.error("Erreur lors du chargement des contacts :", error)
      );
  }, []);

  return (
    <section className="mb-8 relative">
      <h2
        className="text-2xl font-bold mb-6 pb-2 transition-colors duration-200"
        style={{
          borderBottom: `2px solid ${secondaryColor}`,
          color: isDark ? "white" : "black",
        }}
      >
        Contact
      </h2>

      {/* Conteneur avec blur */}
      <div className="relative">
        <motion.div
          initial={{ filter: "blur(10px)", opacity: 0.6 }}
          animate={{ filter: "blur(10px)", opacity: 0.6 }}
          className="relative"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.map((info, index) => {
              const IconComponent = iconMap[info.icon] || Mail;

              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-lg overflow-hidden relative"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.02)",
                    color: isDark ? "white" : "black",
                  }}
                >
                  <div
                    className="rounded-full p-2 shrink-0"
                    style={{ backgroundColor: secondaryColor }}
                  >
                    <IconComponent
                      color={getTextColor(secondaryColor)}
                      size={20}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {info.label}
                    </div>
                    <div className="font-medium truncate">{info.value}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Overlay avec le bouton parfaitement centré */}
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10">
          <button
            className="px-6 py-3 rounded-lg text-white font-bold transition-all duration-200 hover:scale-105 shadow-lg"
            onClick={() => setIsModalOpen(true)}
            style={{
              backgroundColor: secondaryColor,
              color: getTextColor(secondaryColor),
            }}
          >
            Cliquer pour me contacter
          </button>
        </div>
      </div>

      {/* Modale avec formulaire */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default Contact;
