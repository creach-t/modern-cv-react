// src/services/PDFService/icons/SkillIcons.jsx

import React from 'react';
import { Image, Svg, Path, G } from '@react-pdf/renderer';

/**
 * Composant pour afficher une icône SVG simple
 * @param {Object} props - Propriétés du composant
 * @param {string} props.name - Nom de la compétence
 * @param {number} props.size - Taille de l'icône (défaut: 24)
 * @returns {React.ReactElement} - Composant SVG
 */
export const SkillIcon = ({ name, size = 24, color = '#000000' }) => {
  // Style de l'icône
  const iconStyle = {
    width: size,
    height: size,
    objectFit: 'contain'
  };
  
  // Utiliser une icône SVG simple par défaut
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={iconStyle}>
      <Path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-10.5l6 3.5-6 3.5v-7z"
        fill={color}
      />
    </Svg>
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
    'react.js': 'react',
    'reactjs': 'react',
    'node.js': 'nodejs',
    'nodejs': 'nodejs',
    'vue.js': 'vuejs',
    'vuejs': 'vuejs',
    'angular': 'angular',
    'javascript': 'javascript',
    'typescript': 'typescript',
    'html': 'html5',
    'html5': 'html5',
    'css': 'css3',
    'css3': 'css3',
    'php': 'php',
    'python': 'python',
    'java': 'java',
    'c#': 'csharp',
    'csharp': 'csharp',
    'golang': 'go',
    'ruby': 'ruby',
    'swift': 'swift',
    'kotlin': 'kotlin',
    'mysql': 'mysql',
    'postgresql': 'postgresql',
    'postgres': 'postgresql',
    'mongodb': 'mongodb',
    'aws': 'aws',
    'amazon': 'aws',
    'azure': 'azure',
    'google cloud': 'gcp',
    'gcp': 'gcp',
    'docker': 'docker',
    'kubernetes': 'kubernetes',
    'jenkins': 'jenkins',
    'git': 'git',
    'github': 'github',
    'gitlab': 'gitlab',
    'linux': 'linux',
    'sass': 'sass',
    'redux': 'redux',
    'graphql': 'graphql',
    'firebase': 'firebase',
    'tailwind': 'tailwindcss',
    'tailwindcss': 'tailwindcss',
    'bootstrap': 'bootstrap',
    'express': 'express',
    'django': 'django',
    'flask': 'flask',
    'laravel': 'laravel',
    'spring': 'spring',
    'next.js': 'nextjs',
    'nextjs': 'nextjs',
    'nuxt.js': 'nuxtjs',
    'nuxtjs': 'nuxtjs',
    'jest': 'jest',
    'mocha': 'mocha',
    'cypress': 'cypress',
    'selenium': 'selenium',
    'figma': 'figma',
    'photoshop': 'photoshop',
    'illustrator': 'illustrator',
    'webpack': 'webpack',
    'babel': 'babel',
    'vscode': 'vscode',
    'postman': 'postman',
    'jira': 'jira',
    'trello': 'trello',
    'slack': 'slack',
    'notion': 'notion',
    'vercel': 'vercel',
    'netlify': 'netlify',
    'heroku': 'heroku',
    'digital ocean': 'digitalocean',
    'nginx': 'nginx',
    'apache': 'apache',
    'redis': 'redis',
    'ansible': 'ansible',
    'terraform': 'terraform',
    'circleci': 'circleci',
    'travis': 'travis',
    'material ui': 'materialui',
    'mui': 'materialui',
    'materialui': 'materialui',
    'dotnet': 'dotnet',
    '.net': 'dotnet',
    'ejs': 'ejs',
    'sequelize': 'sequelize'
  };
  
  // Vérifier si nous avons un mapping spécial pour cette technologie
  if (specialCases[name]) {
    return specialCases[name];
  }
  
  // Sinon, retourner le nom normalisé
  return name;
};

/**
 * Composant qui retourne une icône de compétence colorée
 * @param {Object} props - Propriétés du composant
 * @param {string} props.name - Nom de la compétence
 * @param {number} props.size - Taille de l'icône
 * @param {string} props.color - Couleur de l'icône
 * @returns {React.ReactElement} - Composant SVG
 */
export const SkillIconColored = ({ name, size = 20, color = '#4A90E2' }) => {
  // Normaliser le nom pour obtenir un identifiant cohérent
  const normalizedName = getTechnologyIconName(name);
  
  // Des icônes simplifiées pour les technologies les plus courantes
  const iconMap = {
    // Front-end
    "javascript": (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M3,3h18v18H3V3z" fill="#F7DF1E" />
        <Path d="M12,17.5c1.2,0,2-0.4,2.6-1.4l1.4,0.8c-0.9,1.5-2.1,2.1-4,2.1c-2.8,0-4.5-1.8-4.5-4.5 c0-2.7,1.7-4.5,4.4-4.5c1.9,0,3.2,0.7,4,2.1l-1.4,0.8c-0.6-1-1.3-1.4-2.5-1.4c-1.6,0-2.6,1.1-2.6,3c0,1.9,1,3,2.6,3z" fill="#000000" />
      </Svg>
    ),
    "react": (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M12,10.6c-0.7,0-1.3,0.6-1.3,1.3c0,0.7,0.6,1.3,1.3,1.3s1.3-0.6,1.3-1.3C13.3,11.2,12.7,10.6,12,10.6z" fill={color} />
        <Path d="M12,4.7c-5,0-9.3,1.9-9.3,3.8c0,1.9,4.2,3.8,9.3,3.8s9.3-1.9,9.3-3.8C21.3,6.6,17,4.7,12,4.7z M12,10.9 c-1.3,0-2.4-1.1-2.4-2.4c0-1.3,1.1-2.4,2.4-2.4s2.4,1.1,2.4,2.4C14.4,9.8,13.3,10.9,12,10.9z" fill={color} />
        <Path d="M12,14.3c-5,0-9.3-1.9-9.3-3.8v4c0,1.9,4.2,3.8,9.3,3.8s9.3-1.9,9.3-3.8v-4C21.3,12.5,17,14.3,12,14.3z" fill={color} />
        <Path d="M12,20.3c-5,0-9.3-1.9-9.3-3.8v4c0,1.9,4.2,3.8,9.3,3.8s9.3-1.9,9.3-3.8v-4C21.3,18.5,17,20.3,12,20.3z" fill={color} />
      </Svg>
    ),
    "nodejs": (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M12,2L3,7v10l9,5l9-5V7L12,2z M12,4.1l6.5,3.6v8.6L12,19.9l-6.5-3.6V7.7L12,4.1z" fill={color} />
        <Path d="M12,7c-2.8,0-5,2.2-5,5c0,2.8,2.2,5,5,5c2.8,0,5-2.2,5-5C17,9.2,14.8,7,12,7z M12,15c-1.7,0-3-1.3-3-3 s1.3-3,3-3s3,1.3,3,3S13.7,15,12,15z" fill={color} />
      </Svg>
    ),
    "html5": (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M3,2l1.5,17L12,21l7.5-2L21,2H3z" fill="#E44D26" />
        <Path d="M17.5,9H8.5l0.3,2h8.5l-0.5,6l-4.8,1.5l-4.8-1.5L7,13h2l0.2,1.7l2.8,0.8l2.8-0.8L15,12H7l-0.5-6h11l-0.2,3 H17.5z" fill="#FFFFFF" />
      </Svg>
    ),
    "css3": (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M3,2l1.5,17L12,21l7.5-2L21,2H3z" fill="#1572B6" />
        <Path d="M17.7,8L17.5,10.5L15,11h-3l-0.2,2h3.2l-0.3,3.5L12,17l-2.8-0.5L9,13.5h2l0.2,1.5l0.8,0.2L13,15l0.2-2H9L8.5,8 H17.7z" fill="#FFFFFF" />
      </Svg>
    ),
    "typescript": (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M3,3v18h18V3H3z" fill="#3178C6" />
        <Path d="M11.6,16v-2.2H7.5V12h10v1.8h-4.1V16H11.6z M14.9,10c0.8,0,1.4-0.2,1.8-0.5c0.4-0.3,0.6-0.7,0.6-1.2 c0-0.5-0.2-0.9-0.6-1.2c-0.4-0.3-1-0.5-1.8-0.5H9.2v6.5h2.3V10H14.9z" fill="#FFFFFF" />
      </Svg>
    ),
    // Bases de données
    "mongodb": (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M12,2.5c-1.6,0.6-6,2.6-6,11.5c0,8.4,5.1,7.8,6,7.5c0.3,0.5,0.5,1,0.6,1.5c0.1-0.6,0.3-1.1,0.6-1.5 c0.9,0.3,6,1,6-7.5C19.2,5.1,13.6,3.1,12,2.5z" fill="#47A248" />
        <Path d="M12,4.5c0,0-0.3,3.5,0,7c0.2,3.5,1.2,7.5,1.2,7.5S11.8,21,12,19c0.2,2,1.2,0,1.2,0S12.2,15,12,11.5 c-0.3-3.5,0-7,0-7" fill="#FFFFFF" />
      </Svg>
    ),
    "mysql": (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M6.2,5c-0.1,0-0.2,0.2-0.3,0.2C5.7,5.3,5.7,5.5,5.5,5.6C5.4,5.8,5.3,6,5.1,6.1C4.9,6.3,4.8,6.5,4.7,6.6 c-0.1,0.1-0.2,0.2-0.3,0.4C4.3,7.1,4.2,7.2,4.1,7.3C4,7.4,3.8,7.4,3.7,7.5v0.1c0.1,0,0.1,0.1,0.2,0.1c0.1,0.1,0.1,0.2,0.2,0.2 c0.1,0.1,0.2,0.1,0.3,0.2c0.2,0.1,0.4,0.1,0.6,0c0.1,0,0.1-0.1,0.2-0.1c0.1-0.1,0.1-0.2,0.1-0.3c0-0.1,0-0.2,0.1-0.3 c0.1-0.3,0.1-0.6,0.2-0.9c0-0.1,0.1-0.2,0.2-0.3c0.1-0.1,0.3-0.1,0.4-0.2c0.1,0,0.2-0.1,0.2-0.2c0-0.1,0-0.1-0.1-0.2 C6.4,5.6,6.3,5.5,6.2,5z" fill="#00758F" />
        <Path d="M19,9.5c-1,0-2,0.3-2.9,0.7c-0.2,0.1-0.6,0.1-0.6,0.4c0.1,0.1,0.1,0.3,0.2,0.4c0.2,0.3,0.4,0.6,0.7,0.9 c0.2,0.2,0.3,0.4,0.6,0.6c0.3,0.2,0.7,0.3,1,0.5c0.2,0.1,0.4,0.2,0.6,0.3c0.1,0.1,0.2,0.2,0.3,0.3c0,0.1,0,0.2,0,0.2 c-0.1,0.2-0.2,0.4-0.3,0.5c-0.3,0.3-0.6,0.6-1,0.8c-0.2,0.1-0.5,0.2-0.7,0.3c-0.1,0-0.3,0-0.3,0.1c0.1,0.1,0.1,0.2,0.2,0.3 c0.1,0.3,0.4,0.5,0.6,0.7c0.2,0.1,0.4,0.2,0.6,0.3c0.4,0.1,0.8,0.1,1.2,0.1c0.2,0,0.4,0,0.6,0c0.1-0.1,0.3-0.2,0.4-0.3 c0.1-0.3,0.3-0.6,0.3-1c0-0.2,0-0.3-0.1-0.5c-0.1-0.2-0.2-0.3-0.3-0.5c-0.2-0.2-0.5-0.4-0.7-0.6c-0.2-0.1-0.5-0.3-0.7-0.4 c-0.1-0.1-0.2-0.1-0.3-0.2c-0.1-0.1-0.3-0.3-0.2-0.4c0-0.1,0.1-0.1,0.2-0.1c0.2-0.1,0.4-0.1,0.6-0.2c0.3-0.1,0.6-0.1,0.8-0.3 c0.1-0.1,0.3-0.2,0.4-0.3c0.2-0.2,0.3-0.5,0.3-0.8c0-0.2-0.1-0.3-0.2-0.4C19.9,9.7,19.4,9.5,19,9.5z" fill="#00758F" />
        <Path d="M12.2,9.5c-0.2,0-0.4,0-0.5,0.1c-0.1,0-0.2,0.1-0.3,0.2v6.5c0.1,0,0.2,0.1,0.3,0.1c0.1,0,0.3,0,0.4,0 c0.2,0,0.5-0.1,0.7-0.1c0.2-0.1,0.4-0.2,0.6-0.3c0.2-0.1,0.3-0.3,0.4-0.5c0.1-0.2,0.2-0.5,0.2-0.7c0-0.1,0-0.3,0-0.4 c0-0.1-0.1-0.2-0.1-0.3c-0.1-0.3-0.3-0.5-0.7-0.7c0.2-0.1,0.4-0.2,0.5-0.4c0.2-0.2,0.3-0.5,0.3-0.8c0-0.4-0.2-0.7-0.5-0.9 C13.2,9.6,12.7,9.5,12.2,9.5z" fill="#F29111" />
      </Svg>
    ),
    // Autres
    "git": (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M21.8,12l-9.8-9.8c-0.5-0.5-1.4-0.5-1.9,0L8.5,3.8l2.4,2.4C11,6.1,11.1,6,11.3,6c0.6,0,1.1,0.5,1.1,1.1 c0,0.6-0.5,1.1-1.1,1.1c-0.6,0-1.1-0.5-1.1-1.1c0-0.1,0-0.2,0.1-0.3L8.1,4.7L2.2,10.6c-0.5,0.5-0.5,1.4,0,1.9l9.8,9.8 c0.5,0.5,1.4,0.5,1.9,0l7.9-7.9C22.3,13.4,22.3,12.5,21.8,12z" fill="#F05133" />
      </Svg>
    ),
    "docker": (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M13,8h2v2h-2V8z M9,6h2v2H9V6z M13,6h2v2h-2V6z M9,8h2v2H9V8z M5,10h2v2H5V10z M5,6h2v2H5V6z M5,8h2v2H5V8z M9,10h2v2H9V10z M17,10h2v2h-2V10z" fill="#2496ED" />
        <Path d="M19.8,12.3c-0.3-0.2-1-0.5-1.8-0.5c-0.3,0-0.6,0-0.9,0.1c-0.1-0.9-0.5-1.7-1.1-2.2l-0.4-0.3L15.3,10 c-0.1,0.6-0.1,1.1,0.1,1.6c0.1,0.3,0.3,0.6,0.5,0.8c-0.2,0.1-0.5,0.2-0.9,0.3C13.4,13,11.6,13,10,13h-0.8c-0.5,1.4-0.4,3,0.3,4.4 c0.5,1,1.4,1.8,2.4,2.3c1.2,0.5,2.5,0.8,3.8,0.8c0.8,0,1.6-0.1,2.4-0.2c1.1-0.2,2.2-0.6,3.1-1.2c0.8-0.5,1.4-1.2,1.9-2 c0.9-1.6,1.4-3.3,1.6-5.1C23.1,11.4,21.9,13.3,19.8,12.3z" fill="#2496ED" />
      </Svg>
    ),
    "python": (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M12,2C9.2,2,8.5,3.2,8.5,4.5v1.8H12v0.5H6.4C5.1,6.8,4,7.7,4,10c0,2.3,0.8,3,2,4c1.2,1,2.5,0.9,2.5,0.9 h1.5V13c0-1.1,1-2.2,2-2.2h3.5c0,0,2,0.1,2-2.8s-0.9-3.8-3-3.8c-2.1,0-2.5-0.2-2.5-0.2V3C12,2,12,2,12,2z M9.5,3.8 c0.3,0,0.5,0.2,0.5,0.5S9.8,4.8,9.5,4.8S9,4.6,9,4.2S9.2,3.8,9.5,3.8z" fill="#366C9C" />
        <Path d="M12,22c2.8,0,3.5-1.2,3.5-2.5v-1.8H12v-0.5h5.6c1.3,0,2.4-0.9,2.4-3.2c0-2.3-0.8-3-2-4c-1.2-1-2.5-0.9-2.5-0.9 h-1.5v1.8c0,1.1-1,2.2-2,2.2H8.5c0,0-2-0.1-2,2.8s0.9,3.8,3,3.8c2.1,0,2.5,0.2,2.5,0.2V21C12,22,12,22,12,22z M14.5,20.2 c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5S14.8,20.2,14.5,20.2z" fill="#FEC211" />
      </Svg>
    ),
    // Utiliser une icône générique pour tous les autres
    "default": (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-10.5l6 3.5-6 3.5v-7z"
          fill={color}
        />
      </Svg>
    )
  };

  // Retourner l'icône correspondante ou l'icône par défaut
  return iconMap[normalizedName] || iconMap["default"];
};

export default {
  SkillIcon,
  SkillIconColored,
  getTechnologyIconName
};