import React from 'react';
import { Code2, Briefcase, GraduationCap, Languages } from 'lucide-react';

const ModernCV = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      {/* Header Section with Modern Design */}
      <header className="bg-slate-900 text-white p-8 rounded-lg shadow-xl mb-8">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
              THÉO CRÉAC'H
            </h1>
            <h2 className="text-2xl font-light">Développeur Web Fullstack JavaScript</h2>
            <div className="flex gap-4 text-slate-300 text-sm">
              <a href="mailto:CREACH.T@GMAIL.COM" className="hover:text-blue-400 transition-colors">
                CREACH.T@GMAIL.COM
              </a>
              <span>•</span>
              <span>06 84 68 13 01</span>
              <span>•</span>
              <span>SAINT-MAUR-DES-FOSSÉS</span>
            </div>
            <div className="flex gap-4 text-sm">
              <a href="https://CREACH-T.GITHUB.IO" className="text-blue-400 hover:text-blue-300 transition-colors">
                GitHub
              </a>
              <a href="https://LINKEDIN.COM/IN/CREACHTHEO" className="text-blue-400 hover:text-blue-300 transition-colors">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </header>
      <div className="grid grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="col-span-2 space-y-8">
          {/* Expérience Projet et Professionnelle */}
          <section className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-6">
              <Briefcase className="text-blue-500" />
              Projet de formation & Expérience
            </h3>
            
            <div className="space-y-6">
              <div className="relative pl-4 border-l-2 border-blue-500">
                <h4 className="text-lg font-semibold text-slate-800">O'clock - Projet de fin de formation</h4>
                <p className="text-sm text-slate-500">2024</p>
                <div className="mt-2 text-slate-600">
                  <strong>ZombieLand</strong> - Application de gestion de parc d'attractions
                  <ul className="mt-1">
                    <li>• Développement frontend TypeScript/React avec carte interactive</li>
                    <li>• Backend Node.js/Express & PostgreSQL, authentification JWT</li>
                    <li>• Fonctionnalités: messagerie, réservations, commentaires, back-office admin</li>
                  </ul>
                </div>
              </div>
              <div className="relative pl-4 border-l-2 border-blue-500">
                <h4 className="text-lg font-semibold text-slate-800">Projets Personnels</h4>
                <p className="text-sm text-slate-500">2024 - 2025</p>
                <ul className="mt-2 space-y-3 text-slate-600">
                  <li>
                    <strong>O'Coffee</strong> - E-commerce avec React et Node.js, système de paiement intégré, gestion des commandes et back-office admin
                  </li>
                  <li>
                    <strong>CultBrawl</strong> - Jeu de combat en ligne avec full-stack JavaScript, backend sécurisé et streaming temps réel
                  </li>
                  <li>
                    <strong>Top Réparateurs</strong> - React et Google Maps API, géolocalisation et analyse des avis pour localiser les meilleurs réparateurs
                  </li>
                </ul>
              </div>
              <div className="relative pl-4 border-l-2 border-blue-500">
                <h4 className="text-lg font-semibold text-slate-800">Stage</h4>
                <p className="text-sm text-slate-500">Sept - Nov 2024</p>
                <ul className="mt-2 space-y-2 text-slate-600">
                  <li>• Développement de composants React et React Native</li>
                  <li>• Refactorisation et optimisation du code existant</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
        {/* Sidebar */}
        <div className="space-y-8">
          {/* Technical Skills */}
          <section className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-6">
              <Code2 className="text-blue-500" />
              Technologies
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-md font-semibold text-slate-700">Spécialités</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Express'].map(skill => (
                    <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-md font-semibold text-slate-700">Frontend</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['React Native', 'Redux', 'Tailwind', 'HTML/CSS'].map(skill => (
                    <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-md font-semibold text-slate-700">Backend & Base de données</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['API REST', 'JWT', 'MongoDB', 'Sequelize'].map(skill => (
                    <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-md font-semibold text-slate-700">Outils & Pratiques</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Git', 'SCRUM', 'Tests Unitaires', 'CI/CD'].map(skill => (
                    <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
          {/* Languages */}
          <section className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-6">
              <Languages className="text-blue-500" />
              Langues et Plus
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-md font-semibold text-slate-700">Langues</h4>
                <p className="text-slate-600 mt-1">Anglais (Niveau B2)</p>
              </div>
              <div>
                <h4 className="text-md font-semibold text-slate-700">Centres d'intérêt</h4>
                <ul className="mt-1 space-y-1 text-slate-600">
                  <li>• Travail du bois et bricolage</li>
                  <li>• Électronique et graphisme</li>
                  <li>• Veille technologique</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ModernCV;