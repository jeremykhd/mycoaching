# Service Composable Pattern

## Base Template

```ts
// src/modules/{name}/services/use{Name}Service.ts
import { supabase } from '@/shared/services/supabaseClient'
import type { Entity } from '../models/Entity'

export function useEntityService() {
  async function getEntities(): Promise<Entity[]> {
    const { data, error } = await supabase
      .from('entity')
      .select('id, name, created_at')

    if (error) throw error
    return data
  }

  async function getEntity(id: number): Promise<Entity> {
    const { data, error } = await supabase
      .from('entity')
      .select('id, name, created_at')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  async function postEntity(payload: Omit<Entity, 'id' | 'created_at'>): Promise<Entity> {
    const { data, error } = await supabase
      .from('entity')
      .insert(payload)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async function patchEntity(id: number, payload: Partial<Entity>): Promise<Entity> {
    const { data, error } = await supabase
      .from('entity')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  return { getEntities, getEntity, postEntity, patchEntity }
}
```

## Naming Conventions

| Operation | Method prefix | Example |
|-----------|--------------|---------|
| Fetch list | `get{Entities}` | `getAccounts()` |
| Fetch one | `get{Entity}` | `getAccount(id)` |
| Create | `post{Entity}` | `postAccount(data)` |
| Update | `patch{Entity}` | `patchAccount(id, data)` |
| Delete | `delete{Entity}` | `deleteAccount(id)` |
