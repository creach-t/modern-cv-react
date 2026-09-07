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
| `deploy` | Installe `cloudflared` (épinglé **2026.5.1**), configure `~/.ssh/config` avec `ProxyCommand cloudflared access ssh` (service token), puis SCP `docker-compose.prod.yml` → VPS et SSH : `docker compose pull` + `up --force-recreate` |

> ⚠️ Le déploiement ne passe **plus en SSH direct** mais par le **tunnel Cloudflare** (app SSH exposée via Cloudflare Access). Le job installe `cloudflared` **épinglé à `2026.5.1`** : la `2026.6.0` casse l'auth par service token (cf. [`cloudflare/cloudflared#1673`](https://github.com/cloudflare/cloudflared/issues/1673)). **Ne jamais passer en `latest`.**

### Secrets GitHub Actions requis

| Secret | Valeur |
|---|---|
| `SSH_HOSTNAME` | Hostname public de l'app SSH exposée par le tunnel Cloudflare (ex : `ssh.creachtheo.fr`) |
| `CF_ACCESS_CLIENT_ID` | Service token ID (Cloudflare Access) → `--service-token-id` |
| `CF_ACCESS_CLIENT_SECRET` | Service token secret (Cloudflare Access) → `--service-token-secret` |
| `VPS_USER` | Utilisateur SSH sur le VPS (`root`) |
| `VPS_SSH_KEY` | Clé privée SSH de déploiement (contenu complet) |
| `VPS_DEPLOY_PATH` | Dossier projet sur le VPS (ex : `/root/projects/modern-cv-react`) |
| `GHCR_PAT` | GitHub PAT `read:packages` (pour `docker pull` depuis le VPS) |

### Côté Cloudflare Access

- L'app SSH doit avoir une **policy `Service Auth`** (et **non `Allow`**) autorisant le service token — sinon `cloudflared access ssh` est rejeté.
- Le service token (ID + secret) est celui référencé par `CF_ACCESS_CLIENT_ID` / `CF_ACCESS_CLIENT_SECRET`.

### Clé SSH autorisée sur le VPS

La clé publique correspondant à `VPS_SSH_KEY` doit être dans `~/.ssh/authorized_keys` de `VPS_USER` sur le VPS (l'auth par clé SSH se fait **après** le transport tunnel Cloudflare).

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

### 5. cloudflared 2026.6.0 casse les service tokens
**Symptôme** : `cloudflared access ssh` échoue à l'auth (service token rejeté) → deploy KO
**Cause** : régression dans `cloudflared 2026.6.0` (cf. `cloudflare/cloudflared#1673`)
**Fix** : épingler la version à `2026.5.1` dans le job `deploy`, ne pas utiliser `latest`

### 6. Egress des conteneurs bloqué par le firewall (DOCKER-USER)
**Symptôme** : le conteneur ne peut pas joindre une API externe (timeout sur 80/443 sortant)
**Cause** : une règle `DOCKER-USER` qui `DROP` le trafic 80/443 court-circuite l'egress des conteneurs
**Fix** (côté VPS, one-time, **uniquement si un backend appelle des API externes**) :
```bash
# autoriser l'egress des réseaux Docker (172.16.0.0/12) en tête de chaîne
iptables -I DOCKER-USER 1 -s 172.16.0.0/12 -j RETURN
# persister
iptables-save > /etc/iptables/rules.v4
```
> Le CV est un site nginx statique (l'appel LLM est **côté navigateur**), donc cette règle
> n'est pas requise ici — à appliquer seulement pour un projet dont le conteneur fait de l'egress.

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
