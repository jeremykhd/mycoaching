# Animation & Micro-Interactions

## Page Entrance Animations

Every view uses staggered entrance animations. Elements appear one after another with a slight delay.

### Pattern
```html
<!-- Header always fades in first -->
<div class="animate-fade-in">Header</div>

<!-- Each section staggers with increasing delay -->
<div class="animate-fade-in-up stagger-1">Section 1</div>
<div class="animate-fade-in-up stagger-2">Section 2</div>
<div class="animate-fade-in-up stagger-3">Section 3</div>
```

### Available Animations (Tailwind)
| Class | Effect | Duration |
|-------|--------|----------|
| `animate-fade-in` | Opacity 0→1 | 0.4s ease-out |
| `animate-fade-in-up` | Opacity 0→1 + translateY(16px→0) | 0.5s ease-out |
| `animate-scale-in` | Opacity 0→1 + scale(0.95→1) | 0.3s ease-out |
| `animate-slide-in-right` | Opacity 0→1 + translateX(20px→0) | 0.4s ease-out |
| `animate-slide-in-left` | Opacity 0→1 + translateX(-20px→0) | 0.4s ease-out |

### Stagger Delays
| Class | Delay |
|-------|-------|
| `stagger-1` | 50ms |
| `stagger-2` | 100ms |
| `stagger-3` | 150ms |
| `stagger-4` | 200ms |
| `stagger-5` | 250ms |
| `stagger-6` | 300ms |
| `stagger-7` | 350ms |
| `stagger-8` | 400ms |

### Rules
- Header: `animate-fade-in` (no stagger)
- First content section: `stagger-1`
- Increment by 1 for each subsequent section
- For items inside a `v-for`, use dynamic stagger: `:class="'stagger-' + (index + offset)"`
- Max stagger-8 — don't make the user wait longer than 400ms for content

## Route Transitions

Defined in `main.css`, applied via `<Transition>` in `App.vue`.

| Transition name | Effect | Use case |
|----------------|--------|----------|
| `page` (default) | Fade + slide Y (12px) | Standard page navigation |
| `slide` | Fade + slide X (24px) | Sub-page navigation (detail → edit) |

To use slide for a route, add to route meta:
```ts
meta: { requiresAuth: true, transition: 'slide' }
```

## Vue Transitions

### Accordion (`<Transition name="accordion">`)
- Expand/collapse with max-height animation
- Used in `ExerciseAccordion` for toggling content
- 250ms ease-out (enter), 200ms ease-in (leave)

### List (`<TransitionGroup name="list">`)
- Items enter with fade + translateY(12px)
- Items leave with fade + scale(0.95)
- Items move with smooth transform transition
- Used for dynamic add/remove of exercises, sets, list items

```html
<TransitionGroup name="list" tag="div" class="space-y-4">
  <div v-for="item in items" :key="item.id">
    <!-- content -->
  </div>
</TransitionGroup>
```

## Micro-Interactions

### Press Effects
| Class | Scale | Duration | Use case |
|-------|-------|----------|----------|
| `press` | 0.97 on `:active` | 150ms | Full-width buttons, CTA, nav items |
| `press-sm` | 0.98 on `:active` | 100ms | Cards, list items, small buttons, calendar days |

### Apply `press` to:
- All buttons (CTA, action buttons, icon buttons)
- All tappable cards and list items
- Navigation items in bottom menu
- Calendar day buttons

### Hover Transitions
Always include `transition-all duration-200` or `transition-colors` on interactive elements:
- Buttons: `hover:bg-accent-500/10` or `hover:bg-white/5`
- Links: `hover:text-accent-300`
- Cards: `hover:bg-white/5` (only if tappable)
- Delete buttons: `text-red-400/60 hover:text-red-400`

### State Transitions
- Active nav item: `transition-all duration-300` for color + scale change
- Calendar selected date: `transition-all duration-300` with `scale-110` + `shadow-lg shadow-accent-500/25`
- Accordion chevron: `transition-transform duration-300` with `rotate-180`
- Bottom nav indicator bar: `transition-all duration-300`

## Performance Rules
- Use `will-change-transform` sparingly (only on elements that animate frequently)
- Prefer `transform` and `opacity` animations (GPU-accelerated)
- Never animate `width`, `height`, `margin`, or `padding` directly
- Use `max-height` for accordion (acceptable trade-off for simplicity)
- Keep total animation duration under 500ms — anything longer feels sluggish
