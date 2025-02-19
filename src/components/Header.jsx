import React from 'react';
import { useColor } from '../contexts/ColorContext';
import { GitHub, Linkedin, Mail } from 'lucide-react';

const Header = () => {
  const { secondaryColor, isDark } = useColor();

  return (
    <header 
      className="py-8 transition-colors duration-200"
      style={{ backgroundColor: secondaryColor }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              John Doe
            </h1>
            <h2 className="text-xl md:text-2xl text-white/90">
              Développeur Full Stack
            </h2>
          </div>
          
          <div className="flex gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/80 transition-colors"
            >
              <GitHub className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/80 transition-colors"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="mailto:john@doe.com"
              className="text-white hover:text-white/80 transition-colors"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;