---
name: ui-ux-design
description: UI/UX design system and page design guidelines for MyCoaching. Use when creating new views, designing page layouts, building UI components, or making design decisions without a mockup.
user-invocable: false
---

# UI/UX Design System — MyCoaching

Expert design guidelines for creating polished, consistent, mobile-first views in the MyCoaching dark glassmorphism design system.

## When to Apply

Reference these guidelines when:
- Creating a new view or page without a provided mockup
- Designing the layout and structure of a screen
- Choosing which components to use and how to compose them
- Making visual or UX decisions (spacing, hierarchy, animations)
- Building or extending reusable components

## Rule Categories

| Category | Reference file |
|----------|---------------|
| Design tokens & visual identity | `references/design-tokens.md` |
| Page layout patterns | `references/page-layouts.md` |
| Component library & composition | `references/components.md` |
| Animation & micro-interactions | `references/animations.md` |
| UX principles & mobile-first rules | `references/ux-principles.md` |

## Core Design Philosophy

- **Dark-first**: Pure black (#000) background, content lives on glass surfaces
- **Glassmorphism**: Every elevated element uses `.glass` / `.card` — never solid colored backgrounds
- **Accent-driven**: Dynamic accent color (CSS variables), use `accent-400` for text/icons, `accent-500` for fills, `accent-500/15` for subtle backgrounds
- **Minimalist**: Whitespace is a feature — less is more, no visual clutter
- **Mobile-first**: All views designed for `max-w-lg mx-auto`, touch-friendly tap targets (min 44px), bottom navigation
- **Animated**: Every page entrance uses staggered `animate-fade-in-up`, every interactive element has `press` feedback
