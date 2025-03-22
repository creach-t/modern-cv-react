// src/services/PDFService/icons/SkillIcons.jsx

import React from 'react';
import { Image } from '@react-pdf/renderer';

/**
 * Composant pour afficher une icône de compétence depuis le dossier public
 * @param {Object} props - Propriétés du composant
 * @param {string} props.name - Nom de la compétence (correspondant au nom du fichier sans extension)
 * @param {number} props.size - Taille de l'icône (défaut: 24)
 * @returns {React.ReactElement} - Composant Image
 */
export const SkillIcon = ({ name, size = 24 }) => {
  // Construire le chemin de l'icône
  let iconPath = `/icons/${name}.svg`;
  
  // Si le nom contient déjà l'extension, ne pas l'ajouter
  if (name.endsWith('.svg')) {
    iconPath = `/icons/${name}`;
  }
  
  // Style de l'icône
  const iconStyle = {
    width: size,
    height: size,
    objectFit: 'contain'
  };
  
  return (
    <Image
      src={iconPath}
      style={iconStyle}
    />
  );
};

/**
 * Transforme le nom d'une technologie en nom de fichier d'icône
 * @param {string} technology - Nom de la technologie
 * @returns {string} - Nom du fichier d'icône le plus probable
 */
export const getTechnologyIconName = (technology) => {
  // Convertir en minuscules et supprimer les espaces
  let name = technology.toLowerCase().trim();
  
  // Mapping pour les cas spéciaux
  const specialCases = {
    'react.js': 'react-original',
    'reactjs': 'react-original',
    'node.js': 'nodejs-original',
    'nodejs': 'nodejs-original',
    'vue.js': 'vuejs-original',
    'vuejs': 'vuejs-original',
    'angular': 'angularjs-original',
    'javascript': 'javascript-original',
    'typescript': 'typescript-original',
    'html': 'html5-original',
    'html5': 'html5-original',
    'css': 'css3-original',
    'css3': 'css3-original',
    'php': 'php-original',
    'python': 'python-original',
    'java': 'java-original',
    'c#': 'csharp-original',
    'csharp': 'csharp-original',
    'golang': 'go-original',
    'ruby': 'ruby-original',
    'swift': 'swift-original',
    'kotlin': 'kotlin-original',
    'mysql': 'mysql-original',
    'postgresql': 'postgresql-original',
    'postgres': 'postgresql-original',
    'mongodb': 'mongodb-original',
    'aws': 'amazonwebservices-original-wordmark',
    'amazon': 'amazonwebservices-original-wordmark',
    'azure': 'azure-original',
    'google cloud': 'googlecloud-original',
    'gcp': 'googlecloud-original',
    'docker': 'docker-original',
    'kubernetes': 'kubernetes-plain',
    'jenkins': 'jenkins-original',
    'git': 'git-original',
    'github': 'github-original',
    'gitlab': 'gitlab-original',
    'linux': 'linux-original',
    'sass': 'sass-original',
    'redux': 'redux-original',
    'graphql': 'graphql-plain',
    'firebase': 'firebase-plain',
    'tailwind': 'tailwindcss-original',
    'tailwindcss': 'tailwindcss-original',
    'bootstrap': 'bootstrap-original',
    'express': 'express-original',
    'django': 'django-plain',
    'flask': 'flask-original',
    'laravel': 'laravel-original',
    'spring': 'spring-original',
    'next.js': 'nextjs-original',
    'nextjs': 'nextjs-original',
    'nuxt.js': 'nuxtjs-original',
    'nuxtjs': 'nuxtjs-original',
    'jest': 'jest-plain',
    'mocha': 'mocha-plain',
    'cypress': 'cypressio-original',
    'selenium': 'selenium-original',
    'figma': 'figma-original',
    'photoshop': 'photoshop-line',
    'illustrator': 'illustrator-line',
    'webpack': 'webpack-original',
    'babel': 'babel-original',
    'vscode': 'vscode-original',
    'postman': 'getpostman-icon',
    'jira': 'jira-original',
    'trello': 'trello-plain',
    'slack': 'slack-original',
    'notion': 'notion-original',
    'vercel': 'vercel-original',
    'netlify': 'netlify-original',
    'heroku': 'heroku-original',
    'digital ocean': 'digitalocean-original',
    'nginx': 'nginx-original',
    'apache': 'apache-original',
    'redis': 'redis-original',
    'ansible': 'ansible-original',
    'terraform': 'terraform-original',
    'circleci': 'circleci-plain',
    'travis': 'travis-plain',
    'material ui': 'materialui-original',
    'mui': 'materialui-original',
    'materialui': 'materialui-original',
    'dotnet': 'dot-net-original',
    '.net': 'dot-net-original',
    'ejs': 'ejs',
    'sequelize': 'sequelize-original'
  };
  
  // Vérifier si nous avons un mapping spécial pour cette technologie
  if (specialCases[name]) {
    return specialCases[name];
  }
  
  // Sinon, essayer de former un nom de fichier standard
  return `${name}-original`;
};

export default {
  SkillIcon,
  getTechnologyIconName
};
