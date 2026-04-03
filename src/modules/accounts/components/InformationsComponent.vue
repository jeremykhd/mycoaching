<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import type { Account } from '../models/Account'
import { useAccountStore } from '../store/useAccountStore'
import { useAuthStore } from '@/modules/auth/store/useAuthStore'
import {
  PencilSquareIcon,
  XMarkIcon,
  CheckIcon,
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const accountStore = useAccountStore()

const account = computed(() => authStore.account)
const isEditing = ref(false)

const formData = ref<Partial<Account>>({
  firstname: account.value?.firstname,
  lastname: account.value?.lastname,
  birthday: account.value?.birthday,
  phone_number: account.value?.phone_number,
  gender: account.value?.gender,
  email: account.value?.email,
})

watch(account, (newAccount) => {
  if (newAccount) {
    formData.value = {
      firstname: newAccount.firstname,
      lastname: newAccount.lastname,
      birthday: newAccount.birthday,
      phone_number: newAccount.phone_number,
      gender: newAccount.gender,
      email: newAccount.email,
    }
  }
}, { immediate: true })

const genderLabel = computed(() => {
  if (account.value?.gender === 'male') return 'Homme'
  if (account.value?.gender === 'female') return 'Femme'
  return 'Non renseigné'
})

const formattedBirthday = computed(() => {
  if (!account.value?.birthday) return 'Non renseigné'
  return new Date(account.value.birthday).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})

const handleSubmit = async () => {
  if (account.value?.id && formData.value) {
    const updatedAccount = await accountStore.updateAccount(account.value.id, formData.value)
    isEditing.value = false
    authStore.account = updatedAccount as Account
  }
}
</script>

<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-sm font-semibold text-text-primary">Informations Personnelles</h2>
      <button
        v-if="!isEditing"
        @click="isEditing = true"
        class="p-1.5 rounded-lg hover:bg-white/5 transition-colors press text-accent-400"
      >
        <PencilSquareIcon class="h-4 w-4" />
      </button>
      <div v-else class="flex items-center space-x-1">
        <button
          @click="isEditing = false"
          class="p-1.5 rounded-lg hover:bg-white/5 transition-colors press text-text-muted"
        >
          <XMarkIcon class="h-4 w-4" />
        </button>
        <button
          @click="handleSubmit"
          class="p-1.5 rounded-lg hover:bg-white/5 transition-colors press text-accent-400"
        >
          <CheckIcon class="h-4 w-4" />
        </button>
      </div>
    </div>

    <div v-if="!isEditing" class="space-y-3">
      <div class="flex items-center justify-between">
        <p class="text-xs text-text-muted">Prénom</p>
        <p class="text-sm text-text-primary">{{ account?.firstname }}</p>
      </div>
      <div class="flex items-center justify-between">
        <p class="text-xs text-text-muted">Nom</p>
        <p class="text-sm text-text-primary">{{ account?.lastname }}</p>
      </div>
      <div class="flex items-center justify-between">
        <p class="text-xs text-text-muted">Email</p>
        <p class="text-sm text-text-secondary">{{ account?.email }}</p>
      </div>
      <div class="flex items-center justify-between">
        <p class="text-xs text-text-muted">Téléphone</p>
        <p class="text-sm text-text-primary">{{ account?.phone_number || 'Non renseigné' }}</p>
      </div>
      <div class="flex items-center justify-between">
        <p class="text-xs text-text-muted">Genre</p>
        <p class="text-sm text-text-primary">{{ genderLabel }}</p>
      </div>
      <div class="flex items-center justify-between">
        <p class="text-xs text-text-muted">Date de naissance</p>
        <p class="text-sm text-text-primary">{{ formattedBirthday }}</p>
      </div>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-3">
      <div>
        <label class="text-xs text-text-muted mb-1 block">Prénom</label>
        <input v-model="formData.firstname" type="text" class="input-field text-sm" placeholder="Votre prénom" />
      </div>
      <div>
        <label class="text-xs text-text-muted mb-1 block">Nom</label>
        <input v-model="formData.lastname" type="text" class="input-field text-sm" placeholder="Votre nom" />
      </div>
      <div>
        <label class="text-xs text-text-muted mb-1 block">Téléphone</label>
        <input v-model="formData.phone_number" type="tel" class="input-field text-sm" placeholder="Votre numéro" />
      </div>
      <div>
        <label class="text-xs text-text-muted mb-1 block">Genre</label>
        <select v-model="formData.gender" class="input-field text-sm bg-bg-muted">
          <option value="" disabled>Sélectionnez</option>
          <option value="male">Homme</option>
          <option value="female">Femme</option>
        </select>
      </div>
    </form>
  </div>
</template>
