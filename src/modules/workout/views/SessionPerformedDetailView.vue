<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProgramService } from '../services/useProgramService'
import {
  ArrowLeftIcon,
  ClockIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/vue/24/outline'
import { FireIcon, BoltIcon, CheckCircleIcon } from '@heroicons/vue/24/solid'

const route = useRoute()
const router = useRouter()
const { getWorkoutSession } = useProgramService()

const session = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  const id = Number(route.params.sessionId)
  if (!id) return

  const { data, error } = await getWorkoutSession(id)
  if (!error && data) session.value = data
  loading.value = false
})

const workout = computed(() => session.value?.workout)
const workoutExercises = computed(() => {
  return (workout.value?.exercises || []).sort((a: any, b: any) => (a.order ?? 99) - (b.order ?? 99))
})
const sessionExercises = computed(() => session.value?.session_exercises || [])

// Merge workout exercises with session data
interface PerformedExercise {
  title: string
  muscleGroup: string | null
  equipment: string | null
  imageUrl: string | null
  bodyWeight: boolean
  planned: { sets: number; reps: number; weight: number }
  performed: { setNumber: number; reps: number | null; weight: number | null; completed: boolean }[]
  blockId: number | null
}

const performedExercises = computed<PerformedExercise[]>(() => {
  return workoutExercises.value.map((we: any) => {
    const se = sessionExercises.value.find((s: any) => s.workout_exercise_id === we.id)
    const sets = (se?.sets || []).sort((a: any, b: any) => a.set_number - b.set_number)

    return {
      title: we.exercise?.title || 'Exercice',
      muscleGroup: we.exercise?.muscle_group || null,
      equipment: we.exercise?.equipment || null,
      imageUrl: we.exercise?.image_url || null,
      bodyWeight: we.exercise?.body_weight || false,
      planned: {
        sets: we.set || 3,
        reps: we.repetitions || 10,
        weight: we.weight || 0,
      },
      performed: sets.map((s: any) => ({
        setNumber: s.set_number,
        reps: s.repetitions,
        weight: s.weight,
        completed: s.completed,
      })),
      blockId: we.block_id,
    }
  })
})

// Group into blocks + standalone
type DisplayItem =
  | { kind: 'exercise'; ex: PerformedExercise; index: number }
  | { kind: 'block'; block: { id: number; type: string; title: string | null }; exercises: { ex: PerformedExercise; index: number }[] }

const displayItems = computed<DisplayItem[]>(() => {
  const items: DisplayItem[] = []
  const usedBlockIds = new Set<number>()
  const blocks = workout.value?.blocks || []

  for (let i = 0; i < performedExercises.value.length; i++) {
    const ex = performedExercises.value[i]
    if (ex.blockId) {
      if (!usedBlockIds.has(ex.blockId)) {
        usedBlockIds.add(ex.blockId)
        const block = blocks.find((b: any) => b.id === ex.blockId)
        const blockExercises = performedExercises.value
          .map((e, idx) => ({ ex: e, index: idx }))
          .filter(e => e.ex.blockId === ex.blockId)
        items.push({
          kind: 'block',
          block: block || { id: ex.blockId, type: 'superset', title: null },
          exercises: blockExercises,
        })
      }
    } else {
      items.push({ kind: 'exercise', ex, index: i })
    }
  }
  return items
})

// Stats
const duration = computed(() => {
  if (!session.value?.created_at || !session.value?.finished_at) return null
  const diff = new Date(session.value.finished_at).getTime() - new Date(session.value.created_at).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
})

const totalCompletedSets = computed(() => {
  return performedExercises.value.reduce((sum, ex) => {
    return sum + ex.performed.filter(s => s.completed).length
  }, 0)
})

const totalPlannedSets = computed(() => {
  return performedExercises.value.reduce((sum, ex) => sum + ex.planned.sets, 0)
})

const totalVolume = computed(() => {
  return performedExercises.value.reduce((sum, ex) => {
    return sum + ex.performed
      .filter(s => s.completed)
      .reduce((setSum, s) => setSum + (s.weight || 0) * (s.reps || 0), 0)
  }, 0)
})

const volumeFormatted = computed(() => {
  if (totalVolume.value >= 1000) return `${(totalVolume.value / 1000).toFixed(1)}T`
  return `${totalVolume.value}kg`
})

const sessionDate = computed(() => {
  if (!session.value) return ''
  return new Date(session.value.created_at).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})

const sessionTime = computed(() => {
  if (!session.value) return ''
  return new Date(session.value.created_at).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
})
</script>

<template>
  <div class="space-y-4 max-w-lg mx-auto">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="w-6 h-6 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
    </div>

    <!-- Not found -->
    <div v-else-if="!session" class="card flex flex-col items-center py-8 text-center animate-fade-in">
      <p class="text-sm text-text-secondary">Séance introuvable</p>
      <button @click="router.back()" class="mt-3 text-sm text-accent-400 press">Retour</button>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="flex items-center space-x-3 animate-fade-in">
        <button @click="router.back()" class="p-1.5 rounded-lg hover:bg-white/5 transition-colors press">
          <ArrowLeftIcon class="h-5 w-5 text-text-secondary" />
        </button>
        <div>
          <h1 class="text-lg font-bold text-text-primary">{{ workout?.title || 'Séance' }}</h1>
          <p v-if="workout?.subtitle" class="text-xs text-text-muted">{{ workout.subtitle }}</p>
        </div>
      </div>

      <!-- Hero card -->
      <div class="card animate-fade-in-up stagger-1">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-1.5 text-text-muted">
            <CalendarIcon class="h-3.5 w-3.5" />
            <span class="text-[11px] capitalize">{{ sessionDate }}</span>
          </div>
          <span class="text-[11px] text-text-muted">{{ sessionTime }}</span>
        </div>

        <div class="grid grid-cols-4 gap-1">
          <div class="rounded-xl bg-white/[0.04] py-2.5 text-center">
            <p class="text-lg font-bold text-accent-400">{{ totalCompletedSets }}</p>
            <p class="text-[10px] text-text-muted mt-0.5">/ {{ totalPlannedSets }} séries</p>
          </div>
          <div class="rounded-xl bg-white/[0.04] py-2.5 text-center">
            <p class="text-lg font-bold text-text-primary">{{ performedExercises.length }}</p>
            <p class="text-[10px] text-text-muted mt-0.5">Exercices</p>
          </div>
          <div class="rounded-xl bg-white/[0.04] py-2.5 text-center">
            <p class="text-lg font-bold text-text-primary">{{ volumeFormatted }}</p>
            <p class="text-[10px] text-text-muted mt-0.5">Volume</p>
          </div>
          <div class="rounded-xl bg-white/[0.04] py-2.5 text-center">
            <p class="text-lg font-bold text-text-primary">{{ duration || '—' }}</p>
            <p class="text-[10px] text-text-muted mt-0.5">Durée</p>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div v-if="session.notes" class="card animate-fade-in-up stagger-2">
        <div class="flex items-center space-x-2 mb-2">
          <ChatBubbleLeftIcon class="h-4 w-4 text-accent-400" />
          <span class="text-xs font-semibold text-text-primary">Notes</span>
        </div>
        <p class="text-sm text-text-secondary">{{ session.notes }}</p>
      </div>

      <!-- Exercises -->
      <div class="animate-fade-in-up stagger-3">
        <h2 class="text-sm font-semibold text-text-primary mb-3">
          Détail des exercices
        </h2>

        <div class="space-y-2">
          <template v-for="item in displayItems" :key="item.kind === 'exercise' ? `ex-${item.index}` : `block-${item.block.id}`">
            <!-- Standalone exercise -->
            <div v-if="item.kind === 'exercise'" class="card">
              <div class="flex items-start space-x-3 mb-3">
                <div v-if="item.ex.imageUrl" class="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                  <img :src="item.ex.imageUrl" :alt="item.ex.title" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-12 h-12 rounded-xl bg-accent-500/15 flex items-center justify-center flex-shrink-0">
                  <FireIcon class="h-5 w-5 text-accent-400" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-text-primary truncate">{{ item.ex.title }}</p>
                  <div class="flex items-center flex-wrap gap-1.5 mt-1">
                    <span v-if="item.ex.muscleGroup" class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent-500/15 text-accent-400">{{ item.ex.muscleGroup }}</span>
                    <span v-if="item.ex.equipment" class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-text-muted">{{ item.ex.equipment }}</span>
                    <span v-if="item.ex.bodyWeight" class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">Poids du corps</span>
                  </div>
                </div>
              </div>

              <!-- Sets table -->
              <div class="border-t border-white/[0.06] pt-3">
                <div class="grid grid-cols-[2rem_1fr_1fr_2rem] gap-2 mb-1.5 px-1">
                  <span class="text-[10px] text-text-muted text-center">Set</span>
                  <span class="text-[10px] text-text-muted text-center">{{ item.ex.bodyWeight ? 'Poids corps' : 'Poids' }}</span>
                  <span class="text-[10px] text-text-muted text-center">Reps</span>
                  <span />
                </div>
                <div v-if="item.ex.performed.length" class="space-y-1">
                  <div
                    v-for="set in item.ex.performed"
                    :key="set.setNumber"
                    class="grid grid-cols-[2rem_1fr_1fr_2rem] gap-2 items-center py-1 px-1 rounded-lg"
                    :class="set.completed ? 'bg-white/[0.03]' : 'opacity-40'"
                  >
                    <span class="text-xs font-semibold text-text-secondary text-center">{{ set.setNumber }}</span>
                    <span v-if="!item.ex.bodyWeight" class="text-sm font-medium text-text-primary text-center">{{ set.weight ?? '—' }} kg</span>
                    <span v-else class="text-xs text-text-muted text-center">BW</span>
                    <span class="text-sm font-medium text-text-primary text-center">{{ set.reps ?? '—' }}</span>
                    <div class="flex justify-center">
                      <CheckCircleIcon v-if="set.completed" class="h-4 w-4 text-accent-400" />
                      <span v-else class="w-4 h-4 rounded-full border border-white/10" />
                    </div>
                  </div>
                </div>
                <p v-else class="text-xs text-text-muted text-center py-2">Aucune série enregistrée</p>
              </div>
            </div>

            <!-- Block -->
            <div v-else class="rounded-2xl border border-accent-500/20 bg-accent-500/[0.03] overflow-hidden">
              <div class="px-4 py-2 bg-accent-500/[0.06] border-b border-accent-500/10">
                <span class="text-xs font-semibold text-accent-400 capitalize">{{ item.block.type === 'giant_set' ? 'Giant Set' : item.block.type }}</span>
                <span v-if="item.block.title" class="text-[10px] text-text-muted ml-2">— {{ item.block.title }}</span>
              </div>
              <div class="p-3 space-y-2">
                <div v-for="bex in item.exercises" :key="bex.index" class="card !bg-white/[0.03]">
                  <div class="flex items-start space-x-3 mb-3">
                    <div v-if="bex.ex.imageUrl" class="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                      <img :src="bex.ex.imageUrl" :alt="bex.ex.title" class="w-full h-full object-cover" />
                    </div>
                    <div v-else class="w-10 h-10 rounded-lg bg-accent-500/15 flex items-center justify-center flex-shrink-0">
                      <FireIcon class="h-4 w-4 text-accent-400" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-text-primary truncate">{{ bex.ex.title }}</p>
                      <span v-if="bex.ex.muscleGroup" class="text-[10px] text-accent-400">{{ bex.ex.muscleGroup }}</span>
                    </div>
                  </div>
                  <div class="border-t border-white/[0.06] pt-2">
                    <div class="grid grid-cols-[2rem_1fr_1fr_2rem] gap-2 mb-1 px-1">
                      <span class="text-[10px] text-text-muted text-center">Set</span>
                      <span class="text-[10px] text-text-muted text-center">{{ bex.ex.bodyWeight ? 'BW' : 'kg' }}</span>
                      <span class="text-[10px] text-text-muted text-center">Reps</span>
                      <span />
                    </div>
                    <div v-if="bex.ex.performed.length" class="space-y-1">
                      <div
                        v-for="set in bex.ex.performed"
                        :key="set.setNumber"
                        class="grid grid-cols-[2rem_1fr_1fr_2rem] gap-2 items-center py-1 px-1 rounded-lg"
                        :class="set.completed ? 'bg-white/[0.03]' : 'opacity-40'"
                      >
                        <span class="text-xs font-semibold text-text-secondary text-center">{{ set.setNumber }}</span>
                        <span v-if="!bex.ex.bodyWeight" class="text-sm font-medium text-text-primary text-center">{{ set.weight ?? '—' }} kg</span>
                        <span v-else class="text-xs text-text-muted text-center">BW</span>
                        <span class="text-sm font-medium text-text-primary text-center">{{ set.reps ?? '—' }}</span>
                        <div class="flex justify-center">
                          <CheckCircleIcon v-if="set.completed" class="h-4 w-4 text-accent-400" />
                          <span v-else class="w-4 h-4 rounded-full border border-white/10" />
                        </div>
                      </div>
                    </div>
                    <p v-else class="text-xs text-text-muted text-center py-2">Aucune série</p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>
