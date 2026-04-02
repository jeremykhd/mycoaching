<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits<{
  (e: 'select', date: Date): void
}>()

const today = new Date()
const currentMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1))
const selectedDate = ref(new Date(today))

const monthLabel = computed(() => {
  return currentMonth.value.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
})

const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

const currentWeekDates = computed(() => {
  const selected = selectedDate.value
  const dayOfWeek = selected.getDay()
  // getDay() returns 0 for Sunday, we want Monday as first day
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(selected)
  monday.setDate(selected.getDate() + mondayOffset)

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
})

function isSameDay(a: Date, b: Date) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()
}

function isToday(date: Date) {
  return isSameDay(date, today)
}

function isSelected(date: Date) {
  return isSameDay(date, selectedDate.value)
}

function selectDate(date: Date) {
  selectedDate.value = new Date(date)
  currentMonth.value = new Date(date.getFullYear(), date.getMonth(), 1)
  emit('select', date)
}

function prevMonth() {
  const prev = new Date(currentMonth.value)
  prev.setMonth(prev.getMonth() - 1)
  currentMonth.value = prev
  // Select first day of previous month
  selectDate(prev)
}

function nextMonth() {
  const next = new Date(currentMonth.value)
  next.setMonth(next.getMonth() + 1)
  currentMonth.value = next
  selectDate(next)
}

defineExpose({ selectedDate })
</script>

<template>
  <div>
    <!-- Month Navigation -->
    <div class="flex items-center justify-between mb-4">
      <button @click="prevMonth" class="p-1.5 rounded-lg hover:bg-white/5 transition-colors press">
        <ChevronLeftIcon class="h-5 w-5 text-text-secondary" />
      </button>
      <span class="text-sm font-semibold text-text-primary capitalize">{{ monthLabel }}</span>
      <button @click="nextMonth" class="p-1.5 rounded-lg hover:bg-white/5 transition-colors press">
        <ChevronRightIcon class="h-5 w-5 text-text-secondary" />
      </button>
    </div>

    <!-- Week Days Strip -->
    <div class="grid grid-cols-7 gap-1">
      <div
        v-for="(day, i) in weekDays"
        :key="'label-' + i"
        class="text-center text-[10px] font-medium text-text-muted mb-1"
      >
        {{ day }}
      </div>
      <button
        v-for="date in currentWeekDates"
        :key="date.toISOString()"
        @click="selectDate(date)"
        class="flex items-center justify-center h-9 w-9 mx-auto rounded-full text-sm font-medium transition-all duration-300 press-sm"
        :class="[
          isSelected(date)
            ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/25 scale-110'
            : isToday(date)
              ? 'ring-1 ring-accent-400 text-accent-400'
              : 'text-text-secondary hover:bg-white/5'
        ]"
      >
        {{ date.getDate() }}
      </button>
    </div>
  </div>
</template>
