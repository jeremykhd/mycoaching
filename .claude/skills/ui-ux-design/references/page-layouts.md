# Page Layout Patterns

## General Structure

Every view follows this skeleton:

```vue
<template>
  <div class="space-y-{4|6} max-w-lg mx-auto">
    <!-- Header (animate-fade-in) -->
    <!-- Content sections (animate-fade-in-up stagger-N) -->
  </div>
</template>
```

- `space-y-4` for dense pages (dashboard)
- `space-y-6` for detail/form pages (more breathing room)

## Page Types

### 1. Dashboard / Home Page
A scrollable feed of cards with key metrics at a glance.

**Structure:**
1. Header — avatar + greeting or page title (no back arrow)
2. Primary CTA — outlined button, full-width
3. Metric cards — `.card` with title + icon link
4. Side-by-side stat cards — `grid grid-cols-2 gap-3`
5. List card — `.card` with title + items using `SessionCard` or similar
6. Secondary action — outlined button at bottom

**Pattern:**
```
[Avatar + Greeting]
[───── CTA Button ─────]
[Card: Section title ↗  ]
[  Content rows         ]
[Stat 1 ↗ ][Stat 2 ↗ ]
[Card: List title ↗     ]
[  Item > ]
[  Item > ]
[── Secondary button ──]
```

### 2. List / History Page
A filterable or chronological list of items.

**Structure:**
1. Header — back arrow + page title
2. Filter/Calendar — `CalendarStrip` or filter bar
3. Current section — label + date + list of cards
4. Past section — label + "Voir tout" link + list of cards

**Pattern:**
```
[← Page Title          ]
[  Calendar / Filters   ]
[Section label    Date  ]
[Card: Item with badges]
[Card: Item with badges]
[Past label    Voir tout]
[Card: Item             ]
[Card: Item             ]
```

### 3. Detail Page
Read-only view of a single entity with structured information.

**Structure:**
1. Header — back arrow + entity title + action icon (share, edit)
2. Info card — key metadata in `grid grid-cols-2 divide-x` (date + duration, etc.)
3. Content sections — each with `h2` title then `.card` content
4. Expandable items — `ExerciseAccordion` for nested data
5. Notes section — `.card` with body text
6. Bottom action — outlined CTA button

**Pattern:**
```
[← Entity Title      🔗]
[Card: Meta 1 | Meta 2 ]
[Section Title          ]
[Card: Accordion items  ]
[  ▸ Item 1 (tap open) ]
[  ▸ Item 2            ]
[Notes Title            ]
[Card: Free text        ]
[── Action Button ─────]
```

### 4. Form / Edit Page
Editable view with inputs and dynamic lists.

**Structure:**
1. Header — X close button + form title
2. Input fields — `grid grid-cols-2 gap-3` for paired fields, full-width for single
3. Textarea — for notes/descriptions
4. Dynamic list — `TransitionGroup` of `.card` items, each with header + input rows
5. Add button — dashed border, accent text
6. Submit button — `.btn-primary` full-width at bottom

**Pattern:**
```
[✕ Form Title          ]
[Date input][Duration  ]
[Notes textarea        ]
[Section Title          ]
[Card: Item header  🗑 ]
[  Set row inputs      ]
[  Set row inputs      ]
[  + Add set           ]
[Card: Another item 🗑 ]
[  ...                 ]
[┈ + Add item ┈┈┈┈┈┈┈┈]
[████ Submit Button ████]
```

### 5. Profile / Settings Page
User information with grouped sections.

**Structure:**
1. Header — centered avatar (large, ring-accent) + name
2. Info sections — labeled `.card` groups (Personal, Health, Objectives)
3. Each section — label/value rows or editable fields
4. Actions — logout, danger zone at bottom

**Pattern:**
```
[    Avatar (lg)        ]
[    User Name          ]
[    @handle / email    ]
[Card: Section 1        ]
[  Label        Value   ]
[  Label        Value   ]
[Card: Section 2        ]
[  Label        Value   ]
[── Danger action ─────]
```

## Header Variants

| Context | Left | Center | Right |
|---------|------|--------|-------|
| Root page (dashboard) | Avatar | — | — |
| Sub-page | `← ArrowLeftIcon` + Title | — | — |
| Detail page | `← ArrowLeftIcon` + Title | — | `ShareIcon` |
| Form/modal | `✕ XMarkIcon` + Title | — | — |

- Back/close buttons: `p-1.5 rounded-lg hover:bg-white/5 transition-colors press`
- Icons: `h-5 w-5 text-text-secondary`

## Section Title Pattern

Always use this structure for titled sections:

```html
<!-- With action link -->
<div class="flex items-center justify-between mb-3">
  <h2 class="text-sm font-semibold text-text-primary">Title</h2>
  <RouterLink to="/target" class="text-accent-400 hover:text-accent-300 transition-colors">
    <ArrowTopRightOnSquareIcon class="h-4 w-4" />
  </RouterLink>
</div>

<!-- With text action -->
<div class="flex items-center justify-between mb-3">
  <h2 class="text-sm font-semibold text-text-primary">Title</h2>
  <button class="text-xs text-accent-400 hover:text-accent-300 transition-colors">
    Voir tout
  </button>
</div>

<!-- Simple -->
<h2 class="text-sm font-semibold text-text-primary mb-3">Title</h2>
```

## Empty States

When a list or section has no data:

```html
<div class="card flex flex-col items-center justify-center py-8 text-center">
  <IconComponent class="h-10 w-10 text-text-muted mb-3" />
  <p class="text-sm text-text-secondary mb-1">Aucune séance trouvée</p>
  <p class="text-xs text-text-muted">Commencez par créer votre première séance</p>
  <button class="btn-primary mt-4 text-sm">Créer une séance</button>
</div>
```
