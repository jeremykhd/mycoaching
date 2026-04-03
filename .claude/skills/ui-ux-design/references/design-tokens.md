# Design Tokens

## Color System

### Backgrounds
- `bg-bg` (#000000) — page background, always pure black
- `bg-bg-soft` (#0a0a0a) — subtle elevation on black
- `bg-bg-muted` (#111111) — form inputs background alternative

### Surfaces (glass layers)
- `bg-white/5` + `border-white/[0.08]` — standard glass (`.glass`)
- `bg-white/10` + `border-white/[0.12]` — strong glass (`.glass-strong`)
- `bg-white/[0.03]` + `border-white/[0.05]` — subtle glass (`.glass-subtle`)
- `bg-white/[0.07]` + `border-white/[0.1]` — menu/nav glass (custom for bottom bar)

### Accent (dynamic via CSS variables)
- `accent-400` — primary accent for text, icons, active states
- `accent-500` — fills (buttons, selected states, progress bars)
- `accent-500/10` or `accent-500/15` — subtle accent backgrounds (badges, icon containers)
- `accent-500/20` — badge backgrounds
- `accent-500/25` — glow shadows (`shadow-accent-500/25`)
- `accent-500/30` — focus rings
- 4 themes available: emerald (default), cyan, purple, orange

### Text
- `text-text-primary` (#fff) — headings, important values, names
- `text-text-secondary` (60% white) — body text, descriptions, inactive nav
- `text-text-muted` (35% white) — labels, hints, timestamps, meta info

### Usage Rules
- **Never** use solid color backgrounds for cards or containers — always glass
- **Never** use gray-* or slate-* Tailwind defaults — use the custom `text-*` and `bg-*` tokens
- Accent color must always come from the `accent-*` palette (CSS variable-driven)
- For destructive actions: `text-red-400/60` default, `hover:text-red-400` on hover

## Typography

### Font
- `Inter var` / system-ui fallback
- Base size: 15px (set in body)

### Scale
| Use case | Classes |
|----------|---------|
| Page title | `text-lg font-bold text-text-primary` |
| Section title | `text-sm font-semibold text-text-primary` |
| Card body text | `text-sm text-text-secondary` |
| Labels / meta | `text-xs text-text-muted` |
| Micro labels | `text-[10px] font-medium text-text-muted` |
| Big stat number | `text-2xl font-bold text-accent-400` or `text-text-primary` |
| Badge text | `text-[10px] font-medium` or `text-xs font-medium` |
| Nav bottom label | `text-[11px] font-medium` |

## Spacing

### Page
- Container: `max-w-lg mx-auto`
- Page padding: handled by AppLayout (`px-4 sm:px-6 lg:px-8`)
- Section gap: `space-y-4` (dashboard) or `space-y-6` (detail/form pages)
- Bottom padding: `pb-32` (to clear bottom nav)

### Cards
- Card padding: `p-5` (via `.card` class)
- Inner spacing: `space-y-3` for lists, `mb-3` or `mb-4` between title and content
- Grid gap: `gap-3` for side-by-side cards

### Touch targets
- Minimum button size: `py-3` for full-width buttons, `p-1.5` for icon buttons
- Icon button hit area: at minimum `h-9 w-9` (calendar) or `p-1.5` wrapping `h-5 w-5` icon
- List items: `p-3` for tappable rows

## Border Radius
- Cards: `rounded-2xl`
- Buttons: `rounded-xl`
- Badges: `rounded-full`
- Icon containers: `rounded-full` (circles) or `rounded-lg` (squares)
- Inputs: `rounded-xl`

## Dividers
- Between sections in a card: `divide-x divide-white/[0.08]` (vertical) or `border-b border-white/[0.06]` (horizontal)
- Never use visible solid borders — always low-opacity white
