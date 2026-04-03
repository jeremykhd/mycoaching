<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  plannedDates?: string[]   // ISO date strings (YYYY-MM-DD) for planned sessions
  completedDates?: string[] // ISO date strings for completed sessions
}>()

const emit = defineEmits<{
  (e: 'select', date: string): void
}>()

const today = new Date()
const currentMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1))

const monthLabel = computed(() => {
  return currentMonth.value.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
})

const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  // Day of week for first day (0=Sun, adjust to Mon=0)
  let startOffset = firstDay.getDay() - 1
  if (startOffset < 0) startOffset = 6

  const days: { date: Date; currentMonth: boolean }[] = []

  // Previous month padding
  for (let i = startOffset - 1; i >= 0; i--) {
    const d = new Date(year, month, -i)
    days.push({ date: d, currentMonth: false })
  }

  // Current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({ date: new Date(year, month, i), currentMonth: true })
  }

  // Next month padding (fill to 42 = 6 rows)
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push({ date: new Date(year, month + 1, i), currentMonth: false })
  }

  return days
})

function toISODate(d: Date): string {
  return d.toISOString().split('T')[0]
}

function isToday(date: Date): boolean {
  return toISODate(date) === toISODate(today)
}

function isPlanned(date: Date): boolean {
  return props.plannedDates?.includes(toISODate(date)) ?? false
}

function isCompleted(date: Date): boolean {
  return props.completedDates?.includes(toISODate(date)) ?? false
}

function prevMonth() {
  const prev = new Date(currentMonth.value)
  prev.setMonth(prev.getMonth() - 1)
  currentMonth.value = prev
}

function nextMonth() {
  const next = new Date(currentMonth.value)
  next.setMonth(next.getMonth() + 1)
  currentMonth.value = next
}

function selectDay(date: Date) {
  emit('select', toISODate(date))
}
</script>

<template>
  <div class="card">
    <!-- Month Nav -->
    <div class="flex items-center justify-between mb-4">
      <button @click="prevMonth" class="p-1.5 rounded-lg hover:bg-white/5 transition-colors press">
        <ChevronLeftIcon class="h-5 w-5 text-text-secondary" />
      </button>
      <span class="text-sm font-semibold text-text-primary capitalize">{{ monthLabel }}</span>
      <button @click="nextMonth" class="p-1.5 rounded-lg hover:bg-white/5 transition-colors press">
        <ChevronRightIcon class="h-5 w-5 text-text-secondary" />
      </button>
    </div>

    <!-- Week Day Headers -->
    <div class="grid grid-cols-7 gap-0.5 mb-1">
      <div
        v-for="(day, i) in weekDays"
        :key="'h-' + i"
        class="text-center text-[10px] font-medium text-text-muted py-1"
      >
        {{ day }}
      </div>
    </div>

    <!-- Days Grid -->
    <div class="grid grid-cols-7 gap-0.5">
      <button
        v-for="(day, i) in calendarDays"
        :key="i"
        @click="selectDay(day.date)"
        class="relative flex items-center justify-center h-9 rounded-lg text-xs font-medium transition-all duration-200 press-sm"
        :class="[
          !day.currentMonth
            ? 'text-white/10'
            : isCompleted(day.date)
              ? 'bg-accent-500 text-white'
              : isToday(day.date)
                ? 'ring-1 ring-accent-400 text-accent-400'
                : isPlanned(day.date)
                  ? 'text-text-primary'
                  : 'text-text-secondary hover:bg-white/5'
        ]"
      >
        {{ day.date.getDate() }}
        <!-- Planned dot -->
        <span
          v-if="isPlanned(day.date) && !isCompleted(day.date) && day.currentMonth"
          class="absolute bottom-0.5 w-1 h-1 rounded-full bg-accent-400"
        />
      </button>
    </div>

    <!-- Legend -->
    <div class="flex items-center justify-center space-x-4 mt-3 pt-3 border-t border-white/[0.06]">
      <div class="flex items-center space-x-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-accent-500" />
        <span class="text-[10px] text-text-muted">Effectuée</span>
      </div>
      <div class="flex items-center space-x-1.5">
        <span class="w-2.5 h-2.5 rounded-full border border-accent-400 bg-transparent" />
        <span class="text-[10px] text-text-muted">Prévue</span>
      </div>
    </div>
  </div>
</template>
