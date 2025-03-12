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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Skills />
              <Project />
            </div>
            <div>
              <Experience />
              <Education />
              <Contact />
            </div>
          </div>
        </main>
        <SettingPanel />
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