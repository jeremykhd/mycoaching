<script setup lang="ts">
import { useAuthStore } from '@/modules/auth/store/useAuthStore'
import {
  ArrowTopRightOnSquareIcon,
  Cog6ToothIcon,
  PlayIcon,
} from '@heroicons/vue/24/outline'
import SessionCard from '@/modules/workout/components/SessionCard.vue'

const authStore = useAuthStore()
const account = authStore.account

// Fake data — à remplacer par les vrais services plus tard
const personalRecords = [
  { name: 'Développé couché', value: '100 kg' },
  { name: 'Squat', value: '140 kg' },
]

const weeklyStats = {
  sessions: { current: 3, target: account?.objectives?.training_per_week || 4 },
  volume: '4,2T',
}

const upcomingSessions = [
  { name: 'Full Body B', day: 'Demain', id: 1 },
  { name: 'Leg Day', day: 'Vendredi', id: 2 },
]
</script>

<template>
  <div class="space-y-4 max-w-lg mx-auto">
    <!-- Header -->
    <div class="flex items-center space-x-3 animate-fade-in">
      <img
        class="h-10 w-10 rounded-full ring-2 ring-accent-500/30 object-cover"
        src="https://images.unsplash.com/photo-1633008692730-ff6cdbdb7621?q=80&w=2160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt=""
      />
      <h1 class="text-lg font-bold text-text-primary">
        Bonjour {{ account?.firstname || 'Coach' }} !
      </h1>
    </div>

    <!-- CTA — Démarrer une séance -->
    <button
      class="w-full flex items-center justify-center space-x-2 py-3 rounded-xl border border-accent-500 text-accent-400 font-medium hover:bg-accent-500/10 transition-all duration-200 press animate-fade-in-up stagger-1"
    >
      <PlayIcon class="h-5 w-5" />
      <span>Démarrer une nouvelle séance</span>
    </button>

    <!-- Records Personnels -->
    <div class="card animate-fade-in-up stagger-2">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-semibold text-text-primary">Records Personnels</h2>
        <RouterLink to="/progress" class="text-accent-400 hover:text-accent-300 transition-colors">
          <ArrowTopRightOnSquareIcon class="h-4 w-4" />
        </RouterLink>
      </div>
      <div class="space-y-3">
        <div
          v-for="record in personalRecords"
          :key="record.name"
          class="flex items-center justify-between"
        >
          <div>
            <p class="text-xs text-text-muted">{{ record.name }}</p>
          </div>
          <p class="text-sm font-semibold text-text-primary">{{ record.value }}</p>
        </div>
      </div>
    </div>

    <!-- Objectifs & Volume -->
    <div class="grid grid-cols-2 gap-3">
      <div class="card animate-fade-in-up stagger-3">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-sm font-semibold text-text-primary">Objectifs</h2>
          <RouterLink to="/progress" class="text-accent-400 hover:text-accent-300 transition-colors">
            <ArrowTopRightOnSquareIcon class="h-4 w-4" />
          </RouterLink>
        </div>
        <p class="text-xs text-text-muted mb-1">Séances</p>
        <div class="flex items-baseline space-x-1">
          <span class="text-2xl font-bold text-accent-400">{{ weeklyStats.sessions.current }}</span>
          <span class="text-sm text-text-muted">/{{ weeklyStats.sessions.target }}</span>
        </div>
        <p class="text-xs text-text-muted mt-1">hebdo</p>
      </div>
      <div class="card animate-fade-in-up stagger-4">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-sm font-semibold text-text-primary">Volume</h2>
          <RouterLink to="/progress" class="text-accent-400 hover:text-accent-300 transition-colors">
            <ArrowTopRightOnSquareIcon class="h-4 w-4" />
          </RouterLink>
        </div>
        <p class="text-xs text-text-muted">Total</p>
        <div class="flex items-baseline space-x-1">
          <span class="text-2xl font-bold text-text-primary">{{ weeklyStats.volume }}</span>
        </div>
        <p class="text-xs text-text-muted mt-1">cette sem.</p>
      </div>
    </div>

    <!-- Prochaines Séances -->
    <div class="card animate-fade-in-up stagger-5">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-semibold text-text-primary">Prochaines Séances</h2>
        <RouterLink to="/workout" class="text-accent-400 hover:text-accent-300 transition-colors">
          <ArrowTopRightOnSquareIcon class="h-4 w-4" />
        </RouterLink>
      </div>
      <div class="space-y-2">
        <SessionCard
          v-for="session in upcomingSessions"
          :key="session.id"
          :title="session.name"
          :subtitle="session.day"
          :to="`/workout/session/${session.id}`"
        />
      </div>
    </div>

    <!-- Personnaliser -->
    <button
      class="w-full flex items-center justify-center space-x-2 py-3 rounded-xl border border-white/[0.08] text-text-secondary font-medium hover:bg-white/5 transition-all duration-200 press animate-fade-in-up stagger-6"
    >
      <Cog6ToothIcon class="h-5 w-5" />
      <span>Personnaliser l'accueil</span>
    </button>
  </div>
</template>
