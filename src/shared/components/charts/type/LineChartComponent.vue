<script lang="ts" setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartData
} from 'chart.js'
import { Line } from 'vue-chartjs'

defineProps<{
  data: ChartData<'line'>;
  options: Record<string, unknown>;
}>()

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

</script>

<template>
    <Line :data="data" :options="options" />
</template>
  
