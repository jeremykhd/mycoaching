<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/store/useAuthStore'
import { useProgramService } from '../services/useProgramService'
import { useWorkoutService } from '../services/useWorkoutService'
import type { Workout, WorkoutExercise } from '../models/Workout'
import {
  ArrowLeftIcon,
  CheckIcon,
  ClockIcon,
  PlusIcon,
  MinusIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { FireIcon } from '@heroicons/vue/24/solid'

interface LiveSet {
  id?: number
  sessionExerciseId?: number
  setNumber: number
  repetitions: number
  weight: number
  bodyWeight: boolean
  completed: boolean
}

interface LiveExercise {
  workoutExerciseId: number
  sessionExerciseId?: number
  exercise: WorkoutExercise
  sets: LiveSet[]
  blockId?: number | null
}

interface LiveBlock {
  id: number
  type: string
  title: string | null
  exercises: LiveExercise[]
}

type LiveDisplayItem =
  | { kind: 'exercise'; exercise: LiveExercise; exIdx: number }
  | { kind: 'block'; block: LiveBlock }

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { getWorkoutById } = useWorkoutService()
const {
  createWorkoutSession,
  getWorkoutSession,
  finishWorkoutSession,
  deleteWorkoutSession,
  createSessionExercisesBatch,
  createSessionSet,
  updateSessionSet,
} = useProgramService()

// Route can be /workout/live/:workoutId (new) or /workout/live/session/:sessionId (resume)
const workoutIdParam = route.params.workoutId ? Number(route.params.workoutId) : null
const sessionIdParam = route.params.sessionId ? Number(route.params.sessionId) : null

const sessionId = ref<number | null>(sessionIdParam)
const workout = ref<Workout | null>(null)
const exercises = ref<LiveExercise[]>([])
const loading = ref(true)
const finishing = ref(false)
const cancelling = ref(false)
const showCancelConfirm = ref(false)
const elapsedSeconds = ref(0)
const notes = ref('')
const sessionCreatedAt = ref<string | null>(null)

let timerInterval: ReturnType<typeof setInterval> | null = null

const elapsedFormatted = computed(() => {
  const h = Math.floor(elapsedSeconds.value / 3600)
  const m = Math.floor((elapsedSeconds.value % 3600) / 60)
  const s = elapsedSeconds.value % 60
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}min`
  return `${m}min ${String(s).padStart(2, '0')}s`
})

const completedSets = computed(() => {
  return exercises.value.reduce((sum, ex) => {
    return sum + ex.sets.filter(s => s.completed).length
  }, 0)
})

const totalSets = computed(() => {
  return exercises.value.reduce((sum, ex) => sum + ex.sets.length, 0)
})

const totalVolume = computed(() => {
  return exercises.value.reduce((sum, ex) => {
    return sum + ex.sets.filter(s => s.completed).reduce((setSum, s) => {
      return setSum + (s.weight || 0) * (s.repetitions || 0)
    }, 0)
  }, 0)
})

const volumeFormatted = computed(() => {
  if (totalVolume.value >= 1000) return `${(totalVolume.value / 1000).toFixed(1)}T`
  return `${totalVolume.value}kg`
})

const liveDisplayItems = computed<LiveDisplayItem[]>(() => {
  const items: LiveDisplayItem[] = []
  const usedBlockIds = new Set<number>()
  const blocks = workout.value?.blocks || []

  for (let i = 0; i < exercises.value.length; i++) {
    const ex = exercises.value[i]
    if (ex.blockId) {
      if (!usedBlockIds.has(ex.blockId)) {
        usedBlockIds.add(ex.blockId)
        const block = blocks.find((b: any) => b.id === ex.blockId)
        const blockExercises = exercises.value.filter(e => e.blockId === ex.blockId)
        items.push({
          kind: 'block',
          block: {
            id: ex.blockId,
            type: block?.type || 'superset',
            title: block?.title || null,
            exercises: blockExercises,
          },
        })
      }
    } else {
      items.push({ kind: 'exercise', exercise: ex, exIdx: i })
    }
  }
  return items
})

const progress = computed(() => {
  if (totalSets.value === 0) return 0
  return Math.round((completedSets.value / totalSets.value) * 100)
})

function startTimer(createdAt: string) {
  sessionCreatedAt.value = createdAt
  const startTime = new Date(createdAt).getTime()
  elapsedSeconds.value = Math.floor((Date.now() - startTime) / 1000)

  timerInterval = setInterval(() => {
    elapsedSeconds.value = Math.floor((Date.now() - startTime) / 1000)
  }, 1000)
}

async function initNewSession() {
  if (!workoutIdParam || !authStore.account?.id) return

  const { data, error } = await getWorkoutById(workoutIdParam)
  if (error || !data) { router.back(); return }
  workout.value = data as Workout

  const { data: session, error: sessionError } = await createWorkoutSession({
    account_id: authStore.account.id,
    workout_id: workoutIdParam,
  })
  if (sessionError || !session) { router.back(); return }

  sessionId.value = (session as any).id
  const createdAt = (session as any).created_at

  // Build live exercises from workout template — single batch insert
  const workoutExercises = workout.value.exercises || []
  const batchData = workoutExercises.map((we, idx) => ({
    workout_session_id: sessionId.value!,
    workout_exercise_id: we.id,
    order: we.order ?? idx + 1,
  }))

  const { data: sessionExercises } = await createSessionExercisesBatch(batchData)

  for (let idx = 0; idx < workoutExercises.length; idx++) {
    const we = workoutExercises[idx]
    const se = sessionExercises?.find((s: any) => s.workout_exercise_id === we.id)

    const targetSets = we.set || 3
    const sets: LiveSet[] = []
    for (let i = 1; i <= targetSets; i++) {
      sets.push({
        setNumber: i,
        repetitions: we.repetitions || 10,
        weight: we.weight || 0,
        bodyWeight: we.exercise?.body_weight || false,
        completed: false,
        sessionExerciseId: se?.id,
      })
    }

    exercises.value.push({
      workoutExerciseId: we.id,
      sessionExerciseId: se?.id,
      exercise: we,
      sets,
      blockId: we.block_id,
    })
  }

  startTimer(createdAt)
}

async function resumeSession() {
  if (!sessionIdParam) return

  const { data, error } = await getWorkoutSession(sessionIdParam)
  if (error || !data) { router.back(); return }

  const session = data as any
  sessionId.value = session.id
  workout.value = session.workout as Workout
  notes.value = session.notes || ''

  // Rebuild exercises from session data
  const workoutExercises = workout.value?.exercises || []
  const sessionExercises = session.session_exercises || []

  for (const we of workoutExercises) {
    const se = sessionExercises.find((s: any) => s.workout_exercise_id === we.id)
    const savedSets: any[] = se?.sets || []

    const targetSets = Math.max(we.set || 3, savedSets.length)
    const sets: LiveSet[] = []

    for (let i = 1; i <= targetSets; i++) {
      const saved = savedSets.find((s: any) => s.set_number === i)
      sets.push({
        id: saved?.id,
        setNumber: i,
        repetitions: saved?.repetitions ?? we.repetitions ?? 10,
        weight: saved?.weight ?? we.weight ?? 0,
        bodyWeight: saved?.body_weight ?? we.exercise?.body_weight ?? false,
        completed: saved?.completed ?? false,
        sessionExerciseId: se?.id,
      })
    }

    exercises.value.push({
      workoutExerciseId: we.id,
      sessionExerciseId: se?.id,
      exercise: we,
      sets,
      blockId: we.block_id,
    })
  }

  startTimer(session.created_at)
}

onMounted(async () => {
  if (sessionIdParam) {
    await resumeSession()
  } else {
    await initNewSession()
  }
  loading.value = false
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

async function toggleSet(exerciseIndex: number, setIndex: number) {
  const set = exercises.value[exerciseIndex].sets[setIndex]
  set.completed = !set.completed

  if (!set.id && set.sessionExerciseId) {
    const { data } = await createSessionSet({
      workout_session_exercise_id: set.sessionExerciseId,
      set_number: set.setNumber,
      repetitions: set.repetitions,
      weight: set.weight,
      body_weight: set.bodyWeight,
      completed: set.completed,
    })
    if (data) set.id = (data as any).id
  } else if (set.id) {
    await updateSessionSet(set.id, { completed: set.completed })
  }
}

function updateSetReps(exerciseIndex: number, setIndex: number, value: number) {
  exercises.value[exerciseIndex].sets[setIndex].repetitions = Math.max(0, value)
}

function updateSetWeight(exerciseIndex: number, setIndex: number, value: number) {
  exercises.value[exerciseIndex].sets[setIndex].weight = Math.max(0, value)
}

function addSet(exerciseIndex: number) {
  const ex = exercises.value[exerciseIndex]
  const lastSet = ex.sets[ex.sets.length - 1]
  ex.sets.push({
    setNumber: ex.sets.length + 1,
    repetitions: lastSet?.repetitions || 10,
    weight: lastSet?.weight || 0,
    bodyWeight: lastSet?.bodyWeight || false,
    completed: false,
    sessionExerciseId: ex.sessionExerciseId,
  })
}

function removeSet(exerciseIndex: number) {
  const ex = exercises.value[exerciseIndex]
  if (ex.sets.length > 1) ex.sets.pop()
}

async function finishSession() {
  if (!sessionId.value) return
  finishing.value = true

  try {
    // Save all sets
    for (const ex of exercises.value) {
      for (const set of ex.sets) {
        if (!set.id && set.sessionExerciseId && set.completed) {
          const { data } = await createSessionSet({
            workout_session_exercise_id: set.sessionExerciseId,
            set_number: set.setNumber,
            repetitions: set.repetitions,
            weight: set.weight,
            body_weight: set.bodyWeight,
            completed: true,
          })
          if (data) set.id = (data as any).id
        } else if (set.id) {
          await updateSessionSet(set.id, {
            repetitions: set.repetitions,
            weight: set.weight,
            completed: set.completed,
          })
        }
      }
    }

    // Mark session as finished
    const { error } = await finishWorkoutSession(sessionId.value, notes.value || undefined)
    if (error) {
      console.error('Failed to finish session:', error)
      finishing.value = false
      return
    }

    if (timerInterval) clearInterval(timerInterval)
    router.push('/dashboard')
  } catch (e) {
    console.error('Error finishing session:', e)
    finishing.value = false
  }
}

async function cancelSession() {
  if (!sessionId.value) return
  cancelling.value = true

  try {
    await deleteWorkoutSession(sessionId.value)
    if (timerInterval) clearInterval(timerInterval)
    router.push('/dashboard')
  } catch (e) {
    console.error('Error cancelling session:', e)
    cancelling.value = false
    showCancelConfirm.value = false
  }
}
</script>

<template>
  <div class="space-y-4 max-w-lg mx-auto pb-24">
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-2 border-accent-400 border-t-transparent rounded-full animate-spin" />
    </div>

    <template v-else>
      <!-- Header -->
      <div class="flex items-center justify-between animate-fade-in">
        <div class="flex items-center space-x-3">
          <button @click="$router.back()" class="p-1.5 rounded-lg hover:bg-white/5 transition-colors press">
            <ArrowLeftIcon class="h-5 w-5 text-text-secondary" />
          </button>
          <div>
            <h1 class="text-lg font-bold text-text-primary">{{ workout?.title }}</h1>
            <p v-if="workout?.type" class="text-xs text-accent-400">
              {{ typeof workout.type === 'object' ? workout.type.name : '' }}
            </p>
          </div>
        </div>
        <button
          @click="showCancelConfirm = true"
          class="p-2 rounded-lg hover:bg-red-500/10 transition-colors press"
        >
          <XMarkIcon class="h-5 w-5 text-red-400" />
        </button>
      </div>

      <!-- Timer & Progress Bar -->
      <div class="card animate-fade-in-up stagger-1">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-2">
            <ClockIcon class="h-4 w-4 text-accent-400" />
            <span class="text-sm font-semibold text-text-primary">{{ elapsedFormatted }}</span>
          </div>
          <span class="text-xs text-text-muted">{{ completedSets }}/{{ totalSets }} séries</span>
        </div>
        <div class="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            class="h-full bg-accent-500 rounded-full transition-all duration-500"
            :style="{ width: `${progress}%` }"
          />
        </div>
        <div class="flex items-center justify-between mt-2">
          <span class="text-xs text-text-muted">{{ progress }}%</span>
          <span class="text-xs text-text-muted">Volume: {{ volumeFormatted }}</span>
        </div>
      </div>

      <!-- Exercises & Blocks -->
      <template v-for="(item, itemIdx) in liveDisplayItems" :key="item.kind === 'exercise' ? `ex-${item.exercise.workoutExerciseId}` : `block-${item.block.id}`">
        <!-- Standalone Exercise -->
        <div
          v-if="item.kind === 'exercise'"
          class="card animate-fade-in-up"
          :class="`stagger-${Math.min(itemIdx + 2, 6)}`"
        >
          <div class="flex items-center space-x-3 mb-3">
            <div v-if="item.exercise.exercise.exercise?.image_url" class="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
              <img :src="item.exercise.exercise.exercise.image_url" class="w-full h-full object-cover" alt="" />
            </div>
            <div v-else class="w-10 h-10 rounded-lg bg-accent-500/15 flex items-center justify-center flex-shrink-0">
              <FireIcon class="h-5 w-5 text-accent-400" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-text-primary truncate">{{ item.exercise.exercise.exercise?.title || 'Exercice' }}</p>
              <div class="flex items-center gap-1.5 mt-0.5">
                <span v-if="item.exercise.exercise.exercise?.muscle_group" class="text-[10px] text-accent-400">{{ item.exercise.exercise.exercise.muscle_group }}</span>
                <span v-if="item.exercise.exercise.exercise?.equipment" class="text-[10px] text-text-muted">{{ item.exercise.exercise.exercise.equipment }}</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-[2rem_1fr_1fr_2.5rem] gap-2 mb-1.5 px-1">
            <span class="text-[10px] text-text-muted text-center">Set</span>
            <span class="text-[10px] text-text-muted text-center">{{ item.exercise.sets[0]?.bodyWeight ? 'Poids corps' : 'Poids (kg)' }}</span>
            <span class="text-[10px] text-text-muted text-center">Reps</span>
            <span />
          </div>
          <div class="space-y-1.5">
            <div v-for="(set, setIdx) in item.exercise.sets" :key="setIdx" class="grid grid-cols-[2rem_1fr_1fr_2.5rem] gap-2 items-center">
              <span class="text-xs font-semibold text-text-secondary text-center">{{ set.setNumber }}</span>
              <input v-if="!set.bodyWeight" type="number" :value="set.weight" @input="updateSetWeight(item.exIdx, setIdx, Number(($event.target as HTMLInputElement).value))" class="input-field text-sm text-center !py-1.5" :class="set.completed ? 'opacity-50' : ''" />
              <span v-else class="text-xs text-text-muted text-center">BW</span>
              <input type="number" :value="set.repetitions" @input="updateSetReps(item.exIdx, setIdx, Number(($event.target as HTMLInputElement).value))" class="input-field text-sm text-center !py-1.5" :class="set.completed ? 'opacity-50' : ''" />
              <button @click="toggleSet(item.exIdx, setIdx)" class="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 press-sm" :class="set.completed ? 'bg-accent-500 text-white' : 'bg-white/[0.06] text-text-muted hover:bg-white/10'">
                <CheckIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
          <div class="flex items-center justify-center space-x-3 mt-3 pt-2 border-t border-white/[0.06]">
            <button @click="removeSet(item.exIdx)" :disabled="item.exercise.sets.length <= 1" class="p-1.5 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-30"><MinusIcon class="h-4 w-4 text-text-muted" /></button>
            <span class="text-xs text-text-muted">{{ item.exercise.sets.length }} série{{ item.exercise.sets.length > 1 ? 's' : '' }}</span>
            <button @click="addSet(item.exIdx)" class="p-1.5 rounded-lg hover:bg-white/5 transition-colors"><PlusIcon class="h-4 w-4 text-accent-400" /></button>
          </div>
        </div>

        <!-- Block (Superset / Triset) -->
        <div
          v-else
          class="rounded-2xl border border-accent-500/20 bg-accent-500/[0.03] overflow-hidden animate-fade-in-up"
          :class="`stagger-${Math.min(itemIdx + 2, 6)}`"
        >
          <div class="px-4 py-2 bg-accent-500/[0.06] border-b border-accent-500/10">
            <span class="text-xs font-semibold text-accent-400 capitalize">{{ item.block.type === 'giant_set' ? 'Giant Set' : item.block.type }}</span>
            <span v-if="item.block.title" class="text-[10px] text-text-muted ml-2">— {{ item.block.title }}</span>
          </div>
          <div class="p-3 space-y-3">
            <div v-for="bex in item.block.exercises" :key="bex.workoutExerciseId" class="card !bg-white/[0.03]">
              <div class="flex items-center space-x-3 mb-3">
                <div v-if="bex.exercise.exercise?.image_url" class="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
                  <img :src="bex.exercise.exercise.image_url" class="w-full h-full object-cover" alt="" />
                </div>
                <div v-else class="w-9 h-9 rounded-lg bg-accent-500/15 flex items-center justify-center flex-shrink-0">
                  <FireIcon class="h-4 w-4 text-accent-400" />
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-semibold text-text-primary truncate">{{ bex.exercise.exercise?.title || 'Exercice' }}</p>
                  <span v-if="bex.exercise.exercise?.muscle_group" class="text-[10px] text-accent-400">{{ bex.exercise.exercise.muscle_group }}</span>
                </div>
              </div>

              <div class="grid grid-cols-[2rem_1fr_1fr_2.5rem] gap-2 mb-1 px-1">
                <span class="text-[10px] text-text-muted text-center">Set</span>
                <span class="text-[10px] text-text-muted text-center">{{ bex.sets[0]?.bodyWeight ? 'BW' : 'kg' }}</span>
                <span class="text-[10px] text-text-muted text-center">Reps</span>
                <span />
              </div>
              <div class="space-y-1.5">
                <div v-for="(set, setIdx) in bex.sets" :key="setIdx" class="grid grid-cols-[2rem_1fr_1fr_2.5rem] gap-2 items-center">
                  <span class="text-xs font-semibold text-text-secondary text-center">{{ set.setNumber }}</span>
                  <input v-if="!set.bodyWeight" type="number" :value="set.weight" @input="updateSetWeight(exercises.indexOf(bex), setIdx, Number(($event.target as HTMLInputElement).value))" class="input-field text-sm text-center !py-1.5" :class="set.completed ? 'opacity-50' : ''" />
                  <span v-else class="text-xs text-text-muted text-center">BW</span>
                  <input type="number" :value="set.repetitions" @input="updateSetReps(exercises.indexOf(bex), setIdx, Number(($event.target as HTMLInputElement).value))" class="input-field text-sm text-center !py-1.5" :class="set.completed ? 'opacity-50' : ''" />
                  <button @click="toggleSet(exercises.indexOf(bex), setIdx)" class="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 press-sm" :class="set.completed ? 'bg-accent-500 text-white' : 'bg-white/[0.06] text-text-muted hover:bg-white/10'">
                    <CheckIcon class="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div class="flex items-center justify-center space-x-3 mt-2 pt-2 border-t border-white/[0.06]">
                <button @click="removeSet(exercises.indexOf(bex))" :disabled="bex.sets.length <= 1" class="p-1.5 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-30"><MinusIcon class="h-4 w-4 text-text-muted" /></button>
                <span class="text-[10px] text-text-muted">{{ bex.sets.length }} série{{ bex.sets.length > 1 ? 's' : '' }}</span>
                <button @click="addSet(exercises.indexOf(bex))" class="p-1.5 rounded-lg hover:bg-white/5 transition-colors"><PlusIcon class="h-4 w-4 text-accent-400" /></button>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Notes -->
      <div class="card animate-fade-in-up">
        <label class="text-xs font-medium text-text-muted mb-1 block">Notes (optionnel)</label>
        <textarea
          v-model="notes"
          rows="2"
          placeholder="Comment s'est passée la séance ?"
          class="input-field text-sm resize-none"
        />
      </div>
    </template>

    <!-- Floating finish button -->
    <div v-if="!loading" class="fixed bottom-20 left-0 right-0 px-4 max-w-lg mx-auto z-30">
      <button
        @click="finishSession"
        :disabled="finishing"
        class="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl bg-accent-500 text-white font-medium shadow-lg shadow-accent-500/25 hover:bg-accent-600 transition-all duration-200 press"
      >
        <CheckIcon class="h-5 w-5" />
        <span>{{ finishing ? 'Enregistrement...' : 'Terminer la séance' }}</span>
      </button>
    </div>

    <!-- Cancel confirmation modal -->
    <Teleport to="body">
      <Transition name="page">
        <div v-if="showCancelConfirm" class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showCancelConfirm = false" />
          <div class="relative card max-w-sm mx-4 w-full text-center">
            <div class="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
              <XMarkIcon class="h-6 w-6 text-red-400" />
            </div>
            <h3 class="text-lg font-bold text-text-primary mb-2">Annuler la séance ?</h3>
            <p class="text-sm text-text-muted mb-6">
              Toute la progression de cette séance sera supprimée. Cette action est irréversible.
            </p>
            <div class="flex gap-3">
              <button
                @click="showCancelConfirm = false"
                class="btn-secondary press flex-1"
              >
                Continuer
              </button>
              <button
                @click="cancelSession"
                :disabled="cancelling"
                class="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-all duration-200 press"
              >
                {{ cancelling ? 'Suppression...' : 'Annuler la séance' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
