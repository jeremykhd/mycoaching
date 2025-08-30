<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import type { Account } from '../models/Account';
import { useAccountStore } from '../store/useAccountStore';
import { useAuthStore } from '@/modules/auth/store/useAuthStore';
import { 
    UserCircleIcon as UserCircle, 
    PencilSquareIcon as PencilSquare, 
    XMarkIcon as XMark, 
    CheckIcon as Check 
} from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const accountStore = useAccountStore();

const account = computed(() => authStore.account)
const isEditing = ref(false);

const formData = ref<Partial<Account>>({ 
    firstname: account.value?.firstname,
    lastname: account.value?.lastname,
    birthday: account.value?.birthday,
    phone_number: account.value?.phone_number,
    gender: account.value?.gender,
    email: account.value?.email,
});

// Mettre à jour formData quand account change
watch(account, (newAccount) => {
    if (newAccount) {
        formData.value = {
            firstname: newAccount.firstname,
            lastname: newAccount.lastname,
            birthday: newAccount.birthday,
            phone_number: newAccount.phone_number,
            gender: newAccount.gender,
            email: newAccount.email
        };
    }
}, { immediate: true });

const handleSubmit = async () => {
  console.log('... je vais etre submit')
  if (account.value?.id && formData.value) {
    console.log('... je vais lancer la promesse de modification')
    const updatedAccount = await accountStore.updateAccount(account.value?.id, formData.value);
    console.log(updatedAccount)
    console.log('.. apres la promesse')
    isEditing.value = false;

    authStore.account = updatedAccount as Account
  }
};

</script>
<template>
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="p-6 border-b border-night-200">
          <div class="flex items-center space-x-3">
            <UserCircle class="h-8 w-8 text-orange-500" />
            <h2 class="text-xl font-semibold text-night-900">Informations Personnelles</h2>
          </div>
        </div>

        <div class="p-6">
          <div class="flex justify-end mb-6">
            <button
              @click="isEditing = !isEditing"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <PencilSquare class="h-5 w-5 mr-2" />
              {{ isEditing ? 'Annuler' : 'Modifier' }}
            </button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Avatar Section -->
            <div class="lg:col-span-1">
              <div class="flex flex-col items-center p-6 bg-night-50 rounded-xl">
                <div class="h-32 w-32 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <UserCircle class="h-24 w-24 text-orange-500" />
                </div>
                <h3 class="text-xl font-medium text-night-900 text-center">
                  {{ account?.firstname }} {{ account?.lastname }}
                </h3>
                <p class="text-sm text-night-500 mt-1">{{ account?.email }}</p>
                <div class="mt-4 flex items-center space-x-2">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <span class="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                    Actif
                  </span>
                </div>
              </div>
            </div>

            <!-- Form Fields -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Non-editable Information -->
              <div class="bg-night-50 rounded-xl p-6">
                <h4 class="text-sm font-medium text-night-500 mb-4">Informations de Compte</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-night-700">Email</label>
                    <div class="mt-1 flex items-center">
                      <p class="text-sm text-night-900">{{ account?.email }}</p>
                      <span class="ml-2 text-night-400">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-night-700">Date de Naissance</label>
                    <p class="mt-1 text-sm text-night-900">{{ account?.birthday }}</p>
                  </div>
                </div>
              </div>

              <!-- Editable Information -->
              <div class="bg-white rounded-xl p-6 border border-night-200">
                <h4 class="text-sm font-medium text-night-500 mb-4">Informations Personnelles</h4>
                <div class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-night-700 mb-1.5">Prénom</label>
                      <input
                        v-if="isEditing"
                        v-model="formData.firstname"
                        type="text"
                        class="mt-1 block w-full px-4 py-2.5 rounded-lg border border-night-200 bg-white text-night-900 placeholder-night-400 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 hover:border-night-300"
                        placeholder="Votre prénom"
                      />
                      <p v-else class="mt-1 px-4 py-2.5 text-sm text-night-900 bg-night-50 rounded-lg">{{ account?.firstname }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-night-700 mb-1.5">Nom</label>
                      <input
                        v-if="isEditing"
                        v-model="formData.lastname"
                        type="text"
                        class="mt-1 block w-full px-4 py-2.5 rounded-lg border border-night-200 bg-white text-night-900 placeholder-night-400 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 hover:border-night-300"
                        placeholder="Votre nom"
                      />
                      <p v-else class="mt-1 px-4 py-2.5 text-sm text-night-900 bg-night-50 rounded-lg">{{ account?.lastname }}</p>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-night-700 mb-1.5">Téléphone</label>
                    <input
                      v-if="isEditing"
                      v-model="formData.phone_number"
                      type="tel"
                      class="mt-1 block w-full px-4 py-2.5 rounded-lg border border-night-200 bg-white text-night-900 placeholder-night-400 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 hover:border-night-300"
                      placeholder="Votre numéro de téléphone"
                    />
                    <p v-else class="mt-1 px-4 py-2.5 text-sm text-night-900 bg-night-50 rounded-lg">{{ account?.phone_number || 'Non renseigné' }}</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-night-700 mb-1.5">Genre</label>
                    <select
                      v-if="isEditing"
                      v-model="formData.gender"
                      class="mt-1 block w-full px-4 py-2.5 rounded-lg border border-night-200 bg-white text-night-900 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 hover:border-night-300 appearance-none cursor-pointer"
                    >
                      <option value="" disabled selected>Sélectionnez votre genre</option>
                      <option value="male">Homme</option>
                      <option value="female">Femme</option>
                    </select>
                    <p v-else class="mt-1 px-4 py-2.5 text-sm text-night-900 bg-night-50 rounded-lg">
                      {{ account?.gender === 'male' ? 'Homme' : account?.gender === 'female' ? 'Femme' : 'Non renseigné' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <div v-if="isEditing" class="flex justify-end space-x-4 mt-6">
            <button
              @click="isEditing = false"
              class="inline-flex items-center px-4 py-2 border border-night-300 rounded-lg shadow-sm text-sm font-medium text-night-700 bg-white hover:bg-night-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <XMark class="h-5 w-5 mr-2" />
              Annuler
            </button>
            <button
              @click="handleSubmit"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <Check class="h-5 w-5 mr-2" />
              Enregistrer
            </button>
          </div>
        </div>
      </div>
</template>