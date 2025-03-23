// src/services/PDFService/config/defaultConfig.js

/**
 * Configuration par défaut pour le CV PDF
 * Ce fichier définit la structure et les paramètres par défaut
 */

const defaultConfig = {
    // Configuration générale du document
    document: {
      size: 'A4',
      padding: 30,
      footer: {
        enabled: true,
        position: 'bottom',
        fontSize: 8,
        color: 'grey'
      }
    },
    
    // Configuration du layout (disposition)
    layout: {
      type: 'multi-column', // 'single-column', 'multi-column', 'grid'
      columns: [
        {
          width: '30%',
          sections: ['skills', 'softSkills', 'projects']
        },
        {
          width: '70%',
          sections: ['experience', 'education']
        }
      ],
      commonSections: ['header'], // Sections qui s'étalent sur toutes les colonnes
      spaceBetweenColumns: 15
    },
    
    // Configuration des sections individuelles
    sections: {
      header: {
        visible: true,
        order: 0,
        style: {
          padding: 5,
          backgroundColor: '#f5f5f5'
        },
        options: {
          showProfilePicture: true,
          showContacts: true,
          profilePictureSize: 60,
          profilePictureBorderWidth: 3,
          profilePictureBorderColor: 'white',
          useFullSecondaryColor: true, // Utiliser la couleur secondaire pleine (sans transparence)
          contactItemStyle: 'flat', // 'pill', 'flat', 'underline'
          contactIconSize: 16,
          contactTextColor: 'auto', // 'auto', 'white', 'black', or any color code
          contactItemPadding: 5
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
        options: {
          groupByCategory: true,
          showCategoryTitles: true,
          showIcons: true, // Afficher les icônes des compétences
          iconSize: 16, // Taille des icônes
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
          padding: 8,
          marginBottom: 15,
          borderRadius: 4,
          borderLeft: '3pt solid #e0e0e0'
        },
        options: {
          showCompanyName: true,
          showJobTitle: true,
          showPeriod: true,
          showExplanation: true,
          showDetails: true,
          showTechnologies: true,
          showTools: true,
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
        options: {
          showSchoolName: true,
          showDegree: true,
          showPeriod: true,
          showLocation: true,
          density: 'normal'
        }
      }
    },
    
    // Configuration des styles et thèmes
    style: {
      theme: 'default', // 'default', 'dark', 'minimal', 'colorful'
      colors: {
        primary: '#000000',
        secondary: '#0077cc', // Default secondary color (accent)
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
          sectionTitle: 16,
          name: 24,
          title: 14,
          companyName: 14,
          jobTitle: 12,
          normal: 10,
          small: 9
        }
      },
      sectionTitle: {
        uppercase: true,
        letterSpacing: 1,
        borderBottom: true,
        borderBottomWidth: 1,
        paddingBottom: 5,
        marginBottom: 10
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