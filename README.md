# Modern CV React

Un CV moderne et interactif créé avec React et Tailwind CSS, optimisé pour le SEO et proposant une expérience utilisateur riche.

## 🚀 Technologies utilisées

- **React 18** - Pour une interface utilisateur réactive et moderne
- **Tailwind CSS** - Pour un design élégant et responsive
- **Framer Motion** - Pour des animations et transitions fluides
- **Lucide React** - Pour des icônes modernes et personnalisables
- **Docker** - Pour un déploiement simple et cohérent

## ✨ Fonctionnalités

- **Design responsive** - S'adapte parfaitement à tous les appareils
- **Interface bilingue** - Support complet français/anglais avec bascule facile
- **Mode sombre/clair** - Thème adaptatif selon les préférences utilisateur
- **Palette de couleurs personnalisable** - Choisissez votre propre thème de couleur
- **Animations et transitions fluides** - Pour une expérience utilisateur engageante
- **Optimisations SEO avancées** - Métadonnées complètes et schéma JSON-LD
- **Sections interactives** - Compétences, expériences et projets présentés de manière dynamique
- **Formulaire de contact modal** - Intégration facile avec vos systèmes de messagerie

## 🔍 Optimisations SEO

Ce projet intègre des fonctionnalités SEO avancées pour une meilleure visibilité en ligne :

- **Métadonnées complètes** - Balises title, description, viewport et autres méta-informations optimisées
- **Données structurées (JSON-LD)** - Schémas Person, SoftwareApplication, ItemList et autres pour un affichage enrichi dans les résultats de recherche
- **Support multilingue** - Balises hreflang pour indiquer les versions linguistiques alternatives
- **Liens canoniques** - Pour éviter les problèmes de contenu dupliqué
- **Optimisations Open Graph et Twitter Cards** - Pour un partage optimal sur les réseaux sociaux
- **Balisage sémantique** - Structure HTML optimisée pour l'accessibilité et le référencement

## 🛠️ Installation

### Option 1: Installation locale

1. Clonez le repository
```bash
git clone https://github.com/creach-t/modern-cv-react.git
cd modern-cv-react
```

2. Installez les dépendances
```bash
npm install
```

3. Lancez le projet
```bash
npm start
```

Le site sera accessible à l'adresse http://localhost:3000

### Option 2: Installation avec Docker

1. Clonez le repository
```bash
git clone https://github.com/creach-t/modern-cv-react.git
cd modern-cv-react
```

2. Construisez et lancez les conteneurs Docker
```bash
docker compose build --no-cache modern-cv-react
docker compose up -d
```

Le site sera accessible à l'adresse http://localhost:2585

## 📁 Structure du projet

```
modern-cv-react/
├── public/            # Ressources statiques et fichiers de données JSON
│   ├── data/          # Données JSON pour les compétences, expériences, etc.
│   ├── img/           # Images et ressources graphiques
│   └── index.html     # Point d'entrée HTML avec optimisations SEO
├── src/
│   ├── components/    # Composants React réutilisables
│   ├── config/        # Configurations d'animation et autres
│   ├── constants/     # Constantes et traductions
│   ├── contexts/      # Contextes React (couleur, langue, modal)
│   ├── hooks/         # Hooks personnalisés
│   ├── utils/         # Fonctions utilitaires
│   ├── App.jsx        # Composant principal de l'application
│   └── index.js       # Point d'entrée JavaScript
├── docker-compose.yml # Configuration Docker Compose
├── Dockerfile         # Configuration Docker
└── tailwind.config.js # Configuration Tailwind CSS
```

## 🎨 Personnalisation

Le CV est facilement personnalisable en modifiant les fichiers JSON dans le dossier `public/data/`. Vous pouvez :

- Modifier vos informations personnelles (`contacts.json`)
- Mettre à jour votre expérience professionnelle (`experiences.json`)
- Ajuster vos formations (`education.json`)
- Personnaliser vos compétences (`skills.json` et `softSkills.json`)
- Ajouter vos projets (`projects.json`)
- Changer les couleurs disponibles (`colors.json`)

Tous les aspects visuels peuvent être personnalisés en modifiant les styles dans les composants React ou via Tailwind CSS.

## 🌐 Déploiement

Ce projet est configuré pour être déployé avec:
- Docker pour la conteneurisation
- Nginx comme serveur web
- Certbot pour les certificats SSL

Le déploiement comprend:
- Un conteneur React pour l'application
- Un conteneur Nginx pour servir l'application et gérer SSL
- Un conteneur Certbot pour la génération et le renouvellement des certificats SSL

## ⚙️ Fonctionnalités techniques avancées

- **Contextes React** - Gestion des thèmes, langues et modal de contact
- **Hooks personnalisés** - Pour la réutilisation de logique complexe
- **Responsive Design** - Adapté à tous les appareils grâce à Tailwind CSS
- **Animations performantes** - Utilisation optimisée de Framer Motion
- **Internationalisation** - Support complet français/anglais facilement extensible
- **Mode sombre/clair** - Détection automatique des préférences utilisateur
- **Système de couleurs dynamique** - Sélecteur de couleur personnalisé avec sauvegarde des préférences

## 👥 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.