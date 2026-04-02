<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { XMarkIcon, TrashIcon, PlusIcon } from '@heroicons/vue/24/outline'
import SetInputRow from '../components/SetInputRow.vue'

const route = useRoute()
const router = useRouter()
const sessionId = route.params.id

// Fake data — editable
const sessionDate = ref('2024-07-24')
const sessionDuration = ref('01:25:00')
const sessionNotes = ref('')

interface EditableSet {
  id: number
  setNumber: number
  weight: number
  reps: number
  rest: number
}

interface EditableExercise {
  id: number
  name: string
  sets: EditableSet[]
}

const exercises = ref<EditableExercise[]>([
  {
    id: 1,
    name: 'Développé couché',
    sets: [
      { id: 1, setNumber: 1, weight: 80, reps: 10, rest: 90 },
      { id: 2, setNumber: 2, weight: 80, reps: 8, rest: 90 },
    ],
  },
  {
    id: 2,
    name: 'Traction',
    sets: [
      { id: 3, setNumber: 1, weight: 0, reps: 12, rest: 60 },
      { id: 4, setNumber: 2, weight: 0, reps: 10, rest: 60 },
      { id: 5, setNumber: 3, weight: 5, reps: 8, rest: 90 },
      { id: 6, setNumber: 4, weight: 5, reps: 6, rest: 90 },
    ],
  },
])

let nextSetId = 100

function addSet(exerciseId: number) {
  const exercise = exercises.value.find(e => e.id === exerciseId)
  if (!exercise) return
  const newSetNumber = exercise.sets.length + 1
  exercise.sets.push({
    id: nextSetId++,
    setNumber: newSetNumber,
    weight: 0,
    reps: 0,
    rest: 60,
  })
}

function deleteSet(exerciseId: number, setId: number) {
  const exercise = exercises.value.find(e => e.id === exerciseId)
  if (!exercise) return
  exercise.sets = exercise.sets
    .filter(s => s.id !== setId)
    .map((s, i) => ({ ...s, setNumber: i + 1 }))
}

function deleteExercise(exerciseId: number) {
  exercises.value = exercises.value.filter(e => e.id !== exerciseId)
}

function addExercise() {
  // TODO: ouvrir un sélecteur d'exercices
  exercises.value.push({
    id: Date.now(),
    name: 'Nouvel exercice',
    sets: [{ id: nextSetId++, setNumber: 1, weight: 0, reps: 0, rest: 60 }],
  })
}

function save() {
  // TODO: sauvegarder via service
  router.back()
}
</script>

<template>
  <div class="space-y-6 max-w-lg mx-auto">
    <!-- Header -->
    <div class="flex items-center space-x-3 animate-fade-in">
      <button @click="router.back()" class="p-1.5 rounded-lg hover:bg-white/5 transition-colors press">
        <XMarkIcon class="h-5 w-5 text-text-secondary" />
      </button>
      <h1 class="text-lg font-bold text-text-primary">Modifier la séance</h1>
    </div>

    <!-- Date & Duration -->
    <div class="grid grid-cols-2 gap-3 animate-fade-in-up stagger-1">
      <div>
        <label class="text-xs text-text-muted mb-1 block">Date</label>
        <input
          v-model="sessionDate"
          type="date"
          class="input-field text-sm"
        />
      </div>
      <div>
        <label class="text-xs text-text-muted mb-1 block">Durée</label>
        <input
          v-model="sessionDuration"
          type="time"
          step="1"
          class="input-field text-sm"
        />
      </div>
    </div>

    <!-- Notes -->
    <div class="animate-fade-in-up stagger-2">
      <label class="text-xs text-text-muted mb-1 block">Notes de la séance</label>
      <textarea
        v-model="sessionNotes"
        rows="3"
        class="input-field text-sm resize-none"
        placeholder="Ajouter des notes..."
      />
    </div>

    <!-- Exercises -->
    <div class="animate-fade-in-up stagger-3">
      <h2 class="text-sm font-semibold text-text-primary mb-3">Exercices</h2>

      <TransitionGroup name="list" tag="div" class="space-y-4">
        <div
          v-for="exercise in exercises"
          :key="exercise.id"
          class="card"
        >
          <!-- Exercise Header -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 rounded-lg bg-accent-500/15 flex items-center justify-center flex-shrink-0">
                <span class="text-accent-400 text-xs font-bold">{{ exercise.sets.length }}</span>
              </div>
              <div>
                <p class="text-sm font-medium text-text-primary">{{ exercise.name }}</p>
                <p class="text-xs text-text-muted">{{ exercise.sets.length }} Séries</p>
              </div>
            </div>
            <button
              @click="deleteExercise(exercise.id)"
              class="p-1.5 text-red-400/60 hover:text-red-400 transition-colors press"
            >
              <TrashIcon class="h-4 w-4" />
            </button>
          </div>

          <!-- Sets -->
          <TransitionGroup name="list" tag="div" class="space-y-2">
            <SetInputRow
              v-for="set in exercise.sets"
              :key="set.id"
              :set-number="set.setNumber"
              :weight="set.weight"
              :reps="set.reps"
              :rest="set.rest"
              :can-delete="exercise.sets.length > 1"
              @update:weight="set.weight = $event"
              @update:reps="set.reps = $event"
              @update:rest="set.rest = $event"
              @delete="deleteSet(exercise.id, set.id)"
            />
          </TransitionGroup>

          <!-- Add Set -->
          <button
            @click="addSet(exercise.id)"
            class="mt-3 w-full text-xs text-accent-400 hover:text-accent-300 transition-colors py-1.5 press-sm"
          >
            + Ajouter une série
          </button>
        </div>
      </TransitionGroup>

      <!-- Add Exercise -->
      <button
        @click="addExercise"
        class="mt-4 w-full flex items-center justify-center space-x-2 py-3 rounded-xl border border-dashed border-white/[0.12] text-accent-400 hover:bg-white/5 transition-all duration-200 press"
      >
        <PlusIcon class="h-4 w-4" />
        <span class="text-sm font-medium">Ajouter un exercice</span>
      </button>
    </div>

    <!-- Save -->
    <button
      @click="save"
      class="w-full btn-primary py-3 text-base press animate-fade-in-up stagger-4"
    >
      Enregistrer les modifications
    </button>
  </div>
</template>
