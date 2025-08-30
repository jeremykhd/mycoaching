# MyCoaching

Application de coaching sportif permettant aux utilisateurs de suivre leur progression et leurs objectifs.

## 🚀 Technologies

- Vue 3 avec Composition API
- TypeScript
- Pinia pour la gestion d'état
- Supabase pour le backend
- TailwindCSS pour le styling
- Vitest pour les tests unitaires
- Cypress pour les tests E2E

## 📋 Prérequis

- Node.js 20+
- npm 9+

## 🛠 Installation

1. Cloner le repository

```bash
git clone https://github.com/votre-username/mycoaching.git
cd mycoaching
```

2. Installer les dépendances

```bash
npm install
```

3. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Remplir les variables dans le fichier `.env` avec vos propres valeurs.

## 🏗 Développement

### Lancer le serveur de développement

```bash
npm run dev
```

### Développement avec Docker

1. Construire l'image de développement

```bash
docker build -t mycoaching-dev .
```

2. Lancer le conteneur de développement

```bash
docker run -it \
  -p 5173:5173 \
  -v $(pwd):/app \
  -v /app/node_modules \
  mycoaching-dev
```

3. Pour arrêter le conteneur

```bash
docker stop mycoaching-dev
```

4. Pour voir les logs

```bash
docker logs -f mycoaching-dev
```

### Lancer les tests unitaires

```bash
npm run test:unit
```

### Lancer les tests E2E

```bash
npm run test:e2e
```

### Vérifier le linting

```bash
npm run lint
```

### Formater le code

```bash
npm run format
```

## 📦 Build

Pour construire l'application pour la production :

```bash
npm run build
```

## 🏗 Structure du projet

```
src/
├── assets/          # Images, fonts, etc.
├── components/      # Composants Vue réutilisables
├── modules/         # Modules de l'application
│   ├── accounts/    # Module de gestion des comptes
│   ├── auth/        # Module d'authentification
│   └── ...
├── router/          # Configuration des routes
├── shared/          # Code partagé (services, utils, etc.)
└── stores/          # Stores Pinia
```

## 🔄 Workflow de développement

1. Créer une branche depuis `dev`

```bash
git checkout -b feature/ma-nouvelle-fonctionnalite
```

2. Développer et tester localement

```bash
npm run dev
npm run test:unit
```

3. Pousser les changements

```bash
git add .
git commit -m "feat: ajout de ma nouvelle fonctionnalité"
git push origin feature/ma-nouvelle-fonctionnalite
```

4. Créer une Pull Request vers `dev`

5. Une fois validée, la PR sera mergée dans `dev`

6. Pour déployer en production, créer une PR de `dev` vers `main`

## 🧪 Tests

### Tests unitaires

Les tests unitaires sont écrits avec Vitest et se trouvent dans les dossiers `__tests__` de chaque module.

### Tests E2E

Les tests E2E sont écrits avec Cypress et se trouvent dans le dossier `cypress/e2e`.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
