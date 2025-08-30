<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import type { Account } from '../models/Account';

const props = defineProps<{
  account?: Account | null;
}>();

const emit = defineEmits<{
  (e: 'submit', account: Partial<Account>): void;
  (e: 'cancel'): void;
}>();

const formData = ref<Partial<Account>>({
    firstname: '',
    lastname: '',
    birthday: '',
    phone_number: '',
    gender: null,
    is_active: undefined
});

onMounted(() => {
  if (props.account) {
    formData.value = { 
      firstname: props.account.firstname,
      lastname: props.account.lastname,
      birthday: props.account.birthday,
      gender: props.account.gender,
      phone_number: props.account.phone_number,
      is_active: props.account.is_active
    };
  }
});

const handleSubmit = () => {
  emit('submit', formData.value);
};
</script>

<template>
  <form id="accountForm" @submit.prevent="handleSubmit" class="space-y-3">
    <div class="grid grid-cols-2 gap-3">
      <!-- Colonne de gauche -->
      <div class="space-y-3">
        <div>
          <label for="firstname" class="block text-sm font-medium text-white">Prénom</label>
          <input
            id="firstname"
            v-model="formData.firstname"
            type="text"
            required
            class="mt-1 block w-full px-3 py-2 bg-white/50 border-white/20 rounded-xl text-night-900 placeholder-night-600 focus:outline-none focus:ring-2 focus:ring-night-500 focus:border-transparent"
          />
        </div>
        <div>
          <label for="birthday" class="block text-sm font-medium text-white">Date de naissance</label>
          <input
            id="birthday"
            v-model="formData.birthday"
            type="date"
            required
            class="mt-1 block w-full px-3 py-2 bg-white/50 border-white/20 rounded-xl text-night-900 placeholder-night-600 focus:outline-none focus:ring-2 focus:ring-night-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Colonne de droite -->
      <div class="space-y-3">
        <div>
          <label for="lastname" class="block text-sm font-medium text-white">Nom</label>
          <input
            id="lastname"
            v-model="formData.lastname"
            type="text"
            required
            class="mt-1 block w-full px-3 py-2 bg-white/50 border-white/20 rounded-xl text-night-900 placeholder-night-600 focus:outline-none focus:ring-2 focus:ring-night-500 focus:border-transparent"
          />
        </div>
        <div class="space-y-3">
          <div>
            <label for="gender" class="block text-sm font-medium text-white">Genre</label>
            <select
              id="gender"
              v-model="formData.gender"
              required
              class="mt-1 block w-full px-3 py-2 bg-white/50 border-white/20 rounded-xl text-night-900 placeholder-night-600 focus:outline-none focus:ring-2 focus:ring-night-500 focus:border-transparent"
            >
              <option value="male">Homme</option>
              <option value="female">Femme</option>
            </select>
          </div>
        </div>
      </div>

      <div class="col-span-2 space-y-3">
        <div>
          <label for="phone_number" class="block text-sm font-medium text-white">Numero de téléphone</label>
          <input
            id="phone_number"
            v-model="formData.phone_number"
            type="text"
            required
            class="mt-1 block w-full px-3 py-2 bg-white/50 border-white/20 rounded-xl text-night-900 placeholder-night-600 focus:outline-none focus:ring-2 focus:ring-night-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>

    <div class="flex justify-end space-x-3 pt-2">
      <button
        type="button"
        @click="emit('cancel')"
        class="px-4 py-2 text-sm font-medium text-white bg-white/20 rounded-xl hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-night-500"
      >
        Annuler
      </button>
      <button
        type="submit"
        class="px-4 py-2 text-sm font-medium text-white bg-night-600 rounded-xl hover:bg-night-700 focus:outline-none focus:ring-2 focus:ring-night-500"
      >
        {{ props.account ? 'Modifier' : 'Créer' }}
      </button>
    </div>
  </form>
</template> 