import React from 'react';
import { useColor } from '../contexts/ColorContext';
import { Phone, Mail, MapPin, Globe } from 'lucide-react';

const Contact = () => {
  const { secondaryColor, isDark } = useColor();

  const contactInfo = [
    {
      icon: <Phone className="w-5 h-5" />,
      label: 'Téléphone',
      value: '+33 6 12 34 56 78',
      link: 'tel:+33612345678'
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: 'Email',
      value: 'john.doe@example.com',
      link: 'mailto:john.doe@example.com'
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Adresse',
      value: 'Paris, France',
      link: 'https://maps.google.com/?q=Paris,France'
    },
    {
      icon: <Globe className="w-5 h-5" />,
      label: 'Site Web',
      value: 'www.johndoe.com',
      link: 'https://www.johndoe.com'
    }
  ];

  return (
    <section className="mb-8">
      <h2 
        className="text-2xl font-bold mb-6 pb-2 transition-colors duration-200"
        style={{ 
          borderBottom: `2px solid ${secondaryColor}`,
          color: isDark ? 'white' : 'black'
        }}
      >
        Contact
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contactInfo.map((info, index) => (
          <a
            key={index}
            href={info.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:scale-105"
            style={{ 
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
              color: isDark ? 'white' : 'black'
            }}
          >
            <div 
              className="rounded-full p-2 transition-colors duration-200"
              style={{ backgroundColor: secondaryColor }}
            >
              {React.cloneElement(info.icon, { 
                color: 'white',
                size: 20 
              })}
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {info.label}
              </div>
              <div className="font-medium">{info.value}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Contact;