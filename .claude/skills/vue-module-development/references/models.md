# TypeScript Models

## Interface Pattern

Models are plain TypeScript interfaces — no classes, no methods.

```ts
// src/modules/planning/models/Planning.ts
export interface Planning {
  id: number
  title: string
  description: string | null
  account_id: number
  created_at: string
}
```

## Rules

- `id` is always `number` (bigint in DB maps to number in TS)
- `created_at` is always `string` (ISO timestamp from Supabase)
- Nullable DB columns → `type | null` in TS
- Use `Omit<Entity, 'id' | 'created_at'>` for create payloads
- Use `Partial<Entity>` for update payloads
- Foreign key fields keep the `_id` suffix: `account_id`, `workout_id`

## Known Enums (from DB)

```ts
export type Gender = 'male' | 'female' | 'other'         // account.gender
export type MeasureWeight = 'kg' | 'lbs'                  // health.measure_weight
```
