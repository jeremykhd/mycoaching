# Database Schema Reference

Full schema is in `DATABASE.md`. Key relations for query writing:

## Main Relations

```
account
  ├── health_id         → health (1-to-1)
  ├── objectives_id     → training_objectives (1-to-1)
  ├── role_id           → role (many-to-1)
  └── user_id           → auth.users (1-to-1, Supabase auth)

account_health
  └── account_id        → account (time-series weight log)

account_group (pivot)
  ├── account_id        → account
  └── group_id          → group

group
  └── create_by         → account (coach who created it)

workout
  └── workout_exercise[]
        └── type        → workout_exercise_type

workout_group (pivot)
  ├── workout_id        → workout
  └── group_id          → group

workout_session
  ├── account_id        → account
  └── workout_id        → workout
```

## Table Names (exact, case-sensitive)

`account`, `health`, `account_health`, `training_objectives`, `role`,
`group`, `account_group`, `workout`, `workout_exercise`, `workout_exercise_type`,
`workout_group`, `workout_session`, `training_session`

## ID Types

All primary keys are `bigint` → use `number` in TypeScript.
`account.user_id` is `uuid` → use `string` in TypeScript.
