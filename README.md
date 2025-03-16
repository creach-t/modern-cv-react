# Modern CV React avec SSR

Ce projet est un CV moderne développé avec React, qui inclut un rendu côté serveur (SSR) pour les robots de recherche tout en préservant l'expérience SPA pour les utilisateurs normaux.

## Fonctionnalités

- Mode SPA (Single Page Application) pour les utilisateurs ordinaires
- Rendu côté serveur (SSR) pour les bots des moteurs de recherche
- Changement de thème (clair/sombre)
- Changement de langue (français/anglais)
- Design responsive
- Coloration personnalisable

## Comment ça marche

Le serveur détecte automatiquement si la requête provient d'un robot de recherche (Google, Bing, etc.) ou d'un navigateur normal. En fonction de cette détection :

- **Pour les robots** : Rendu complet de l'application côté serveur (SSR)
- **Pour les navigateurs** : Envoi du bundle JavaScript pour une expérience SPA classique

## Installation

1. Clonez le repo :
```bash
git clone https://github.com/creach-t/modern-cv-react.git
cd modern-cv-react
```

2. Installez les dépendances :
```bash
npm install
```

3. Compilez l'application :
```bash
npm run build
```

4. Lancez le serveur SSR :
```bash
npm run build:ssr
```

## Comment tester le SSR

Vous avez plusieurs façons de tester le rendu côté serveur :

1. **Simuler un user-agent de bot** :
```bash
curl -A "Googlebot" http://localhost:2585/
```

2. **Utiliser le paramètre d'URL de forçage** :
```
http://localhost:2585/?bot=1
```

3. **Outils en ligne** :
Vous pouvez utiliser des outils comme "Fetch as Google" dans Google Search Console.

## Scripts disponibles

Dans le répertoire du projet, vous pouvez exécuter :

- `npm start` : Lance l'application en mode développement (SPA uniquement)
- `npm run build` : Compile l'application pour la production
- `npm run build:ssr` : Compile puis lance le serveur SSR
- `npm run dev:ssr` : Lance le serveur SSR en mode développement

## Comment fonctionne la détection des bots

Le serveur utilise une liste de patterns d'user-agent courants pour détecter les robots des moteurs de recherche. Si un user-agent contient l'un de ces patterns, le serveur considère qu'il s'agit d'un bot et active le rendu SSR :

- googlebot, bingbot, yandexbot, etc.
- Termes génériques : bot, spider, crawler, etc.

Vous pouvez également forcer le mode bot en ajoutant `?bot=1` à l'URL.

## Architecture technique

- **React 18** pour le frontend
- **Express** pour le serveur Node.js
- **React Helmet** pour la gestion des métadonnées
- **React-DOM/server** pour le rendu côté serveur
- **Tailwind CSS** pour le styling

## Analyse des fichiers clés pour le SSR

### server/server.js
C'est le cœur du système SSR. Ce fichier :
- Configure un serveur Express
- Détecte si la requête provient d'un bot
- Effectue le rendu React côté serveur pour les bots
- Envoie le HTML complet avec l'app pré-rendue pour les bots
- Envoie seulement le HTML minimal avec les scripts pour les navigateurs

### server/index.js
Ce fichier configure l'environnement Node pour le SSR :
- Définit les polyfills nécessaires (window, document, etc.)
- Configure Babel pour transpiler le JSX
- Crée des mocks pour les composants externes (comme lucide-react)

### src/App.jsx
Le composant racine qui accepte maintenant un état initial, permettant au SSR de passer des données :
```jsx
const App = ({ initialState }) => {
  // initialState peut contenir des valeurs de préférence utilisateur
  return (
    <LanguageProvider initialLanguage={initialState?.language}>
      <ColorProvider 
        initialIsDark={initialState?.theme?.isDark}
        initialSecondaryColor={initialState?.theme?.secondaryColor}
      >
        ...
      </ColorProvider>
    </LanguageProvider>
  );
};
```

### src/index.js
Ce fichier gère l'hydratation côté client :
- Détecte si le contenu a été pré-rendu par le serveur
- Utilise `hydrateRoot` pour les pages pré-rendues
- Utilise `createRoot` pour le rendu client standard
- Récupère l'état initial injecté par le serveur

## Logs et débogage

Le serveur génère des logs détaillés qui sont affichés dans la console et écrits dans `server/server.log`. Ces logs incluent :
- Les requêtes reçues et leurs user-agents
- La détection de bot
- Les étapes du rendu SSR
- Les erreurs potentielles

Pour faciliter le débogage, vous pouvez surveiller ce fichier :
```bash
tail -f server/server.log
```

## Améliorations possibles

- Mise en cache du rendu SSR pour améliorer les performances
- Préchargement des données pour le SSR (utilisation de `getServerSideProps` ou équivalent)
- Tests automatisés pour vérifier le bon fonctionnement du SSR
- Amélioration de la détection des bots avec des bibliothèques spécialisées comme `isbot`
- Ajout de métriques de performance pour le SSR
- Mise en place d'un CDN pour les visiteurs réguliers
- Implémentation de stratégies de fallback en cas d'échec du SSR

## Résolution des problèmes courants

### Le SSR ne semble pas fonctionner
- Vérifiez les logs dans `server/server.log`
- Assurez-vous que les fichiers statiques sont correctement compilés dans le dossier `build`
- Testez avec l'option `?bot=1` pour forcer le mode SSR

### Erreurs d'hydratation
Si vous voyez des avertissements d'hydratation dans la console, cela peut être dû à :
- Des différences entre le rendu serveur et client
- Des composants qui utilisent `Math.random()` ou `Date.now()`
- Des événements qui se déclenchent uniquement côté client

### Le contenu ne s'affiche pas pour les moteurs de recherche
- Vérifiez que la détection de bot fonctionne correctement
- Testez avec différents user-agents de bots
- Utilisez un outil comme "View as Googlebot" pour diagnostiquer

## Licence

MIT
