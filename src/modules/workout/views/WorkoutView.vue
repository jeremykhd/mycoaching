<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useWorkoutStore } from '../store/useWorkoutStore';
import StatsCardComponent from '@/shared/components/cards/StatsCardComponent.vue';
import IconBookmark from '@/shared/components/icons/IconBookmark.vue'

const workoutStore = useWorkoutStore()

// Stats data
const stats = ref({
    totalExercises: 156,
    completedToday: 12,
    averageWeight: 75,
    totalSets: 48
})


onMounted(async () => {
    await workoutStore.fetchExercises()
})

const addExercise = () => {
    // Add exercise logic
}
</script>

<template>
    <div class="min-h-screen text-blue-950">
        <!-- Header Section -->
        <!-- <div class="mb-8">
            <h1 class="text-4xl font-bold  mb-2">Exercices</h1>
            <p class="text-gray-400">Gérez et suivez vos exercices préférés</p>
        </div> -->

        <!-- Stats Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Total Exercises Card -->
             <StatsCardComponent title="Total Séances" :stat-number="stats.totalExercises + ''" :icon="IconBookmark" text="↑ 12% vs semaine dernière"/>
            <div class="bg-blue-950 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-400 text-sm">Total Séances</p>
                        <h3 class="text-2xl font-bold text-white mt-1">{{ stats.totalExercises }}</h3>
                    </div>
                    <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <span class="text-2xl">💪</span>
                    </div>
                </div>
                <div class="mt-4">
                    <div class="flex items-center text-green-400 text-sm">
                        <span>↑ 12%</span>
                        <span class="ml-2">vs semaine dernière</span>
                    </div>
                </div>
            </div>

            <!-- Completed Today Card -->
            <div class="bg-blue-950 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-400 text-sm">Complétés Aujourd'hui</p>
                        <h3 class="text-2xl font-bold text-white mt-1">{{ stats.completedToday }}</h3>
                    </div>
                    <div class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <span class="text-2xl">✅</span>
                    </div>
                </div>
                <div class="mt-4">
                    <div class="flex items-center text-green-400 text-sm">
                        <span>↑ 8%</span>
                        <span class="ml-2">vs hier</span>
                    </div>
                </div>
            </div>

            <!-- Average Weight Card -->
            <div class="bg-blue-950 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-400 text-sm">Poids Moyen</p>
                        <h3 class="text-2xl font-bold text-white mt-1">{{ stats.averageWeight }}kg</h3>
                    </div>
                    <div class="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <span class="text-2xl">🏋️</span>
                    </div>
                </div>
                <div class="mt-4">
                    <div class="flex items-center text-green-400 text-sm">
                        <span>↑ 5%</span>
                        <span class="ml-2">vs mois dernier</span>
                    </div>
                </div>
            </div>

            <!-- Total Sets Card -->
            <div class="bg-blue-950 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-400 text-sm">Séries Totales</p>
                        <h3 class="text-2xl font-bold text-white mt-1">{{ stats.totalSets }}</h3>
                    </div>
                    <div class="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <span class="text-2xl">📊</span>
                    </div>
                </div>
                <div class="mt-4">
                    <div class="flex items-center text-green-400 text-sm">
                        <span>↑ 15%</span>
                        <span class="ml-2">vs semaine dernière</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Charts and Lists Section -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Progress Chart -->
            <div class="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-blue-950">Progression Hebdomadaire</h2>
                    <div class="flex gap-2">
                        <button class="px-3 py-1 text-sm bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors">
                            Semaine
                        </button>
                        <button class="px-3 py-1 text-sm bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors">
                            Mois
                        </button>
                    </div>
                </div>
                <!-- Chart will be implemented here -->
                <div class="h-64 bg-white/5 rounded-lg flex items-center justify-center">
                    <p class="text-blue-950">Graphique de progression</p>
                </div>
            </div>

            <!-- Top Exercises List -->
            <div class="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-blue-950">Top Séances</h2>
                    <button class="text-blue-400 hover:text-blue-300 transition-colors">
                        Voir tout
                    </button>
                </div>
                <div class="space-y-4">
                    <div v-for="i in 3" :key="i" class="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                <span class="text-xl">💪</span>
                            </div>
                            <div>
                                <h4 class="text-white font-medium">Squat</h4>
                                <p class="text-sm text-gray-400">4 séries × 12 reps</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-white font-medium">80kg</p>
                            <p class="text-sm text-gray-400">Poids max</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Exercise Button -->
        <div class="fixed bottom-6 right-6">
            <button 
                @click="addExercise"
                class="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
            >
                <span class="text-2xl">+</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
/* Custom scrollbar for select */
select {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

select::-webkit-scrollbar {
    width: 8px;
}

select::-webkit-scrollbar-track {
    background: transparent;
}

select::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
}
</style>