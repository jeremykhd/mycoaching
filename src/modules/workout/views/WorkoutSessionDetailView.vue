<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWorkoutService } from '../services/useWorkoutService'
import type { Workout } from '../models/Workout'
import {
  ArrowLeftIcon,
  CalendarIcon,
  TrashIcon,
  CubeIcon,
  ArrowPathRoundedSquareIcon,
  ClockIcon,
} from '@heroicons/vue/24/outline'
import { FireIcon, BoltIcon } from '@heroicons/vue/24/solid'

const route = useRoute()
const router = useRouter()
const { getWorkoutById, deleteWorkout } = useWorkoutService()

const workout = ref<Workout | null>(null)
const loading = ref(true)
const deleting = ref(false)

onMounted(async () => {
  const id = Number(route.params.id)
  if (!id) return

  const { data, error } = await getWorkoutById(id)
  if (!error && data) workout.value = data as Workout
  loading.value = false
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const typeName = computed(() => {
  if (!workout.value?.type) return null
  return typeof workout.value.type === 'object' ? workout.value.type.name : null
})

// Flatten exercises from pivot
const exercises = computed(() => {
  if (!workout.value?.exercises) return []
  return workout.value.exercises
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
    .map(we => ({
      ...we,
      ex: we.exercise,
    }))
})

const totalSets = computed(() => {
  return exercises.value.reduce((sum, we) => sum + (we.set || 0), 0)
})

const totalVolume = computed(() => {
  return exercises.value.reduce((total, we) => {
    return total + (we.set || 0) * (we.repetitions || 0) * (we.weight || 0)
  }, 0)
})

const estimatedDuration = computed(() => {
  return exercises.value.reduce((total, we) => {
    const setTime = (we.set || 0) * 45
    const restTime = (we.set || 0) * (we.rest || 0)
    return total + setTime + restTime
  }, 0)
})

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60)
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

const muscleGroups = computed(() => {
  const groups = new Set<string>()
  exercises.value.forEach(we => {
    if (we.ex?.muscle_group) groups.add(we.ex.muscle_group)
  })
  return Array.from(groups)
})

async function handleDelete() {
  if (!workout.value || deleting.value) return
  deleting.value = true
  const { error } = await deleteWorkout(workout.value.id)
  if (!error) {
    router.push('/workout/sessions')
  }
  deleting.value = false
}
</script>

<template>
  <div class="space-y-4 max-w-lg mx-auto">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="w-6 h-6 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
    </div>

    <!-- Not found -->
    <div v-else-if="!workout" class="card flex flex-col items-center py-8 text-center animate-fade-in">
      <p class="text-sm text-text-secondary">Séance introuvable</p>
      <button @click="router.back()" class="mt-3 text-sm text-accent-400 press">Retour</button>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="flex items-center justify-between animate-fade-in">
        <div class="flex items-center space-x-3">
          <button @click="router.back()" class="p-1.5 rounded-lg hover:bg-white/5 transition-colors press">
            <ArrowLeftIcon class="h-5 w-5 text-text-secondary" />
          </button>
          <div>
            <h1 class="text-lg font-bold text-text-primary">{{ workout.title }}</h1>
            <p v-if="workout.subtitle" class="text-xs text-text-muted">{{ workout.subtitle }}</p>
          </div>
        </div>
      </div>

      <!-- Hero card -->
      <div class="card animate-fade-in-up stagger-1">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-2">
            <span
              v-if="typeName"
              class="text-xs font-semibold px-3 py-1 rounded-full bg-accent-500/15 text-accent-400"
            >
              {{ typeName }}
            </span>
          </div>
          <div class="flex items-center space-x-1.5 text-text-muted">
            <CalendarIcon class="h-3.5 w-3.5" />
            <span class="text-[11px] capitalize">{{ formatDate(workout.created_at) }}</span>
          </div>
        </div>

        <div v-if="muscleGroups.length" class="flex flex-wrap gap-1.5 mb-4">
          <span
            v-for="group in muscleGroups"
            :key="group"
            class="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/[0.06] text-text-secondary"
          >
            {{ group }}
          </span>
        </div>

        <div class="grid grid-cols-4 gap-1">
          <div class="rounded-xl bg-white/[0.04] py-2.5 text-center">
            <p class="text-lg font-bold text-accent-400">{{ exercises.length }}</p>
            <p class="text-[10px] text-text-muted mt-0.5">Exercices</p>
          </div>
          <div class="rounded-xl bg-white/[0.04] py-2.5 text-center">
            <p class="text-lg font-bold text-text-primary">{{ totalSets }}</p>
            <p class="text-[10px] text-text-muted mt-0.5">Séries</p>
          </div>
          <div class="rounded-xl bg-white/[0.04] py-2.5 text-center">
            <p class="text-lg font-bold text-text-primary">{{ totalVolume > 0 ? (totalVolume / 1000).toFixed(1) : '0' }}</p>
            <p class="text-[10px] text-text-muted mt-0.5">t. volume</p>
          </div>
          <div class="rounded-xl bg-white/[0.04] py-2.5 text-center">
            <p class="text-lg font-bold text-text-primary">~{{ formatDuration(estimatedDuration) }}</p>
            <p class="text-[10px] text-text-muted mt-0.5">Durée est.</p>
          </div>
        </div>
      </div>

      <!-- Exercises list -->
      <div class="animate-fade-in-up stagger-2">
        <h2 class="text-sm font-semibold text-text-primary mb-3">
          Exercices ({{ exercises.length }})
        </h2>

        <div v-if="exercises.length" class="space-y-2">
          <div
            v-for="(we, index) in exercises"
            :key="we.id"
            class="card animate-fade-in-up"
            :class="`stagger-${Math.min(index + 3, 8)}`"
          >
            <div class="flex items-start space-x-3">
              <div
                v-if="we.ex?.image_url"
                class="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-white/5"
              >
                <img :src="we.ex.image_url" :alt="we.ex.title" class="w-full h-full object-cover" />
              </div>
              <div v-else class="w-12 h-12 rounded-xl bg-accent-500/15 flex items-center justify-center flex-shrink-0">
                <span class="text-accent-400 text-lg font-bold">{{ index + 1 }}</span>
              </div>

              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-text-primary truncate">{{ we.ex?.title || 'Exercice' }}</p>
                <div class="flex items-center flex-wrap gap-1.5 mt-1">
                  <span
                    v-if="we.ex?.muscle_group"
                    class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent-500/15 text-accent-400"
                  >
                    {{ we.ex.muscle_group }}
                  </span>
                  <span
                    v-if="we.ex?.equipment"
                    class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-text-muted"
                  >
                    {{ we.ex.equipment }}
                  </span>
                  <span
                    v-if="we.ex?.body_weight"
                    class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400"
                  >
                    Poids du corps
                  </span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-white/[0.06]">
              <div class="flex flex-col items-center">
                <div class="flex items-center space-x-1 mb-0.5">
                  <ArrowPathRoundedSquareIcon class="h-3 w-3 text-accent-400" />
                  <span class="text-[10px] text-text-muted">Séries</span>
                </div>
                <span class="text-sm font-bold text-text-primary">{{ we.set || '—' }}</span>
              </div>
              <div class="flex flex-col items-center">
                <div class="flex items-center space-x-1 mb-0.5">
                  <BoltIcon class="h-3 w-3 text-accent-400" />
                  <span class="text-[10px] text-text-muted">Reps</span>
                </div>
                <span class="text-sm font-bold text-text-primary">{{ we.repetitions || '—' }}</span>
              </div>
              <div class="flex flex-col items-center">
                <div class="flex items-center space-x-1 mb-0.5">
                  <CubeIcon class="h-3 w-3 text-accent-400" />
                  <span class="text-[10px] text-text-muted">Poids</span>
                </div>
                <span class="text-sm font-bold text-text-primary">
                  {{ we.weight ? `${we.weight} kg` : '—' }}
                </span>
              </div>
              <div class="flex flex-col items-center">
                <div class="flex items-center space-x-1 mb-0.5">
                  <ClockIcon class="h-3 w-3 text-accent-400" />
                  <span class="text-[10px] text-text-muted">Repos</span>
                </div>
                <span class="text-sm font-bold text-text-primary">
                  {{ we.rest ? `${we.rest}s` : '—' }}
                </span>
              </div>
            </div>

            <p
              v-if="we.ex?.secondary_muscles"
              class="text-[10px] text-text-muted mt-2 pt-2 border-t border-white/[0.04]"
            >
              Muscles secondaires : {{ we.ex.secondary_muscles }}
            </p>
          </div>
        </div>

        <div v-else class="card text-center py-6">
          <p class="text-sm text-text-muted">Aucun exercice dans cette séance</p>
        </div>
      </div>

      <!-- Delete -->
      <div class="animate-fade-in-up stagger-5 pt-2 pb-4">
        <button
          @click="handleDelete"
          :disabled="deleting"
          class="w-full flex items-center justify-center space-x-2 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all duration-200 press"
        >
          <TrashIcon class="h-5 w-5" />
          <span class="font-medium">{{ deleting ? 'Suppression...' : 'Supprimer la séance' }}</span>
        </button>
      </div>
    </template>
  </div>
</template>
