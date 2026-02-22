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

## 🛠️ Installation locale

```bash
git clone https://github.com/creach-t/modern-cv-react.git
cd modern-cv-react
npm install
npm start        # http://localhost:3000
```

### Avec Docker (dev)

```bash
docker compose build --no-cache
docker compose up -d   # http://localhost:2585
```

## 📁 Structure du projet

```
modern-cv-react/
├── public/                    # Ressources statiques
│   ├── data/                  # Données JSON (compétences, expériences…)
│   ├── img/                   # Images
│   └── index.html
├── src/
│   ├── components/            # Composants React
│   ├── services/PDFService/   # Génération PDF du CV
│   ├── contexts/              # Contextes React (couleur, langue, modal)
│   ├── hooks/                 # Hooks personnalisés
│   └── utils/
├── .github/workflows/
│   └── ci-cd.yml              # Pipeline CI/CD GitHub Actions
├── scripts/
│   └── deploy.sh              # Script de déploiement blue-green (manuel)
├── Dockerfile                 # Multi-stage: node:18 builder + nginx:alpine
├── nginx.conf                 # Config Nginx (SPA, gzip, /health, cache)
├── docker-compose.yml         # Dev local
├── docker-compose.prod.yml    # Production (image GHCR + Traefik labels)
└── tailwind.config.js
```

## 🎨 Personnalisation

Modifiez les fichiers JSON dans `public/data/` :

| Fichier | Contenu |
|---|---|
| `contacts.json` | Informations personnelles et liens |
| `experiences.json` | Expériences professionnelles |
| `education.json` | Formations |
| `skills.json` | Compétences techniques |
| `softSkills.json` | Compétences transverses |
| `projects.json` | Projets |
| `colors.json` | Palette de couleurs disponibles |

## 🚀 CI/CD — Déploiement automatique

Chaque `push` sur `main` déclenche automatiquement le pipeline GitHub Actions :

```
push → main
    │
    ├─ 🧪 Tests & Build check (npm ci + npm test + npm run build)
    │
    ├─ 🐳 Build image Docker → push vers GHCR
    │       ghcr.io/creach-t/modern-cv-react:latest
    │       ghcr.io/creach-t/modern-cv-react:sha-<7chars>
    │
    └─ 🌐 Deploy sur VPS
            scp docker-compose.prod.yml → /root/projects/modern-cv-react
            docker compose pull + up --force-recreate
```

### Secrets GitHub requis

| Secret | Description |
|---|---|
| `SSH_HOST` | IP/domaine du VPS |
| `SSH_USER` | Utilisateur SSH (`root`) |
| `SSH_PRIVATE_KEY` | Clé privée SSH (contenu de `~/.ssh/github_actions_deploy`) |
| `SSH_PORT` | Port SSH (ex: `22`) |
| `GHCR_PAT` | GitHub PAT avec scope `read:packages` (pour que le VPS pull l'image) |

### Architecture serveur

- **Traefik** (`traefik-central`) — reverse proxy + TLS automatique (Let's Encrypt)
- **nginx:1.25-alpine** — sert le bundle React sur le port `2585`
- **Réseau Docker** `traefik-public` — réseau externe partagé entre Traefik et les apps
- **Healthcheck** — `curl -f http://localhost:2585/health` (endpoint `/health` → 200 OK)
- **Version affichée** — SHA git baked dans le bundle via `REACT_APP_VERSION` (visible dans le footer)

### Dossier de déploiement sur le VPS

```
/root/projects/modern-cv-react/
└── docker-compose.prod.yml    # Copié automatiquement par le CI
```

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