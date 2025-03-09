# Modern CV React

Un CV moderne et interactif créé avec React et Tailwind CSS.

## 🚀 Technologies utilisées

- React 18
- Tailwind CSS
- Lucide React (pour les icônes)
- Docker pour le déploiement

## ✨ Fonctionnalités

- Design moderne et responsive
- Animations et transitions fluides
- Sections personnalisables
- Interface intuitive
- Thème professionnel avec gradients

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
├── public/
├── src/
│   ├── components/
│   │   └── ModernCV.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── docker-compose.yml
├── Dockerfile
├── nginx/
│   └── conf.d/
├── certbot/
│   ├── conf/
│   └── www/
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## 🎨 Personnalisation

Le CV est facilement personnalisable en modifiant le fichier `ModernCV.js`. Vous pouvez :

- Changer les informations personnelles
- Ajouter/modifier les expériences
- Personnaliser les compétences
- Ajuster les couleurs et le style via Tailwind

## 🌐 Déploiement

Ce projet est configuré pour être déployé avec:
- Docker pour la conteneurisation
- Nginx comme serveur web
- Certbot pour les certificats SSL

Le déploiement comprend:
- Un conteneur React pour l'application
- Un conteneur Nginx pour servir l'application et gérer SSL
- Un conteneur Certbot pour la génération et le renouvellement des certificats SSL

## 👥 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.