# ─────────────────────────────────────────────
# Stage 1 — Build React app
# ─────────────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Install deps first (layer cache optimisation)
COPY package*.json ./
RUN npm ci

# Build production bundle
COPY . .
# SHA du commit injecté au build (ex: --build-arg GIT_SHA=abc1234)
ARG GIT_SHA=dev
ENV REACT_APP_VERSION=$GIT_SHA

# Assistant IA — injectés au build (vides par défaut → IA hors-ligne, repli contact).
# ⚠️ REACT_APP_* est inclus dans le bundle public : la clé sera exposée côté client.
# Protéger l'endpoint côté Cloudflare (rate limiting / Turnstile) ou passer par un proxy.
ARG REACT_APP_LLM_API_KEY=""
ARG REACT_APP_LLM_API_URL=""
ARG REACT_APP_LLM_MODEL=""
ENV REACT_APP_LLM_API_KEY=$REACT_APP_LLM_API_KEY
ENV REACT_APP_LLM_API_URL=$REACT_APP_LLM_API_URL
ENV REACT_APP_LLM_MODEL=$REACT_APP_LLM_MODEL

RUN npm run build

# ─────────────────────────────────────────────
# Stage 2 — Serve with Nginx (lightweight)
# ─────────────────────────────────────────────
FROM nginx:1.25-alpine AS production

# curl pour le healthcheck (wget BusyBox ne fonctionne pas bien dans ce contexte)
RUN apk add --no-cache curl

# Copy built assets
COPY --from=builder /app/build /usr/share/nginx/html

# Custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 2585

HEALTHCHECK --interval=15s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:2585/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
