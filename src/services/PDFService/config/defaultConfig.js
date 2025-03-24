// src/services/PDFService/config/defaultConfig.js

/**
 * Configuration par défaut pour le CV PDF
 * Ce fichier centralise toute la configuration de style et de structure
 */

const defaultConfig = {
  // Configuration générale du document
  document: {
    size: 'A4',
    padding: 12,
    footer: {
      enabled: false,
      position: 'bottom',
      fontSize: 8,
      color: '#666666'
    }
  },
  
  // Configuration du layout (disposition)
  layout: {
    type: 'multi-column', // 'single-column', 'multi-column', 'grid'
    columns: [
      {
        width: '28%',
        sections: ['skills', 'softSkills']
      },
      {
        width: '72%',
        sections: ['experience', 'education', 'projects']
      }
    ],
    commonSections: ['header'], // Sections qui s'étalent sur toutes les colonnes
    spaceBetweenColumns: 8
  },
  
  // Thème global
  theme: {
    colors: {
      primary: '#000000',
      secondary: '#0077cc', // Couleur d'accent principale
      text: {
        primary: '#000000',
        secondary: '#666666',
        light: '#999999'
      },
      background: {
        page: '#ffffff',
        header: '#f5f5f5',
        leftColumn: '#f8f8f8',
        rightColumn: '#ffffff'
      }
    },
    fonts: {
      primary: 'Roboto',
      secondary: 'Roboto',
      heading: 'Roboto',
      sizes: {
        sectionTitle: 14,
        name: 20,
        title: 11,
        subTitle: 10,
        companyName: 10,
        jobTitle: 9,
        normal: 9,
        small: 8,
        smaller: 7,
        smallest: 6
      }
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: 700,
      color: '#000000', // Peut être remplacé par 'primary' dans le rendu
      textAlign: 'center',
      padding: 2,
      marginBottom: 4,
      uppercase: true,
      letterSpacing: 1,
      borderBottom: true,
      borderBottomWidth: 1,
      borderBottomColor: '#0077cc', // Peut être remplacé par 'secondary' dans le rendu
      paddingBottom: 3,
      marginBottom: 5
    },
    density: {
      compact: 5,
      normal: 10,
      spacious: 20
    }
  },
  
  // Configuration des sections individuelles
  sections: {
    header: {
      visible: true,
      order: 0,
      style: {
        padding: 10,
        backgroundColor: '#f5f5f5'
      },
      // Styles spécifiques au header
      name: {
        fontSize: 18, 
        fontWeight: 'bold',
        marginBottom: 4,
        color: 'auto' // 'auto' utilisera la valeur déterminée à partir de la couleur de fond
      },
      title: {
        fontSize: 12,
        color: 'auto',
        highlight: {
          color: '#0077cc', // Peut être remplacé par 'secondary' dans le rendu
          fontWeight: 'bold'
        }
      },
      profile: {
        size: 70,
        borderWidth: 2,
        borderColor: '#0077cc', // Peut être remplacé par 'secondary' dans le rendu
        margin: 2
      },
      contact: {
        itemSpacing: 4,
        iconSize: 14,
        iconMargin: 6,
        textSize: 9,
        color: 'auto' // 'auto' utilisera la valeur déterminée à partir de la couleur de fond
      },
      options: {
        showProfilePicture: true,
        showContacts: true,
        useFullSecondaryColor: false, // Utiliser la couleur secondaire pleine (sans transparence)
        contactItemStyle: 'flat', // 'pill', 'flat', 'underline'
      }
    },
    skills: {
      visible: true,
      order: 1,
      style: {
        backgroundColor: '#f8f8f8',
        padding: 8,
        marginBottom: 15,
        borderRadius: 4
      },
      category: {
        fontSize: 10,
        fontWeight: 500,
        marginBottom: 5,
        backgroundColor: '#f0f0f0',
        backgroundOpacity: '15%', // Peut être combiné avec la couleur secondaire
        padding: 3,
        borderRadius: 3
      },
      item: {
        fontSize: 9,
        marginBottom: 4,
        marginLeft: 5
      },
      icon: {
        size: 16,
        margin: 5
      },
      options: {
        groupByCategory: true,
        showCategoryTitles: true,
        showIcons: true, // Afficher les icônes des compétences
        iconPosition: 'left', // Position des icônes ('left', 'right')
        density: 'normal' // 'compact', 'normal', 'spacious'
      }
    },
    softSkills: {
      visible: true,
      order: 2,
      style: {
        backgroundColor: '#f9f9f9',
        padding: 8,
        marginBottom: 15,
        borderRadius: 4
      },
      item: {
        marginBottom: 10, // Sera remplacé par la valeur de densité
        padding: 3,
        borderLeft: '2pt solid #e0e0e0',
        borderLeftColor: '#0077cc', // Peut être remplacé par 'secondary' dans le rendu
        borderLeftOpacity: '50%'
      },
      title: {
        fontSize: 10,
        fontWeight: 500
      },
      description: {
        fontSize: 9
      },
      options: {
        showDescription: true,
        density: 'normal'
      }
    },
    projects: {
      visible: true,
      order: 3,
      style: {
        backgroundColor: '#f7f7f7',
        padding: 8,
        marginBottom: 15,
        borderRadius: 4
      },
      item: {
        marginBottom: 10, // Sera remplacé par la valeur de densité
        padding: 4,
        border: '1pt solid #eeeeee',
        borderColor: '#0077cc', // Peut être remplacé par 'secondary' dans le rendu
        borderOpacity: '30%',
        borderRadius: 3
      },
      title: {
        fontSize: 11,
        fontWeight: 500
      },
      description: {
        fontSize: 9,
        marginTop: 2
      },
      technology: {
        fontSize: 8,
        backgroundColor: '#eaeaea',
        padding: '2 4',
        borderRadius: 2,
        marginRight: 4,
        marginTop: 3
      },
      options: {
        showDescription: true,
        showTechnologies: true,
        maxProjects: null, // null = all
        density: 'normal'
      }
    },
    experience: {
      visible: true,
      order: 4,
      style: {
        backgroundColor: '#fcfcfc',
        padding: 4, // Ajusté pour le format en 2 colonnes
        marginBottom: 15,
        borderRadius: 4,
        borderLeft: '3pt solid #e0e0e0'
      },
      item: {
        marginBottom: 3,
        border: '0.5pt solid #e0e0e0',
        borderRadius: 3,
        padding: 3,
        backgroundColor: 'white'
      },
      company: {
        fontSize: 9,
        fontWeight: 700,
        color: '#0077cc' // Peut être remplacé par 'secondary' dans le rendu
      },
      jobTitle: {
        fontSize: 8,
        fontWeight: 600,
        marginBottom: 2,
        color: '#444444'
      },
      period: {
        fontSize: 8,
        fontStyle: 'normal',
        backgroundColor: '#f0f0f0',
        backgroundOpacity: '15%', // Peut être combiné avec la couleur secondaire
        padding: 3,
        borderRadius: 2
      },
      explanation: {
        fontSize: 7,
        lineHeight: 1.2,
        color: '#555555'
      },
      detail: {
        fontSize: 6.5,
        lineHeight: 1.2,
        marginBottom: 1
      },
      technical: {
        marginTop: 2,
        borderTop: '0.5pt dotted #e0e0e0',
        paddingTop: 2
      },
      techLabel: {
        fontSize: 6,
        fontWeight: 600,
        color: '#555555',
        marginBottom: 1
      },
      technology: {
        fontSize: 6,
        backgroundColor: '#f0f0f0',
        backgroundOpacity: '15%', // Peut être combiné avec la couleur secondaire
        padding: '1 3',
        borderRadius: 2,
        marginRight: 3,
        marginBottom: 2
      },
      options: {
        showCompanyName: true,
        showJobTitle: true,
        showPeriod: true,
        showExplanation: true,
        showDetails: true,
        showTechnologies: true,
        showTools: true,
        twoColumns: true, // Afficher les expériences sur 2 colonnes
        density: 'normal'
      }
    },
    education: {
      visible: true,
      order: 5,
      style: {
        backgroundColor: '#fafafa',
        padding: 8,
        marginBottom: 15,
        borderRadius: 4,
        borderLeft: '3pt solid #e8e8e8'
      },
      item: {
        marginBottom: 10, // Sera remplacé par la valeur de densité
        padding: 5
      },
      schoolName: {
        fontSize: 11,
        fontWeight: 500
      },
      degree: {
        fontSize: 9,
        fontStyle: 'italic'
      },
      period: {
        fontSize: 8,
        fontStyle: 'normal',
        backgroundColor: '#f0f0f0',
        backgroundOpacity: '15%', // Peut être combiné avec la couleur secondaire
        padding: 3,
        borderRadius: 2
      },
      location: {
        fontSize: 8,
        color: '#555555'
      },
      options: {
        showSchoolName: true,
        showDegree: true,
        showPeriod: true,
        showLocation: true,
        density: 'normal'
      }
    }
  },
  
  // Configuration des icônes de contact
  contactIcons: {
    email: {
      type: 'material', // 'material', 'custom'
      name: 'email',
      color: '#0077cc', // Par défaut, utilisera la couleur secondaire
    },
    phone: {
      type: 'material',
      name: 'phone',
      color: '#0077cc',
    },
    website: {
      type: 'material',
      name: 'language',
      color: '#0077cc',
    },
    linkedin: {
      type: 'material',
      name: 'linkedin',
      color: '#0077cc',
    },
    github: {
      type: 'material',
      name: 'code',
      color: '#0077cc',
    },
    location: {
      type: 'material',
      name: 'location_on',
      color: '#0077cc',
    },
    // Vous pouvez ajouter d'autres types de contact ici
  }
};

export default defaultConfig;