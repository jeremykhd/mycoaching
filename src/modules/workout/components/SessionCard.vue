<script setup lang="ts">
import { FireIcon } from '@heroicons/vue/24/solid'
import { ChevronRightIcon } from '@heroicons/vue/24/outline'

export interface SessionBadge {
  label: string
  type?: 'accent' | 'neutral'
}

defineProps<{
  title: string
  subtitle?: string
  badges?: SessionBadge[]
  totalWeight?: string
  to?: string
}>()
</script>

<template>
  <RouterLink
    v-if="to"
    :to="to"
    class="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all duration-200"
  >
    <div class="flex items-center space-x-3 min-w-0">
      <div class="w-9 h-9 rounded-full bg-accent-500/15 flex items-center justify-center flex-shrink-0">
        <FireIcon class="h-4 w-4 text-accent-400" />
      </div>
      <div class="min-w-0">
        <p class="text-sm font-medium text-text-primary truncate">{{ title }}</p>
        <div v-if="badges?.length" class="flex flex-wrap gap-1.5 mt-1">
          <span
            v-for="(badge, i) in badges"
            :key="i"
            class="text-[10px] font-medium px-2 py-0.5 rounded-full"
            :class="badge.type === 'accent' ? 'bg-accent-500/15 text-accent-400' : 'bg-white/[0.06] text-text-muted'"
          >
            {{ badge.label }}
          </span>
        </div>
        <p v-if="totalWeight" class="text-xs text-text-muted mt-1">{{ totalWeight }}</p>
        <p v-if="subtitle" class="text-xs text-text-muted mt-0.5">{{ subtitle }}</p>
      </div>
    </div>
    <ChevronRightIcon class="h-5 w-5 text-text-muted flex-shrink-0 ml-2" />
  </RouterLink>
  <div
    v-else
    class="flex items-center justify-between p-3 rounded-xl"
  >
    <div class="flex items-center space-x-3 min-w-0">
      <div class="w-9 h-9 rounded-full bg-accent-500/15 flex items-center justify-center flex-shrink-0">
        <FireIcon class="h-4 w-4 text-accent-400" />
      </div>
      <div class="min-w-0">
        <p class="text-sm font-medium text-text-primary truncate">{{ title }}</p>
        <div v-if="badges?.length" class="flex flex-wrap gap-1.5 mt-1">
          <span
            v-for="(badge, i) in badges"
            :key="i"
            class="text-[10px] font-medium px-2 py-0.5 rounded-full"
            :class="badge.type === 'accent' ? 'bg-accent-500/15 text-accent-400' : 'bg-white/[0.06] text-text-muted'"
          >
            {{ badge.label }}
          </span>
        </div>
        <p v-if="totalWeight" class="text-xs text-text-muted mt-1">{{ totalWeight }}</p>
        <p v-if="subtitle" class="text-xs text-text-muted mt-0.5">{{ subtitle }}</p>
      </div>
    </div>
  </div>
</template>
