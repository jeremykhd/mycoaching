<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

export interface ExerciseSet {
  setNumber: number
  reps: number
  weight: number
  rest: number
  isPR?: boolean
}

defineProps<{
  name: string
  sets: ExerciseSet[]
  defaultOpen?: boolean
}>()

const isOpen = ref(false)
</script>

<template>
  <div class="border-b border-white/[0.06] last:border-b-0">
    <button
      @click="isOpen = !isOpen"
      class="w-full flex items-center justify-between py-3 text-left press-sm"
    >
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-lg bg-accent-500/15 flex items-center justify-center flex-shrink-0">
          <span class="text-accent-400 text-xs font-bold">{{ sets.length }}</span>
        </div>
        <span class="text-sm font-medium text-text-primary">{{ name }}</span>
      </div>
      <ChevronDownIcon
        class="h-4 w-4 text-text-muted transition-transform duration-300"
        :class="isOpen ? 'rotate-180' : ''"
      />
    </button>

    <Transition name="accordion">
      <div v-if="isOpen" class="pb-3 pl-11 space-y-2">
        <div
          v-for="(set, i) in sets"
          :key="set.setNumber"
          class="flex items-center justify-between text-xs animate-fade-in"
          :style="{ animationDelay: `${i * 50}ms` }"
        >
          <span class="text-text-secondary">
            Série {{ set.setNumber }}: {{ set.reps }} reps @ {{ set.weight }} kg
          </span>
          <div class="flex items-center space-x-2">
            <span class="text-text-muted">{{ set.rest }}s repos</span>
            <span
              v-if="set.isPR"
              class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-accent-500/20 text-accent-400 animate-scale-in"
            >
              PR
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
