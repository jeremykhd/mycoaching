# MyCoaching — Claude Code Context

## Project Overview
A Vue 3 PWA coaching app. Coaches manage athlete accounts, health data, objectives, and workouts. Built mobile-first with Supabase as backend.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full architecture details and [DATABASE.md](./DATABASE.md) for the full database schema.

## Tech Stack
- **Vue 3** + TypeScript + Vite
- **Pinia** for state management
- **Vue Router 4** with navigation guards
- **Supabase** for auth (OTP/magic link) + database
- **TailwindCSS** with custom palettes (primary=sky, secondary=orange, night=slate)
- **Vitest** (unit) + **Cypress** (E2E)
- **Vercel** deployment + Docker dev environment

## Project Structure
```
src/
├── modules/        # Feature modules (auth, accounts, workout)
│   └── {module}/
│       ├── components/
│       ├── models/       # TypeScript interfaces
│       ├── services/     # Supabase composables
│       ├── store/        # Pinia store
│       ├── views/
│       ├── router/       # route.ts
│       └── __tests__/
├── shared/
│   ├── components/  # AppLayout, Sidebar, MenuBottom, Charts, Cards
│   ├── ui/          # Headless base components (UiCard, UiModal, UiInput, UiSelect)
│   ├── composables/ # useDeviceIsMobile
│   ├── services/    # supabaseClient.ts
│   └── utils/
└── router/index.ts  # Main router with auth guards
```

## Conventions

### Components
- PascalCase filenames: `ExerciseCreateForm.vue`
- Shared layout components: `*Component.vue` suffix
- UI primitives: `Ui*` prefix (e.g., `UiModal`, `UiInputText`)
- Use `<script setup lang="ts">` — no Options API

### Modules
When adding a new feature, follow the module pattern:
```
src/modules/{name}/
  components/, models/, services/, store/, views/, router/, __tests__/
```
Then import the router in `src/router/index.ts`.

### Services
- Composables returning async functions (not classes)
- Use Supabase client from `@/shared/services/supabaseClient`
- Pattern: `use{Entity}Service.ts`

### Stores (Pinia)
- Pattern: `use{Entity}Store.ts`
- Always show toast on success/error
- State: data + `loading: boolean` + `error: string | null`

### Routing
- Protected routes use `meta: { requiresAuth: true }`
- Module routes defined in `src/modules/{name}/router/route.ts`
- Main guard in `src/router/index.ts`

### Testing
- Unit tests with Vitest in `__tests__/` folder
- Use `testUtils.ts` mock factories (createMockUser, createMockAccount, etc.)
- Mock Supabase — never hit real DB in unit tests
- Test stores, services, and composables; not every component

## Environment Variables
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_ENDPOINT=
```

## Key Commands
```bash
npm run dev          # Dev server (localhost:5173)
npm run build        # Type check + production build
npm run test:unit    # Vitest unit tests
npm run test:e2e     # Cypress E2E (headless)
npm run lint         # ESLint with fix
npm run format       # Prettier
```

## Auth Flow
1. User enters email → OTP sent via Supabase
2. User enters OTP → session created
3. Router guard checks: session → account exists → route allowed
4. `useAuthStore` manages all auth state

## What to Avoid
- Do not use Options API — always Composition API with `<script setup>`
- Do not call Supabase directly in components — always go through services
- Do not mutate store state outside actions
- Do not add inline styles — use TailwindCSS classes
- Do not skip tests for stores and services

## Claude Behaviour
- Before creating any configuration file, skill, command, or setup for a third-party tool (Claude Code, Supabase, Vite, etc.), always verify the correct format and supported fields from the official documentation or by searching the web
- Never rely solely on patterns seen in the conversation or project as a substitute for documentation
- If unsure about a tool's format or API, search first — never guess and write

## New Feature Workflow
When asked to build a new feature or module:
1. **Always present a plan first** — list every file to create/edit, every DB table to create, and the order of operations
2. **Wait for validation** — do not create or edit any file until the user has approved the plan
3. Check `DATABASE.md` — if the required tables don't exist, include them in the plan and create them in Supabase via MCP after approval
4. Scaffold the full module structure: models, service, store, views, router, tests
5. Update `DATABASE.md` to reflect any new tables added
6. Always do database first, then code — never scaffold a module against tables that don't exist yet
