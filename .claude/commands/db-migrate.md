Scaffold a new Supabase SQL migration file.

Description: $ARGUMENTS

1. Check if `supabase/migrations/` directory exists. If not, note that `supabase init` needs to be run first.

2. Create a new migration file: `supabase/migrations/{timestamp}_{slug}.sql`
   - Timestamp format: `YYYYMMDDHHMMSS` (use current date/time)
   - Slug: snake_case description derived from the argument

3. Write the SQL migration following these conventions:
   - Use `bigint generated always as identity` for primary keys (matches existing tables)
   - Use `timestamptz` for timestamps (not `timestamp`)
   - Add `NOT NULL` constraints explicitly
   - Include a rollback comment block at the top showing the reverse operation
   - For new junction/pivot tables, name them `{table_a}_{table_b}` (e.g., `account_group`)
   - For enums, use `CREATE TYPE ... AS ENUM`

4. Reference existing tables from DATABASE.md when adding foreign keys.

Show the complete SQL file content.
