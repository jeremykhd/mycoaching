---
name: vue-module-development
description: Vue 3 feature module development guide for MyCoaching. Use when scaffolding a new feature module, adding routes, or structuring a new domain area of the app.
user-invocable: false
---

# Vue Module Development — MyCoaching

Guide for building new feature modules in this project consistently with the existing codebase.

## When to Apply

Reference these guidelines when:
- Scaffolding a new feature module
- Adding routes to the app
- Structuring a new domain area (e.g. planning, nutrition, messaging)
- Onboarding into the project's module conventions

## Module Structure

Every feature lives in `src/modules/{name}/` with this layout:

```
src/modules/{name}/
├── __tests__/
│   └── use{Name}Store.test.ts
├── components/
├── models/
│   └── {Name}.ts
├── services/
│   └── use{Name}Service.ts
├── store/
│   └── use{Name}Store.ts
├── views/
│   └── {Name}View.vue
└── router/
    └── route.ts
```

## Rule Categories

| Category | Reference file |
|----------|---------------|
| Directory structure | `references/module-structure.md` |
| Routing conventions | `references/routing.md` |
| TypeScript models | `references/models.md` |
| Module registration | `references/registration.md` |

## How to Use

Read individual reference files for detailed patterns and examples:

```
references/module-structure.md
references/routing.md
references/models.md
references/registration.md
```
