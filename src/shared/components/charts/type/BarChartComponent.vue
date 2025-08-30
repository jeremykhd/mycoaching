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
import { Bar } from 'vue-chartjs'

defineProps<{
  data: ChartData<'bar'>;
  options: Record<string, unknown>;
}>()

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

</script>

<template>
    <Bar :data="data" :options="options" />
</template>
  
