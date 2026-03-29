# Naming & File Structure

## Naming Rules

| Type | Convention | Example |
|------|-----------|---------|
| Feature component | `PascalCase` + `Component` suffix | `AccountFormComponent.vue` |
| Page/view | `PascalCase` + `View` suffix | `ProfileView.vue` |
| UI primitive | `Ui` prefix + `PascalCase` | `UiModal.vue`, `UiInputText.vue` |
| Icon | `PascalCase` + `Icon` suffix | `DumbbellIcon.vue` |

## Where to Place Components

| Location | When to use |
|----------|-------------|
| `src/modules/{name}/components/` | Feature-specific, used only in that module |
| `src/shared/components/` | Reusable across modules (layout, charts, cards) |
| `src/shared/ui/` | Headless base primitives, minimal/no styling |

## File Structure per Component

Single `.vue` file with three blocks in order:
1. `<script setup lang="ts">`
2. `<template>`
3. `<style>` (only if needed — prefer TailwindCSS)
