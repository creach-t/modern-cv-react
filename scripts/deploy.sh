#!/usr/bin/env bash
# =============================================================
#  Zero-Downtime Blue-Green Deploy Script
#  Appelé par GitHub Actions via SSH.
#  Le serveur fait lui-même : git pull → docker build → swap
# =============================================================
set -euo pipefail

# ── Couleurs ──────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'
YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
log()  { echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $*"; }
ok()   { echo -e "${GREEN}[$(date '+%H:%M:%S')] ✅ $*${NC}"; }
warn() { echo -e "${YELLOW}[$(date '+%H:%M:%S')] ⚠️  $*${NC}"; }
err()  { echo -e "${RED}[$(date '+%H:%M:%S')] ❌ $*${NC}" >&2; }

# ── Configuration — adapte ces variables à ton serveur ────────
REPO_DIR="${REPO_DIR:-/root/projects/modern-cv-react}"
IMAGE_NAME="modern-cv-react"
CONTAINER_PROD="${IMAGE_NAME}"
CONTAINER_NEW="${IMAGE_NAME}-new"
NETWORK="traefik-public"
PORT="2585"
HEALTH_URL="http://localhost:${PORT}/health"
HEALTH_RETRIES=30
HEALTH_INTERVAL=2

TRAEFIK_LABELS=(
  "traefik.enable=true"
  "traefik.http.routers.cv.rule=Host(\`creachtheo.fr\`) || Host(\`www.creachtheo.fr\`)"
  "traefik.http.routers.cv.entrypoints=websecure"
  "traefik.http.routers.cv.tls.certresolver=myresolver"
  "traefik.http.services.cv.loadbalancer.server.port=${PORT}"
)

# ── 1. Récupère la dernière version du code ────────────────────
log "📥 git pull origin main..."
cd "${REPO_DIR}"
git pull origin main
ok "Code à jour"

# ── 2. Build de la nouvelle image Docker ──────────────────────
log "🐳 Build de l'image Docker..."
docker build -t "${IMAGE_NAME}:new" .
ok "Image construite"

# ── 3. Nettoyage d'un éventuel conteneur candidat résiduel ────
if docker ps -aq --filter "name=^${CONTAINER_NEW}$" | grep -q .; then
  warn "Conteneur résiduel ${CONTAINER_NEW} détecté — suppression..."
  docker rm -f "${CONTAINER_NEW}"
fi

# ── 4. Démarrage du nouveau conteneur (candidat) ──────────────
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
  "${IMAGE_NAME}:new"

# ── 5. Health check ───────────────────────────────────────────
log "⏳ Health check (max $((HEALTH_RETRIES * HEALTH_INTERVAL))s)..."

retries="${HEALTH_RETRIES}"
until docker exec "${CONTAINER_NEW}" \
    wget -q --spider "${HEALTH_URL}" 2>/dev/null; do
  retries=$((retries - 1))
  if [ "${retries}" -le 0 ]; then
    err "Health check échoué ! Rollback en cours..."
    docker rm -f "${CONTAINER_NEW}" || true
    err "Ancien conteneur toujours actif. Aucune interruption de service."
    exit 1
  fi
  warn "Pas encore prêt... (${retries} tentatives restantes)"
  sleep "${HEALTH_INTERVAL}"
done

ok "Nouveau conteneur opérationnel !"

# ── 6. Bascule : Traefik route déjà sur les 2 conteneurs
#    On arrête l'ancien → Traefik ne garde que le nouveau → 0 downtime
if docker ps -q --filter "name=^${CONTAINER_PROD}$" | grep -q .; then
  log "🔴 Arrêt de l'ancien conteneur : ${CONTAINER_PROD}"
  docker stop "${CONTAINER_PROD}"
  docker rm   "${CONTAINER_PROD}"
  ok "Ancien conteneur supprimé"
else
  warn "Aucun ancien conteneur (premier déploiement)"
fi

# ── 7. Renommage candidat → production ────────────────────────
docker rename "${CONTAINER_NEW}" "${CONTAINER_PROD}"
# Retag propre de l'image
docker tag "${IMAGE_NAME}:new" "${IMAGE_NAME}:latest"
docker rmi "${IMAGE_NAME}:new" 2>/dev/null || true

# ── 8. Nettoyage images obsolètes ─────────────────────────────
log "🧹 Nettoyage des images non utilisées..."
docker image prune -f --filter "dangling=true" || true

echo ""
ok "═══════════════════════════════════════════════"
ok " Déploiement terminé  —  Zéro interruption ✓   "
ok "═══════════════════════════════════════════════"
echo ""
