<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps<{
  searchQuery: string;
  statusFilter: string;
}>();

const emit = defineEmits<{
  (e: 'update:searchQuery', value: string): void;
  (e: 'update:statusFilter', value: string): void;
}>();

const localSearchQuery = ref(props.searchQuery);
const localStatusFilter = ref(props.statusFilter);

watch(localSearchQuery, (newValue) => {
  emit('update:searchQuery', newValue);
});

watch(localStatusFilter, (newValue) => {
  emit('update:statusFilter', newValue);
});
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-4">
    <!-- Search Input -->
    <div class="flex-1">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-night-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          :value="searchQuery"
          @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          class="input-primary pl-10 w-full"
          placeholder="Rechercher un utilisateur..."
        />
      </div>
    </div>

    <!-- Status Filter -->
    <div class="sm:w-48">
      <select
        :value="statusFilter"
        @change="$emit('update:statusFilter', ($event.target as HTMLSelectElement).value)"
        class="input-primary w-full"
      >
        <option value="all">Tous les statuts</option>
        <option value="active">Actif</option>
        <option value="inactive">Inactif</option>
        <option value="pending">En attente</option>
      </select>
    </div>
  </div>
</template> 