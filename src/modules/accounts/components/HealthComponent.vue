<script lang="ts" setup>
import type { Account } from '../models/Account'
import type { Health } from '../models/Health'
import { EnumMeasureWeight } from '../models/Health'
import {
  PencilSquareIcon,
  XMarkIcon,
  CheckIcon,
  HeartIcon,
  PlusIcon,
} from '@heroicons/vue/24/outline'
import { useAccountStore } from '../store/useAccountStore'
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/modules/auth/store/useAuthStore'

const accountStore = useAccountStore()
const authStore = useAuthStore()
const account = computed(() => authStore.account)
const isEditing = ref(false)

const formData = ref<Partial<Health>>({
  height: account.value?.health?.height || undefined,
  weight: account.value?.health?.weight || undefined,
  target_weight: account.value?.health?.target_weight || undefined,
  target_training: account.value?.health?.target_training || undefined,
  measure_weight: account.value?.health?.measure_weight || EnumMeasureWeight.weekly,
})

watch(account, (newAccount) => {
  if (newAccount?.health) {
    formData.value = {
      height: newAccount.health.height || undefined,
      weight: newAccount.health.weight || undefined,
      target_weight: newAccount.health.target_weight || undefined,
      target_training: newAccount.health.target_training || undefined,
      measure_weight: newAccount.health.measure_weight || EnumMeasureWeight.weekly,
    }
  }
}, { immediate: true })

const measureWeightOptions = [
  { value: EnumMeasureWeight.daily, label: 'Quotidien' },
  { value: EnumMeasureWeight.weekly, label: 'Hebdomadaire' },
  { value: EnumMeasureWeight.monthly, label: 'Mensuel' },
]

const hasHealthData = computed(() => account.value?.health?.id)

const bmi = computed(() => {
  const w = account.value?.health?.weight
  const h = account.value?.health?.height
  if (!w || !h) return null
  return (w / ((h / 100) ** 2)).toFixed(1)
})

const measureLabel = computed(() => {
  const val = account.value?.health?.measure_weight
  return measureWeightOptions.find(o => o.value === val)?.label || 'Non renseigné'
})

const handleSubmit = async () => {
  if (!account.value?.id) return

  if (account.value.health?.id) {
    // Update existing health data
    const updatedAccount = await accountStore.updateHealth(account.value.health.id, formData.value)
    if (updatedAccount) authStore.account = updatedAccount as Account
  } else {
    // Create new health data
    const updatedAccount = await accountStore.createHealth({
      ...formData.value,
      account_id: account.value.id,
    })
    if (updatedAccount) authStore.account = updatedAccount as Account
  }
  isEditing.value = false
}

const handleCancel = () => {
  if (account.value?.health) {
    formData.value = {
      height: account.value.health.height || undefined,
      weight: account.value.health.weight || undefined,
      target_weight: account.value.health.target_weight || undefined,
      target_training: account.value.health.target_training || undefined,
      measure_weight: account.value.health.measure_weight || EnumMeasureWeight.weekly,
    }
  }
  isEditing.value = false
}
</script>

<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-sm font-semibold text-text-primary">Santé</h2>
      <button
        v-if="hasHealthData && !isEditing"
        @click="isEditing = true"
        class="p-1.5 rounded-lg hover:bg-white/5 transition-colors press text-accent-400"
      >
        <PencilSquareIcon class="h-4 w-4" />
      </button>
      <div v-else-if="isEditing" class="flex items-center space-x-1">
        <button
          @click="handleCancel"
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

    <!-- Empty State -->
    <div v-if="!hasHealthData && !isEditing" class="flex flex-col items-center justify-center py-6 text-center">
      <HeartIcon class="h-10 w-10 text-text-muted mb-3" />
      <p class="text-sm text-text-secondary mb-1">Aucune donnée de santé</p>
      <p class="text-xs text-text-muted mb-4">Ajoutez vos informations pour suivre votre progression</p>
      <button @click="isEditing = true" class="btn-primary text-sm press">
        <PlusIcon class="h-4 w-4 inline mr-1" />
        Ajouter
      </button>
    </div>

    <!-- Display Mode -->
    <div v-else-if="!isEditing" class="space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <div class="glass-subtle rounded-xl p-3 text-center">
          <p class="text-xs text-text-muted mb-1">Poids</p>
          <p class="text-lg font-bold text-text-primary">{{ account?.health?.weight ?? '—' }} <span class="text-xs text-text-muted">kg</span></p>
        </div>
        <div class="glass-subtle rounded-xl p-3 text-center">
          <p class="text-xs text-text-muted mb-1">Taille</p>
          <p class="text-lg font-bold text-text-primary">{{ account?.health?.height ?? '—' }} <span class="text-xs text-text-muted">cm</span></p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="glass-subtle rounded-xl p-3 text-center">
          <p class="text-xs text-text-muted mb-1">IMC</p>
          <p class="text-lg font-bold text-accent-400">{{ bmi ?? '—' }}</p>
        </div>
        <div class="glass-subtle rounded-xl p-3 text-center">
          <p class="text-xs text-text-muted mb-1">Obj. poids</p>
          <p class="text-lg font-bold text-text-primary">{{ account?.health?.target_weight ?? '—' }} <span class="text-xs text-text-muted">kg</span></p>
        </div>
      </div>

      <div class="flex items-center justify-between pt-1">
        <p class="text-xs text-text-muted">Fréquence de mesure</p>
        <span class="badge badge-neutral">{{ measureLabel }}</span>
      </div>
      <div class="flex items-center justify-between">
        <p class="text-xs text-text-muted">Activité cible</p>
        <span class="badge badge-accent">{{ account?.health?.target_training ?? '—' }} sessions/sem.</span>
      </div>
    </div>

    <!-- Edit Mode -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-xs text-text-muted mb-1 block">Poids (kg)</label>
          <input v-model.number="formData.weight" type="number" step="0.1" min="0" class="input-field text-sm" />
        </div>
        <div>
          <label class="text-xs text-text-muted mb-1 block">Taille (cm)</label>
          <input v-model.number="formData.height" type="number" min="0" class="input-field text-sm" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-xs text-text-muted mb-1 block">Objectif poids (kg)</label>
          <input v-model.number="formData.target_weight" type="number" step="0.1" min="0" class="input-field text-sm" />
        </div>
        <div>
          <label class="text-xs text-text-muted mb-1 block">Sessions/sem.</label>
          <input v-model.number="formData.target_training" type="number" min="0" max="7" class="input-field text-sm" />
        </div>
      </div>
      <div>
        <label class="text-xs text-text-muted mb-1 block">Fréquence de mesure</label>
        <select v-model="formData.measure_weight" class="input-field text-sm bg-bg-muted">
          <option v-for="opt in measureWeightOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>
    </form>
  </div>
</template>
