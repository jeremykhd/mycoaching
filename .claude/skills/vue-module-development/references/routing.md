# Routing Conventions

## Route File Pattern

Each module exports its routes from `router/route.ts`:

```ts
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/my-feature',
    name: 'my-feature',
    component: () => import('../views/MyFeatureView.vue'),
    meta: { requiresAuth: true }
  }
]

export default routes
```

## Rules

- Always use lazy imports (`() => import(...)`) — never static imports in route files
- Protected routes: `meta: { requiresAuth: true }`
- Public routes (login, verify-otp): no meta or `meta: { requiresAuth: false }`
- Child routes of the main layout go under the `AppLayout` parent route in `src/router/index.ts`

## Registration

After creating `router/route.ts`, import it in `src/router/index.ts`:

```ts
import myFeatureRoutes from '@/modules/my-feature/router/route'

const router = createRouter({
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        ...existingRoutes,
        ...myFeatureRoutes  // add here
      ]
    }
  ]
})
```

## Auth Guard Logic (src/router/index.ts)

The existing guard handles:
1. Fetch session if not loaded
2. `requiresAuth` + no session → `/login`
3. Session + no account → `/create-account`
4. Session + pendingVerification → `/verify-otp`
