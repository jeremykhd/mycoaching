<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProgramService } from '../services/useProgramService'
import { useProgramStore } from '../store/useProgramStore'
import type { Program } from '../models/Program'
import MonthCalendar from '../components/MonthCalendar.vue'
import {
  ArrowLeftIcon,
  PencilSquareIcon,
  TrashIcon,
  CalendarDaysIcon,
} from '@heroicons/vue/24/outline'
import { FireIcon } from '@heroicons/vue/24/solid'

const DAYS = [
  { value: 1, label: 'Lundi', short: 'Lun' },
  { value: 2, label: 'Mardi', short: 'Mar' },
  { value: 3, label: 'Mercredi', short: 'Mer' },
  { value: 4, label: 'Jeudi', short: 'Jeu' },
  { value: 5, label: 'Vendredi', short: 'Ven' },
  { value: 6, label: 'Samedi', short: 'Sam' },
  { value: 7, label: 'Dimanche', short: 'Dim' },
]

const route = useRoute()
const router = useRouter()
const { getProgramById, deleteProgram } = useProgramService()
const programStore = useProgramStore()

const programId = Number(route.params.id)
const program = ref<Program | null>(null)
const loading = ref(true)
const showDeleteConfirm = ref(false)
const deleting = ref(false)

onMounted(async () => {
  const { data, error } = await getProgramById(programId)
  if (error || !data) { router.back(); return }
  program.value = data as Program
  loading.value = false
})

const progress = computed(() => {
  if (!program.value) return 0
  const start = new Date(program.value.start_date)
  const end = new Date(program.value.end_date)
  const now = new Date()
  if (now < start) return 0
  if (now > end) return 100
  const total = end.getTime() - start.getTime()
  const elapsed = now.getTime() - start.getTime()
  return Math.round((elapsed / total) * 100)
})

const currentWeek = computed(() => {
  if (!program.value) return 0
  const start = new Date(program.value.start_date)
  const now = new Date()
  if (now < start) return 0
  const diffMs = now.getTime() - start.getTime()
  return Math.min(Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1, program.value.duration_weeks)
})

// Get unique weekly schedule (week 1 pattern)
const weeklySchedule = computed(() => {
  if (!program.value?.program_workouts?.length) return []
  const week1 = program.value.program_workouts.filter(pw => pw.week_number === 1)
  return week1.sort((a, b) => a.day_of_week - b.day_of_week)
})

const trainingDaysCount = computed(() => {
  return new Set(weeklySchedule.value.map(pw => pw.day_of_week)).size
})

// Planned dates
const plannedDates = computed(() => {
  if (!program.value?.program_workouts?.length) return []
  const start = new Date(program.value.start_date)
  const dates: string[] = []

  for (const pw of program.value.program_workouts) {
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

// Completed dates from store sessions
const completedDates = computed(() => {
  return programStore.sessions.map(s => {
    return new Date(s.created_at).toISOString().split('T')[0]
  })
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function getDayLabel(dayOfWeek: number): string {
  return DAYS.find(d => d.value === dayOfWeek)?.short || ''
}

async function handleDelete() {
  deleting.value = true
  const { error } = await deleteProgram(programId)
  if (!error) {
    if (programStore.activeProgram?.id === programId) {
      programStore.activeProgram = null
    }
    router.push('/workout')
  }
  deleting.value = false
}
</script>

<template>
  <div class="space-y-4 max-w-lg mx-auto">
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-2 border-accent-400 border-t-transparent rounded-full animate-spin" />
    </div>

    <template v-else-if="program">
      <!-- Header -->
      <div class="flex items-center justify-between animate-fade-in">
        <div class="flex items-center space-x-3">
          <button @click="$router.back()" class="p-1.5 rounded-lg hover:bg-white/5 transition-colors press">
            <ArrowLeftIcon class="h-5 w-5 text-text-secondary" />
          </button>
          <div>
            <h1 class="text-lg font-bold text-text-primary">{{ program.title }}</h1>
            <p v-if="program.is_active" class="text-[10px] font-medium text-accent-400">Actif</p>
          </div>
        </div>
        <RouterLink
          :to="`/workout/program/${programId}/edit`"
          class="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-white/[0.06] text-text-secondary hover:bg-white/10 transition-colors press"
        >
          <PencilSquareIcon class="h-4 w-4" />
          <span>Modifier</span>
        </RouterLink>
      </div>

      <!-- Description -->
      <div v-if="program.description" class="card animate-fade-in-up stagger-1">
        <p class="text-sm text-text-secondary">{{ program.description }}</p>
      </div>

      <!-- Progress & Info -->
      <div class="card animate-fade-in-up stagger-1">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs text-text-muted">Semaine {{ currentWeek }}/{{ program.duration_weeks }}</span>
          <span class="text-xs font-medium text-accent-400">{{ progress }}%</span>
        </div>
        <div class="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden mb-4">
          <div
            class="h-full bg-accent-500 rounded-full transition-all duration-500"
            :style="{ width: `${progress}%` }"
          />
        </div>

        <div class="grid grid-cols-3 gap-2 text-center">
          <div>
            <p class="text-lg font-bold text-accent-400">{{ trainingDaysCount }}</p>
            <p class="text-[10px] text-text-muted">jours/sem</p>
          </div>
          <div>
            <p class="text-lg font-bold text-text-primary">{{ program.duration_weeks }}</p>
            <p class="text-[10px] text-text-muted">semaines</p>
          </div>
          <div>
            <p class="text-lg font-bold text-text-primary">{{ trainingDaysCount * program.duration_weeks }}</p>
            <p class="text-[10px] text-text-muted">séances total</p>
          </div>
        </div>

        <div class="flex items-center space-x-2 mt-4 pt-3 border-t border-white/[0.06]">
          <CalendarDaysIcon class="h-4 w-4 text-text-muted flex-shrink-0" />
          <p class="text-xs text-text-muted">
            Du {{ formatDate(program.start_date) }} au {{ formatDate(program.end_date) }}
          </p>
        </div>
      </div>

      <!-- Calendar -->
      <div class="animate-fade-in-up stagger-2">
        <MonthCalendar
          :planned-dates="plannedDates"
          :completed-dates="completedDates"
        />
      </div>

      <!-- Weekly Schedule -->
      <div class="animate-fade-in-up stagger-3">
        <h2 class="text-sm font-semibold text-text-primary mb-3">Semaine type</h2>
        <div class="space-y-2">
          <div
            v-for="day in DAYS"
            :key="day.value"
            class="card !py-3 flex items-center justify-between"
          >
            <div class="flex items-center space-x-3 min-w-0">
              <span class="text-xs font-semibold text-text-secondary w-12">{{ day.short }}</span>

              <template v-if="weeklySchedule.find(pw => pw.day_of_week === day.value)">
                <div class="flex items-center space-x-2 min-w-0">
                  <div class="w-7 h-7 rounded-lg bg-accent-500/15 flex items-center justify-center flex-shrink-0">
                    <FireIcon class="h-3.5 w-3.5 text-accent-400" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-text-primary truncate">
                      {{ weeklySchedule.find(pw => pw.day_of_week === day.value)?.workout?.title || 'Séance' }}
                    </p>
                    <p
                      v-if="weeklySchedule.find(pw => pw.day_of_week === day.value)?.workout?.type"
                      class="text-[10px] text-accent-400"
                    >
                      {{ typeof weeklySchedule.find(pw => pw.day_of_week === day.value)?.workout?.type === 'object'
                        ? (weeklySchedule.find(pw => pw.day_of_week === day.value)?.workout?.type as any)?.name
                        : '' }}
                    </p>
                  </div>
                </div>
              </template>

              <span v-else class="text-xs text-text-muted">Repos</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete -->
      <div class="animate-fade-in-up stagger-4 pt-2">
        <button
          v-if="!showDeleteConfirm"
          @click="showDeleteConfirm = true"
          class="w-full flex items-center justify-center space-x-2 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors press"
        >
          <TrashIcon class="h-4 w-4" />
          <span class="text-sm font-medium">Supprimer le programme</span>
        </button>
        <div v-else class="card border border-red-500/20">
          <p class="text-sm text-text-secondary text-center mb-3">Supprimer ce programme ?</p>
          <div class="flex space-x-2">
            <button
              @click="showDeleteConfirm = false"
              class="flex-1 py-2.5 rounded-xl text-sm font-medium bg-white/[0.06] text-text-secondary hover:bg-white/10 transition-colors press"
            >
              Annuler
            </button>
            <button
              @click="handleDelete"
              :disabled="deleting"
              class="flex-1 py-2.5 rounded-xl text-sm font-medium bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors press"
            >
              {{ deleting ? 'Suppression...' : 'Confirmer' }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
