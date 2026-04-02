<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeftIcon,
  ShareIcon,
  CalendarIcon,
  ClockIcon,
  PencilSquareIcon,
} from '@heroicons/vue/24/outline'
import ExerciseAccordion from '../components/ExerciseAccordion.vue'

const route = useRoute()
const router = useRouter()
const sessionId = route.params.id

// Fake data
const session = {
  id: sessionId,
  title: 'Pectoraux/Triceps',
  date: 'Lundi 28 Oct 2024',
  duration: '1h 15min',
  notes: 'Bonne énergie aujourd\'hui. Augmenter le poids la semaine prochaine sur le développé couché.',
}

const exercises = [
  {
    name: 'Développé couché',
    sets: [
      { setNumber: 1, reps: 12, weight: 60, rest: 90 },
      { setNumber: 2, reps: 10, weight: 65, rest: 90 },
      { setNumber: 3, reps: 8, weight: 70, rest: 120, isPR: true },
    ],
  },
  {
    name: 'Écarté incliné haltères',
    sets: [
      { setNumber: 1, reps: 12, weight: 14, rest: 60 },
      { setNumber: 2, reps: 12, weight: 14, rest: 60 },
      { setNumber: 3, reps: 10, weight: 16, rest: 90 },
    ],
  },
  {
    name: 'Dips',
    sets: [
      { setNumber: 1, reps: 15, weight: 0, rest: 60 },
      { setNumber: 2, reps: 12, weight: 0, rest: 60 },
      { setNumber: 3, reps: 10, weight: 5, rest: 90 },
    ],
  },
]
</script>

<template>
  <div class="space-y-6 max-w-lg mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between animate-fade-in">
      <div class="flex items-center space-x-3">
        <button @click="router.back()" class="p-1.5 rounded-lg hover:bg-white/5 transition-colors press">
          <ArrowLeftIcon class="h-5 w-5 text-text-secondary" />
        </button>
        <h1 class="text-lg font-bold text-text-primary">Séance {{ session.title }}</h1>
      </div>
      <button class="p-1.5 rounded-lg hover:bg-white/5 transition-colors press">
        <ShareIcon class="h-5 w-5 text-text-secondary" />
      </button>
    </div>

    <!-- Date & Duration -->
    <div class="card animate-fade-in-up stagger-1">
      <div class="grid grid-cols-2 divide-x divide-white/[0.08]">
        <div class="pr-4">
          <div class="flex items-center space-x-2 mb-1">
            <CalendarIcon class="h-4 w-4 text-text-muted" />
            <span class="text-xs text-text-muted">Date</span>
          </div>
          <p class="text-sm font-medium text-text-primary">{{ session.date }}</p>
        </div>
        <div class="pl-4">
          <div class="flex items-center space-x-2 mb-1">
            <ClockIcon class="h-4 w-4 text-text-muted" />
            <span class="text-xs text-text-muted">Durée</span>
          </div>
          <p class="text-sm font-medium text-text-primary">{{ session.duration }}</p>
        </div>
      </div>
    </div>

    <!-- Exercises -->
    <div class="animate-fade-in-up stagger-2">
      <h2 class="text-sm font-semibold text-text-primary mb-3">Exercices</h2>
      <div class="card !p-0">
        <div class="px-5 py-2">
          <ExerciseAccordion
            v-for="exercise in exercises"
            :key="exercise.name"
            :name="exercise.name"
            :sets="exercise.sets"
          />
        </div>
      </div>
    </div>

    <!-- Notes -->
    <div class="animate-fade-in-up stagger-3">
      <h2 class="text-sm font-semibold text-text-primary mb-3">Mes Notes</h2>
      <div class="card">
        <p class="text-sm text-text-secondary leading-relaxed">{{ session.notes }}</p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center space-x-3 animate-fade-in-up stagger-4">
      <RouterLink
        :to="`/workout/session/${sessionId}/edit`"
        class="flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl border border-accent-500 text-accent-400 font-medium hover:bg-accent-500/10 transition-all duration-200 press"
      >
        <PencilSquareIcon class="h-5 w-5" />
        <span>Modifier la Séance</span>
      </RouterLink>
    </div>
  </div>
</template>
