# MyCoaching — Database Schema

Backend: **Supabase (PostgreSQL)**

---

## Entity Relationship Overview

```
auth.users (Supabase)
    │
    └── account (user_id → auth.users.id)
            ├── health_id         → health
            ├── objectives_id     → training_objectives
            ├── role_id           → role
            │
            ├── account_group ────→ group
            │                          ├── workout_group ──→ workout
            │                          └── create_by ──────→ account
            │
            ├── account_health (time-series weight log)
            │
            └── workout_session ──→ workout
                                        └── workout_exercise
                                                └── type → workout_exercise_type
```

---

## Tables

### `account`
Main user profile. Linked to Supabase auth via `user_id`.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | bigint | NO | PK |
| `user_id` | uuid | NO | FK → `auth.users.id` |
| `email` | varchar | YES | |
| `firstname` | varchar | YES | |
| `lastname` | varchar | YES | |
| `birthday` | date | YES | |
| `gender` | USER-DEFINED | YES | Enum (values TBD) |
| `phone_number` | varchar | YES | |
| `height` | integer | YES | cm |
| `health_id` | bigint | YES | FK → `health` |
| `objectives_id` | bigint | YES | FK → `training_objectives` |
| `role_id` | bigint | YES | FK → `role` |
| `is_active` | boolean | NO | |
| `created_at` | timestamptz | NO | |

---

### `health`
Health profile snapshot for an account (static reference data).

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | bigint | NO | PK |
| `height` | integer | YES | cm |
| `weight` | real | YES | current weight |
| `target_weight` | real | YES | goal weight |
| `measure_weight` | USER-DEFINED | YES | Enum: unit (kg/lbs) |
| `target_training` | smallint | YES | target sessions/week |

> **Note:** This is the static health profile. For historical weight tracking over time, see `account_health`.

---

### `account_health`
Time-series weight measurements for an account.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | bigint | NO | PK |
| `account_id` | bigint | YES | FK → `account` |
| `weight` | real | YES | measured weight |
| `date` | timestamptz | NO | measurement date |

> Use this table to draw weight-over-time charts. Different from `health` which is a point-in-time snapshot.

---

### `training_objectives`
Training goals linked to an account.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | bigint | NO | PK |
| `training_per_week` | smallint | YES | target sessions per week |
| `created_at` | timestamptz | NO | |

---

### `role`
Authorization roles.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | bigint | NO | PK |
| `name` | varchar | NO | e.g. `ROLE_ADMIN`, `ROLE_USER` |

---

### `group`
Training groups (coach can group athletes).

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | bigint | NO | PK |
| `name` | varchar | YES | |
| `description` | text | YES | |
| `create_by` | bigint | YES | FK → `account` (coach) |
| `created_at` | timestamptz | NO | |

---

### `account_group`
Junction table — many-to-many between accounts and groups.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | bigint | NO | PK |
| `account_id` | bigint | YES | FK → `account` |
| `group_id` | bigint | YES | FK → `group` |

---

### `workout`
Workout templates created by a coach.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | bigint | NO | PK |
| `title` | varchar | YES | |
| `subtitle` | varchar | YES | |
| `created_at` | timestamptz | NO | |

---

### `workout_exercise`
Exercises within a workout template.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | bigint | NO | PK |
| `workout_id` | bigint | YES | FK → `workout` |
| `type` | bigint | YES | FK → `workout_exercise_type` |
| `title` | varchar | YES | |
| `subtitle` | varchar | YES | |
| `body_weight` | boolean | YES | true = no external weight |
| `weight` | real | YES | kg |
| `repetitions` | integer | YES | reps per set |
| `set` | smallint | YES | number of sets |
| `rest` | smallint | YES | rest in seconds |

---

### `workout_exercise_type`
Categories/types for exercises (e.g. Strength, Cardio, Mobility).

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | bigint | NO | PK |
| `name` | varchar | NO | |

---

### `workout_group`
Junction table — workouts assigned to groups.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | bigint | NO | PK |
| `workout_id` | bigint | YES | FK → `workout` |
| `group_id` | bigint | YES | FK → `group` |
| `created_at` | timestamptz | NO | |

---

### `workout_session`
An actual workout performed by an athlete (tracks completion).

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | bigint | NO | PK |
| `account_id` | bigint | YES | FK → `account` (athlete) |
| `workout_id` | bigint | YES | FK → `workout` (template used) |
| `created_at` | timestamptz | NO | session start |
| `finished_at` | timestamp | YES | null = in progress |

---

### `training_session`
Individual exercise execution within a planning session.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | bigint | NO | PK |
| `plannings_session_id` | bigint | YES | FK → planning table (not yet in schema) |
| `title` | varchar | YES | |
| `subtitle` | varchar | YES | |
| `body_weight` | varchar | YES | |
| `weight` | real | YES | |
| `repetitions` | integer | YES | |
| `series_number` | smallint | YES | |
| `repos` | smallint | YES | rest in seconds |

> `plannings_session_id` references a planning/schedule table not yet present in the schema. This table may be part of a future planning feature.

---

## Key Relationships Summary

| From | Column | To | Type |
|------|--------|----|------|
| `account` | `user_id` | `auth.users.id` | 1-to-1 |
| `account` | `health_id` | `health` | 1-to-1 |
| `account` | `objectives_id` | `training_objectives` | 1-to-1 |
| `account` | `role_id` | `role` | many-to-1 |
| `account_health` | `account_id` | `account` | many-to-1 |
| `account_group` | `account_id` | `account` | many-to-many pivot |
| `account_group` | `group_id` | `group` | many-to-many pivot |
| `group` | `create_by` | `account` | many-to-1 |
| `workout_exercise` | `workout_id` | `workout` | many-to-1 |
| `workout_exercise` | `type` | `workout_exercise_type` | many-to-1 |
| `workout_group` | `workout_id` | `workout` | many-to-many pivot |
| `workout_group` | `group_id` | `group` | many-to-many pivot |
| `workout_session` | `account_id` | `account` | many-to-1 |
| `workout_session` | `workout_id` | `workout` | many-to-1 |

---

## Enums (USER-DEFINED types)

| Table | Column | Known values |
|-------|--------|-------------|
| `account` | `gender` | TBD |
| `health` | `measure_weight` | likely `kg` / `lbs` |

---

## Notes & Observations

- **Two health concepts:** `health` = static profile snapshot; `account_health` = time-series measurements. Use `account_health` for progress charts.
- **Groups feature:** Coaches can group athletes and assign workouts to entire groups via `workout_group` + `account_group`.
- **Planning feature (incomplete):** `training_session.plannings_session_id` suggests a scheduling/planning layer not yet fully modeled in the DB.
- **Workout vs Training session:** `workout_session` tracks when an athlete performed a `workout` template. `training_session` appears to be a different (possibly older or planning-based) concept.
