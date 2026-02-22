# CLAUDE.md — Contexte projet pour Claude Code

## Vue d'ensemble

CV interactif React servi en production sur **creachtheo.fr**.
Stack : React 18 + Tailwind CSS + nginx + Docker + Traefik + GitHub Actions.

---

## Commandes essentielles

```bash
npm start          # Dev local → http://localhost:3000
npm run build      # Build production (CI = true → ESLint bloque sur warnings)
npm test -- --watchAll=false --passWithNoTests --ci
docker compose up -d --build   # Dev avec Docker → http://localhost:2585
```

> ⚠️ `npm run build` en mode CI (`CI=true`) **traite les warnings ESLint comme des erreurs**.
> Corriger tous les `no-unused-vars` et `react-hooks/exhaustive-deps` avant de push.

---

## Architecture de production

```
Internet → Traefik (traefik-central) → modern-cv-react (nginx:2585)
                                              ↑
                              réseau Docker : traefik-public
```

| Composant | Détail |
|---|---|
| Reverse proxy | Traefik v2.10 (`traefik-central`), réseau `traefik-public` |
| Image | `nginx:1.25-alpine` + `curl` (pour healthcheck) |
| Port interne | `2585` |
| TLS | Let's Encrypt via `certresolver=myresolver` |
| Healthcheck | `curl -f http://localhost:2585/health` → 200 |
| Version | SHA git court injecté via `ARG GIT_SHA` → `REACT_APP_VERSION` |

**⚠️ Traefik filtre les containers `unhealthy` et `starting`.**
Le healthcheck DOIT passer pour que le trafic soit routé.

---

## Pipeline CI/CD (.github/workflows/ci-cd.yml)

**Déclencheur** : push sur `main`

| Job | Ce qu'il fait |
|---|---|
| `test` | `npm ci` + `npm test` + `npm run build` |
| `build-image` | Build Docker avec `--build-arg GIT_SHA=$GITHUB_SHA`, push vers GHCR (`latest` + `sha-<7chars>`) |
| `deploy` | SCP `docker-compose.prod.yml` → VPS, puis SSH : `docker compose pull` + `up --force-recreate` |

### Secrets GitHub Actions requis

| Secret | Valeur |
|---|---|
| `SSH_HOST` | IP du VPS |
| `SSH_USER` | `root` |
| `SSH_PRIVATE_KEY` | Contenu de `~/.ssh/github_actions_deploy` |
| `SSH_PORT` | `22` (ou port custom) |
| `GHCR_PAT` | GitHub PAT `read:packages` (pour `docker pull` depuis le VPS) |

### Clé SSH autorisée sur le VPS

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINxH5AAJrkOnfKJ2T/bfrV7sGT8tMKNoZg31UwWnmZFm github-actions-deploy
```
Doit être dans `/root/.ssh/authorized_keys` sur le VPS.

---

## Fichiers clés

| Fichier | Rôle |
|---|---|
| `Dockerfile` | Multi-stage : `node:18-alpine` (build) → `nginx:1.25-alpine` (prod) |
| `nginx.conf` | SPA routing (`try_files`), gzip, `/health`, cache assets 1 an, headers sécu |
| `docker-compose.yml` | Dev local (build context `.`) |
| `docker-compose.prod.yml` | Production (image GHCR, `container_name`, Traefik labels, healthcheck curl) |
| `scripts/deploy.sh` | Deploy blue-green **manuel** (git pull + docker build local + swap) |

---

## VPS — Infos serveur

| Info | Valeur |
|---|---|
| Hôte | `vmi1909924` |
| Dossier projet | `/root/projects/modern-cv-react/` |
| Container | `modern-cv-react` |
| Réseau Docker | `traefik-public` (external) |
| Image en prod | `ghcr.io/creach-t/modern-cv-react:latest` |

### Commandes de diagnostic utiles

```bash
# État du container
docker ps --filter "name=modern-cv-react" --format 'table {{.Names}}\t{{.Status}}\t{{.Image}}'

# Logs nginx
docker logs modern-cv-react --tail 30

# Tester le healthcheck manuellement
docker exec modern-cv-react curl -f http://localhost:2585/health

# Vérifier le réseau Traefik
docker inspect modern-cv-react --format '{{range $k,$v := .NetworkSettings.Networks}}{{$k}} {{end}}'

# Logs Traefik (routing creachtheo.fr)
docker logs traefik-central 2>&1 | grep -i "creachtheo\|modern-cv" | tail -10

# Redéploiement manuel d'urgence (sans CI)
cd /root/projects/modern-cv-react
IMAGE_TAG=latest docker compose -f docker-compose.prod.yml pull
IMAGE_TAG=latest docker compose -f docker-compose.prod.yml up -d --force-recreate
```

---

## Gotchas & bugs rencontrés

### 1. Traefik filtre les containers unhealthy
**Symptôme** : container `Up X min (unhealthy)` → site en 404
**Cause** : `wget --spider` n'existe pas dans BusyBox (nginx:alpine)
**Fix** : `apk add curl` dans le Dockerfile, utiliser `curl -f` pour le healthcheck

### 2. Nom du container docker-compose
**Symptôme** : container nommé `modern-cv-react-modern-cv-react-1` au lieu de `modern-cv-react`
**Cause** : docker-compose préfixe avec le nom du projet
**Fix** : `container_name: modern-cv-react` dans `docker-compose.prod.yml`

### 3. Build ESLint échoue en CI
**Symptôme** : `Failed to compile` sur des warnings
**Cause** : `CI=true` traite les warnings comme des erreurs
**Fix** : supprimer les variables inutilisées (`no-unused-vars`), capturer les refs avant cleanup (`react-hooks/exhaustive-deps`)

### 4. Version footer ne change pas
**Symptôme** : footer affiche `vdev` au lieu du SHA
**Cause** : `REACT_APP_VERSION` doit être injecté au **build** via `--build-arg GIT_SHA`
**Fix** : `build-args: GIT_SHA=${{ github.sha }}` dans le workflow, `ARG GIT_SHA` + `ENV REACT_APP_VERSION` dans le Dockerfile avant `RUN npm run build`

---

## Structure du code React

```
src/
├── components/
│   ├── layout/
│   │   ├── Header/        # Navigation + partage
│   │   └── Footer/        # Icône GitHub + version (REACT_APP_VERSION)
│   └── sections/          # Expériences, compétences, projets…
├── services/
│   └── PDFService/        # Génération PDF (@react-pdf/renderer)
│       ├── sections/      # Sections PDF (BaseSection, HeaderSection…)
│       └── layout/        # layoutManager.js
├── contexts/              # ThemeContext, LanguageContext, ModalContext
└── hooks/
```
