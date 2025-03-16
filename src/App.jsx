import React from 'react';
import { ColorProvider } from './contexts/ColorContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ContactModalProvider } from './contexts/ContactModalContext';
import SettingPanel from './components/SettingsPanel';
import Header from './components/Header';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';
import { useColor } from './contexts/ColorContext';
import Project from './components/Project';

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
      </div>
    </div>
  );
};

// Mettre à jour App pour recevoir et utiliser initialState
const App = ({ initialState }) => {
  // Valeurs par défaut si initialState n'est pas fourni
  const defaultInitialState = {
    language: 'fr',
    theme: {
      isDark: true,
      secondaryColor: '#6667AB'
    }
  };

  // Fusionner avec les valeurs par défaut si initialState est undefined
  const state = initialState || defaultInitialState;

  return (
    <LanguageProvider initialLanguage={state.language}>
      <ColorProvider 
        initialIsDark={state.theme?.isDark} 
        initialSecondaryColor={state.theme?.secondaryColor}
      >
        <ContactModalProvider>
          <AppContent />
        </ContactModalProvider>
      </ColorProvider>
    </LanguageProvider>
  );
};

export default App;