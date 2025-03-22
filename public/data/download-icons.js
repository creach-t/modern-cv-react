/**
 * Script pour télécharger toutes les icônes SVG (Version CommonJS)
 * 
 * Pour installer les dépendances:
 * npm install axios fs-extra
 */

const fs = require('fs-extra');
const axios = require('axios');
const path = require('path');

// Configuration
const ICONS_DIR = path.join(__dirname, '..', 'icons'); // Chemin où sauvegarder les icônes
const SKILLS_DATA = [
  {
    "category": "Frontend",
    "skills": [
      {
        "name": "React",
        "level": 4,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
      },
      {
        "name": "React Native",
        "level": 3,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
      },
      {
        "name": "HTML/CSS",
        "level": 4,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"
      },
      {
        "name": "JavaScript",
        "level": 4,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
      },
      {
        "name": "TypeScript",
        "level": 3,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
      },
      {
        "name": "Tailwind CSS",
        "level": 3,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg"
      },
      {
        "name": "Vue.js",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg"
      },
      {
        "name": "Angular",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg"
      },
      {
        "name": "Next.js",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
      },
      {
        "name": "Redux",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg"
      },
      {
        "name": "Webpack",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg"
      },
      {
        "name": "SASS",
        "level": 1,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg"
      },
      {
        "name": "Bootstrap",
        "level": 2,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg"
      },
      {
        "name": "Material UI",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg"
      },
      {
        "name": "Framer Motion",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/framermotion/framermotion-original.svg"
      },      
      {
        "name": "EJS",
        "level": 1,
        "logo": "https://www.svgrepo.com/show/373574/ejs.svg"
      }
    ]
  },
  {
    "category": "Backend",
    "skills": [
      {
        "name": "Node.js",
        "level": 3,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
      },
      {
        "name": "Python",
        "level": 1,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
      },
      {
        "name": "Java",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg"
      },
      {
        "name": "SQL",
        "level": 3,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg"
      },
      {
        "name": "NoSQL",
        "level": 3,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"
      },
      {
        "name": "GraphQL",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg"
      },
      {
        "name": "Express.js",
        "level": 4,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg"
      },
      {
        "name": "Django",
        "level": 2,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg"
      },
      {
        "name": "Flask",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg"
      },
      {
        "name": "Spring",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg"
      },
      {
        "name": "PostgreSQL",
        "level": 3,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"
      },
      {
        "name": "MongoDB",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"
      },
      {
        "name": "Redis",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg"
      },
      {
        "name": "Firebase",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg"
      },
      {
        "name": "Sequelize",
        "level": 2,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sequelize/sequelize-original.svg"
      },
      {
        "name": "Mongoose",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"
      },
      {
        "name": "C#",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg"
      },
      {
        "name": ".NET",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg"
      },
      {
        "name": "PHP",
        "level": 1,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg"
      },
      {
        "name": "Laravel",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg"
      },
      {
        "name": "Java",
        "level": 1,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg"
      }
    ]
  },
  {
    "category": "DevOps",
    "skills": [
      {
        "name": "Docker",
        "level": 3,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"
      },
      {
        "name": "CI/CD",
        "level": 3,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg"
      },
      {
        "name": "Git",
        "level": 4,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"
      },
      {
        "name": "GitHub",
        "level": 4,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
      },
      {
        "name": "GitLab",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg"
      },
      {
        "name": "Kubernetes",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg"
      },
      {
        "name": "AWS",
        "level": 1,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg"
      },
      {
        "name": "Azure",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg"
      },
      {
        "name": "Google Cloud",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg"
      },
      {
        "name": "Netlify",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netlify/netlify-original.svg"
      },
      {
        "name": "Vercel",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg"
      },
      {
        "name": "Jenkins",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg"
      },
      {
        "name": "Travis CI",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/travis/travis-plain.svg"
      },
      {
        "name": "CircleCI",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/circleci/circleci-plain.svg"
      },
      {
        "name": "Terraform",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg"
      },
      {
        "name": "Ansible",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original.svg"
      },
      {
        "name": "NGINX",
        "level": 2,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg"
      },
      {
        "name": "Linux",
        "level": 3,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg"
      },
      {
        "name": "Bash",
        "level": 2,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg"
      }
    ]
  },
  {
    "category": "Tools",
    "skills": [
      {
        "name": "VS Code",
        "level": 4,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg"
      },
      {
        "name":"Apache",
        "level": 1,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg"
      },
      {
        "name":"Oracle",
        "level": 1,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg"
      },
      {
        "name": "Figma",
        "level": 3,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg"
      },
      {
        "name": "Eslint",
        "level": 2,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eslint/eslint-original.svg"
      },
      {
        "name": "Photoshop",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-line.svg"
      },
      {
        "name": "Illustrator",
        "level": 2,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-line.svg"
      },
      {
        "name": "Jira",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg"
      },
      {
        "name": "Trello",
        "level": 4,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/trello/trello-plain.svg"
      },
      {
        "name": "Slack",
        "level": 4,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg"
      },
      {
        "name": "Notion",
        "level": 3,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/notion/notion-original.svg"
      },
      {
        "name": "Postman",
        "level": 2,
        "logo": "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg"
      },
      {
        "name": "Jest",
        "level": 1,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg"
      },
      {
        "name": "Testing Library",
        "level": 0,
        "logo": "https://testing-library.com/img/octopus-128x128.png"
      },
      {
        "name": "Cypress",
        "level": 1,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cypressio/cypressio-original.svg"
      },
      {
        "name": "Mocha",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mocha/mocha-plain.svg"
      },
      {
        "name": "Selenium",
        "level": 0,
        "logo": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/selenium/selenium-original.svg"
      }
    ]
  }
]; // Les données des compétences intégrées directement

// Fonction principale
async function downloadAllIcons() {
  console.log(`Création du dossier d'icônes: ${ICONS_DIR}`);
  await fs.ensureDir(ICONS_DIR);

  // Extraire toutes les URLs d'icônes uniques
  const iconUrls = new Set();
  SKILLS_DATA.forEach(category => {
    category.skills.forEach(skill => {
      if (skill.logo) {
        iconUrls.add(skill.logo);
      }
    });
  });

  console.log(`${iconUrls.size} URLs d'icônes uniques trouvées`);

  // Télécharger chaque icône
  let successCount = 0;
  let failCount = 0;
  const updatedSkills = JSON.parse(JSON.stringify(SKILLS_DATA)); // Clone profond

  for (const category of updatedSkills) {
    for (const skill of category.skills) {
      if (skill.logo) {
        const url = skill.logo;
        const filename = getFilenameFromUrl(url);
        const localPath = `/icons/${filename}`;
        
        try {
          await downloadIcon(url, path.join(ICONS_DIR, filename));
          // Mettre à jour le chemin dans le JSON pour pointer vers le fichier local
          skill.logo = localPath;
          console.log(`✓ Téléchargé: ${url} → ${localPath}`);
          successCount++;
        } catch (error) {
          console.error(`✗ Erreur pour ${url}:`, error.message);
          failCount++;
        }
      }
    }
  }

  // Sauvegarder le JSON mis à jour avec les chemins locaux
  const updatedJsonPath = path.join(__dirname, 'skills_local.json');
  await fs.writeJson(updatedJsonPath, updatedSkills, { spaces: 2 });
  
  console.log(`\nRésumé:`);
  console.log(`- ${successCount} icônes téléchargées avec succès`);
  console.log(`- ${failCount} échecs`);
  console.log(`- JSON mis à jour sauvegardé dans: ${updatedJsonPath}`);
}

// Fonction pour extraire un nom de fichier depuis une URL
function getFilenameFromUrl(url) {
  // Extraire le nom de fichier de l'URL
  let filename = path.basename(url);
  
  // Traiter les URLs spéciales (comme les URLs SVGRepo)
  if (url.includes('svgrepo.com/show/')) {
    // Format: https://www.svgrepo.com/show/373574/ejs.svg
    const parts = url.split('/');
    filename = parts[parts.length - 1]; // Prendre juste "ejs.svg"
  }
  
  // S'assurer que le fichier a l'extension .svg
  if (!filename.endsWith('.svg')) {
    filename += '.svg';
  }
  
  // Nettoyer le nom de fichier pour qu'il soit valide
  filename = filename.replace(/[?#]/g, '');
  
  return filename;
}

// Fonction pour télécharger une icône
async function downloadIcon(url, destPath) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      responseType: 'text'
    });
    
    const svgContent = response.data;
    
    // Vérifier si le contenu semble être un SVG valide
    if (!svgContent.includes('<svg') && !svgContent.includes('<?xml')) {
      throw new Error('Le contenu ne semble pas être un SVG valide');
    }
    
    await fs.writeFile(destPath, svgContent);
  } catch (error) {
    if (error.response) {
      throw new Error(`Erreur HTTP: ${error.response.status}`);
    } else {
      throw error;
    }
  }
}

// Exécuter le script
downloadAllIcons().catch(console.error);