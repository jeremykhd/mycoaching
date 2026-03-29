# Action Patterns

## Standard CRUD Actions

```ts
async function fetchEntities() {
  loading.value = true
  error.value = null
  try {
    entities.value = await getEntities()
  } catch (e) {
    error.value = (e as Error).message
    toast.error('Failed to load entities')
  } finally {
    loading.value = false
  }
}

async function createEntity(data: Omit<Entity, 'id' | 'created_at'>) {
  loading.value = true
  error.value = null
  try {
    const created = await postEntity(data)
    entities.value.push(created)
    toast.success('Entity created successfully')
  } catch (e) {
    error.value = (e as Error).message
    toast.error('Failed to create entity')
  } finally {
    loading.value = false
  }
}

async function updateEntity(id: number, data: Partial<Entity>) {
  loading.value = true
  error.value = null
  try {
    const updated = await patchEntity(id, data)
    const index = entities.value.findIndex(e => e.id === id)
    if (index !== -1) entities.value[index] = updated
    entity.value = updated
    toast.success('Entity updated successfully')
  } catch (e) {
    error.value = (e as Error).message
    toast.error('Failed to update entity')
  } finally {
    loading.value = false
  }
}
```

## Rules

- Always reset `error.value = null` at the start of each action
- Always use `finally` to reset `loading.value = false`
- Always show toast on success AND error
- Update local state optimistically after mutations (push/splice) to avoid refetching
