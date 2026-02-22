#!/usr/bin/env bash
# =============================================================
#  Zero-Downtime Blue-Green Deploy Script
#  Usage : ./deploy.sh <image:tag>
#  Env   : GHCR_USER, GHCR_PAT  (pour s'authentifier sur GHCR)
# =============================================================
set -euo pipefail

# ── Couleurs pour les logs ────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log()  { echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $*"; }
ok()   { echo -e "${GREEN}[$(date '+%H:%M:%S')] ✅ $*${NC}"; }
warn() { echo -e "${YELLOW}[$(date '+%H:%M:%S')] ⚠️  $*${NC}"; }
err()  { echo -e "${RED}[$(date '+%H:%M:%S')] ❌ $*${NC}" >&2; }

# ── Configuration ─────────────────────────────────────────────
IMAGE="${1:?Usage: $0 <image:tag>}"
CONTAINER_PROD="modern-cv-react"          # nom du conteneur actif
CONTAINER_NEW="${CONTAINER_PROD}-new"     # conteneur candidat
NETWORK="traefik-public"
PORT="2585"
HEALTH_URL="http://localhost:${PORT}/health"
HEALTH_RETRIES=30
HEALTH_INTERVAL=2

# Labels Traefik (identiques pour les deux conteneurs
# → Traefik load-balance pendant la transition, puis ne garde que le nouveau)
TRAEFIK_LABELS=(
  "traefik.enable=true"
  "traefik.http.routers.cv.rule=Host(\`creachtheo.fr\`) || Host(\`www.creachtheo.fr\`)"
  "traefik.http.routers.cv.entrypoints=websecure"
  "traefik.http.routers.cv.tls.certresolver=myresolver"
  "traefik.http.services.cv.loadbalancer.server.port=${PORT}"
)

# ── 0. Authentification GHCR ─────────────────────────────────
log "🔑 Authentification sur GHCR..."
echo "${GHCR_PAT:?Variable GHCR_PAT manquante}" \
  | docker login ghcr.io -u "${GHCR_USER:?Variable GHCR_USER manquante}" --password-stdin
ok "Authentifié sur ghcr.io"

# ── 1. Pull de la nouvelle image ─────────────────────────────
log "📦 Pull de l'image : ${IMAGE}"
docker pull "${IMAGE}"
ok "Image disponible localement"

# ── 2. Nettoyage d'un éventuel conteneur candidat résiduel ───
if docker ps -aq --filter "name=^${CONTAINER_NEW}$" | grep -q .; then
  warn "Conteneur résiduel ${CONTAINER_NEW} détecté — suppression..."
  docker rm -f "${CONTAINER_NEW}"
fi

# ── 3. Démarrage du nouveau conteneur (candidat) ─────────────
log "🟢 Démarrage du conteneur candidat : ${CONTAINER_NEW}"

LABEL_ARGS=()
for label in "${TRAEFIK_LABELS[@]}"; do
  LABEL_ARGS+=("--label" "${label}")
done

docker run -d \
  --name "${CONTAINER_NEW}" \
  --network "${NETWORK}" \
  --restart unless-stopped \
  "${LABEL_ARGS[@]}" \
  "${IMAGE}"

# ── 4. Health check du nouveau conteneur ─────────────────────
log "⏳ Health check (${HEALTH_RETRIES} tentatives, intervalle ${HEALTH_INTERVAL}s)..."

retries="${HEALTH_RETRIES}"
until docker exec "${CONTAINER_NEW}" \
    wget -q --spider "${HEALTH_URL}" 2>/dev/null; do
  retries=$((retries - 1))
  if [ "${retries}" -le 0 ]; then
    err "Health check échoué après ${HEALTH_RETRIES} tentatives !"
    err "Rollback : suppression du conteneur candidat..."
    docker rm -f "${CONTAINER_NEW}" || true
    err "Déploiement annulé. L'ancien conteneur reste actif."
    exit 1
  fi
  warn "Pas encore prêt... (${retries} tentatives restantes)"
  sleep "${HEALTH_INTERVAL}"
done

ok "Nouveau conteneur opérationnel !"

# ── 5. Bascule : arrêt de l'ancien conteneur ─────────────────
#    À ce stade, Traefik route déjà sur les DEUX conteneurs
#    (même service name = load-balancing automatique).
#    En arrêtant l'ancien, Traefik ne garde que le nouveau → 0 downtime.
if docker ps -q --filter "name=^${CONTAINER_PROD}$" | grep -q .; then
  log "🔴 Arrêt de l'ancien conteneur : ${CONTAINER_PROD}"
  docker stop "${CONTAINER_PROD}"
  docker rm "${CONTAINER_PROD}"
  ok "Ancien conteneur supprimé"
else
  warn "Aucun ancien conteneur trouvé (premier déploiement ?)"
fi

# ── 6. Renommage du candidat en production ───────────────────
docker rename "${CONTAINER_NEW}" "${CONTAINER_PROD}"
ok "Conteneur renommé : ${CONTAINER_NEW} → ${CONTAINER_PROD}"

# ── 7. Nettoyage des anciennes images ────────────────────────
log "🧹 Nettoyage des images non utilisées..."
docker image prune -f --filter "dangling=true" || true

echo ""
ok "═══════════════════════════════════════════════"
ok " Déploiement terminé  —  Zéro interruption ✓   "
ok "═══════════════════════════════════════════════"
echo ""
