<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Health } from '@/modules/accounts/models/Health'
import { useHealthService, type WeightEntry } from '@/modules/accounts/services/useHealthService'
import {
  ScaleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BellAlertIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  health: Health
  accountId: number
}>()

const { getWeightHistory } = useHealthService()
const weightHistory = ref<WeightEntry[]>([])
const loading = ref(true)

onMounted(async () => {
  const { data, error } = await getWeightHistory(props.accountId, 15)
  if (!error && data) weightHistory.value = data as WeightEntry[]
  loading.value = false
})

const currentWeight = computed(() => props.health.weight)
const targetWeight = computed(() => props.health.target_weight)

const previousWeight = computed(() => {
  if (weightHistory.value.length < 2) return null
  return weightHistory.value[weightHistory.value.length - 2].weight
})

const latestEntry = computed(() => {
  if (!weightHistory.value.length) return null
  return weightHistory.value[weightHistory.value.length - 1]
})

const weightDiff = computed(() => {
  if (!previousWeight.value || !latestEntry.value) return null
  return +(latestEntry.value.weight - previousWeight.value).toFixed(1)
})

const isLosingTarget = computed(() => targetWeight.value < currentWeight.value)
const progressPercent = computed(() => {
  const start = isLosingTarget.value
    ? Math.max(currentWeight.value, targetWeight.value) + 5
    : Math.min(currentWeight.value, targetWeight.value) - 5
  const total = Math.abs(start - targetWeight.value)
  const done = Math.abs(start - currentWeight.value)
  if (total <= 0) return 100
  return Math.min(100, Math.max(0, Math.round((done / total) * 100)))
})

const lastMeasureDate = computed(() => {
  if (!latestEntry.value) return null
  return new Date(latestEntry.value.date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  })
})

const measureLabel = computed(() => {
  const map: Record<string, string> = {
    daily: 'Quotidien',
    weekly: 'Hebdomadaire',
    monthly: 'Mensuel',
  }
  return map[props.health.measure_weight] || props.health.measure_weight
})

const shouldRemind = computed(() => {
  if (!latestEntry.value) return true
  const last = new Date(latestEntry.value.date)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - last.getTime()) / (24 * 60 * 60 * 1000))

  if (props.health.measure_weight === 'daily') return diffDays >= 1
  if (props.health.measure_weight === 'weekly') return diffDays >= 7
  if (props.health.measure_weight === 'monthly') return diffDays >= 30
  return false
})

// Sparkline points (SVG polyline)
const sparklinePoints = computed(() => {
  if (weightHistory.value.length < 2) return ''

  const weights = weightHistory.value.map(e => e.weight)
  const min = Math.min(...weights) - 0.5
  const max = Math.max(...weights) + 0.5
  const range = max - min || 1

  const w = 200
  const h = 40
  const step = w / (weights.length - 1)

  return weights
    .map((val, i) => `${i * step},${h - ((val - min) / range) * h}`)
    .join(' ')
})
</script>

<template>
  <div class="card">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center space-x-2">
        <ScaleIcon class="h-4 w-4 text-accent-400" />
        <h3 class="text-sm font-semibold text-text-primary">Suivi du poids</h3>
      </div>
      <div v-if="shouldRemind" class="flex items-center space-x-1 text-amber-400">
        <BellAlertIcon class="h-3.5 w-3.5" />
        <span class="text-[10px] font-medium">Pesée à faire</span>
      </div>
    </div>

    <!-- Weight display -->
    <div class="flex items-end justify-between mb-3">
      <div>
        <p class="text-2xl font-bold text-text-primary">{{ currentWeight }}<span class="text-sm text-text-muted ml-0.5">kg</span></p>
        <div class="flex items-center space-x-2 mt-0.5">
          <span class="text-xs text-text-muted">Objectif : {{ targetWeight }} kg</span>
          <div
            v-if="weightDiff !== null"
            class="flex items-center space-x-0.5"
            :class="weightDiff < 0 ? 'text-emerald-400' : weightDiff > 0 ? 'text-red-400' : 'text-text-muted'"
          >
            <ArrowTrendingDownIcon v-if="weightDiff < 0" class="h-3 w-3" />
            <ArrowTrendingUpIcon v-else-if="weightDiff > 0" class="h-3 w-3" />
            <span class="text-[10px] font-medium">
              {{ weightDiff > 0 ? '+' : '' }}{{ weightDiff }} kg
            </span>
          </div>
        </div>
      </div>

      <!-- Mini sparkline -->
      <div v-if="weightHistory.length >= 2" class="w-24 h-10">
        <svg viewBox="0 0 200 40" class="w-full h-full" preserveAspectRatio="none">
          <polyline
            :points="sparklinePoints"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-accent-400"
          />
        </svg>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="mb-3">
      <div class="h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
        <div
          class="h-full rounded-full bg-accent-500 transition-all duration-500"
          :style="{ width: `${progressPercent}%` }"
        />
      </div>
      <div class="flex items-center justify-between mt-1">
        <span class="text-[10px] text-text-muted">{{ currentWeight }} kg</span>
        <span class="text-[10px] text-accent-400">{{ targetWeight }} kg</span>
      </div>
    </div>

    <!-- Info row -->
    <div class="flex items-center justify-between pt-2 border-t border-white/[0.06]">
      <div class="flex items-center space-x-3">
        <div v-if="lastMeasureDate">
          <span class="text-[10px] text-text-muted">Dernière pesée</span>
          <p class="text-xs font-medium text-text-primary">{{ lastMeasureDate }}</p>
        </div>
        <div v-else>
          <span class="text-[10px] text-text-muted">Aucune pesée enregistrée</span>
        </div>
      </div>
      <span class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-text-muted">
        {{ measureLabel }}
      </span>
    </div>
  </div>
</template>
