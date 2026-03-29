# Query & Relation Syntax

## Explicit Column Selection

Always list columns explicitly — avoid `select('*')` on joined queries:

```ts
// Bad
.select('*')

// Good
.select('id, firstname, lastname, email, is_active')
```

## Nested Relations (Supabase joins)

Use foreign key aliases for nested selects:

```ts
// account with health, objectives and role
.select(`
  id, firstname, lastname, email, birthday, gender, phone_number, is_active,
  health:health_id(id, weight, height, target_weight, measure_weight, target_training),
  objectives:objectives_id(id, training_per_week),
  role:role_id(id, name)
`)

// workout with exercises and their types
.select(`
  id, title, subtitle, created_at,
  workout_exercise(id, title, weight, repetitions, set, rest, body_weight,
    type:workout_exercise_type(id, name)
  )
`)

// account with group memberships
.select(`
  id, firstname, lastname,
  account_group(group:group_id(id, name, description))
`)
```

## Filtering

```ts
.eq('id', id)               // WHERE id = ?
.eq('is_active', true)      // WHERE is_active = true
.eq('user_id', userId)      // WHERE user_id = ?
.order('created_at', { ascending: false })
.limit(10)
```

## Single Row

Use `.single()` when expecting exactly one result. Throws if 0 or >1 rows:

```ts
.select('id, firstname')
.eq('user_id', userId)
.single()
```
