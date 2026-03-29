# TailwindCSS Conventions

## Custom Color Palette

| Alias | Color | Use for |
|-------|-------|---------|
| `primary` | sky | Main actions, buttons, links, active states |
| `secondary` | orange | Accents, highlights, secondary actions |
| `night` | slate | Backgrounds, text, borders, neutral UI |

```html
<!-- Primary button -->
<button class="bg-primary-600 hover:bg-primary-700 text-white">

<!-- Secondary accent -->
<span class="text-secondary-500">

<!-- Dark background -->
<div class="bg-night-900 text-night-100">
```

## Rules

- No inline styles — always TailwindCSS classes
- No custom CSS unless TailwindCSS genuinely cannot do it
- Use `@apply` in `<style>` only for heavily repeated patterns
- Color names: use the palette aliases (`primary`, `secondary`, `night`) not the raw color (`sky`, `orange`, `slate`)

## Common Patterns

```html
<!-- Card -->
<div class="bg-white dark:bg-night-800 rounded-xl shadow p-4">

<!-- Form input wrapper -->
<div class="flex flex-col gap-2">

<!-- Section spacing -->
<section class="space-y-4">

<!-- Loading spinner placeholder -->
<div class="animate-pulse bg-night-200 rounded h-4 w-full">
```
