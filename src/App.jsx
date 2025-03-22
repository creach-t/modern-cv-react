import React from 'react';
import { ColorProvider } from './contexts/ColorContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ContactModalProvider } from './contexts/ContactModalContext';
import SettingPanel from './components/SettingsPanel';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Skills from './components/sections/Skills';
import Experience from './components/sections/Experience';
import Education from './components/sections/Education';
import Contact from './components/contact/Contact';
import { useColor } from './contexts/ColorContext';
import Project from './components/sections/Project';
import SoftSkills from './components/sections/SoftSkills';

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
        <Footer />
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