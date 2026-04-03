<script lang="ts" setup>
import { onMounted, computed } from 'vue'
import type { Account } from '../models/Account'
import type { User } from '@supabase/supabase-js'
import { useAccountStore } from '../store/useAccountStore'
import { useAuthStore } from '@/modules/auth/store/useAuthStore'
import InformationsComponent from '../components/InformationsComponent.vue'
import HealthComponent from '../components/HealthComponent.vue'
import {
  ArrowRightStartOnRectangleIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  user: User
  account: Account
}>()

const accountStore = useAccountStore()
const authStore = useAuthStore()

const account = computed(() => authStore.account)

const initials = computed(() => {
  const f = account.value?.firstname?.[0] || ''
  const l = account.value?.lastname?.[0] || ''
  return (f + l).toUpperCase()
})

const memberSince = computed(() => {
  if (!account.value?.created_at) return ''
  return new Date(account.value.created_at).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  })
})

onMounted(() => {
  accountStore.account = props.account
})

const handleLogout = async () => {
  await authStore.signOut()
}
</script>

<template>
  <div class="space-y-4 max-w-lg mx-auto">
    <!-- Avatar + Name Header -->
    <div class="flex flex-col items-center text-center animate-fade-in pt-2">
      <div class="w-20 h-20 rounded-full bg-accent-500/15 flex items-center justify-center mb-3 ring-2 ring-accent-500/30">
        <span class="text-2xl font-bold text-accent-400">{{ initials }}</span>
      </div>
      <h1 class="text-lg font-bold text-text-primary">
        {{ account?.firstname }} {{ account?.lastname }}
      </h1>
      <p class="text-xs text-text-muted mt-0.5">{{ account?.email }}</p>
      <div class="flex items-center space-x-2 mt-2">
        <span class="badge badge-accent">{{ account?.role?.name || 'Membre' }}</span>
        <span v-if="memberSince" class="text-[10px] text-text-muted">Membre depuis {{ memberSince }}</span>
      </div>
    </div>

    <!-- Informations Personnelles -->
    <div class="animate-fade-in-up stagger-1">
      <InformationsComponent />
    </div>

    <!-- Santé -->
    <div class="animate-fade-in-up stagger-2">
      <HealthComponent />
    </div>

    <!-- Objectifs -->
    <div class="card animate-fade-in-up stagger-3">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-semibold text-text-primary">Objectifs</h2>
      </div>
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <p class="text-xs text-text-muted">Entraînements / semaine</p>
          <span class="badge badge-accent">{{ account?.objectives?.training_per_week ?? '—' }}</span>
        </div>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="card animate-fade-in-up stagger-4 !p-0">
      <RouterLink
        to="/progress"
        class="flex items-center justify-between p-4 border-b border-white/[0.06] hover:bg-white/5 transition-colors press-sm"
      >
        <span class="text-sm text-text-primary">Mes progrès</span>
        <ChevronRightIcon class="h-4 w-4 text-text-muted" />
      </RouterLink>
      <RouterLink
        to="/workout"
        class="flex items-center justify-between p-4 hover:bg-white/5 transition-colors press-sm"
      >
        <span class="text-sm text-text-primary">Historique séances</span>
        <ChevronRightIcon class="h-4 w-4 text-text-muted" />
      </RouterLink>
    </div>

    <!-- Logout -->
    <button
      @click="handleLogout"
      class="w-full flex items-center justify-center space-x-2 py-3 rounded-xl text-red-400/80 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 press animate-fade-in-up stagger-5"
    >
      <ArrowRightStartOnRectangleIcon class="h-5 w-5" />
      <span class="text-sm font-medium">Se déconnecter</span>
    </button>
  </div>
</template>
