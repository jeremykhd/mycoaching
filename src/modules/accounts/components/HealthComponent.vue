<script lang="ts" setup>
import type { Account } from '../models/Account';
import type { Health } from '../models/Health';
import { EnumMeasureWeight } from '../models/Health';
import { 
  HeartIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/vue/24/outline';
import { useAccountStore } from '../store/useAccountStore';
import { ref, computed, watch } from 'vue';
import UiInputNumber from '@/shared/ui/inputs/UiInputNumber.vue';
import UiSelect from '@/shared/ui/select/UiSelect.vue';
import { useAuthStore } from '@/modules/auth/store/useAuthStore';

const accountStore = useAccountStore();
const authStore = useAuthStore();
const account = computed(() => authStore.account)
const isEditing = ref(false);

const formData = ref<Partial<Health>>({
  height: account.value?.health?.height || undefined,
  weight: account.value?.health?.weight || undefined,
  target_weight: account.value?.health?.target_weight || undefined,
  target_training: account.value?.health?.target_training || undefined,
  measure_weight: account.value?.health?.measure_weight || EnumMeasureWeight.weekly
});

// Mettre à jour formData quand account change
watch(account, (newAccount) => {
  if (newAccount?.health) {
    formData.value = {
      height: newAccount.health.height || undefined,
      weight: newAccount.health.weight || undefined,
      target_weight: newAccount.health.target_weight || undefined,
      target_training: newAccount.health.target_training || undefined,
      measure_weight: newAccount.health.measure_weight || EnumMeasureWeight.weekly
    };
  }
}, { immediate: true });

const measureWeightOptions = [
  { value: EnumMeasureWeight.daily, label: 'Quotidien' },
  { value: EnumMeasureWeight.weekly, label: 'Hebdomadaire' },
  { value: EnumMeasureWeight.monthly, label: 'Mensuel' }
];

const hasHealthData = computed(() => {
  return account.value?.health?.id
});

const handleSubmit = async () => {
  if (account.value?.id) {
    const updatedAccount = await accountStore.updateHealth(account.value?.health.id, formData.value);
    isEditing.value = false;
    authStore.account = updatedAccount as Account
  }
};

const handleCancel = () => {
  if (account.value?.health) {
    formData.value = {
      height: account.value.health.height || undefined,
      weight: account.value.health.weight || undefined,
      target_weight: account.value.health.target_weight || undefined,
      target_training: account.value.health.target_training || undefined,
      measure_weight: account.value.health.measure_weight || EnumMeasureWeight.weekly
    };
  }
  isEditing.value = false;
};
</script>

<template>
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="p-6 border-b border-night-200">
          <div class="flex items-center space-x-3">
            <HeartIcon class="h-8 w-8 text-orange-500" />
            <h2 class="text-xl font-semibold text-night-900">Informations de Santé</h2>
          </div>
        </div>

        <div class="p-6">
          <div v-if="!hasHealthData" class="text-center py-8">
            <HeartIcon class="mx-auto h-12 w-12 text-night-400" />
            <h3 class="mt-2 text-lg font-medium text-night-900">Aucune donnée de santé</h3>
            <p class="mt-1 text-sm text-night-500">
              Commencez à suivre votre progression en ajoutant vos informations de santé.
            </p>
            <div class="mt-6">
              <button
                @click="isEditing = true"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <PlusCircleIcon class="h-5 w-5 mr-2" />
                Ajouter mes informations
              </button>
            </div>
          </div>

          <template v-else>
            <div class="flex justify-end mb-6">
              <button
                @click="isEditing = true"
                :disabled="isEditing"
                :class="[
                  'inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500',
                  isEditing 
                    ? 'bg-orange-400 cursor-not-allowed'
                    : 'bg-orange-600 hover:bg-orange-700'
                ]"
              >
                <PencilSquareIcon class="h-5 w-5 mr-2" />
                Modifier
              </button>
            </div>

            <div v-if="isEditing" class="mb-6">
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Statistiques de Santé -->
                  <div class="bg-night-50 rounded-xl p-6">
                    <h3 class="text-lg font-medium text-night-900 mb-6">Statistiques de Santé</h3>
                    <div class="space-y-4">
                      <UiInputNumber
                        label="Poids (kg)"
                        v-model="formData.weight"
                        :isEditing="isEditing"
                        step="0.1"
                        min="0"
                      />
                      <UiInputNumber
                        label="Taille (cm)"
                        v-model="formData.height"
                        :isEditing="isEditing"
                        min="0"
                      />
                      <UiSelect
                        label="Fréquence de mesure"
                        v-model="formData.measure_weight"
                        :options="measureWeightOptions"
                        :isEditing="isEditing"
                        placeholder="Sélectionnez la fréquence de mesure"
                      />
                    </div>
                  </div>

                  <!-- Objectifs de Santé -->
                  <div class="bg-night-50 rounded-xl p-6">
                    <h3 class="text-lg font-medium text-night-900 mb-6">Objectifs de Santé</h3>
                    <div class="space-y-4">
                      <UiInputNumber
                        label="Objectif de Poids (kg)"
                        v-model="formData.target_weight"
                        :isEditing="isEditing"
                        step="0.1"
                        min="0"
                      />
                      <UiInputNumber
                        label="Niveau d'Activité (sessions/semaine)"
                        v-model="formData.target_training"
                        :isEditing="isEditing"
                        min="0"
                        max="7"
                      />
                    </div>
                  </div>
                </div>

                <!-- Boutons d'action -->
                <div class="flex justify-end space-x-4">
                  <button
                    type="button"
                    @click="handleCancel"
                    class="inline-flex items-center px-4 py-2 border border-night-300 rounded-lg shadow-sm text-sm font-medium text-night-700 bg-white hover:bg-night-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    <XMarkIcon class="h-5 w-5 mr-2" />
                    Annuler
                  </button>
                  <button
                    type="submit"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    <CheckIcon class="h-5 w-5 mr-2" />
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Health Stats -->
              <div class="bg-night-50 rounded-xl p-6">
                <h3 class="text-lg font-medium text-night-900 mb-6">Statistiques de Santé</h3>
                <div class="space-y-6">
                  <UiInputNumber
                    label="Poids"
                    :modelValue="account?.health?.weight ?? 0"
                    :isEditing="false"
                  />
                  <UiInputNumber
                    label="Taille"
                    :modelValue="account?.health?.height ?? 0"
                    :isEditing="false"
                  />
                  <div>
                    <label class="block text-sm font-medium text-night-700">IMC</label>
                    <p id="IMC" class="mt-1 text-lg text-night-900">
                      {{ account?.health?.weight && account?.health?.height 
                        ? ((account?.health.weight / ((account?.health.height / 100) ** 2)).toFixed(1))
                        : 'Non calculable' }}
                    </p>
                  </div>
                  <div>
                    <UiSelect
                      label="Fréquence de mesure"
                      :modelValue="account?.health?.measure_weight"
                      :options="measureWeightOptions"
                      :isEditing="false"
                    />
                  </div>
                </div>
              </div>

              <!-- Health Goals -->
              <div class="bg-night-50 rounded-xl p-6">
                <h3 class="text-lg font-medium text-night-900 mb-6">Objectifs de Santé</h3>
                <div class="space-y-6">
                  <UiInputNumber
                    label="Objectif de Poids"
                    :modelValue="account?.health?.target_weight ?? 0"
                    :isEditing="false"
                  />
                  <UiInputNumber
                    label="Niveau d'Activité"
                    :modelValue="account?.health?.target_training ?? 0"
                    :isEditing="false"
                  />
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
</template>