/**
 * Helpers pour React Helmet
 * Ce fichier fournit des fonctions pour gérer les métadonnées SEO
 */

const React = require('react');
const { Helmet } = require('react-helmet');

/**
 * Crée un composant pour les métadonnées SEO
 * @param {Object} props - Les propriétés pour les métadonnées
 * @returns {React.Component} - Composant React avec les métadonnées
 */
const createSEOComponent = (props = {}) => {
  const {
    title = 'Théo Créach - CV',
    description = 'CV de Théo Créach, développeur web full-stack',
    url = 'https://theocreach.dev',
    imagePath = '/og-image.jpg',
    keywords = 'CV, développeur, web, react, javascript, tailwind',
    language = 'fr',
    author = 'Théo Créach',
    twitterHandle = '@theocreach'
  } = props;

  const fullUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  const imageUrl = imagePath.startsWith('http') ? imagePath : `${fullUrl}${imagePath}`;

  return React.createElement(
    Helmet,
    null,
    [
      React.createElement('title', { key: 'title' }, title),
      React.createElement('html', { key: 'html', lang: language }),
      React.createElement('meta', { key: 'charset', charSet: 'utf-8' }),
      React.createElement('meta', { key: 'viewport', name: 'viewport', content: 'width=device-width, initial-scale=1' }),
      React.createElement('meta', { key: 'description', name: 'description', content: description }),
      React.createElement('meta', { key: 'keywords', name: 'keywords', content: keywords }),
      React.createElement('meta', { key: 'author', name: 'author', content: author }),
      
      // OpenGraph tags
      React.createElement('meta', { key: 'og:title', property: 'og:title', content: title }),
      React.createElement('meta', { key: 'og:description', property: 'og:description', content: description }),
      React.createElement('meta', { key: 'og:url', property: 'og:url', content: fullUrl }),
      React.createElement('meta', { key: 'og:image', property: 'og:image', content: imageUrl }),
      React.createElement('meta', { key: 'og:type', property: 'og:type', content: 'website' }),
      React.createElement('meta', { key: 'og:site_name', property: 'og:site_name', content: title }),
      
      // Twitter Card tags
      React.createElement('meta', { key: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' }),
      React.createElement('meta', { key: 'twitter:title', name: 'twitter:title', content: title }),
      React.createElement('meta', { key: 'twitter:description', name: 'twitter:description', content: description }),
      React.createElement('meta', { key: 'twitter:image', name: 'twitter:image', content: imageUrl }),
      
      // Si un compte Twitter est spécifié
      twitterHandle && React.createElement('meta', { key: 'twitter:creator', name: 'twitter:creator', content: twitterHandle }),
      twitterHandle && React.createElement('meta', { key: 'twitter:site', name: 'twitter:site', content: twitterHandle }),
      
      // Structured Data (JSON-LD) - resume/CV - Utilisé par Google
      React.createElement('script', {
        key: 'jsonld',
        type: 'application/ld+json',
        dangerouslySetInnerHTML: {
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: author,
            url: fullUrl,
            image: imageUrl,
            jobTitle: 'Développeur Web Full-Stack',
            worksFor: {
              '@type': 'Organization',
              name: 'Théo Créach'
            },
            sameAs: [
              'https://www.linkedin.com/in/theocreach',
              'https://github.com/creach-t'
            ]
          })
        }
      })
    ].filter(Boolean)
  );
};

/**
 * Méthode pour extraire les données de Helmet
 * @returns {Object} - Données extraites de Helmet
 */
const getHelmetData = () => {
  try {
    const helmet = Helmet.renderStatic();
    return {
      title: helmet.title.toString(),
      meta: helmet.meta.toString(),
      link: helmet.link.toString(),
      script: helmet.script.toString(),
      htmlAttributes: helmet.htmlAttributes.toString(),
      bodyAttributes: helmet.bodyAttributes.toString()
    };
  } catch (error) {
    console.error('Erreur lors de l\'extraction des données Helmet:', error);
    return {
      title: '',
      meta: '',
      link: '',
      script: '',
      htmlAttributes: '',
      bodyAttributes: ''
    };
  }
};

module.exports = {
  createSEOComponent,
  getHelmetData
};