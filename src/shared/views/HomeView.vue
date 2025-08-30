<script setup lang="ts">
import { ref } from 'vue';
import StatsCardComponent from '../components/cards/StatsCardComponent.vue';
import IconSessions from '../components/icons/IconSessions.vue';
import IconCheck from '../components/icons/IconCheck.vue';
import IconLightning from '../components/icons/IconLightning.vue';
import IconClockTime from '../components/icons/IconClockTime.vue';
import ChartComponent from '../components/charts/ChartComponent.vue';

const performanceData = ref({
  labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
  datasets: [{ 
    data: [40, 20, 12, 35, 28, 15, 8],
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderColor: 'rgb(99, 102, 241)',
    borderWidth: 2
  }]
});

const weeklyData = ref({
  labels: ['Cardio', 'Force', 'Flexibilité', 'Endurance', 'Vitesse'],
  datasets: [{ 
    data: [65, 59, 90, 81, 56],
    backgroundColor: 'rgba(236, 72, 153, 0.2)',
    borderColor: 'rgb(236, 72, 153)',
    borderWidth: 2
  }]
});

const progressData = ref({
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
  datasets: [{ 
    data: [30, 45, 60, 75, 85, 90],
    borderColor: 'rgb(16, 185, 129)',
    tension: 0.4
  }]
});

const goalsData = ref({
  labels: ['Atteints', 'En cours', 'À venir'],
  datasets: [{ 
    data: [3, 2, 1],
    backgroundColor: [
      'rgba(16, 185, 129, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(99, 102, 241, 0.8)'
    ]
  }]
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  }
});
</script>

<template>
  <div class="space-y-6">
    <!-- En-tête avec statistiques rapides -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCardComponent transparent title="Sessions cette semaine" stat-number="12" :icon="IconSessions"/>
      <StatsCardComponent transparent title="Objectifs atteints" stat-number="3/7" :icon="IconCheck"/>
      <StatsCardComponent transparent title="Calories brûlées" stat-number="2,450" :icon="IconLightning"/>
      <StatsCardComponent transparent title="Temps d'entraînement" stat-number="8.5h" :icon="IconClockTime"/>
    </div>

    <!-- Graphiques principaux -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Performance quotidienne -->
        <ChartComponent title="Performance quotidienne" type="bar" :data="performanceData" :options="chartOptions"/>

      <!-- Progression -->
        <ChartComponent title="Progression" type="line" :data="progressData" :options="chartOptions"/>
    </div>

    <!-- Graphiques secondaires -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Performance de la semaine -->
      <ChartComponent title="Performance de la semaine" type="radar" :data="weeklyData" :options="chartOptions"/>

      <!-- Objectifs -->
      <ChartComponent title="Objectifs" type="doughnut" :data="goalsData" :options="chartOptions"/>
    </div>
  </div>
</template>
