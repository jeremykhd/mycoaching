<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/store/useAuthStore'
import { useProgramStore } from '../store/useProgramStore'
import { useProgramService } from '../services/useProgramService'
import type { Workout } from '../models/Workout'
import {
  ArrowLeftIcon,
  CheckIcon,
  PlusIcon,
  XMarkIcon,
  CalendarDaysIcon,
} from '@heroicons/vue/24/outline'
import { FireIcon } from '@heroicons/vue/24/solid'

interface PlannedDay {
  dayOfWeek: number
  workout: Workout | null
}

const DAYS = [
  { value: 1, label: 'Lundi', short: 'Lun' },
  { value: 2, label: 'Mardi', short: 'Mar' },
  { value: 3, label: 'Mercredi', short: 'Mer' },
  { value: 4, label: 'Jeudi', short: 'Jeu' },
  { value: 5, label: 'Vendredi', short: 'Ven' },
  { value: 6, label: 'Samedi', short: 'Sam' },
  { value: 7, label: 'Dimanche', short: 'Dim' },
]

const router = useRouter()
const authStore = useAuthStore()
const programStore = useProgramStore()
const { createProgram, addProgramWorkout } = useProgramService()

// Form
const title = ref('')
const description = ref('')
const durationWeeks = ref(4)
const startDate = ref(new Date().toISOString().split('T')[0])
const saving = ref(false)

// Planning per week
const plannedDays = ref<PlannedDay[]>([])

// Workout picker
const showWorkoutPicker = ref(false)
const pickingForDay = ref<number | null>(null)

// Available workouts
const workouts = ref<Workout[]>([])

onMounted(async () => {
  if (!authStore.account?.id) return
  await programStore.fetchWorkouts(authStore.account.id)
  workouts.value = programStore.workouts
})

const endDate = computed(() => {
  if (!startDate.value) return ''
  const start = new Date(startDate.value)
  const end = new Date(start)
  end.setDate(start.getDate() + durationWeeks.value * 7 - 1)
  return end.toISOString().split('T')[0]
})

const canSave = computed(() => {
  return title.value.trim() && startDate.value && plannedDays.value.length > 0 && !saving.value
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function openWorkoutPicker(dayOfWeek: number) {
  pickingForDay.value = dayOfWeek
  showWorkoutPicker.value = true
}

function assignWorkout(workout: Workout) {
  if (pickingForDay.value === null) return

  // Remove existing assignment for this day
  plannedDays.value = plannedDays.value.filter(d => d.dayOfWeek !== pickingForDay.value)

  plannedDays.value.push({
    dayOfWeek: pickingForDay.value,
    workout,
  })

  // Sort by day
  plannedDays.value.sort((a, b) => a.dayOfWeek - b.dayOfWeek)

  showWorkoutPicker.value = false
  pickingForDay.value = null
}

function removeDay(dayOfWeek: number) {
  plannedDays.value = plannedDays.value.filter(d => d.dayOfWeek !== dayOfWeek)
}

function getAssignedWorkout(dayOfWeek: number): Workout | null {
  return plannedDays.value.find(d => d.dayOfWeek === dayOfWeek)?.workout || null
}

function getDayLabel(dayOfWeek: number): string {
  return DAYS.find(d => d.value === dayOfWeek)?.label || ''
}

async function saveProgram() {
  if (!canSave.value || !authStore.account?.id) return
  saving.value = true

  const { data: program, error } = await createProgram({
    account_id: authStore.account.id,
    title: title.value.trim(),
    description: description.value.trim() || null,
    duration_weeks: durationWeeks.value,
    start_date: startDate.value,
    end_date: endDate.value,
    is_active: true,
  })

  if (error || !program) {
    saving.value = false
    return
  }

  // Add planned workouts for each week
  for (let week = 1; week <= durationWeeks.value; week++) {
    for (const planned of plannedDays.value) {
      if (!planned.workout) continue
      await addProgramWorkout({
        program_id: program.id,
        workout_id: planned.workout.id,
        day_of_week: planned.dayOfWeek,
        week_number: week,
      })
    }
  }

  saving.value = false
  router.push('/workout')
}
</script>

<template>
  <div class="space-y-4 max-w-lg mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between animate-fade-in">
      <div class="flex items-center space-x-3">
        <button @click="$router.back()" class="p-1.5 rounded-lg hover:bg-white/5 transition-colors press">
          <ArrowLeftIcon class="h-5 w-5 text-text-secondary" />
        </button>
        <h1 class="text-lg font-bold text-text-primary">Nouveau Programme</h1>
      </div>
      <button
        @click="saveProgram"
        :disabled="!canSave"
        class="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 press"
        :class="canSave
          ? 'bg-accent-500 text-white hover:bg-accent-600'
          : 'bg-white/[0.06] text-text-muted cursor-not-allowed'"
      >
        <CheckIcon class="h-4 w-4" />
        <span>{{ saving ? 'Enregistrement...' : 'Enregistrer' }}</span>
      </button>
    </div>

    <!-- Infos -->
    <div class="card space-y-3 animate-fade-in-up stagger-1">
      <div>
        <label class="text-xs font-medium text-text-muted mb-1 block">Nom du programme *</label>
        <input v-model="title" type="text" placeholder="Ex: Programme Force, PPL..." class="input-field text-sm" />
      </div>
      <div>
        <label class="text-xs font-medium text-text-muted mb-1 block">Description</label>
        <textarea v-model="description" rows="2" placeholder="Objectifs du programme..." class="input-field text-sm resize-none" />
      </div>
    </div>

    <!-- Duration & dates -->
    <div class="card space-y-3 animate-fade-in-up stagger-2">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-xs font-medium text-text-muted mb-1 block">Date de début</label>
          <input v-model="startDate" type="date" class="input-field text-sm" />
        </div>
        <div>
          <label class="text-xs font-medium text-text-muted mb-1 block">Durée (semaines)</label>
          <input v-model.number="durationWeeks" type="number" min="1" max="52" class="input-field text-sm" />
        </div>
      </div>
      <div v-if="startDate && endDate" class="flex items-center space-x-2 pt-1">
        <CalendarDaysIcon class="h-4 w-4 text-text-muted flex-shrink-0" />
        <p class="text-xs text-text-muted">
          Du {{ formatDate(startDate) }} au {{ formatDate(endDate) }}
        </p>
      </div>
    </div>

    <!-- Weekly Planning -->
    <div class="animate-fade-in-up stagger-3">
      <h2 class="text-sm font-semibold text-text-primary mb-3">Semaine type</h2>
      <p class="text-xs text-text-muted mb-3">Assignez vos séances aux jours de la semaine. Ce planning sera répété chaque semaine.</p>

      <div class="space-y-2">
        <div
          v-for="day in DAYS"
          :key="day.value"
          class="card !py-3 flex items-center justify-between"
        >
          <div class="flex items-center space-x-3 min-w-0">
            <span class="text-xs font-semibold text-text-secondary w-12">{{ day.short }}</span>

            <!-- Assigned workout -->
            <template v-if="getAssignedWorkout(day.value)">
              <div class="flex items-center space-x-2 min-w-0">
                <div class="w-7 h-7 rounded-lg bg-accent-500/15 flex items-center justify-center flex-shrink-0">
                  <FireIcon class="h-3.5 w-3.5 text-accent-400" />
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-text-primary truncate">{{ getAssignedWorkout(day.value)!.title }}</p>
                  <p v-if="getAssignedWorkout(day.value)!.type" class="text-[10px] text-accent-400">
                    {{ typeof getAssignedWorkout(day.value)!.type === 'object' ? getAssignedWorkout(day.value)!.type!.name : '' }}
                  </p>
                </div>
              </div>
            </template>

            <!-- Empty day -->
            <span v-else class="text-xs text-text-muted">Repos</span>
          </div>

          <div class="flex items-center space-x-1 flex-shrink-0">
            <button
              v-if="getAssignedWorkout(day.value)"
              @click="removeDay(day.value)"
              class="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              <XMarkIcon class="h-4 w-4 text-red-400" />
            </button>
            <button
              @click="openWorkoutPicker(day.value)"
              class="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <PlusIcon class="h-4 w-4 text-accent-400" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary -->
    <div v-if="plannedDays.length" class="card animate-fade-in-up stagger-4">
      <div class="grid grid-cols-3 gap-2 text-center">
        <div>
          <p class="text-lg font-bold text-accent-400">{{ plannedDays.length }}</p>
          <p class="text-[10px] text-text-muted">jours/sem</p>
        </div>
        <div>
          <p class="text-lg font-bold text-text-primary">{{ durationWeeks }}</p>
          <p class="text-[10px] text-text-muted">semaines</p>
        </div>
        <div>
          <p class="text-lg font-bold text-text-primary">{{ plannedDays.length * durationWeeks }}</p>
          <p class="text-[10px] text-text-muted">séances total</p>
        </div>
      </div>
    </div>

    <!-- No workouts warning -->
    <div v-if="!workouts.length" class="card flex flex-col items-center py-6 text-center animate-fade-in-up stagger-4">
      <FireIcon class="h-8 w-8 text-text-muted mb-2" />
      <p class="text-sm text-text-secondary mb-1">Aucune séance disponible</p>
      <p class="text-xs text-text-muted mb-3">Créez d'abord des séances pour les assigner à votre programme</p>
      <RouterLink to="/workout/create" class="text-sm text-accent-400 font-medium press">
        Créer une séance
      </RouterLink>
    </div>

    <!-- Workout Picker Modal -->
    <Teleport to="body">
      <Transition name="page">
        <div v-if="showWorkoutPicker" class="fixed inset-0 z-50 flex flex-col">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showWorkoutPicker = false" />

          <div class="relative mt-auto max-h-[70vh] flex flex-col bg-bg-primary rounded-t-2xl overflow-hidden animate-slide-up">
            <div class="flex items-center justify-between p-4 border-b border-white/[0.08]">
              <h3 class="text-sm font-semibold text-text-primary">
                Choisir une séance — {{ getDayLabel(pickingForDay!) }}
              </h3>
              <button @click="showWorkoutPicker = false" class="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                <XMarkIcon class="h-5 w-5 text-text-muted" />
              </button>
            </div>

            <div class="overflow-y-auto flex-1 px-4 pb-safe">
              <div v-if="workouts.length" class="space-y-1 py-3">
                <button
                  v-for="workout in workouts"
                  :key="workout.id"
                  @click="assignWorkout(workout)"
                  class="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white/[0.06] transition-colors text-left press-sm"
                >
                  <div class="w-10 h-10 rounded-lg bg-accent-500/15 flex items-center justify-center flex-shrink-0">
                    <FireIcon class="h-5 w-5 text-accent-400" />
                  </div>
                  <div class="min-w-0">
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
                </button>
              </div>

              <div v-else class="flex flex-col items-center py-8 text-center">
                <p class="text-sm text-text-secondary">Aucune séance disponible</p>
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
