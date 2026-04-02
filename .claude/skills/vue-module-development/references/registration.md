# Module Registration Checklist

When a new module is complete, verify these steps:

## 1. Router registered
In `src/router/index.ts`, import and spread module routes into the `AppLayout` children array.

## 2. Navigation link added
Add a nav entry in the appropriate navigation component:
- Desktop: `src/shared/components/sidebar/SidebarLeftComponent.vue`
- Mobile: `src/shared/components/menu/MenuBottomComponent.vue`

## 3. Store available
Pinia stores are auto-registered via `createPinia()` in `main.ts` — no explicit registration needed.

## 4. Tests passing
Run `npm run test:unit` before considering the module complete.

## 5. Types consistent
Model interfaces match the DB schema in `DATABASE.md`.
