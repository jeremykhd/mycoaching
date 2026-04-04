<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/modules/auth/store/useAuthStore'
import { useWorkoutService } from '../services/useWorkoutService'
import type { Workout } from '../models/Workout'
import {
  ArrowLeftIcon,
  PlusIcon,
  ChevronRightIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/vue/24/outline'
import { FireIcon } from '@heroicons/vue/24/solid'

const authStore = useAuthStore()
const { getWorkouts } = useWorkoutService()

const workouts = ref<Workout[]>([])
const loading = ref(true)

onMounted(async () => {
  if (!authStore.account?.id) return
  const { data, error } = await getWorkouts(authStore.account.id)
  if (!error && data) workouts.value = data as Workout[]
  loading.value = false
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
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
        <h1 class="text-lg font-bold text-text-primary">Mes Séances</h1>
      </div>
      <RouterLink
        to="/workout/create"
        class="p-2 rounded-xl bg-accent-500 text-white hover:bg-accent-600 transition-colors press"
      >
        <PlusIcon class="h-5 w-5" />
      </RouterLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="w-6 h-6 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
    </div>

    <!-- List -->
    <div v-else-if="workouts.length" class="space-y-2">
      <RouterLink
        v-for="(workout, i) in workouts"
        :key="workout.id"
        :to="`/workout/session/${workout.id}`"
        class="card flex items-center justify-between press-sm animate-fade-in-up"
        :class="`stagger-${Math.min(i + 1, 8)}`"
      >
        <div class="flex items-center space-x-3 min-w-0">
          <div class="w-10 h-10 rounded-full bg-accent-500/15 flex items-center justify-center flex-shrink-0">
            <FireIcon class="h-5 w-5 text-accent-400" />
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium text-text-primary truncate">{{ workout.title }}</p>
            <div class="flex items-center space-x-2 mt-0.5">
              <span class="text-[10px] text-text-muted">{{ formatDate(workout.created_at) }}</span>
              <span
                v-if="workout.type"
                class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent-500/15 text-accent-400"
              >
                {{ typeof workout.type === 'object' ? workout.type.name : '' }}
              </span>
              <span
                v-if="workout.exercises?.length"
                class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-text-muted"
              >
                {{ workout.exercises.length }} exercice{{ workout.exercises.length > 1 ? 's' : '' }}
              </span>
            </div>
          </div>
        </div>
        <ChevronRightIcon class="h-4 w-4 text-text-muted flex-shrink-0 ml-2" />
      </RouterLink>
    </div>

    <!-- Empty State -->
    <div v-else class="card flex flex-col items-center justify-center py-8 text-center animate-fade-in-up stagger-1">
      <ClipboardDocumentListIcon class="h-10 w-10 text-text-muted mb-3" />
      <p class="text-sm text-text-secondary mb-1">Aucune séance créée</p>
      <p class="text-xs text-text-muted mb-4">Créez votre première séance d'entraînement</p>
      <RouterLink to="/workout/create" class="btn-primary text-sm press">
        <PlusIcon class="h-4 w-4 inline mr-1" />
        Créer une séance
      </RouterLink>
    </div>
  </div>
</template>
