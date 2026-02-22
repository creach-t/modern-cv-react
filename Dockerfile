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
RUN npm run build

# ─────────────────────────────────────────────
# Stage 2 — Serve with Nginx (lightweight)
# ─────────────────────────────────────────────
FROM nginx:1.25-alpine AS production

# Copy built assets
COPY --from=builder /app/build /usr/share/nginx/html

# Custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 2585

# Built-in healthcheck used by Docker & the deploy script
HEALTHCHECK --interval=15s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -q --spider http://localhost:2585/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
