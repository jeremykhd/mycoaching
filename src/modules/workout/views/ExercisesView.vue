<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useAuthStore } from '@/modules/auth/store/useAuthStore'
import { useExerciseService } from '../services/useExerciseService'
import type { Exercise } from '../models/Exercise'
import {
  MagnifyingGlassIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const { getUserExercises } = useExerciseService()

const exercises = ref<Exercise[]>([])
const loading = ref(false)
const search = ref('')
const selectedGroup = ref('Tout')

onMounted(async () => {
  if (!authStore.account?.id) return
  loading.value = true
  const { data, error } = await getUserExercises(authStore.account.id)
  if (!error && data) exercises.value = data as Exercise[]
  loading.value = false
})

const muscleGroups = computed(() => {
  const groups = new Set<string>()
  exercises.value.forEach(e => {
    if (e.muscle_group) groups.add(e.muscle_group)
  })
  return ['Tout', ...Array.from(groups).sort()]
})

const filtered = computed(() => {
  let result = exercises.value

  if (selectedGroup.value !== 'Tout') {
    result = result.filter(e => e.muscle_group === selectedGroup.value)
  }

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    result = result.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.muscle_group?.toLowerCase().includes(q)
    )
  }

  return result
})
</script>

<template>
  <div class="space-y-4 max-w-lg mx-auto">
    <!-- Header -->
    <div class="text-center animate-fade-in">
      <h1 class="text-lg font-bold text-text-primary">Exercices</h1>
    </div>

    <!-- Search -->
    <div class="relative animate-fade-in-up stagger-1">
      <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
      <input
        v-model="search"
        type="text"
        placeholder="Rechercher un exercice..."
        class="input-field !pl-10 text-sm"
      />
    </div>

    <!-- Muscle Group Filters -->
    <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide animate-fade-in-up stagger-2">
      <button
        v-for="group in muscleGroups"
        :key="group"
        @click="selectedGroup = group"
        class="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 press-sm"
        :class="selectedGroup === group
          ? 'bg-accent-500 text-white'
          : 'bg-white/[0.06] text-text-muted hover:text-text-secondary'"
      >
        {{ group }}
      </button>
    </div>

    <!-- Exercise List -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="w-6 h-6 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
    </div>

    <div v-else-if="filtered.length" class="space-y-2">
      <RouterLink
        v-for="(exercise, i) in filtered"
        :key="exercise.id"
        :to="`/exercises/${exercise.id}`"
        class="card flex items-center justify-between press-sm animate-fade-in-up"
        :class="`stagger-${Math.min(i + 3, 8)}`"
      >
        <div class="flex items-center space-x-3 min-w-0">
          <div
            v-if="exercise.image_url"
            class="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-white/5"
          >
            <img :src="exercise.image_url" :alt="exercise.title" class="w-full h-full object-cover" />
          </div>
          <div v-else class="w-12 h-12 rounded-xl bg-accent-500/15 flex items-center justify-center flex-shrink-0">
            <span class="text-accent-400 text-lg font-bold">{{ exercise.title[0] }}</span>
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium text-text-primary truncate">{{ exercise.title }}</p>
            <div class="flex items-center gap-1.5 mt-0.5">
              <p v-if="exercise.muscle_group" class="text-xs text-accent-400">{{ exercise.muscle_group }}</p>
              <span
                v-if="exercise.is_custom"
                class="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-white/[0.06] text-text-muted"
              >
                Custom
              </span>
            </div>
          </div>
        </div>
        <ChevronRightIcon class="h-4 w-4 text-text-muted flex-shrink-0 ml-2" />
      </RouterLink>
    </div>

    <!-- Empty State -->
    <div v-else class="card flex flex-col items-center justify-center py-8 text-center animate-fade-in-up stagger-3">
      <MagnifyingGlassIcon class="h-10 w-10 text-text-muted mb-3" />
      <p class="text-sm text-text-secondary mb-1">Aucun exercice trouvé</p>
      <p class="text-xs text-text-muted">
        {{ search || selectedGroup !== 'Tout' ? 'Essayez de modifier vos filtres' : 'Créez des séances pour voir vos exercices ici' }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
