<script lang="ts" setup>
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  type ChartData,
  RadialLinearScale,
  Filler,
  LineElement,
  PointElement
} from 'chart.js'
import { Radar } from 'vue-chartjs'

defineProps<{
  data: ChartData<'radar'>;
  options: Record<string, unknown>;
}>()

ChartJS.register(  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend)

</script>

<template>
    <Radar :data="data" :options="options" />
</template>
  
