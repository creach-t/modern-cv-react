import React from 'react';
import { Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="container mx-auto px-4 py-4 text-center">
      <a 
        href="https://github.com/creach-t/modern-cv-react" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-block text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 opacity-50 hover:opacity-100 transition-all duration-200"
        aria-label="Lien vers le dépôt GitHub"
      >
        <Github size={24} />
      </a>
    </footer>
  );
};

export default Footer;