<script lang="ts" setup>

import HealthComponent from '../components/HealthComponent.vue';
import { 
  FlagIcon,
  PencilSquareIcon,
} from '@heroicons/vue/24/outline';
import type { Account } from '../models/Account';
import type { User } from '@supabase/supabase-js';
import InformationsComponent from '../components/InformationsComponent.vue';
import { onMounted } from 'vue';
import { useAccountStore } from '../store/useAccountStore';

const props = defineProps<{
    user: User;
    account: Account
}>()

const accountStore = useAccountStore()
onMounted(() => {
  accountStore.account = props.account
})
</script>

<template>
  <div class="min-h-screen">
    <div class="max-w-7xl mx-auto px-6 space-y-8">
      <!-- Header -->
      <!-- <div class="bg-white rounded-2xl shadow-xl p-6">
        <h1 class="text-3xl font-bold text-night-900">Mon Profil</h1>
        <p class="mt-2 text-sm text-night-500">Gérez vos informations personnelles et vos objectifs</p>
      </div> -->

      <!-- Account Information Section -->
      <InformationsComponent/>
      <!-- Health Section -->
      <HealthComponent/>
      <!-- Objectives Section -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="p-6 border-b border-night-200">
          <div class="flex items-center space-x-3">
            <FlagIcon class="h-8 w-8 text-orange-500" />
            <h2 class="text-xl font-semibold text-night-900">Mes Objectifs</h2>
          </div>
        </div>

        <div class="p-6">
          <div class="flex justify-end mb-6">
            <button
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <PencilSquareIcon class="h-5 w-5 mr-2" />
              Ajouter un objectif
            </button>
          </div>

          <div class="bg-night-50 rounded-xl p-8">
            <p class="text-night-500 text-center text-lg">
              La gestion des objectifs sera bientôt disponible. Restez à l'écoute !
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>