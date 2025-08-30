<script lang="ts" setup>
import UiCard from '@/shared/ui/cards/UiCard.vue';
import { computed, defineAsyncComponent } from 'vue';

const props = defineProps<{
    type: 'bar' | 'line' | 'radar' | 'doughnut'
    data: any
    options?: any,
    title: string
}>();

const chartComponents = {
    bar: defineAsyncComponent(() => import('./type/BarChartComponent.vue')),
    line: defineAsyncComponent(() => import('./type/LineChartComponent.vue')),
    radar: defineAsyncComponent(() => import('./type/RadarChartComponent.vue')),
    doughnut: defineAsyncComponent(() => import('./type/DoughnutChartComponent.vue')),
}
const chartComponent = computed(() => chartComponents[props.type])
</script>

<template>
    <UiCard transparent>
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-night-900">{{ title }}</h2>
            <button class="text-sm text-primary-600 hover:text-primary-700">Voir plus</button>
        </div>
        <div class="h-80">
            <component :is="chartComponent" :data="data" :options="options" />
        </div>
    </UiCard>
</template>