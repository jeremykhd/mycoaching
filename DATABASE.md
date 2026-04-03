# MyCoaching — Database Schema

Backend: **Supabase (PostgreSQL)**

---

## Entity Relationship Overview

```
auth.users (Supabase)
    │
    └── account (user_id → auth.users.id)
            ├── role_id           → role
            │
            ├── health (account_id → account)
            ├── training_objectives (account_id → account)
            ├── account_health (account_id → account, time-series weight)
            │
            ├── account_group ────→ group
            │                          ├── workout_group ──→ workout
            │                          └── create_by ──────→ account
            │
            ├── workout (account_id → account, creator)
            │     └── workout_exercise
            │           ├── type → workout_exercise_type
            │           ├── account_id → account (custom exercises)
            │           └── muscle_group, equipment, image_url...
            │
            ├── program (account_id → account)
            │     └── program_workout
            │           └── workout_id → workout
            │
            └── workout_session (account_id → account)
                  └── workout_session_exercise
                        └── workout_session_set (actual performance)
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
| `gender` | USER-DEFINED | YES | Enum |
| `phone_number` | varchar | YES | |
| `role_id` | bigint | YES | FK → `role` |
| `is_active` | boolean | NO | default false |
| `created_at` | timestamptz | NO | |

---

### `health`
Health profile for an account. Relation inverted: health points to account.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | bigint | NO | PK |
| `account_id` | bigint | YES | FK → `account` |
| `height` | integer | YES | cm |
| `weight` | real | YES | current weight |
| `target_weight` | real | YES | goal weight |
| `measure_weight` | USER-DEFINED | YES | Enum: frequency (daily/weekly/monthly) |
| `target_training` | smallint | YES | target sessions/week |

---

### `account_health`
Time-series weight measurements for progress charts.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | bigint | NO | PK |
| `account_id` | bigint | YES | FK → `account` |
| `weight` | real | YES | measured weight |
| `date` | timestamptz | NO | measurement date |

---

### `training_objectives`
Training goals. Relation inverted: objectives points to account.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | bigint | NO | PK |
| `account_id` | bigint | YES | FK → `account` |
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
Workout templates created by a user.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | bigint | NO | PK |
| `account_id` | bigint | YES | FK → `account` (creator) |
| `title` | varchar | YES | |
| `subtitle` | varchar | YES | |
| `created_at` | timestamptz | NO | |

---

### `workout_exercise`
Exercises within a workout template. Supports both imported (API) and custom exercises.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | bigint | NO | PK |
| `workout_id` | bigint | YES | FK → `workout` |
| `type` | bigint | YES | FK → `workout_exercise_type` |
| `account_id` | bigint | YES | FK → `account` (null = global, set = personal) |
| `title` | varchar | YES | |
| `subtitle` | varchar | YES | |
| `body_weight` | boolean | YES | true = no external weight |
| `weight` | real | YES | kg |
| `repetitions` | integer | YES | target reps per set |
| `set` | smallint | YES | target number of sets |
| `rest` | smallint | YES | rest in seconds |
| `muscle_group` | varchar | YES | primary muscle group |
| `secondary_muscles` | varchar | YES | secondary muscles |
| `equipment` | varchar | YES | required equipment |
| `image_url` | text | YES | exercise GIF/image URL |
| `instructions` | text | YES | exercise description |
| `is_custom` | boolean | NO | default true. false = imported from API |

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

### `program`
Training programs with defined duration and schedule.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | bigint | NO | PK |
| `account_id` | bigint | NO | FK → `account` (CASCADE) |
| `title` | varchar | NO | |
| `description` | text | YES | |
| `duration_weeks` | smallint | NO | default 4 |
| `start_date` | date | NO | |
| `end_date` | date | NO | |
| `is_active` | boolean | NO | default true |
| `created_at` | timestamptz | NO | |

---

### `program_workout`
Maps workouts to specific days within a program.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | bigint | NO | PK |
| `program_id` | bigint | NO | FK → `program` (CASCADE) |
| `workout_id` | bigint | NO | FK → `workout` (CASCADE) |
| `day_of_week` | smallint | NO | 1=Monday, 7=Sunday |
| `week_number` | smallint | NO | ≥ 1 |
| `created_at` | timestamptz | NO | |

---

### `workout_session`
An actual workout performed by a user.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | bigint | NO | PK |
| `account_id` | bigint | YES | FK → `account` |
| `workout_id` | bigint | YES | FK → `workout` (template used) |
| `notes` | text | YES | session notes |
| `created_at` | timestamptz | NO | session start |
| `finished_at` | timestamptz | YES | null = in progress |

---

### `workout_session_exercise`
Each exercise performed in a session (links to the template exercise).

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | bigint | NO | PK |
| `workout_session_id` | bigint | NO | FK → `workout_session` (CASCADE) |
| `workout_exercise_id` | bigint | NO | FK → `workout_exercise` |
| `order` | smallint | YES | exercise order in session |
| `notes` | text | YES | exercise-specific notes |
| `created_at` | timestamptz | NO | |

---

### `workout_session_set`
Each set performed — the actual performance data for progression tracking.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | bigint | NO | PK |
| `workout_session_exercise_id` | bigint | NO | FK → `workout_session_exercise` (CASCADE) |
| `set_number` | smallint | NO | series number (1, 2, 3...) |
| `repetitions` | integer | YES | actual reps performed |
| `weight` | real | YES | actual weight used |
| `body_weight` | boolean | YES | default false |
| `completed` | boolean | NO | default false |
| `created_at` | timestamptz | NO | |

---

## Key Relationships Summary

| From | Column | To | Type |
|------|--------|----|------|
| `account` | `user_id` | `auth.users.id` | 1-to-1 |
| `account` | `role_id` | `role` | many-to-1 |
| `health` | `account_id` | `account` | many-to-1 (1-to-1 in practice) |
| `training_objectives` | `account_id` | `account` | many-to-1 (1-to-1 in practice) |
| `account_health` | `account_id` | `account` | many-to-1 |
| `account_group` | `account_id` | `account` | many-to-many pivot |
| `account_group` | `group_id` | `group` | many-to-many pivot |
| `group` | `create_by` | `account` | many-to-1 |
| `workout` | `account_id` | `account` | many-to-1 |
| `workout_exercise` | `workout_id` | `workout` | many-to-1 |
| `workout_exercise` | `type` | `workout_exercise_type` | many-to-1 |
| `workout_exercise` | `account_id` | `account` | many-to-1 (custom exercises) |
| `workout_group` | `workout_id` | `workout` | many-to-many pivot |
| `workout_group` | `group_id` | `group` | many-to-many pivot |
| `workout_session` | `account_id` | `account` | many-to-1 |
| `workout_session` | `workout_id` | `workout` | many-to-1 |
| `workout_session_exercise` | `workout_session_id` | `workout_session` | many-to-1 (CASCADE) |
| `workout_session_exercise` | `workout_exercise_id` | `workout_exercise` | many-to-1 |
| `workout_session_set` | `workout_session_exercise_id` | `workout_session_exercise` | many-to-1 (CASCADE) |
| `program` | `account_id` | `account` | many-to-1 (CASCADE) |
| `program_workout` | `program_id` | `program` | many-to-1 (CASCADE) |
| `program_workout` | `workout_id` | `workout` | many-to-1 (CASCADE) |

---

## Enums (USER-DEFINED types)

| Table | Column | Known values |
|-------|--------|-------------|
| `account` | `gender` | `male`, `female` |
| `health` | `measure_weight` | `daily`, `weekly`, `monthly` |

---

## Progression Query Example

To get weight progression for a specific exercise over time:

```sql
SELECT
  wss.weight,
  wss.repetitions,
  wss.set_number,
  wse.created_at
FROM workout_session_set wss
JOIN workout_session_exercise wse ON wse.id = wss.workout_session_exercise_id
WHERE wse.workout_exercise_id = :exercise_id
ORDER BY wse.created_at ASC;
```
