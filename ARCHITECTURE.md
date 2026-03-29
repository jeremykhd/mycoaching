# MyCoaching — Architecture

## Overview

MyCoaching is a **mobile-first Progressive Web App** built with Vue 3. It allows coaches to manage athlete profiles, track health data, define objectives, and build workouts.

```
┌─────────────────────────────────────────────────┐
│                  Vue 3 SPA (PWA)                │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │   Auth   │  │ Accounts │  │   Workout    │  │
│  │  Module  │  │  Module  │  │   Module     │  │
│  └──────────┘  └──────────┘  └──────────────┘  │
│         ↕            ↕              ↕           │
│  ┌─────────────────────────────────────────┐   │
│  │           Shared (UI, Layout)           │   │
│  └─────────────────────────────────────────┘   │
│         ↕            ↕              ↕           │
│  ┌─────────────────────────────────────────┐   │
│  │         Pinia Stores (State)            │   │
│  └─────────────────────────────────────────┘   │
│         ↕                                       │
│  ┌─────────────────────────────────────────┐   │
│  │      Service Layer (Composables)        │   │
│  └─────────────────────────────────────────┘   │
│         ↕                                       │
└─────────────┬───────────────────────────────────┘
              ↓
     ┌─────────────────┐
     │    Supabase      │
     │  (Auth + DB)     │
     └─────────────────┘
```

---

## Modules

### auth
Handles authentication (OTP/magic link via Supabase).

| File | Role |
|------|------|
| `views/LoginView.vue` | Email input, sends OTP |
| `views/VerifyOTPView.vue` | Token input, verifies OTP |
| `components/AuthProvider.vue` | Wraps app, conditionally renders based on auth state |
| `store/useAuthStore.ts` | Session, user, OTP state |
| `services/useAuthService.ts` | Supabase auth calls |

**Auth State Machine:**
```
Unauthenticated → /login
  → sendOTP(email)
  → /verify-otp
  → verifyOTP(token)
  → Authenticated (no account) → /create-account
  → Authenticated (with account) → /dashboard
```

### accounts
Manages coach and athlete profiles, health data, and training objectives.

| File | Role |
|------|------|
| `models/Account.ts` | Account interface |
| `models/Health.ts` | Health data interface |
| `models/Objectives.ts` | Objectives interface |
| `models/Role.ts` | Role interface (ROLE_ADMIN, etc.) |
| `services/useAccountService.ts` | Account CRUD via Supabase |
| `services/useHealthService.ts` | Health CRUD |
| `services/useObjectivesService.ts` | Objectives CRUD |
| `store/useAccountStore.ts` | Account state |
| `views/AccountsView.vue` | List of all accounts (admin) |
| `views/ProfileView.vue` | Own profile |
| `views/CreateAccountView.vue` | First-time account creation |

### workout
Manages exercises, exercise types, and workout sessions.

| File | Role |
|------|------|
| `models/Exercise.ts` | Exercise interface |
| `models/ExerciseType.ts` | Exercise type/category interface |
| `services/useExerciseService.ts` | Exercise CRUD |
| `services/useWorkoutService.ts` | Workout session service |
| `store/useWorkoutStore.ts` | Exercise and workout state |
| `views/ExercisesView.vue` | Exercise library |
| `views/WorkoutView.vue` | Workout builder/tracker |
| `components/ExerciseCreateForm.vue` | New exercise form |

---

## Shared Layer

### components
- `AppLayout.vue` — main shell: sidebar + top bar + bottom nav + slot
- `SidebarLeftComponent.vue` — desktop persistent sidebar
- `SidebarTopComponent.vue` — top navigation bar
- `MenuBottomComponent.vue` — mobile bottom navigation
- `StatsCardComponent.vue` — dashboard stat cards
- Chart components: `BarChart`, `LineChart`, `RadarChart`, `DoughnutChart`

### ui (headless primitives)
| Component | Sub-components |
|-----------|---------------|
| `UiCard` | `UiCardTitle`, `UiCardIcon`, `UiCardText`, `UiCardNumber`, `UiCardContent` |
| `UiModal` | `UiModalHeader`, `UiModalBody`, `UiModalFooter` |
| `UiInputText` | — |
| `UiInputNumber` | — |
| `UiSelect` | — |

### composables
- `useDeviceIsMobile.ts` — reactive mobile breakpoint detection

### services
- `supabaseClient.ts` — single Supabase client instance

---

## State Management (Pinia)

All stores follow this pattern:
```ts
export const useEntityStore = defineStore('entity', () => {
  // State
  const entity = ref<Entity | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function fetchEntity(id: string) {
    loading.value = true
    try {
      entity.value = await entityService.get(id)
      toast.success('...')
    } catch (e) {
      error.value = e.message
      toast.error('...')
    } finally {
      loading.value = false
    }
  }

  return { entity, loading, error, fetchEntity }
})
```

**Stores:**
| Store | Purpose |
|-------|---------|
| `useAuthStore` | session, user, pendingVerification |
| `useAccountStore` | account, accounts[], health, objectives |
| `useWorkoutStore` | exercises[], exerciseTypes[] |

---

## Routing

```
/login                  → LoginView (public)
/verify-otp             → VerifyOTPView (public)
/ (AppLayout)
  /dashboard            → HomeView (auth)
  /profil               → ProfileView (auth)
  /accounts             → AccountsView (auth + admin)
  /create-account       → CreateAccountView (auth, no account)
  /workout              → WorkoutView (auth)
  /exercises            → ExercisesView (auth)
```

**Guard logic (src/router/index.ts):**
1. Fetch session if not loaded
2. `requiresAuth` + no session → `/login`
3. Session + no account → `/create-account`
4. Session + pendingVerification → `/verify-otp`
5. Already logged in + on `/login` → `/dashboard`

---

## Data Flow

```
Component
  → calls store action
    → store calls service
      → service calls Supabase
        → returns data
      → store updates state
    → store shows toast
  → component reacts to state
```

---

## Database (Supabase)

See [DATABASE.md](./DATABASE.md) for the full schema with all columns, types, and relations.

**Tables at a glance:**
| Table | Description |
|-------|-------------|
| `account` | User profiles linked to `auth.users` via `user_id` |
| `health` | Static health profile snapshot (height, weight, targets) |
| `account_health` | Time-series weight measurements for charts |
| `training_objectives` | Training goals (sessions/week) |
| `role` | Authorization roles (`ROLE_ADMIN`, `ROLE_USER`) |
| `group` | Training groups created by coaches |
| `account_group` | Many-to-many: accounts ↔ groups |
| `workout` | Workout templates |
| `workout_exercise` | Exercises within a workout template |
| `workout_exercise_type` | Exercise categories |
| `workout_group` | Many-to-many: workouts ↔ groups |
| `workout_session` | Actual performed sessions by an athlete |
| `training_session` | Planning-based sessions (planning feature, incomplete) |

---

## Deployment

| Environment | Config |
|-------------|--------|
| Development | Docker (Node 22-Alpine), Vite HMR, `localhost:5173` |
| Production | Vercel, SPA rewrite → `index.html`, 1-year asset cache, security headers |

**PWA:** Auto-update service worker via `vite-plugin-pwa`. App installable on mobile.

---

## Testing Strategy

| Layer | Tool | What to test |
|-------|------|-------------|
| Stores | Vitest + @pinia/testing | All actions, loading states, error handling |
| Services | Vitest | Supabase calls (mocked) |
| Composables | Vitest | Logic and reactivity |
| Components | Vitest + @vue/test-utils | Key interactions only |
| E2E flows | Cypress | Auth flow, account creation |

Mock factories in `src/shared/test/testUtils.ts`:
- `createMockUser()`, `createMockAccount()`, `createMockHealth()`
- `createMockSession()`, `createMockRole()`, `createMockAuthError()`
