Regenerate TypeScript types from the Supabase database schema.

1. Run: `npx supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > src/shared/types/database.types.ts`
   - If SUPABASE_PROJECT_ID is not set, extract it from VITE_SUPABASE_URL in .env (the subdomain part: `https://{project-id}.supabase.co`)
   - If supabase CLI is not installed, run `npm install -g supabase` first

2. After generating, check if any existing service interfaces in `src/modules/*/models/*.ts` are misaligned with the new types and report differences.

3. Do NOT automatically update model files — report what's changed and let the user decide.

Known tables in this project: account, health, account_health, training_objectives, role, group, account_group, workout, workout_exercise, workout_exercise_type, workout_group, workout_session, training_session.
