<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/store/useAuthStore'
import { useProgramStore } from '@/modules/workout/store/useProgramStore'
import { useProgramService } from '@/modules/workout/services/useProgramService'
import MonthCalendar from '@/modules/workout/components/MonthCalendar.vue'
import SessionCard from '@/modules/workout/components/SessionCard.vue'
import {
  PlayIcon,
  CalendarDaysIcon,
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
  ChartBarIcon,
  ClockIcon,
} from '@heroicons/vue/24/outline'
import { FireIcon, BoltIcon } from '@heroicons/vue/24/solid'

const router = useRouter()
const authStore = useAuthStore()
const programStore = useProgramStore()
const { getInProgressSession } = useProgramService()
const account = authStore.account

const showWorkoutPicker = ref(false)
const loading = ref(true)
const inProgressSession = ref<any>(null)

onMounted(async () => {
  if (!account?.id) return
  await Promise.all([
    programStore.fetchActiveProgram(account.id),
    programStore.fetchWorkouts(account.id),
    programStore.fetchSessions(account.id),
  ])

  // Check for in-progress session
  const { data: activeSession } = await getInProgressSession(account.id)
  if (activeSession) inProgressSession.value = activeSession

  loading.value = false
})

// Sessions this week
const sessionsThisWeek = computed(() => {
  const now = new Date()
  const monday = new Date(now)
  const day = monday.getDay()
  const diff = day === 0 ? -6 : 1 - day
  monday.setDate(monday.getDate() + diff)
  monday.setHours(0, 0, 0, 0)

  return programStore.sessions.filter(s => {
    const d = new Date(s.created_at)
    return d >= monday && d <= now
  })
})

const weeklyTarget = computed(() => {
  return account?.objectives?.training_per_week || 4
})

// Weekly volume (kg)
const weeklyVolume = computed(() => {
  // Volume is computed from session sets if available, fallback to workout template data
  // For now we use workout template exercises from completed sessions this week
  let total = 0
  for (const session of sessionsThisWeek.value) {
    const w = programStore.workouts.find(w => w.id === (session as any).workout_id)
    if (w?.exercises) {
      for (const ex of w.exercises) {
        total += (ex.set || 0) * (ex.repetitions || 0) * (ex.weight || 0)
      }
    }
  }
  return total
})

const volumeFormatted = computed(() => {
  if (weeklyVolume.value >= 1000) return `${(weeklyVolume.value / 1000).toFixed(1)}T`
  return `${weeklyVolume.value}kg`
})

// Planned dates from active program
const plannedDates = computed(() => {
  const program = programStore.activeProgram
  if (!program?.program_workouts?.length) return []

  const start = new Date(program.start_date)
  const dates: string[] = []

  for (const pw of program.program_workouts) {
    const weekOffset = (pw.week_number - 1) * 7
    const dayOffset = pw.day_of_week - 1
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

// Completed dates from sessions
const completedDates = computed(() => {
  return programStore.sessions.map(s => {
    return new Date(s.created_at).toISOString().split('T')[0]
  })
})

// Today's planned workout(s)
const todayWorkouts = computed(() => {
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  if (!plannedDates.value.includes(todayStr)) return []

  const program = programStore.activeProgram
  if (!program?.program_workouts?.length) return []

  const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay()
  return program.program_workouts
    .filter(pw => pw.day_of_week === dayOfWeek)
    .map(pw => pw.workout)
    .filter(Boolean)
})

// Recent sessions (last 3)
const recentSessions = computed(() => {
  return programStore.sessions.slice(0, 3)
})

// Streak (consecutive weeks with at least 1 session)
const streak = computed(() => {
  if (!programStore.sessions.length) return 0

  let count = 0
  const now = new Date()
  const currentMonday = new Date(now)
  const day = currentMonday.getDay()
  const diff = day === 0 ? -6 : 1 - day
  currentMonday.setDate(currentMonday.getDate() + diff)
  currentMonday.setHours(0, 0, 0, 0)

  // Check each week backwards
  for (let w = 0; w < 52; w++) {
    const weekStart = new Date(currentMonday)
    weekStart.setDate(weekStart.getDate() - w * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)

    const hasSession = programStore.sessions.some(s => {
      const d = new Date(s.created_at)
      return d >= weekStart && d < weekEnd
    })

    if (hasSession) count++
    else break
  }

  return count
})

function startWorkout(workoutId: number) {
  showWorkoutPicker.value = false
  router.push(`/workout/live/${workoutId}`)
}
</script>

<template>
  <div class="space-y-4 max-w-lg mx-auto">
    <!-- Header -->
    <div class="flex items-center space-x-3 animate-fade-in">
      <div class="w-10 h-10 rounded-full bg-accent-500/15 flex items-center justify-center ring-2 ring-accent-500/30">
        <BoltIcon class="h-5 w-5 text-accent-400" />
      </div>
      <div>
        <h1 class="text-lg font-bold text-text-primary">
          Bonjour {{ account?.firstname || 'Coach' }} !
        </h1>
        <p v-if="programStore.activeProgram" class="text-xs text-text-muted">
          {{ programStore.activeProgram.title }}
        </p>
      </div>
    </div>

    <!-- In-progress session banner -->
    <RouterLink
      v-if="inProgressSession"
      :to="`/workout/live/session/${inProgressSession.id}`"
      class="card flex items-center justify-between border border-accent-500/30 bg-accent-500/5 press animate-fade-in-up stagger-1"
    >
      <div class="flex items-center space-x-3">
        <div class="w-9 h-9 rounded-full bg-accent-500/20 flex items-center justify-center">
          <ClockIcon class="h-4 w-4 text-accent-400 animate-pulse" />
        </div>
        <div>
          <p class="text-sm font-semibold text-text-primary">Séance en cours</p>
          <p class="text-xs text-accent-400">{{ inProgressSession.workout?.title || 'Séance' }}</p>
        </div>
      </div>
      <span class="text-xs font-medium text-accent-400 px-3 py-1.5 rounded-lg bg-accent-500/15">
        Reprendre
      </span>
    </RouterLink>

    <!-- CTA — Démarrer une séance -->
    <button
      v-if="!inProgressSession"
      @click="showWorkoutPicker = true"
      :disabled="!programStore.workouts.length"
      class="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl bg-accent-500 text-white font-medium shadow-lg shadow-accent-500/25 hover:bg-accent-600 transition-all duration-200 press animate-fade-in-up stagger-1"
    >
      <PlayIcon class="h-5 w-5" />
      <span>Démarrer une séance</span>
    </button>

    <!-- Today's planned -->
    <div v-if="todayWorkouts.length" class="card animate-fade-in-up stagger-2">
      <div class="flex items-center space-x-2 mb-2">
        <CalendarDaysIcon class="h-4 w-4 text-accent-400" />
        <h2 class="text-sm font-semibold text-text-primary">Aujourd'hui</h2>
      </div>
      <div class="space-y-1.5">
        <button
          v-for="w in todayWorkouts"
          :key="w!.id"
          @click="startWorkout(w!.id)"
          class="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.06] transition-colors press-sm"
        >
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-full bg-accent-500/15 flex items-center justify-center">
              <FireIcon class="h-4 w-4 text-accent-400" />
            </div>
            <div class="text-left">
              <p class="text-sm font-medium text-text-primary">{{ w!.title }}</p>
              <p v-if="w!.type" class="text-[10px] text-accent-400">
                {{ typeof w!.type === 'object' ? (w!.type as any).name : '' }}
              </p>
            </div>
          </div>
          <PlayIcon class="h-4 w-4 text-accent-400" />
        </button>
      </div>
    </div>

    <!-- Weekly Stats -->
    <div class="grid grid-cols-3 gap-2 animate-fade-in-up stagger-2">
      <div class="card text-center !py-3">
        <p class="text-xl font-bold text-accent-400">{{ sessionsThisWeek.length }}</p>
        <p class="text-[10px] text-text-muted">/ {{ weeklyTarget }} séances</p>
      </div>
      <div class="card text-center !py-3">
        <p class="text-xl font-bold text-text-primary">{{ volumeFormatted }}</p>
        <p class="text-[10px] text-text-muted">volume sem.</p>
      </div>
      <div class="card text-center !py-3">
        <p class="text-xl font-bold text-text-primary">{{ streak }}</p>
        <p class="text-[10px] text-text-muted">sem. consec.</p>
      </div>
    </div>

    <!-- Calendar -->
    <div class="animate-fade-in-up stagger-3">
      <MonthCalendar
        :planned-dates="plannedDates"
        :completed-dates="completedDates"
      />
    </div>

    <!-- Recent Sessions -->
    <div class="animate-fade-in-up stagger-4">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-semibold text-text-primary">Dernières séances</h2>
        <RouterLink to="/workout/sessions" class="text-xs text-accent-400 hover:text-accent-300 transition-colors">
          Voir tout
        </RouterLink>
      </div>

      <div v-if="recentSessions.length" class="space-y-2">
        <div v-for="session in recentSessions" :key="session.id" class="card press-sm">
          <SessionCard
            :title="(session as any).workout?.title || 'Séance'"
            :subtitle="new Date(session.created_at).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })"
            :badges="[
              ...(session.finished_at
                ? [{ label: 'Terminée', type: 'accent' as const }]
                : [{ label: 'En cours', type: 'neutral' as const }]),
            ]"
            :to="`/workout/session/${(session as any).workout_id}`"
          />
        </div>
      </div>

      <div v-else-if="!loading" class="card flex flex-col items-center py-6 text-center">
        <ChartBarIcon class="h-8 w-8 text-text-muted mb-2" />
        <p class="text-sm text-text-secondary">Aucune séance effectuée</p>
        <p class="text-xs text-text-muted mt-1">Lancez votre première séance !</p>
      </div>
    </div>

    <!-- Quick links -->
    <div class="grid grid-cols-2 gap-2 animate-fade-in-up stagger-5">
      <RouterLink to="/workout" class="card flex items-center space-x-3 press-sm">
        <div class="w-9 h-9 rounded-full bg-accent-500/15 flex items-center justify-center flex-shrink-0">
          <FireIcon class="h-4 w-4 text-accent-400" />
        </div>
        <div>
          <p class="text-sm font-medium text-text-primary">Programmes</p>
          <p class="text-[10px] text-text-muted">{{ programStore.workouts.length }} séances</p>
        </div>
      </RouterLink>
      <RouterLink to="/exercises" class="card flex items-center space-x-3 press-sm">
        <div class="w-9 h-9 rounded-full bg-accent-500/15 flex items-center justify-center flex-shrink-0">
          <ArrowTopRightOnSquareIcon class="h-4 w-4 text-accent-400" />
        </div>
        <div>
          <p class="text-sm font-medium text-text-primary">Exercices</p>
          <p class="text-[10px] text-text-muted">Ma bibliothèque</p>
        </div>
      </RouterLink>
    </div>

    <!-- Workout Picker Modal -->
    <Teleport to="body">
      <Transition name="page">
        <div v-if="showWorkoutPicker" class="fixed inset-0 z-50 flex flex-col">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showWorkoutPicker = false" />

          <div class="relative mt-auto max-h-[70vh] flex flex-col bg-bg-primary rounded-t-2xl overflow-hidden animate-slide-up">
            <div class="flex items-center justify-between p-4 border-b border-white/[0.08]">
              <h3 class="text-sm font-semibold text-text-primary">Choisir une séance</h3>
              <button @click="showWorkoutPicker = false" class="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                <XMarkIcon class="h-5 w-5 text-text-muted" />
              </button>
            </div>

            <div class="overflow-y-auto flex-1 px-4 pb-safe">
              <div v-if="programStore.workouts.length" class="space-y-1 py-3">
                <button
                  v-for="workout in programStore.workouts"
                  :key="workout.id"
                  @click="startWorkout(workout.id)"
                  class="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white/[0.06] transition-colors text-left press-sm"
                >
                  <div class="w-10 h-10 rounded-lg bg-accent-500/15 flex items-center justify-center flex-shrink-0">
                    <FireIcon class="h-5 w-5 text-accent-400" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-text-primary truncate">{{ workout.title }}</p>
                    <div class="flex items-center gap-1.5 mt-0.5">
                      <span v-if="workout.type" class="text-[10px] text-accent-400">
                        {{ typeof workout.type === 'object' ? workout.type.name : '' }}
                      </span>
                      <span v-if="workout.exercises?.length" class="text-[10px] text-text-muted">
                        {{ workout.exercises.length }} exercice{{ workout.exercises.length > 1 ? 's' : '' }}
                      </span>
                    </div>
                  </div>
                  <PlayIcon class="h-5 w-5 text-accent-400 flex-shrink-0" />
                </button>
              </div>

              <div v-else class="flex flex-col items-center py-8 text-center">
                <p class="text-sm text-text-secondary">Aucune séance disponible</p>
                <RouterLink to="/workout/create" class="text-sm text-accent-400 font-medium mt-2 press" @click="showWorkoutPicker = false">
                  Créer une séance
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
</style>
