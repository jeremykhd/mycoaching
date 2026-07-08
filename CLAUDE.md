# MyCoaching — Claude Code Context

## Project Overview
A **Vue 3 PWA** coaching app built mobile-first. Coaches manage athlete accounts, health tracking, training programs, workout sessions (live + history), and objectives. Supabase handles auth (OTP) and database.

- **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Database schema**: [DATABASE.md](./DATABASE.md)
- **Supabase project**: `cqgkbaubyydehaqhrmab`

## Tech Stack
- **Vue 3** + TypeScript + Vite (PWA via `vite-plugin-pwa`)
- **Pinia** — state management
- **Vue Router 4** — navigation guards for auth
- **Supabase** — auth (OTP/magic link) + PostgreSQL
- **TailwindCSS** — dark glassmorphism design system
- **Heroicons** (`@heroicons/vue`) — icon library
- **vue-toastification** — toast notifications
- **Vitest** (unit) + **Cypress** (E2E)
- **Vercel** — production deployment
- **Docker** — dev environment (Node 22-Alpine)

## Project Structure
```
src/
├── modules/
│   ├── auth/          # OTP login, session management
│   ├── accounts/      # Profiles, health, objectives
│   └── workout/       # Exercises, workouts, programs, sessions
├── shared/
│   ├── components/    # AppLayout, Sidebar, MenuBottom, Cards, Charts
│   ├── ui/            # UiCard, UiModal, UiInput, UiSelect (headless)
│   ├── composables/   # useDeviceIsMobile
│   ├── services/      # supabaseClient.ts
│   └── views/         # HomeView
└── router/index.ts    # Main router + auth guards
```

Each module follows:
```
src/modules/{name}/
  components/ models/ services/ store/ views/ router/ __tests__/
```

## Design System — Dark Glassmorphism

### CSS Classes (defined in global styles)
- `.card` — glass card with backdrop blur, border, shadow
- `.input-field` — dark glass input
- `.btn-primary` — accent gradient button
- `.glass` — glass effect container
- `.press` — press-down animation on tap

### Color Tokens (Tailwind)
- `text-text-primary` / `text-text-secondary` / `text-text-muted`
- `bg-accent-400` / `bg-accent-500` / `text-accent-400`
- `bg-white/[0.06]` — subtle borders and dividers
- `bg-dark-800` / `bg-dark-900` — background layers

### UI Patterns
- Bottom sheets: `Teleport` + `Transition` + `animate-slide-up`
- Mobile navigation: `MenuBottomComponent.vue`
- Cards: `.card` class with consistent padding/radius
- Icons: Heroicons 24/outline, sized `h-4 w-4` to `h-6 w-6`

## Conventions

### Components
- PascalCase: `ExerciseCreateForm.vue`
- `<script setup lang="ts">` — never Options API
- Shared layout: `*Component.vue` suffix
- UI primitives: `Ui*` prefix

### Services
- Composables: `use{Entity}Service.ts`
- Always use `@/shared/services/supabaseClient`
- Return Supabase `PostgrestSingleResponse` / `PostgrestResponse`
- Use `normalizeAccount()` when querying account with relations (Supabase returns arrays for 1-to-many even if 1-to-1 in practice)

### Stores (Pinia)
- Pattern: `use{Entity}Store.ts`
- State: `data + loading: boolean + error: string | null`
- Toast on success/error via `vue-toastification`
- Never mutate state outside store actions

### Routing
- Protected: `meta: { requiresAuth: true }`
- Module routes in `src/modules/{name}/router/route.ts`
- Import in `src/router/index.ts`

### Testing
- Vitest in `__tests__/` within each module
- Mock Supabase — never hit real DB
- Mock `vue-toastification`
- Test stores and services, not every component

## Key Commands
```bash
npm run dev          # Dev server (localhost:5173)
npm run build        # Type check + production build
npm run test:unit    # Vitest unit tests
npm run test:e2e     # Cypress E2E
npm run lint         # ESLint with fix
npm run format       # Prettier
```

## Auth Flow
1. Email → OTP sent via Supabase
2. OTP verified → session created
3. Guard: session → account exists → route
4. `useAuthStore` manages auth state

## Known Patterns

### Supabase Array Normalization
Supabase returns one-to-many relations as arrays even for 1-to-1 relationships (no UNIQUE constraint on `health.account_id` / `training_objectives.account_id`). The `normalizeAccount()` function in `useAccountService.ts` transforms `health: [{...}]` → `health: {...}`.

### Exercise Catalog
Exercises come from wger.de API (`is_custom: false`) or are user-created (`is_custom: true`). Both are stored in the `exercise` table.

### Workout Session Lifecycle
1. Start session → create `workout_session` (finished_at = null)
2. Log sets → `workout_session_exercise` + `workout_session_set`
3. Finish → set `finished_at` timestamp
4. Cancel → delete `workout_session`

## What to Avoid
- Options API — always Composition API with `<script setup>`
- Direct Supabase calls in components — always through services
- Inline styles — use TailwindCSS
- Mutating store state outside actions
- Skipping tests for stores and services
- Using `patchAccount()` to update related tables (health, objectives) — use their dedicated services

## Claude Behaviour
- Before creating config files for any third-party tool, verify format from official docs or web search — never guess
- Never rely solely on conversation patterns as a substitute for documentation

## Agents & Commandes

### Agents principaux (pipeline)
| Commande | Rôle | Quand l'utiliser |
|----------|------|-----------------|
| `/architect` | Analyse les besoins, vérifie DATABASE.md, produit un plan détaillé | Avant toute implémentation |
| `/developer` | Implémente un plan validé (DB → models → services → stores → views → routes) | Après validation du plan |
| `/qa` | Écrit les tests, lance build/lint/tests, review qualité | Après implémentation |

### Orchestrateurs
| Commande | Rôle |
|----------|------|
| `/feature <description>` | Pipeline complet : Architect → (validation) → Developer → QA |
| `/bugfix <description>` | Diagnostic → Fix → Validation (build + tests) |
| `/refactor <cible>` | Analyse → Refactoring → Validation (sans changement de comportement) |

### Utilitaires
| Commande | Rôle |
|----------|------|
| `/commit` | Commit conventionnel avec tags `[ADD]`, `[FIX]`, `[REFACTOR]` |
| `/review` | Review des changements git (qualité, archi, tests, UX) |
| `/test` | Lance les tests unitaires, diagnostique les échecs |
| `/doc` | Met à jour DATABASE.md et ARCHITECTURE.md |
| `/new-module <name>` | Scaffold un nouveau module complet |
| `/new-component <name> in <location>` | Crée un composant Vue |
| `/store <name>` | Crée un store Pinia avec tests |
| `/db-migrate` | Scaffold une migration SQL |
| `/db-query` | Aide à écrire une requête Supabase |
| `/db-types` | Régénère les types TypeScript depuis Supabase |

### Workflow recommandé
- **Nouvelle feature** → `/feature` ou `/architect` + `/developer` + `/qa`
- **Bug** → `/bugfix`
- **Refactoring** → `/refactor`
- **Quick fix** → correction directe + `/qa`

## Hooks (Quality Gates)

Configurés dans `.claude/settings.json` :

| Event | Matcher | Action |
|-------|---------|--------|
| `PreToolUse` | `Bash` | Bloque les commandes dangereuses (`rm -rf`, `git push --force`, `git reset --hard`, `git clean -f`) |
| `PostToolUse` | `Write\|Edit` | Lance ESLint automatiquement sur le fichier modifié |

## New Feature Workflow
1. **Plan first** — list every file to create/edit, every DB table needed
2. **Wait for user validation** — do not create or edit until approved
3. Check `DATABASE.md` — include new tables in plan if needed
4. Database first, then code — never scaffold against non-existent tables
5. Update `DATABASE.md` after adding tables
6. Scaffold full module: models → service → store → views → router → tests
