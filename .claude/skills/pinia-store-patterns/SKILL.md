---
name: pinia-store-patterns
description: Pinia store patterns for MyCoaching. Use when creating or modifying Pinia stores, writing store tests, or reviewing state management code.
user-invocable: false
---

# Pinia Store Patterns — MyCoaching

Guide for consistent state management across all modules.

## When to Apply

Reference these guidelines when:
- Creating a new `use{Entity}Store.ts`
- Adding actions to an existing store
- Writing store unit tests
- Reviewing state management code
- Deciding where logic belongs (store vs service vs component)

## Rule Categories

| Category | Reference file |
|----------|---------------|
| Store structure & state | `references/store-structure.md` |
| Action patterns | `references/actions.md` |
| Testing stores | `references/testing.md` |

## Core Rules

- Use composition API setup stores (`defineStore('name', () => { ... })`)
- Every store has: `loading: Ref<boolean>` + `error: Ref<string | null>`
- Always show toast on success and error
- Never call Supabase directly — always call service functions
- Never mutate state outside of store actions
