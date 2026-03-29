Review the current git changes (staged + unstaged) for this Vue 3 project.

1. Run `git diff HEAD` to see all changes.
2. For each changed file, evaluate:

**Code quality:**
- Follows Composition API + `<script setup lang="ts">` pattern
- No direct Supabase calls in components (must go through services)
- Store mutations only inside actions
- No inline styles — TailwindCSS classes only
- TypeScript types properly defined (no `any` unless justified)

**Architecture:**
- New features follow the module pattern (models / services / store / views / router)
- New UI elements use or extend the `shared/ui` primitives
- Route added to module `router/route.ts` and registered in `src/router/index.ts`

**Testing:**
- New store actions have corresponding tests
- New services have tests
- Mock factories from `testUtils.ts` used (not ad-hoc mocks)

**UX/Responsive:**
- Mobile layout considered (`useDeviceIsMobile` used where needed)
- `MenuBottomComponent` visible on mobile, sidebar on desktop

3. Output a concise list of findings: issues (must fix), suggestions (nice to have), and confirmed good patterns.
