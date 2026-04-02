# Error Handling in Services

## Pattern: Throw, Don't Catch

Services throw errors — the store catches and handles them:

```ts
// Service — just throw
async function getAccount(userId: string) {
  const { data, error } = await supabase
    .from('account')
    .select('id, firstname')
    .eq('user_id', userId)
    .single()

  if (error) throw error   // let the store handle it
  return data
}

// Store — catch and show toast
async function fetchAccount(userId: string) {
  loading.value = true
  try {
    account.value = await accountService.getAccount(userId)
  } catch (e) {
    error.value = (e as Error).message
    toast.error('Failed to load account')
  } finally {
    loading.value = false
  }
}
```

## Testing Services

Mock the Supabase client — never hit the real DB in tests:

```ts
vi.mock('@/shared/services/supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockAccount, error: null })
    }))
  }
}))
```
