<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useAuthStore } from '@/modules/auth/store/useAuthStore'
import { useProgramService } from '../services/useProgramService'
import type { WorkoutSession } from '../models/WorkoutSession'
import type { Workout } from '../models/Workout'
import {
  ArrowLeftIcon,
  ClockIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/vue/24/outline'
import { FireIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'

const authStore = useAuthStore()
const { getWorkoutSessions } = useProgramService()

interface SessionWithWorkout extends WorkoutSession {
  workout: Workout
}

const sessions = ref<SessionWithWorkout[]>([])
const loading = ref(true)

onMounted(async () => {
  if (!authStore.account?.id) return
  const { data, error } = await getWorkoutSessions(authStore.account.id)
  if (!error && data) {
    sessions.value = (data as unknown as SessionWithWorkout[]).filter(
      (s) => s.finished_at !== null
    )
  }
  loading.value = false
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getDuration(start: string, end: string): string {
  const diff = new Date(end).getTime() - new Date(start).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

// Group sessions by month
const groupedSessions = computed(() => {
  const groups: { label: string; sessions: SessionWithWorkout[] }[] = []
  const map = new Map<string, SessionWithWorkout[]>()

  for (const session of sessions.value) {
    const date = new Date(session.created_at)
    const key = `${date.getFullYear()}-${date.getMonth()}`
    const label = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

    if (!map.has(key)) {
      map.set(key, [])
      groups.push({ label, sessions: map.get(key)! })
    }
    map.get(key)!.push(session)
  }

  return groups
})
</script>

<template>
  <div class="space-y-4 max-w-lg mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between animate-fade-in">
      <div class="flex items-center space-x-3">
        <button @click="$router.back()" class="p-1.5 rounded-lg hover:bg-white/5 transition-colors press">
          <ArrowLeftIcon class="h-5 w-5 text-text-secondary" />
        </button>
        <div>
          <h1 class="text-lg font-bold text-text-primary">Historique</h1>
          <p v-if="sessions.length" class="text-xs text-text-muted">{{ sessions.length }} séance{{ sessions.length > 1 ? 's' : '' }} terminée{{ sessions.length > 1 ? 's' : '' }}</p>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="w-6 h-6 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
    </div>

    <!-- List grouped by month -->
    <template v-else-if="sessions.length">
      <div
        v-for="(group, gi) in groupedSessions"
        :key="group.label"
        class="space-y-2 animate-fade-in-up"
        :class="`stagger-${Math.min(gi + 1, 8)}`"
      >
        <h2 class="text-xs font-semibold text-text-muted uppercase tracking-wider px-1 capitalize">
          {{ group.label }}
        </h2>

        <RouterLink
          v-for="session in group.sessions"
          :key="session.id"
          :to="`/workout/history/${session.id}`"
          class="card flex items-center justify-between press-sm"
        >
          <div class="flex items-center space-x-3 min-w-0">
            <div class="w-10 h-10 rounded-full bg-accent-500/15 flex items-center justify-center flex-shrink-0">
              <FireIcon class="h-5 w-5 text-accent-400" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-text-primary truncate">
                {{ session.workout?.title || 'Séance' }}
              </p>
              <div class="flex items-center gap-2 mt-0.5">
                <div class="flex items-center space-x-1">
                  <CalendarIcon class="h-3 w-3 text-text-muted" />
                  <span class="text-[10px] text-text-muted capitalize">{{ formatDate(session.created_at) }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <ClockIcon class="h-3 w-3 text-text-muted" />
                  <span class="text-[10px] text-text-muted">
                    {{ getDuration(session.created_at, session.finished_at!) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <ChevronRightIcon class="h-4 w-4 text-text-muted flex-shrink-0 ml-2" />
        </RouterLink>
      </div>
    </template>

    <!-- Empty State -->
    <div v-else class="card flex flex-col items-center justify-center py-8 text-center animate-fade-in-up stagger-1">
      <ClipboardDocumentListIcon class="h-10 w-10 text-text-muted mb-3" />
      <p class="text-sm text-text-secondary mb-1">Aucune séance terminée</p>
      <p class="text-xs text-text-muted">Vos séances terminées apparaîtront ici</p>
    </div>
  </div>
</template>
