<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useExerciseService } from '../services/useExerciseService'
import type { Exercise } from '../models/Exercise'
import {
  ArrowLeftIcon,
  ChartBarIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const { getExerciseById, getExerciseHistory, updateExercise, deleteExercise } = useExerciseService()

const exercise = ref<Exercise | null>(null)
const history = ref<any[]>([])
const loading = ref(true)

// Edit mode
const editing = ref(false)
const editForm = ref({ title: '', muscle_group: '', equipment: '', instructions: '' })
const saving = ref(false)
const deleting = ref(false)

onMounted(async () => {
  const id = Number(route.params.id)
  const [exRes, histRes] = await Promise.all([
    getExerciseById(id),
    getExerciseHistory(id),
  ])

  if (!exRes.error && exRes.data) exercise.value = exRes.data as Exercise
  if (!histRes.error && histRes.data) history.value = histRes.data
  loading.value = false
})

function startEdit() {
  if (!exercise.value) return
  editForm.value = {
    title: exercise.value.title,
    muscle_group: exercise.value.muscle_group || '',
    equipment: exercise.value.equipment || '',
    instructions: exercise.value.instructions || '',
  }
  editing.value = true
}

async function saveEdit() {
  if (!exercise.value || saving.value) return
  saving.value = true

  const { data, error } = await updateExercise(exercise.value.id, {
    title: editForm.value.title,
    muscle_group: editForm.value.muscle_group || null,
    equipment: editForm.value.equipment || null,
    instructions: editForm.value.instructions || null,
  })

  if (!error && data) {
    exercise.value = data as Exercise
    editing.value = false
  }
  saving.value = false
}

async function handleDelete() {
  if (!exercise.value || deleting.value) return
  deleting.value = true
  const { error } = await deleteExercise(exercise.value.id)
  if (!error) {
    router.push('/exercises')
  }
  deleting.value = false
}

// Stats computed from history
const stats = computed(() => {
  if (!history.value.length) return null

  const weights = history.value
    .filter(h => h.weight != null)
    .map(h => h.weight as number)
  const reps = history.value
    .filter(h => h.repetitions != null)
    .map(h => h.repetitions as number)

  return {
    maxWeight: weights.length ? Math.max(...weights) : null,
    avgWeight: weights.length ? Math.round(weights.reduce((a, b) => a + b, 0) / weights.length) : null,
    maxReps: reps.length ? Math.max(...reps) : null,
    totalSets: history.value.length,
  }
})

// Last session data
const lastSession = computed(() => {
  if (!history.value.length) return null

  const sorted = [...history.value].sort((a, b) => {
    const dateA = a.workout_session_exercise?.workout_session?.created_at || ''
    const dateB = b.workout_session_exercise?.workout_session?.created_at || ''
    return dateB.localeCompare(dateA)
  })

  const firstSessionDate = sorted[0]?.workout_session_exercise?.workout_session?.created_at
  if (!firstSessionDate) return null

  const sessionSets = sorted.filter(s =>
    s.workout_session_exercise?.workout_session?.created_at === firstSessionDate
  )

  return {
    date: new Date(firstSessionDate).toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }),
    workoutTitle: sessionSets[0]?.workout_session_exercise?.workout_session?.workout?.title || 'Séance',
    sets: sessionSets.map(s => ({
      setNumber: s.set_number,
      weight: s.weight,
      reps: s.repetitions,
    })),
  }
})

// Progression data
const progressionData = computed(() => {
  if (!history.value.length) return []

  const bySession = new Map<string, number>()
  for (const h of history.value) {
    const date = h.workout_session_exercise?.workout_session?.created_at?.split('T')[0]
    if (!date || h.weight == null) continue
    const current = bySession.get(date) || 0
    bySession.set(date, Math.max(current, h.weight))
  }

  return Array.from(bySession.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-8)
    .map(([date, weight]) => ({
      date: new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      weight,
    }))
})

const maxProgression = computed(() => {
  if (!progressionData.value.length) return 1
  return Math.max(...progressionData.value.map(p => p.weight))
})

const badges = computed(() => {
  if (!exercise.value) return []
  const b: { label: string; type: 'accent' | 'neutral' }[] = []
  if (exercise.value.muscle_group) b.push({ label: exercise.value.muscle_group, type: 'accent' })
  if (exercise.value.equipment) b.push({ label: exercise.value.equipment, type: 'neutral' })
  if (exercise.value.body_weight) b.push({ label: 'Poids du corps', type: 'neutral' })
  if (exercise.value.is_custom) b.push({ label: 'Custom', type: 'neutral' })
  return b
})
</script>

<template>
  <div class="space-y-5 max-w-lg mx-auto">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-6 h-6 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
    </div>

    <template v-else-if="exercise">
      <!-- Header -->
      <div class="flex items-center justify-between animate-fade-in">
        <div class="flex items-center space-x-3">
          <button @click="router.back()" class="p-1.5 rounded-lg hover:bg-white/5 transition-colors press">
            <ArrowLeftIcon class="h-5 w-5 text-text-secondary" />
          </button>
          <h1 class="text-lg font-bold text-text-primary">{{ exercise.title }}</h1>
        </div>
        <button
          v-if="exercise.is_custom && !editing"
          @click="startEdit"
          class="p-1.5 rounded-lg hover:bg-white/5 transition-colors press"
        >
          <PencilSquareIcon class="h-5 w-5 text-text-secondary" />
        </button>
      </div>

      <!-- Edit Form -->
      <div v-if="editing" class="card space-y-3 animate-fade-in-up">
        <div>
          <label class="text-xs font-medium text-text-muted mb-1 block">Titre</label>
          <input v-model="editForm.title" type="text" class="input-field text-sm" />
        </div>
        <div>
          <label class="text-xs font-medium text-text-muted mb-1 block">Groupe musculaire</label>
          <input v-model="editForm.muscle_group" type="text" class="input-field text-sm" />
        </div>
        <div>
          <label class="text-xs font-medium text-text-muted mb-1 block">Équipement</label>
          <input v-model="editForm.equipment" type="text" class="input-field text-sm" />
        </div>
        <div>
          <label class="text-xs font-medium text-text-muted mb-1 block">Instructions</label>
          <textarea v-model="editForm.instructions" rows="3" class="input-field text-sm" />
        </div>
        <div class="flex items-center space-x-2 pt-1">
          <button
            @click="saveEdit"
            :disabled="saving"
            class="flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-accent-500 text-white text-sm font-medium hover:bg-accent-600 transition-colors press"
          >
            <CheckIcon class="h-4 w-4" />
            <span>{{ saving ? 'Enregistrement...' : 'Enregistrer' }}</span>
          </button>
          <button
            @click="editing = false"
            class="p-2.5 rounded-xl hover:bg-white/5 transition-colors"
          >
            <XMarkIcon class="h-5 w-5 text-text-muted" />
          </button>
        </div>
      </div>

      <!-- Display (not editing) -->
      <template v-if="!editing">
        <!-- Image -->
        <div
          v-if="exercise.image_url"
          class="rounded-2xl overflow-hidden h-44 animate-fade-in-up stagger-1"
        >
          <img :src="exercise.image_url" :alt="exercise.title" class="w-full h-full object-cover" />
        </div>

        <!-- Badges -->
        <div v-if="badges.length" class="flex flex-wrap gap-2 animate-fade-in-up stagger-1">
          <span
            v-for="(badge, i) in badges"
            :key="i"
            class="badge"
            :class="badge.type === 'accent' ? 'badge-accent' : 'badge-neutral'"
          >
            {{ badge.label }}
          </span>
        </div>

        <!-- Description -->
        <div v-if="exercise.instructions" class="card animate-fade-in-up stagger-2">
          <p class="text-sm text-text-secondary leading-relaxed">{{ exercise.instructions }}</p>
        </div>

        <!-- Stats Grid -->
        <div v-if="stats" class="grid grid-cols-2 gap-3 animate-fade-in-up stagger-3">
          <div class="glass-subtle rounded-xl p-3 text-center">
            <p class="text-xs text-text-muted mb-1">Poids max</p>
            <p class="text-lg font-bold text-accent-400">
              {{ stats.maxWeight != null ? `${stats.maxWeight} kg` : '—' }}
            </p>
          </div>
          <div class="glass-subtle rounded-xl p-3 text-center">
            <p class="text-xs text-text-muted mb-1">Poids moy.</p>
            <p class="text-lg font-bold text-text-primary">
              {{ stats.avgWeight != null ? `${stats.avgWeight} kg` : '—' }}
            </p>
          </div>
          <div class="glass-subtle rounded-xl p-3 text-center">
            <p class="text-xs text-text-muted mb-1">Reps max</p>
            <p class="text-lg font-bold text-text-primary">
              {{ stats.maxReps ?? '—' }}
            </p>
          </div>
          <div class="glass-subtle rounded-xl p-3 text-center">
            <p class="text-xs text-text-muted mb-1">Total séries</p>
            <p class="text-lg font-bold text-text-primary">{{ stats.totalSets }}</p>
          </div>
        </div>

        <!-- Last Session -->
        <div v-if="lastSession" class="card animate-fade-in-up stagger-4">
          <h2 class="text-sm font-semibold text-text-primary mb-3">Dernière Séance</h2>
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs text-text-muted">{{ lastSession.workoutTitle }}</span>
            <span class="text-xs text-text-muted">{{ lastSession.date }}</span>
          </div>
          <div class="space-y-1.5">
            <div
              v-for="set in lastSession.sets"
              :key="set.setNumber"
              class="flex items-center justify-between text-xs"
            >
              <span class="text-text-secondary">Série {{ set.setNumber }}</span>
              <span class="text-text-primary font-medium">
                {{ set.weight != null ? `${set.weight} kg` : 'PDC' }}
                × {{ set.reps ?? '—' }} reps
              </span>
            </div>
          </div>
        </div>

        <!-- Progression Chart -->
        <div v-if="progressionData.length > 1" class="card animate-fade-in-up stagger-5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-sm font-semibold text-text-primary">Historique & Progression</h2>
            <ChartBarIcon class="h-4 w-4 text-text-muted" />
          </div>

          <div class="flex items-end space-x-1.5 h-28">
            <div
              v-for="(point, i) in progressionData"
              :key="i"
              class="flex-1 flex flex-col items-center"
            >
              <span class="text-[9px] text-text-muted mb-1">{{ point.weight }}</span>
              <div
                class="w-full rounded-t-md bg-accent-500/60 transition-all duration-500"
                :style="{
                  height: `${(point.weight / maxProgression) * 80}%`,
                  minHeight: '4px',
                  animationDelay: `${i * 50}ms`
                }"
                :class="i === progressionData.length - 1 ? 'bg-accent-500' : ''"
              />
              <span class="text-[8px] text-text-muted mt-1.5 truncate w-full text-center">{{ point.date }}</span>
            </div>
          </div>
        </div>

        <!-- No history -->
        <div v-if="!stats" class="card flex flex-col items-center justify-center py-8 text-center animate-fade-in-up stagger-3">
          <ChartBarIcon class="h-10 w-10 text-text-muted mb-3" />
          <p class="text-sm text-text-secondary mb-1">Aucun historique</p>
          <p class="text-xs text-text-muted">Les données apparaîtront après votre première séance avec cet exercice</p>
        </div>

        <!-- Delete (custom only) -->
        <div v-if="exercise.is_custom" class="pt-2 pb-4 animate-fade-in-up stagger-6">
          <button
            @click="handleDelete"
            :disabled="deleting"
            class="w-full flex items-center justify-center space-x-2 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all duration-200 press"
          >
            <TrashIcon class="h-5 w-5" />
            <span class="font-medium">{{ deleting ? 'Suppression...' : 'Supprimer l\'exercice' }}</span>
          </button>
        </div>
      </template>
    </template>
  </div>
</template>
