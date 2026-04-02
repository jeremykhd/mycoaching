# Layout & Responsive

## App Shell

All authenticated pages render inside `AppLayout.vue` which provides:
- `SidebarLeftComponent` — visible on desktop (md+)
- `SidebarTopComponent` — top bar
- `MenuBottomComponent` — visible on mobile only
- `<slot />` — the page content

Never re-implement the shell — routes inside `/` automatically get `AppLayout`.

## Responsive Pattern

Use `useDeviceIsMobile` composable for conditional rendering:

```vue
<script setup lang="ts">
import { useDeviceIsMobile } from '@/shared/composables/useDeviceIsMobile'
const { isMobile } = useDeviceIsMobile()
</script>

<template>
  <div v-if="isMobile">Mobile layout</div>
  <div v-else>Desktop layout</div>
</template>
```

## TailwindCSS Breakpoints

This project is **mobile-first**. Default styles = mobile, then override for larger:

```html
<!-- Mobile: stacked, Desktop: side by side -->
<div class="flex flex-col md:flex-row">

<!-- Mobile: hidden, Desktop: visible -->
<div class="hidden md:block">

<!-- Mobile: full width, Desktop: fixed width -->
<div class="w-full md:w-64">
```
