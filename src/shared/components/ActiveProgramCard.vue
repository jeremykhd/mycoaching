<script setup lang="ts">
import { computed } from 'vue'
import type { Program } from '@/modules/workout/models/Program'
import {
  CalendarDaysIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline'
import { FireIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{
  program: Program
  sessionsThisWeek: number
}>()

const weeklyTarget = computed(() => {
  if (!props.program.program_workouts?.length) return 0
  const days = new Set(props.program.program_workouts.map(pw => pw.day_of_week))
  return days.size
})

const currentWeek = computed(() => {
  const start = new Date(props.program.start_date)
  const now = new Date()
  const diff = now.getTime() - start.getTime()
  const week = Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1
  return Math.max(1, Math.min(week, props.program.duration_weeks))
})

const progressPercent = computed(() => {
  return Math.round((currentWeek.value / props.program.duration_weeks) * 100)
})

const daysLeft = computed(() => {
  const end = new Date(props.program.end_date)
  const now = new Date()
  const diff = end.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)))
})
</script>

<template>
  <RouterLink
    :to="`/workout/program/${program.id}`"
    class="card press-sm block"
  >
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center space-x-2">
        <CalendarDaysIcon class="h-4 w-4 text-accent-400" />
        <h3 class="text-sm font-semibold text-text-primary">Programme actif</h3>
      </div>
      <ChevronRightIcon class="h-4 w-4 text-text-muted" />
    </div>

    <p class="text-base font-bold text-text-primary mb-1">{{ program.title }}</p>
    <p v-if="program.description" class="text-xs text-text-muted mb-3 line-clamp-1">{{ program.description }}</p>

    <!-- Progress bar -->
    <div class="mb-3">
      <div class="flex items-center justify-between mb-1">
        <span class="text-[10px] text-text-muted">Semaine {{ currentWeek }} / {{ program.duration_weeks }}</span>
        <span class="text-[10px] text-accent-400 font-medium">{{ progressPercent }}%</span>
      </div>
      <div class="h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
        <div
          class="h-full rounded-full bg-accent-500 transition-all duration-500"
          :style="{ width: `${progressPercent}%` }"
        />
      </div>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-3 gap-2">
      <div class="rounded-lg bg-white/[0.04] py-2 text-center">
        <div class="flex items-center justify-center space-x-1 mb-0.5">
          <FireIcon class="h-3 w-3 text-accent-400" />
        </div>
        <p class="text-sm font-bold text-text-primary">{{ sessionsThisWeek }}<span class="text-text-muted font-normal">/{{ weeklyTarget }}</span></p>
        <p class="text-[9px] text-text-muted">cette sem.</p>
      </div>
      <div class="rounded-lg bg-white/[0.04] py-2 text-center">
        <p class="text-sm font-bold text-text-primary">{{ program.duration_weeks }}</p>
        <p class="text-[9px] text-text-muted">semaines</p>
      </div>
      <div class="rounded-lg bg-white/[0.04] py-2 text-center">
        <p class="text-sm font-bold text-text-primary">{{ daysLeft }}</p>
        <p class="text-[9px] text-text-muted">jours restants</p>
      </div>
    </div>
  </RouterLink>
</template>
