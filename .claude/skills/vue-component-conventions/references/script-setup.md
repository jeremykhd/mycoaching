# Script Setup Patterns

## Base Template

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEntityStore } from '@/modules/entity/store/useEntityStore'
import type { Entity } from '@/modules/entity/models/Entity'

// Props
const props = defineProps<{
  entity: Entity
  isLoading?: boolean
}>()

// Emits
const emit = defineEmits<{
  save: [entity: Entity]
  cancel: []
}>()

// Store
const store = useEntityStore()

// Local state
const isOpen = ref(false)

// Computed
const displayName = computed(() => `${props.entity.firstname} ${props.entity.lastname}`)
</script>
```

## Rules

- Always `<script setup lang="ts">` — no Options API, no `defineComponent`
- Props: typed with generics `defineProps<{...}>()`
- Emits: typed with generics `defineEmits<{...}>()`
- No direct Supabase calls — use store actions
- No service calls — use store actions
- Import types with `import type`
- Path alias: always use `@/` instead of relative `../../`
