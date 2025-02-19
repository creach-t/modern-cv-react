import React from 'react';
import { ColorProvider } from './contexts/ColorContext';
import ColorPicker from './components/ColorPicker';
import Header from './components/Header';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';
import { useColor } from './contexts/ColorContext';

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
              <Contact />
            </div>
            <div>
              <Experience />
              <Education />
            </div>
          </div>
        </main>
        <ColorPicker />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ColorProvider>
      <AppContent />
    </ColorProvider>
  );
};

export default App;