<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAuthStore } from '@/modules/auth/store/useAuthStore'
import { useProgramStore } from '../store/useProgramStore'
import ProgramCard from '../components/ProgramCard.vue'
import MonthCalendar from '../components/MonthCalendar.vue'
import SessionCard from '../components/SessionCard.vue'
import {
  ArrowTopRightOnSquareIcon,
  PlusIcon,
  CalendarDaysIcon,
  ListBulletIcon,
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const programStore = useProgramStore()

const accountId = computed(() => authStore.account?.id)

onMounted(async () => {
  if (!accountId.value) return
  await Promise.all([
    programStore.fetchActiveProgram(accountId.value),
    programStore.fetchWorkouts(accountId.value),
    programStore.fetchSessions(accountId.value),
  ])
})

// Compute planned dates from active program
const plannedDates = computed(() => {
  const program = programStore.activeProgram
  if (!program?.program_workouts?.length) return []

  const start = new Date(program.start_date)
  const dates: string[] = []

  for (const pw of program.program_workouts) {
    // For each week of the program, compute the actual date
    const weekOffset = (pw.week_number - 1) * 7
    // day_of_week: 1=Mon, 7=Sun. JS getDay: 0=Sun, 1=Mon
    const dayOffset = pw.day_of_week - 1 // 0=Mon
    const startDayOfWeek = start.getDay()
    const startMondayOffset = startDayOfWeek === 0 ? -6 : 1 - startDayOfWeek
    const monday = new Date(start)
    monday.setDate(start.getDate() + startMondayOffset)

    const targetDate = new Date(monday)
    targetDate.setDate(monday.getDate() + weekOffset + dayOffset)
    dates.push(targetDate.toISOString().split('T')[0])
  }

  return dates
})

// Compute completed dates from sessions
const completedDates = computed(() => {
  return programStore.sessions.map(s => {
    return new Date(s.created_at).toISOString().split('T')[0]
  })
})

// Workouts for display (latest 3)
const recentWorkouts = computed(() => {
  return programStore.workouts.slice(0, 3)
})

// Exercise count
const exerciseCount = computed(() => {
  const exerciseIds = new Set<number>()
  for (const w of programStore.workouts) {
    if (w.exercises) {
      for (const e of w.exercises) {
        exerciseIds.add(e.id)
      }
    }
  }
  return exerciseIds.size
})
</script>

<template>
  <div class="space-y-4 max-w-lg mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between animate-fade-in">
      <h1 class="text-lg font-bold text-text-primary">Programmes</h1>
    </div>

    <!-- Active Program -->
    <div class="animate-fade-in-up stagger-1">
      <ProgramCard
        v-if="programStore.activeProgram"
        :program="programStore.activeProgram"
      />
      <!-- Empty state -->
      <div v-else class="card flex flex-col items-center justify-center py-8 text-center">
        <CalendarDaysIcon class="h-10 w-10 text-text-muted mb-3" />
        <p class="text-sm text-text-secondary mb-1">Aucun programme actif</p>
        <p class="text-xs text-text-muted mb-4">Créez un programme pour planifier vos entraînements</p>
        <button class="btn-primary text-sm press">
          <PlusIcon class="h-4 w-4 inline mr-1" />
          Créer un programme
        </button>
      </div>
    </div>

    <!-- Calendar -->
    <div class="animate-fade-in-up stagger-2">
      <MonthCalendar
        :planned-dates="plannedDates"
        :completed-dates="completedDates"
      />
    </div>

    <!-- Séances (Workouts) -->
    <div class="animate-fade-in-up stagger-3">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-semibold text-text-primary">Séances</h2>
        <RouterLink to="/workout" class="text-xs text-accent-400 hover:text-accent-300 transition-colors">
          Voir tout
        </RouterLink>
      </div>

      <div v-if="recentWorkouts.length" class="space-y-2">
        <div v-for="(workout, i) in recentWorkouts" :key="workout.id" class="card press-sm">
          <SessionCard
            :title="workout.title"
            :subtitle="workout.subtitle || undefined"
            :badges="workout.exercises?.length
              ? [{ label: `${workout.exercises.length} exercices`, type: 'neutral' as const }]
              : []"
            :to="`/workout/session/${workout.id}`"
          />
        </div>
      </div>

      <!-- Empty + Create -->
      <div v-else class="card flex flex-col items-center justify-center py-6 text-center">
        <p class="text-sm text-text-secondary mb-1">Aucune séance créée</p>
        <p class="text-xs text-text-muted mb-4">Créez des séances pour les ajouter à votre programme</p>
      </div>

      <button class="mt-3 w-full flex items-center justify-center space-x-2 py-3 rounded-xl border border-dashed border-white/[0.12] text-accent-400 hover:bg-white/5 transition-all duration-200 press">
        <PlusIcon class="h-4 w-4" />
        <span class="text-sm font-medium">Créer une séance</span>
      </button>
    </div>

    <!-- Exercices -->
    <div class="animate-fade-in-up stagger-4">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-semibold text-text-primary">Exercices</h2>
        <RouterLink to="/exercises" class="text-accent-400 hover:text-accent-300 transition-colors">
          <ArrowTopRightOnSquareIcon class="h-4 w-4" />
        </RouterLink>
      </div>
      <RouterLink to="/exercises" class="card flex items-center justify-between press-sm">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-full bg-accent-500/15 flex items-center justify-center">
            <ListBulletIcon class="h-4 w-4 text-accent-400" />
          </div>
          <div>
            <p class="text-sm font-medium text-text-primary">Ma bibliothèque</p>
            <p class="text-xs text-text-muted">{{ exerciseCount }} exercice{{ exerciseCount > 1 ? 's' : '' }} utilisé{{ exerciseCount > 1 ? 's' : '' }}</p>
          </div>
        </div>
        <ArrowTopRightOnSquareIcon class="h-4 w-4 text-text-muted" />
      </RouterLink>
    </div>
  </div>
</template>
