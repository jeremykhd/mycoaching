<script setup lang="ts">
import { computed } from 'vue'
import type { Program } from '../models/Program'
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  program: Program
}>()

const progress = computed(() => {
  const start = new Date(props.program.start_date)
  const end = new Date(props.program.end_date)
  const now = new Date()

  if (now < start) return 0
  if (now > end) return 100

  const total = end.getTime() - start.getTime()
  const elapsed = now.getTime() - start.getTime()
  return Math.round((elapsed / total) * 100)
})

const currentWeek = computed(() => {
  const start = new Date(props.program.start_date)
  const now = new Date()
  if (now < start) return 0
  const diffMs = now.getTime() - start.getTime()
  return Math.min(Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1, props.program.duration_weeks)
})

const formattedDates = computed(() => {
  const fmt = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  return `${fmt(props.program.start_date)} — ${fmt(props.program.end_date)}`
})
</script>

<template>
  <div class="card">
    <div class="flex items-center justify-between mb-3">
      <div>
        <h3 class="text-sm font-semibold text-text-primary">{{ program.title }}</h3>
        <p v-if="program.description" class="text-xs text-text-muted mt-0.5">{{ program.description }}</p>
      </div>
      <RouterLink to="/workout" class="text-accent-400 hover:text-accent-300 transition-colors">
        <ArrowTopRightOnSquareIcon class="h-4 w-4" />
      </RouterLink>
    </div>

    <!-- Progress -->
    <div class="mb-3">
      <div class="flex items-center justify-between mb-1.5">
        <span class="text-xs text-text-muted">Semaine {{ currentWeek }}/{{ program.duration_weeks }}</span>
        <span class="text-xs font-medium text-accent-400">{{ progress }}%</span>
      </div>
      <div class="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          class="h-full rounded-full bg-accent-500 transition-all duration-500"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>

    <!-- Dates -->
    <p class="text-[10px] text-text-muted">{{ formattedDates }}</p>
  </div>
</template>
