# Guide d'utilisation du SSR pour Modern-CV-React

Ce document explique comment tester et vérifier que le rendu côté serveur (SSR) fonctionne correctement pour les robots de recherche (bots) tout en conservant l'expérience SPA pour les utilisateurs normaux.

## Préparation

1. Assurez-vous d'avoir installé toutes les dépendances :
   ```
   npm install
   ```

2. Construisez l'application :
   ```
   npm run build
   ```

3. Lancez le serveur SSR :
   ```
   npm run build:ssr
   ```

## Comment vérifier que le SSR fonctionne

### Méthode 1 : Test automatisé

Nous avons créé un script de test qui vérifie automatiquement le bon fonctionnement du SSR en simulant différents user-agents :

1. Dans un nouveau terminal (laissez le serveur tourner), exécutez :
   ```
   npm run test:ssr
   ```

2. Consultez les résultats dans la console et ouvrez le rapport HTML généré dans le dossier `server/test-results/report.html`.

### Méthode 2 : Test manuel avec curl

Vous pouvez vérifier manuellement que le SSR fonctionne en utilisant curl pour simuler différents user-agents :

1. Simuler un bot Google :
   ```
   curl -A "Googlebot" http://localhost:2585/ > bot.html
   ```

2. Simuler un navigateur normal :
   ```
   curl -A "Mozilla/5.0" http://localhost:2585/ > browser.html
   ```

3. Comparez les fichiers générés :
   - `bot.html` doit contenir le HTML complet avec les balises correspondant à votre application React
   - `browser.html` doit contenir un squelette HTML minimal sans le contenu prérendu

### Méthode 3 : Test dans le navigateur

1. Visitez l'URL normale de votre application : `http://localhost:2585/`
   - Vous devriez voir l'application React chargée normalement comme une SPA
   - Dans les DevTools, le HTML initial ne devrait pas contenir votre application

2. Visitez l'URL avec le paramètre bot : `http://localhost:2585/?bot=1`
   - Vous verrez toujours l'application React, mais si vous regardez le code source de la page (Ctrl+U ou Cmd+U), vous devriez voir tout le HTML prérendu
   - Dans les DevTools > Elements, vous devriez voir une balise meta `<meta name="rendered-by" content="server" />`

## Comprendre les logs

Le serveur génère des logs détaillés dans le fichier `server/server.log` qui vous aident à diagnostiquer les problèmes :

```
[2025-03-16T12:34:56.789Z] NOUVELLE REQUETE: GET /
[2025-03-16T12:34:56.789Z] IP: ::1, Headers: {"user-agent":"Mozilla/5.0..."}
[2025-03-16T12:34:56.789Z] User-Agent: "Mozilla/5.0..."
[2025-03-16T12:34:56.789Z] Est-ce un bot: NON
[2025-03-16T12:34:56.789Z] Rendu client pour navigateur
[2025-03-16T12:34:56.789Z] Envoi de la réponse client
```

Pour un bot, vous verriez plutôt :

```
[2025-03-16T12:34:56.789Z] Est-ce un bot: OUI
[2025-03-16T12:34:56.789Z] Rendu SSR pour bot
[2025-03-16T12:34:56.789Z] Import de App réussi
[2025-03-16T12:34:56.789Z] Envoi de la réponse SSR réussie
```

## Dépannage

### Le SSR ne fonctionne pas du tout

1. Vérifiez que le serveur est bien démarré (`npm run build:ssr`)
2. Consultez les logs dans `server/server.log` pour détecter d'éventuelles erreurs
3. Assurez-vous que l'application a été correctement compilée (`npm run build`)

### Erreurs d'hydratation

Si vous voyez des erreurs d'hydratation dans la console (messages comme "Hydration failed because..."), c'est généralement dû à des différences entre le rendu serveur et client. Vérifiez :

1. L'ordre d'importation des CSS
2. Les composants qui peuvent avoir des comportements différents côté serveur et client
3. L'utilisation de `Math.random()` ou d'autres fonctions non déterministes
4. Les vérifications `typeof window !== 'undefined'` dans vos composants

### L'application fonctionne pour les navigateurs mais pas pour les bots

1. Vérifiez la détection de bot dans le fichier `server/ssr-utils.js`
2. Ajoutez votre user-agent spécifique à la liste si nécessaire
3. Utilisez `?bot=1` dans l'URL pour forcer le mode bot et diagnostiquer

## Pour aller plus loin

Si vous souhaitez améliorer l'implémentation SSR, voici quelques pistes :

1. Ajoutez un mécanisme de cache pour le rendu SSR des pages fréquemment visitées
2. Implémentez un système de préchargement des données (comme getServerSideProps de Next.js)
3. Ajoutez des tests automatisés pour le SSR dans votre pipeline CI/CD
4. Utilisez une bibliothèque comme `isbot` pour une détection plus précise des robots de recherche
5. Implémentez un mécanisme de régénération statique incrémentale (ISR) pour les pages qui changent peu

N'hésitez pas à modifier les fichiers de configuration selon vos besoins spécifiques.
