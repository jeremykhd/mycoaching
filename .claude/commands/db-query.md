Help write a Supabase query for this project.

Request: $ARGUMENTS

Rules for this project:
- Always use the Supabase client from `@/shared/services/supabaseClient`
- Wrap the query in a composable service function: `use{Entity}Service.ts`
- Use `.select()` with explicit columns — avoid `select('*')` for joined queries
- For relations, use Supabase nested select syntax:
  ```ts
  .select('id, firstname, health:health_id(weight, height), role:role_id(name)')
  ```
- Always destructure `{ data, error }` and throw on error
- Return typed data using the project's model interfaces from `src/modules/*/models/`

Known relations from DATABASE.md:
- account → health (health_id), training_objectives (objectives_id), role (role_id)
- account ↔ group (via account_group)
- workout → workout_exercise → workout_exercise_type
- workout ↔ group (via workout_group)
- workout_session → account, workout
- account_health → account (time-series weight)

Show the complete service function and the corresponding TypeScript interface if it doesn't exist yet.
