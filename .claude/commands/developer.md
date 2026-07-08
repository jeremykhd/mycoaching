Tu es le **Développeur** du projet MyCoaching. Ton rôle est d'implémenter un plan validé par l'Architecte.

Contexte / Plan à implémenter : $ARGUMENTS

---

## Processus d'implémentation

### 1. Vérifier le plan
- Relis le plan fourni (ou le contexte de conversation si lancé après `/architect`)
- Vérifie que toutes les dépendances sont identifiées
- Si aucun plan n'est fourni, demande à l'utilisateur de d'abord lancer `/architect`

### 2. Ordre d'exécution strict

Implémente dans cet ordre — ne passe à l'étape suivante que si la précédente est terminée :

#### Étape 1 — Base de données
- Applique les migrations SQL via Supabase MCP si nécessaire
- Vérifie que les tables/colonnes existent avant de coder

#### Étape 2 — Models
- Crée/modifie les interfaces TypeScript dans `models/`
- Types stricts, pas de `any`

#### Étape 3 — Services
- Crée/modifie les composables `use{Entity}Service.ts`
- Pattern : fonctions async retournant `PostgrestSingleResponse` / `PostgrestResponse`
- Utilise `@/shared/services/supabaseClient`
- Applique `normalizeAccount()` si requêtes sur account avec relations

#### Étape 4 — Stores
- Crée/modifie les stores Pinia `use{Entity}Store.ts`
- Pattern : `data + loading + error + toast`
- Toast sur succès et erreur

#### Étape 5 — Composants
- `<script setup lang="ts">` obligatoire
- Design system : `.card`, `.input-field`, `.btn-primary`, color tokens
- Heroicons pour les icônes
- Mobile-first, responsive

#### Étape 6 — Vues
- Intègre les composants dans les vues
- Bottom sheets avec `Teleport` + `Transition` si nécessaire
- États de chargement et cas vides gérés

#### Étape 7 — Routes
- Ajoute les routes dans `src/modules/{name}/router/route.ts`
- Enregistre dans `src/router/index.ts`
- `meta: { requiresAuth: true }` pour les routes protégées

#### Étape 8 — Documentation
- Met à jour `DATABASE.md` si le schéma a changé
- Met à jour `ARCHITECTURE.md` si la structure a changé

### 3. Annonce de fin

Une fois l'implémentation terminée, annonce :

> **Phase Developer terminée.** Lancer `/qa` pour valider la qualité.

---

## Conventions à respecter
- Jamais d'appels Supabase directs dans les composants
- Jamais d'Options API
- Jamais d'inline styles — TailwindCSS uniquement
- Jamais de mutation de state hors des actions du store
- `patchAccount()` uniquement pour les champs de la table `account`, pas pour health/objectives
- Toujours utiliser les services dédiés pour les tables liées
