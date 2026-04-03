# UX Principles & Mobile-First Rules

## Core Principles

### 1. Content Hierarchy
Every screen must have a clear visual hierarchy:
1. **Primary** — the main action or information (biggest, boldest, accent-colored)
2. **Secondary** — supporting info (smaller, text-secondary)
3. **Tertiary** — meta/context (smallest, text-muted)

Never give equal visual weight to everything — pick what matters most and make it stand out.

### 2. Information Density
- **Dashboard**: high density — many cards, compact stats, quick-scan layout
- **Detail pages**: medium density — structured sections, room to breathe
- **Forms**: low density — one concern per visible area, clear labels
- **Empty states**: very low — centered message, single action

### 3. Progressive Disclosure
Don't show everything at once:
- Use accordions for nested data (exercises → sets)
- Use "Voir tout" links for long lists (show 2-3 items, link to full list)
- Use modals for secondary actions (create, confirm delete)
- Complex data → card summary first, detail page on tap

### 4. Feedback & Affordance
Every interactive element must communicate that it's interactive:
- Tappable items → `press` or `press-sm` effect + hover state
- Navigation → chevron `>` on right side
- Links → accent color (`text-accent-400`)
- Active state → accent bar, scale, color change
- Destructive → red tint (`text-red-400/60`)

## Mobile-First Rules

### Layout
- All content: `max-w-lg mx-auto` (never wider than ~512px on mobile)
- No horizontal scrolling — ever
- Bottom nav fixed, content scrolls behind it
- Add `pb-32` to main content to clear bottom nav
- Touch targets minimum 44×44px effective area

### Navigation
- Bottom nav for primary sections (4 tabs max)
- Back arrow (`←`) for sub-pages, never rely on browser back
- Close button (`✕`) for forms/modals
- Swipe gestures are optional enhancements, never the only way

### Typography
- No text smaller than `text-[10px]` (badges/micro-labels only)
- Body text minimum `text-sm` (14px)
- Line length naturally capped by `max-w-lg`

### Touch Interactions
- Tap targets: minimum `p-3` for list items, `py-3` for buttons
- No hover-only interactions — everything must work on tap
- Use `press` for tactile feedback on every tappable element
- Avoid double-tap or long-press as primary actions

### Forms
- Label above input (not inline)
- Full-width inputs on mobile
- `grid grid-cols-2 gap-3` for paired short inputs (date + time)
- Textarea for notes: minimum `rows="3"`
- Submit button always visible (not behind keyboard) — position at bottom of scroll

## Design Decisions Guide

When designing a new page without a mockup, ask yourself:

### What type of page is this?
→ See `page-layouts.md` for the 5 patterns (dashboard, list, detail, form, profile)

### What's the primary action?
→ Make it the most prominent element (CTA button, or first card)

### What data does the user need?
→ Organize into cards by concern. One card = one topic.

### What can the user do here?
→ Each action needs a clear affordance (button, link, tappable card)

### What if there's no data?
→ Design the empty state (icon + message + CTA)

## Localization

- All UI text in French
- Date format: `toLocaleDateString('fr-FR', ...)` 
- Number format: use comma for decimals (4,2T not 4.2T)
- Common labels: "Voir tout", "Ajouter", "Enregistrer", "Modifier", "Supprimer", "Annuler"

## Accessibility Baseline

- All images: `alt` attribute (can be empty for decorative)
- Icon buttons: wrap in `<button>` with accessible name or `aria-label`
- Color contrast: accent on black = always sufficient; text-muted on black = decorative only, never for essential info
- Focus states: all interactive elements have `focus:ring-2 focus:ring-accent-500/30`

## Anti-Patterns to Avoid

| Don't | Do instead |
|-------|-----------|
| Solid colored card backgrounds | Glass effect (`.card` or `.glass`) |
| Gray text on gray background | Use text hierarchy (primary/secondary/muted) |
| Emoji as icons | Heroicons outline/solid |
| Inline styles | TailwindCSS utility classes |
| Fixed pixel widths | Responsive widths (`w-full`, `max-w-lg`) |
| Horizontal scroll on mobile | Stack vertically or use grid |
| More than 4 bottom nav items | Prioritize — 4 max |
| Animations longer than 500ms | Keep it snappy (200-400ms) |
| Multiple CTA per screen | One primary, others secondary/ghost |
| Text-heavy empty states | Icon + short message + action |
