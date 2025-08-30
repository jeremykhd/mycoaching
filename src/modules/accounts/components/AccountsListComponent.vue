<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useAccountStore } from '../store/useAccountStore';
import { 
  PencilSquareIcon,
  CheckIcon
} from '@heroicons/vue/24/outline';
import type { Account } from '../models/Account';

const accountsStore = useAccountStore();
const searchQuery = ref('');

// Ajouter un watcher pour déboguer
watch(searchQuery, (newValue) => {
    console.log('searchQuery changed:', newValue);
});

const filteredAccounts = computed(() => {
    console.log('Computing filteredAccounts with searchQuery:', searchQuery.value);
    if (!searchQuery.value) return accountsStore.accounts;
    const query = searchQuery.value.toLowerCase();
    const filtered = accountsStore.accounts?.filter(account => 
        account.firstname.toLowerCase().includes(query) ||
        account.lastname.toLowerCase().includes(query) ||
        account.email.toLowerCase().includes(query)
    );
    console.log('Filtered accounts:', filtered);
    return filtered;
});

const toggleAccountStatus = async (account: Account) => {
  try {
    await accountsStore.updateAccount(account.id, { is_active: !account.is_active });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
  }
};
</script>

<template>
  <div class="bg-white rounded-lg shadow">
    <!-- Search -->
    <div class="p-4 border-b border-night-900/20">
      <input
        id="searchAccountInput"
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher un compte..."
        class="w-full px-4 py-2 border border-night-900/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-night-500"
      />
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-night-900/20">
        <thead class="bg-night-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-night-500 uppercase tracking-wider">
              Nom
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-night-500 uppercase tracking-wider">
              Email
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-night-500 uppercase tracking-wider">
              Statut
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-night-500 uppercase tracking-wider">
              Admin
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-night-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-night-900/20">
          <tr v-for="account in filteredAccounts" :key="account.id" class="hover:bg-night-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="h-10 w-10 flex-shrink-0">
                  <!-- <img
                    :src="account.avatar_url"
                    :alt="account.name"
                    class="h-10 w-10 rounded-full"
                  /> -->
                  
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-night-900">{{ account.firstname }} {{ account.lastname }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-night-500">{{ account.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center space-x-3">
                <button
                  id="emitToggleStatus"
                  type="button"
                  @click="toggleAccountStatus(account)"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-night-500 focus:ring-offset-2"
                  :class="account.is_active ? 'bg-green-600' : 'bg-red-600'"
                >
                  <span
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    :class="account.is_active ? 'translate-x-5' : 'translate-x-0'"
                  />
                </button>
                <span
                  class="text-sm"
                  :class="account.is_active ? 'text-green-600' : 'text-red-600'"
                >
                  {{ account.is_active ? 'Actif' : 'Inactif' }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-center items-center text-green">
                <component v-if="account.role?.name === 'ROLE_ADMIN'" :is="CheckIcon" class="text-green h-6 w-6"/>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                id="emitEdit"
                class="text-night-600 hover:text-night-900 mr-4"
                @click="$emit('edit', account)"
              >
                <PencilSquareIcon class="h-5 w-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>