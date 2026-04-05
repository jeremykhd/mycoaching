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
  <form id="accountForm" @submit.prevent="handleSubmit" class="space-y-4">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label for="firstname" class="block text-sm font-medium text-text-secondary mb-1.5">Prénom</label>
        <input
          id="firstname"
          v-model="formData.firstname"
          type="text"
          required
          class="input-field"
        />
      </div>
      <div>
        <label for="lastname" class="block text-sm font-medium text-text-secondary mb-1.5">Nom</label>
        <input
          id="lastname"
          v-model="formData.lastname"
          type="text"
          required
          class="input-field"
        />
      </div>
      <div>
        <label for="birthday" class="block text-sm font-medium text-text-secondary mb-1.5">Date de naissance</label>
        <input
          id="birthday"
          v-model="formData.birthday"
          type="date"
          required
          class="input-field"
        />
      </div>
      <div>
        <label for="gender" class="block text-sm font-medium text-text-secondary mb-1.5">Genre</label>
        <select
          id="gender"
          v-model="formData.gender"
          required
          class="input-field"
        >
          <option value="male">Homme</option>
          <option value="female">Femme</option>
        </select>
      </div>
      <div class="col-span-2">
        <label for="phone_number" class="block text-sm font-medium text-text-secondary mb-1.5">Numéro de téléphone</label>
        <input
          id="phone_number"
          v-model="formData.phone_number"
          type="text"
          required
          class="input-field"
        />
      </div>
    </div>

    <div class="flex justify-end gap-3 pt-3">
      <button
        type="button"
        @click="emit('cancel')"
        class="btn-secondary press"
      >
        Annuler
      </button>
      <button
        type="submit"
        class="btn-primary press"
      >
        {{ props.account ? 'Modifier' : 'Créer' }}
      </button>
    </div>
  </form>
</template>
