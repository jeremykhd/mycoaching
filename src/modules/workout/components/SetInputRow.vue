<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline'

defineProps<{
  setNumber: number
  weight: number
  reps: number
  rest: number
  canDelete?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:weight', value: number): void
  (e: 'update:reps', value: number): void
  (e: 'update:rest', value: number): void
  (e: 'delete'): void
}>()
</script>

<template>
  <div class="flex items-center space-x-2">
    <span class="text-xs text-text-muted w-16 flex-shrink-0">Série {{ setNumber }}</span>
    <input
      type="number"
      :value="weight"
      @input="emit('update:weight', Number(($event.target as HTMLInputElement).value))"
      class="input-field !py-2 !px-2.5 text-center text-sm w-16"
      placeholder="kg"
    />
    <input
      type="number"
      :value="reps"
      @input="emit('update:reps', Number(($event.target as HTMLInputElement).value))"
      class="input-field !py-2 !px-2.5 text-center text-sm w-16"
      placeholder="reps"
    />
    <input
      type="number"
      :value="rest"
      @input="emit('update:rest', Number(($event.target as HTMLInputElement).value))"
      class="input-field !py-2 !px-2.5 text-center text-sm w-16"
      placeholder="repos"
    />
    <button
      v-if="canDelete"
      @click="emit('delete')"
      class="p-1.5 text-red-400/60 hover:text-red-400 transition-colors flex-shrink-0"
    >
      <TrashIcon class="h-4 w-4" />
    </button>
    <div v-else class="w-7 flex-shrink-0" />
  </div>
</template>
