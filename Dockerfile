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

# Installer serve
RUN npm install -g serve

# Exposer le port 2585
EXPOSE 2585

# Démarrer serve sur le port 2585
CMD ["serve", "-s", "build", "-l", "2585"]