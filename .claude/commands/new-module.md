Scaffold a new feature module for this Vue 3 project.

The module name is: $ARGUMENTS

Create the full module structure under `src/modules/{name}/`:

```
src/modules/{name}/
├── __tests__/
│   └── use{Name}Store.test.ts     # Vitest store tests using testUtils.ts mocks
├── components/                    # (empty, ready for components)
├── models/
│   └── {Name}.ts                  # TypeScript interface for the entity
├── services/
│   └── use{Name}Service.ts        # Supabase composable service
├── store/
│   └── use{Name}Store.ts          # Pinia store
├── views/
│   └── {Name}View.vue             # Main view component
└── router/
    └── route.ts                   # Vue Router route definition
```

Rules to follow:
- Use `<script setup lang="ts">` in all .vue files
- Service: composable pattern returning async functions, use `@/shared/services/supabaseClient`
- Store: follow pattern in ARCHITECTURE.md (state + loading + error + toast notifications)
- Model: clean TypeScript interface with `id`, `created_at`, and relevant fields
- Route: protected with `meta: { requiresAuth: true }`, use lazy import
- Test: scaffold basic describe block using createTestWrapper and mock factories from `@/shared/test/testUtils`
- After creating files, show the line to add in `src/router/index.ts` to register the module route

Do NOT modify src/router/index.ts automatically — show the user what to add.
