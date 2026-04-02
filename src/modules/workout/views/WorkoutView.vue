<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import CalendarStrip from '../components/CalendarStrip.vue'
import SessionCard from '../components/SessionCard.vue'

// Fake data
const todaySessions = [
  {
    id: 1,
    title: 'Pectoraux & Triceps',
    badges: [
      { label: '+5% volume', type: 'accent' as const },
      { label: 'Durée: 1h05m', type: 'neutral' as const },
      { label: 'Volume: ', type: 'neutral' as const },
    ],
    totalWeight: '9,200 kg',
  },
  {
    id: 2,
    title: 'Cardio Léger',
    badges: [
      { label: 'Durée: 0h30m', type: 'neutral' as const },
      { label: 'Calories: ', type: 'neutral' as const },
    ],
    totalWeight: '300 kcal',
  },
]

const pastSessions = [
  {
    id: 3,
    title: 'Leg Day',
    date: 'Dimanche 12 Mai',
    badges: [
      { label: 'Record personnel sur le Squat!', type: 'accent' as const },
      { label: 'Volume: ', type: 'neutral' as const },
    ],
    totalWeight: '12,500 kg',
  },
  {
    id: 4,
    title: 'Dos & Biceps',
    date: 'Vendredi 10 Mai',
    badges: [
      { label: '-2% volume', type: 'neutral' as const },
      { label: 'Durée: 1h20m', type: 'neutral' as const },
      { label: 'Volume: ', type: 'neutral' as const },
    ],
    totalWeight: '7,800 kg',
  },
]

const selectedDate = ref(new Date())

const selectedDateLabel = computed(() => {
  const d = selectedDate.value
  const today = new Date()
  const isToday =
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()

  const formatted = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  return { isToday, formatted }
})

function onDateSelect(date: Date) {
  selectedDate.value = date
}
</script>

<template>
  <div class="space-y-6 max-w-lg mx-auto">
    <!-- Header -->
    <div class="flex items-center space-x-3 animate-fade-in">
      <button @click="$router.back()" class="p-1.5 rounded-lg hover:bg-white/5 transition-colors press">
        <ArrowLeftIcon class="h-5 w-5 text-text-secondary" />
      </button>
      <h1 class="text-lg font-bold text-text-primary">Historique des Séances</h1>
    </div>

    <!-- Calendar -->
    <div class="animate-fade-in-up stagger-1">
      <CalendarStrip @select="onDateSelect" />
    </div>

    <!-- Today's Sessions -->
    <div class="animate-fade-in-up stagger-2">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-semibold text-text-primary">
          {{ selectedDateLabel.isToday ? "Aujourd'hui" : '' }}
        </h2>
        <span class="text-xs text-text-muted capitalize">{{ selectedDateLabel.formatted }}</span>
      </div>
      <div class="space-y-3">
        <div
          v-for="(session, i) in todaySessions"
          :key="session.id"
          class="card press-sm animate-fade-in-up"
          :class="`stagger-${i + 3}`"
        >
          <SessionCard
            :title="session.title"
            :badges="session.badges"
            :total-weight="session.totalWeight"
            :to="`/workout/session/${session.id}`"
          />
        </div>
      </div>
    </div>

    <!-- Past Sessions -->
    <div class="animate-fade-in-up stagger-5">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-semibold text-text-primary">Séances passées</h2>
        <button class="text-xs text-accent-400 hover:text-accent-300 transition-colors">
          Voir tout
        </button>
      </div>
      <div class="space-y-3">
        <div
          v-for="(session, i) in pastSessions"
          :key="session.id"
          class="card press-sm animate-fade-in-up"
          :class="`stagger-${i + 6}`"
        >
          <p class="text-xs text-text-muted mb-1 px-3">{{ session.date }}</p>
          <SessionCard
            :title="session.title"
            :badges="session.badges"
            :total-weight="session.totalWeight"
            :to="`/workout/session/${session.id}`"
          />
        </div>
      </div>
    </div>
  </div>
</template>
