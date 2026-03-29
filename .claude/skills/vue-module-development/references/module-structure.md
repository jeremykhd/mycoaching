# Module Structure

Each module is a self-contained feature unit. Never share state or components directly between modules — go through `shared/`.

## Directory Rules

- `models/` — TypeScript interfaces only. No logic.
- `services/` — Supabase data access only. No state.
- `store/` — State management only. Calls services, never Supabase directly.
- `views/` — Page-level components. Use components and stores, no direct service calls.
- `components/` — Feature-specific UI. Can use store, cannot call services.
- `router/` — Single `route.ts` file, exported as default array.
- `__tests__/` — Unit tests for store and services only.

## Existing Modules (reference)

| Module | Path | Domain |
|--------|------|--------|
| auth | `src/modules/auth/` | OTP login, session management |
| accounts | `src/modules/accounts/` | Athlete profiles, health, objectives |
| workout | `src/modules/workout/` | Exercises, workout templates, sessions |
