FROM node:18-alpine as build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier les fichiers du projet
COPY . .

# Construire l'application pour la production
RUN npm run build

# Étape finale pour l'exécution SSR
FROM node:18-alpine

WORKDIR /app

# Copier les dépendances et les fichiers de build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/build ./build
COPY --from=build /app/public ./public
COPY --from=build /app/server ./server
COPY --from=build /app/src ./src
COPY --from=build /app/.babelrc ./

# Exposer le port 2585
EXPOSE 2585

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=2585

# Démarrer le serveur SSR
CMD ["node", "server/index.js"]
