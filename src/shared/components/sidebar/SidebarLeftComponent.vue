<script lang="ts" setup>

import type { Account } from '@/modules/accounts/models/Account';
import { UserIcon } from '@heroicons/vue/24/solid';
import { computed } from 'vue';
import { calculateAge } from '@/shared/utils/CalculateAgeFromDate';

const props = defineProps<{
    isSidebarOpen: boolean,
    account: Account
}>();

const userAge = computed(() => {
  if (!props.account.birthday) return 'Non renseigné';
  return `${calculateAge(props.account.birthday)} ans`;
});

</script>

<template>
  <!-- Version Desktop -->
  <aside
    :class="[
      'invisible lg:visible fixed inset-0 lg:inset-4 rounded-xl z-50 w-screen lg:w-72 transform transition-transform duration-300 ease-in-out glass-effect bg-gradient-to-br from-night-900 via-night-800 to-night-950',
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <div class="flex items-center justify-between h-16 px-6 border-b border-blue-900/20">
      <div class="flex items-center">
        <div class="relative">
          <img src="@/assets/logo.svg" alt="Logo" class="h-10 w-10 animate-pulse" />
          <div class="absolute -top-1 -right-1 h-3 w-3 bg-orange-400 rounded-full border-2 border-blue-950"></div>
        </div>
        <span class="ml-3 text-xl font-bold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
          MyCoaching
        </span>
      </div>
    </div>

    <!-- User Profile -->
    <div class="p-4 border-b border-blue-900/20">
      <div class="flex flex-col items-center space-y-3">
        <img
          class="h-24 w-24 rounded-full ring-4 ring-blue-800 object-cover"
          src="https://images.unsplash.com/photo-1633008692730-ff6cdbdb7621?q=80&w=2160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
        />
        <div class="text-center">
          <h2 class="text-lg font-semibold text-gray-200">{{account.firstname}} {{account.lastname}}</h2>
          <p class="text-sm text-gray-400">{{account.email}}</p>
        </div>
        <div class="flex flex-row space-x-2">
          <UserIcon class="w-6 h-6" :class="[
            account.gender === 'male' ? 'text-blue-500' :'text-pink-500',
            ]"/>
          <p class="text-sm text-gray-400">{{ userAge }}</p>
        </div>
      </div>
    </div>

    <!-- Training Stats -->
    <div class="p-4 space-y-3">
      <h3 class="text-sm font-medium text-gray-400">Activité cette semaine</h3>
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-blue-900/30 rounded-xl p-3">
          <p class="text-xs text-gray-400">Séances</p>
          <div class="flex items-baseline space-x-1">
            <p class="text-xl font-semibold text-blue-400">{{ account.objectives?.training_per_week || 0 }}</p>
            <p class="text-xs text-gray-400">/ semaine</p>
          </div>
        </div>
        <div class="bg-orange-900/20 rounded-xl p-3">
          <p class="text-xs text-gray-400">Objectif</p>
          <div class="flex items-baseline space-x-1">
            <p class="text-xl font-semibold text-orange-400">{{ account.health?.target_training || 0 }}</p>
            <p class="text-xs text-gray-400">séances</p>
          </div>
        </div>
      </div>
    </div>

    <!-- User Stats -->
    <div class="p-4 space-y-3">
      <h3 class="text-sm font-medium text-gray-400">Statistiques de santé</h3>
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-blue-900/30 rounded-xl p-3">
          <p class="text-xs text-gray-400">Poids actuel</p>
          <p class="text-xl font-semibold text-blue-400">{{ account.health?.weight || '-' }} kg</p>
        </div>
        <div class="bg-orange-900/20 rounded-xl p-3">
          <p class="text-xs text-gray-400">Objectif</p>
          <p class="text-xl font-semibold text-orange-400">{{ account.health?.target_weight || '-' }} kg</p>
        </div>
        <div class="bg-green-900/20 rounded-xl p-3">
          <p class="text-xs text-gray-400">Différence</p>
          <p class="text-xl font-semibold text-green-400">
            {{ account.health?.weight && account.health?.target_weight 
              ? (account.health.target_weight - account.health.weight).toFixed(1) 
              : '-' }} kg
          </p>
        </div>
        <div class="bg-purple-900/20 rounded-xl p-3">
          <p class="text-xs text-gray-400">IMC</p>
          <p class="text-xl font-semibold text-purple-400">
            {{ account.health?.weight && account.health?.height 
              ? ((account.health.weight / ((account.health.height / 100) ** 2))).toFixed(1)
              : '-' }}
          </p>
        </div>
      </div>
    </div>
  </aside>
</template>
