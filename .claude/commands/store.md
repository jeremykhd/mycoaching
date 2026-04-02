Create a new Pinia store for this project.

The entity name is: $ARGUMENTS

Create `src/modules/{name}/store/use{Name}Store.ts` following the project's store pattern:

```ts
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'
import { use{Name}Service } from '../services/use{Name}Service'
import type { {Name} } from '../models/{Name}'

export const use{Name}Store = defineStore('{name}', () => {
  const toast = useToast()
  const { get{Name}s, post{Name}, patch{Name}, delete{Name} } = use{Name}Service()

  const {name}s = ref<{Name}[]>([])
  const {name} = ref<{Name} | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetch{Name}s() { ... }
  async function fetch{Name}(id: string) { ... }
  async function create{Name}(data: Omit<{Name}, 'id' | 'created_at'>) { ... }
  async function update{Name}(id: string, data: Partial<{Name}>) { ... }

  return { {name}s, {name}, loading, error, fetch{Name}s, fetch{Name}, create{Name}, update{Name} }
})
```

Also create a basic test file at `src/modules/{name}/__tests__/use{Name}Store.test.ts` using:
- `@pinia/testing` createTestingPinia
- `createTestWrapper` from `@/shared/test/testUtils`
- Mock the service composable
- Test at minimum: initial state, successful fetch, error handling

Show the complete files.
