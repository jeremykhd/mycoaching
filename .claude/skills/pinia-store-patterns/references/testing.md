# Testing Stores

## Setup

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { flushPromises } from '@vue/test-utils'
import { useEntityStore } from '../useEntityStore'
import { createTestWrapper, createMockAccount } from '@/shared/test/testUtils'

// Mock the service
vi.mock('../../services/useEntityService', () => ({
  useEntityService: () => ({
    getEntities: vi.fn(),
    postEntity: vi.fn(),
    patchEntity: vi.fn()
  })
}))

describe('useEntityStore', () => {
  beforeEach(() => {
    setActivePinia(createTestingPinia({ createSpy: vi.fn }))
  })
})
```

## What to Test

For every action, test:
1. **Initial state** — loading false, error null, data null/empty
2. **Success path** — data populated, toast called, loading reset
3. **Error path** — error message set, toast.error called, loading reset

```ts
it('sets loading during fetch', async () => {
  const store = useEntityStore()
  const promise = store.fetchEntities()
  expect(store.loading).toBe(true)
  await promise
  expect(store.loading).toBe(false)
})

it('handles fetch error', async () => {
  mockGetEntities.mockRejectedValue(new Error('DB error'))
  const store = useEntityStore()
  await store.fetchEntities()
  expect(store.error).toBe('DB error')
  expect(store.entities).toEqual([])
})
```

## Mock Factories (from testUtils.ts)

- `createMockUser()` — Supabase User object
- `createMockAccount()` — Account with health, objectives, role
- `createMockHealth()` — Health object
- `createMockSession()` — Supabase Session object
- `createMockRole()` — Role object
- `createMockAuthError()` — AuthError object
