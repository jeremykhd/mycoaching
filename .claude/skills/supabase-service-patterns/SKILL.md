---
name: supabase-service-patterns
description: Supabase service layer patterns for MyCoaching. Use when writing or reviewing service composables that interact with the Supabase database.
user-invocable: false
---

# Supabase Service Patterns — MyCoaching

Guide for writing the service layer that connects the app to Supabase.

## When to Apply

Reference these guidelines when:
- Writing a new `use{Entity}Service.ts` composable
- Adding a new Supabase query
- Reviewing data access code
- Working with table relations (joins, nested selects)
- Handling Supabase errors

## Rule Categories

| Category | Reference file |
|----------|---------------|
| Service composable pattern | `references/service-pattern.md` |
| Query & relation syntax | `references/queries.md` |
| Database schema & relations | `references/schema.md` |
| Error handling | `references/error-handling.md` |

## Core Rule

**Never call Supabase directly in components or stores.**
Always: `Component → Store action → Service → Supabase`
