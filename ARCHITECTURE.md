# MyCoaching — Architecture

## Overview

MyCoaching is a **mobile-first Progressive Web App** built with Vue 3. It allows coaches to manage athlete profiles, track health data, define training objectives, build workout programs, and track live workout sessions with actual performance data.

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
| `store/useAuthStore.ts` | Session, user, OTP, account state |

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
| `models/Role.ts` | Role interface |
| `services/useAccountService.ts` | Account CRUD + `normalizeAccount()` |
| `services/useHealthService.ts` | Health CRUD + weight history |
| `services/useObjectivesService.ts` | Objectives CRUD |
| `store/useAccountStore.ts` | Account, health, objectives state |
| `components/InformationsComponent.vue` | Profile info form |
| `components/HealthComponent.vue` | Health data form (create + update) |
| `components/AccountsListComponent.vue` | Admin accounts list |
| `components/AccountsFilterComponent.vue` | Admin filter |
| `views/AccountsView.vue` | All accounts (admin) |
| `views/ProfileView.vue` | Own profile |
| `views/CreateAccountView.vue` | First-time account creation |

### workout
Manages exercises, workouts, programs, live sessions, and session history.

| File | Role |
|------|------|
| **Models** | |
| `models/Exercise.ts` | Exercise interface |
| `models/Workout.ts` | Workout + WorkoutExercise + Block interfaces |
| `models/Program.ts` | Program + ProgramWorkout interfaces |
| `models/WorkoutSession.ts` | Session + SessionExercise + SessionSet interfaces |
| **Services** | |
| `services/useExerciseService.ts` | Exercise CRUD (Supabase) |
| `services/useExerciseApiService.ts` | wger.de API integration |
| `services/useWorkoutService.ts` | Workout template CRUD |
| `services/useProgramService.ts` | Programs, sessions, session deletion |
| **Stores** | |
| `store/useWorkoutStore.ts` | Exercises, exercise types |
| `store/useProgramStore.ts` | Programs, sessions |
| **Views** | |
| `views/ExercisesView.vue` | Exercise library |
| `views/ExerciseDetailView.vue` | Exercise detail |
| `views/WorkoutView.vue` | Workout templates list |
| `views/WorkoutCreateView.vue` | Create workout template |
| `views/WorkoutSessionDetailView.vue` | Workout template preview |
| `views/WorkoutListView.vue` | Completed sessions history (grouped by month) |
| `views/LiveSessionView.vue` | Live workout tracking (cancel, log sets) |
| `views/SessionPerformedDetailView.vue` | Actual session performance detail |
| `views/ProgramCreateView.vue` | Create program |
| `views/ProgramDetailView.vue` | Program detail |
| `views/ProgramEditView.vue` | Edit program |
| **Components** | |
| `components/CalendarStrip.vue` | Horizontal calendar strip |
| `components/MonthCalendar.vue` | Full month calendar |
| `components/ExerciseAccordion.vue` | Expandable exercise row |
| `components/ProgramCard.vue` | Program list card |
| `components/SessionCard.vue` | Session list card |
| `components/SetInputRow.vue` | Set input for live tracking |

---

## Shared Layer

### components
- `AppLayout.vue` — main shell: sidebar + top bar + bottom nav + slot
- `ActiveProgramCard.vue` — home screen active program with progress
- `HealthSummaryCard.vue` — home screen weight tracking with sparkline
- `SidebarLeftComponent.vue` — desktop persistent sidebar
- `SidebarTopComponent.vue` — top navigation bar
- `MenuBottomComponent.vue` — mobile bottom navigation
- `StatsCardComponent.vue` — dashboard stat cards
- `ModalComponent.vue` — generic modal
- Chart components: `BarChart`, `LineChart`, `RadarChart`, `DoughnutChart`

### ui (headless primitives)
| Component | Sub-components |
|-----------|---------------|
| `UiCard` | `UiCardTitle`, `UiCardIcon`, `UiCardText`, `UiCardNumber`, `UiCardContent` |
| `UiModal` | `UiModalHeader`, `UiModalBody`, `UiModalFooter` |
| `UiInputText` | — |
| `UiInputNumber` | — |
| `UiInputBase` | — |
| `UiSelect` | — |

### composables
- `useDeviceIsMobile.ts` — reactive mobile breakpoint detection

### services
- `supabaseClient.ts` — single Supabase client instance

### views
- `HomeView.vue` — dashboard with calendar, active program card, health card, weekly stats, day summary bottom sheet

---

## State Management (Pinia)

All stores follow this pattern:
```ts
export const useEntityStore = defineStore('entity', () => {
  const toast = useToast()
  const entity = ref<Entity | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

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
| `useAuthStore` | session, user, pendingVerification, account |
| `useAccountStore` | account, accounts[], health, objectives CRUD |
| `useWorkoutStore` | exercises[], exerciseTypes[] |
| `useProgramStore` | programs[], sessions[] |

---

## Routing

```
/login                          → LoginView (public)
/verify-otp                     → VerifyOTPView (public)
/ (AppLayout)
  /dashboard                    → HomeView (auth)
  /profil                       → ProfileView (auth)
  /accounts                     → AccountsView (auth + admin)
  /create-account               → CreateAccountView (auth, no account)
  /workout                      → WorkoutView (auth)
  /workout/create               → WorkoutCreateView (auth)
  /workout/session/:id          → WorkoutSessionDetailView (auth)
  /workout/history              → WorkoutListView (auth) — completed sessions
  /workout/history/:sessionId   → SessionPerformedDetailView (auth)
  /workout/live/:sessionId      → LiveSessionView (auth)
  /workout/program/create       → ProgramCreateView (auth)
  /workout/program/:id          → ProgramDetailView (auth)
  /workout/program/:id/edit     → ProgramEditView (auth)
  /exercises                    → ExercisesView (auth)
  /exercises/:id                → ExerciseDetailView (auth)
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

## Design System — Dark Glassmorphism

### Core CSS Classes
- `.card` — glass card (backdrop blur, border, shadow)
- `.input-field` — dark glass input
- `.btn-primary` — accent gradient button
- `.glass` — glass effect container
- `.press` — press-down animation on tap

### Color Tokens (Tailwind)
- Text: `text-text-primary`, `text-text-secondary`, `text-text-muted`
- Accent: `bg-accent-400/500`, `text-accent-400`
- Borders: `bg-white/[0.06]`, `border-white/[0.06]`
- Backgrounds: `bg-dark-800`, `bg-dark-900`

### UI Patterns
- Bottom sheets: `Teleport` + `Transition` + `animate-slide-up`
- Sparklines: SVG `<polyline>` computed from data
- Icons: Heroicons 24/outline (`h-4 w-4` to `h-6 w-6`)
- Mobile nav: `MenuBottomComponent.vue`

---

## Database (Supabase)

See [DATABASE.md](./DATABASE.md) for the full schema with all columns, types, and relations.

**Tables at a glance:**
| Table | Description |
|-------|-------------|
| `account` | User profiles linked to `auth.users` via `user_id` |
| `health` | Static health profile (height, weight, targets) |
| `account_health` | Time-series weight measurements |
| `training_objectives` | Training goals (sessions/week) |
| `role` | Authorization roles |
| `group` / `account_group` | Training groups (many-to-many) |
| `exercise` | Exercise catalog (wger API + custom) |
| `workout` | Workout templates |
| `workout_block` | Exercise groupings (supersets, trisets) |
| `workout_exercise` | Exercises within a workout template |
| `workout_exercise_type` | Exercise categories |
| `program` / `program_workout` | Training programs with schedule |
| `workout_session` | Actual performed sessions |
| `workout_session_exercise` | Exercises performed in a session |
| `workout_session_set` | Individual sets (actual weight, reps, completed) |

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
| Stores | Vitest + Pinia | All actions, loading states, error handling |
| Services | Vitest | Supabase calls (mocked) |
| Composables | Vitest | Logic and reactivity |
| Components | Vitest + @vue/test-utils | Key interactions only |
| E2E flows | Cypress | Auth flow, account creation |

Mock factories in `src/shared/test/testUtils.ts`.
