import React from 'react';
import { ColorProvider } from './contexts/ColorContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ContactModalProvider } from './contexts/ContactModalContext';
import { Github } from 'lucide-react';
import SettingPanel from './components/SettingsPanel';
import Header from './components/Header';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';
import { useColor } from './contexts/ColorContext';
import Project from './components/Project';
import SoftSkills from './components/SoftSkills';

const AppContent = () => {
  const { isDark } = useColor();
  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 transition-colors duration-200">
        <Header />
        <main className="container mx-auto px-4 py-8">
          {/* Utilisation de l'ordre flexible avec les classes order de Tailwind */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Skills />
              <SoftSkills />
              <Project />
              {/* Contact en desktop affiché en dessous de Project dans la première colonne */}
              <div className="hidden md:block">
                <Contact />
              </div>
            </div>
            <div>
              <Experience />
              <Education />
            </div>
          </div>
          
          {/* Contact en version mobile affiché en dernier */}
          <div className="md:hidden mt-8">
            <Contact />
          </div>
        </main>
        <SettingPanel />
        
        {/* Lien GitHub discret en bas de page */}
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
      </div>
    </div>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <ColorProvider>
        <ContactModalProvider>
          <AppContent />
        </ContactModalProvider>
      </ColorProvider>
    </LanguageProvider>
  );
};

export default App;