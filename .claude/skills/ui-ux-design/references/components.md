# Component Library & Composition

## Available Reusable Components

### Layout
| Component | Path | Usage |
|-----------|------|-------|
| `AppLayout` | `shared/components/AppLayout.vue` | Main layout wrapper (sidebar + content + bottom nav) |
| `MenuBottomComponent` | `shared/components/menu/MenuBottomComponent.vue` | Fixed bottom navigation (4 tabs) |
| `SidebarLeftComponent` | `shared/components/sidebar/SidebarLeftComponent.vue` | Desktop sidebar |
| `SidebarTopComponent` | `shared/components/sidebar/SidebarTopComponent.vue` | Desktop top bar |

### UI Primitives (`shared/ui/`)
| Component | Usage |
|-----------|-------|
| `UiCard` | Base card wrapper — prefer `.card` class directly |
| `UiModal` | Modal overlay with `glass-strong` background |
| `UiInputText` | Text input with label, uses `.input-field` |
| `UiInputNumber` | Number input with label |
| `UiSelect` | Select dropdown, dark themed |

### Domain Components (`modules/workout/components/`)
| Component | Props | Usage |
|-----------|-------|-------|
| `SessionCard` | `title`, `subtitle?`, `badges?`, `totalWeight?`, `to?` | Workout session item with icon, badges, chevron. Renders as RouterLink when `to` provided |
| `CalendarStrip` | emits `@select(date)` | Month nav + week day strip with selectable dates |
| `ExerciseAccordion` | `name`, `sets[]`, `defaultOpen?` | Expandable exercise with series detail, PR badge |
| `SetInputRow` | `setNumber`, `weight`, `reps`, `rest`, `canDelete?` | Editable set row with 3 number inputs + delete |

## Component Composition Rules

### When to create a new component
- When the same visual pattern appears in **2+ views** — extract immediately
- When a section of a view is **self-contained** (has its own state or logic)
- When a pattern would be **useful in future pages** you can anticipate

### When NOT to create a component
- One-time layout arrangements (just use classes in the view)
- Simple wrappers around a single HTML element
- Components with only 1-2 lines of template

### Naming
- Module-specific: `src/modules/{module}/components/{Name}.vue`
- Shared across modules: `src/shared/components/{Name}Component.vue`
- UI primitives: `src/shared/ui/{category}/Ui{Name}.vue`

## Common Patterns

### Icon Container (circle)
```html
<div class="w-9 h-9 rounded-full bg-accent-500/15 flex items-center justify-center">
  <FireIcon class="h-4 w-4 text-accent-400" />
</div>
```

### Icon Container (square)
```html
<div class="w-8 h-8 rounded-lg bg-accent-500/15 flex items-center justify-center">
  <span class="text-accent-400 text-xs font-bold">3</span>
</div>
```

### Stat Display
```html
<div class="flex items-baseline space-x-1">
  <span class="text-2xl font-bold text-accent-400">3</span>
  <span class="text-sm text-text-muted">/4</span>
</div>
<p class="text-xs text-text-muted mt-1">hebdo</p>
```

### Card with Title + Link Icon
```html
<div class="card animate-fade-in-up stagger-N">
  <div class="flex items-center justify-between mb-4">
    <h2 class="text-sm font-semibold text-text-primary">Title</h2>
    <RouterLink to="/target" class="text-accent-400 hover:text-accent-300 transition-colors">
      <ArrowTopRightOnSquareIcon class="h-4 w-4" />
    </RouterLink>
  </div>
  <!-- content -->
</div>
```

### Full-Width Outlined Button (CTA)
```html
<button class="w-full flex items-center justify-center space-x-2 py-3 rounded-xl border border-accent-500 text-accent-400 font-medium hover:bg-accent-500/10 transition-all duration-200 press">
  <PlayIcon class="h-5 w-5" />
  <span>Action text</span>
</button>
```

### Full-Width Secondary Button
```html
<button class="w-full flex items-center justify-center space-x-2 py-3 rounded-xl border border-white/[0.08] text-text-secondary font-medium hover:bg-white/5 transition-all duration-200 press">
  <Cog6ToothIcon class="h-5 w-5" />
  <span>Secondary action</span>
</button>
```

### Dashed Add Button
```html
<button class="w-full flex items-center justify-center space-x-2 py-3 rounded-xl border border-dashed border-white/[0.12] text-accent-400 hover:bg-white/5 transition-all duration-200 press">
  <PlusIcon class="h-4 w-4" />
  <span class="text-sm font-medium">Ajouter un élément</span>
</button>
```

### Badge Row
```html
<div class="flex flex-wrap gap-1.5 mt-1">
  <span class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent-500/15 text-accent-400">
    +5% volume
  </span>
  <span class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-text-muted">
    Durée: 1h05m
  </span>
</div>
```

### Label / Value Row
```html
<div class="flex items-center justify-between">
  <p class="text-xs text-text-muted">Label</p>
  <p class="text-sm font-semibold text-text-primary">Value</p>
</div>
```

### Two-Column Info Card
```html
<div class="card">
  <div class="grid grid-cols-2 divide-x divide-white/[0.08]">
    <div class="pr-4">
      <div class="flex items-center space-x-2 mb-1">
        <CalendarIcon class="h-4 w-4 text-text-muted" />
        <span class="text-xs text-text-muted">Label</span>
      </div>
      <p class="text-sm font-medium text-text-primary">Value</p>
    </div>
    <div class="pl-4">
      <!-- same structure -->
    </div>
  </div>
</div>
```

## Icons

Use **Heroicons** exclusively:
- `@heroicons/vue/24/outline` — default for UI icons
- `@heroicons/vue/24/solid` — for filled/active states (e.g., `FireIcon` in session items)

Common icons used:
| Icon | Usage |
|------|-------|
| `ArrowLeftIcon` | Back navigation |
| `XMarkIcon` | Close/cancel |
| `ChevronRightIcon` | List item navigation |
| `ChevronDownIcon` | Accordion toggle |
| `ArrowTopRightOnSquareIcon` | External/detail link |
| `PlayIcon` | Start action |
| `PlusIcon` | Add item |
| `TrashIcon` | Delete |
| `ShareIcon` | Share action |
| `Cog6ToothIcon` | Settings |
| `CalendarIcon` | Date reference |
| `ClockIcon` | Duration |
| `PencilSquareIcon` | Edit |
| `TrophyIcon` | Records/achievements |
| `FireIcon` (solid) | Session/workout icon |
| `HomeIcon` | Nav: home |
| `CalendarDaysIcon` | Nav: programs |
| `ChartBarIcon` | Nav: progress |
| `UserIcon` | Nav: profile |
