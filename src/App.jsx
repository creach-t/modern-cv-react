import React from 'react';
import { Helmet } from 'react-helmet';
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
  const { isDark, secondaryColor } = useColor();

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <Helmet>
        <title>Théo Créac'h - CV | Développeur Full Stack JavaScript</title>
        <meta name="description" content="CV moderne et interactif de Théo Créac'h, développeur Full Stack JavaScript spécialisé en React et Node.js." />
        <meta name="keywords" content="développeur, javascript, react, node.js, full stack, CV, portfolio" />
        <meta property="og:title" content="Théo Créac'h - CV | Développeur Full Stack JavaScript" />
        <meta property="og:description" content="CV moderne et interactif de Théo Créac'h, développeur Full Stack JavaScript spécialisé en React et Node.js." />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content={secondaryColor} />
      </Helmet>
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

const App = ({ initialState }) => {
  // Préparer les valeurs initiales à partir des props ou utiliser les valeurs par défaut
  const initialLanguage = initialState?.language || 'fr';
  const initialDarkMode = initialState?.theme?.isDark ?? true;
  const initialColor = initialState?.theme?.secondaryColor || '#6667AB';

  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      <ColorProvider initialDarkMode={initialDarkMode} initialColor={initialColor}>
        <ContactModalProvider>
          <AppContent />
        </ContactModalProvider>
      </ColorProvider>
    </LanguageProvider>
  );
};

export default App;
