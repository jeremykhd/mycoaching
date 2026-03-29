# Store Structure

## Full Template

```ts
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'
import { useEntityService } from '../services/useEntityService'
import type { Entity } from '../models/Entity'

export const useEntityStore = defineStore('entity', () => {
  const toast = useToast()
  const { getEntities, getEntity, postEntity, patchEntity } = useEntityService()

  // State
  const entities = ref<Entity[]>([])
  const entity = ref<Entity | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function fetchEntities() { ... }
  async function fetchEntity(id: number) { ... }
  async function createEntity(data: Omit<Entity, 'id' | 'created_at'>) { ... }
  async function updateEntity(id: number, data: Partial<Entity>) { ... }

  return { entities, entity, loading, error, fetchEntities, fetchEntity, createEntity, updateEntity }
})
```

## State Naming

| State | Type | Purpose |
|-------|------|---------|
| `{entity}` | `Ref<Entity \| null>` | Single selected item |
| `{entities}` | `Ref<Entity[]>` | List of items |
| `loading` | `Ref<boolean>` | Async in-progress indicator |
| `error` | `Ref<string \| null>` | Last error message |

## Existing Stores

| Store | Path | State |
|-------|------|-------|
| `useAuthStore` | `modules/auth/store/` | user, session, pendingVerification |
| `useAccountStore` | `modules/accounts/store/` | account, accounts[] |
| `useWorkoutStore` | `modules/workout/store/` | exercises[], exerciseTypes[] |
