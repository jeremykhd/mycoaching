<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useWorkoutStore } from '../store/useWorkoutStore';
import type { Exercise } from '../models/Exercise';
import type { Workout } from '../models/Workout';
import { PlusCircleIcon, PencilSquareIcon, ArchiveBoxIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline';

const workoutStore = useWorkoutStore()
const selectedWorkout = ref<Workout | null>(null)

// Stats data
const stats = ref({
    totalExercises: 156,
    completedToday: 12,
    averageWeight: 75,
    totalSets: 48
})

// Chart data
const exerciseProgress = ref({
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
        {
            label: 'Exercices complétés',
            data: [8, 12, 6, 9, 15, 10, 7],
            borderColor: '#3B82F6',
            tension: 0.4
        }
    ]
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
        <!-- Create Exercise Button -->
        <div class="mb-8">
            <button 
                @click="addExercise"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
                <PlusCircleIcon class="h-5 w-5 mr-2" />
                Créer un exercice
            </button>
        </div>

        <!-- Charts and Lists Section -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <!-- Top Exercises List -->
            <div class="bg-blue-950 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-white">Top Exercices</h2>
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
        </div>

        <!-- Exercises List Section -->
        <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-gray-900">Liste des exercices</h2>
                <div class="flex items-center gap-4">
                    <div class="relative">
                        <input
                            type="text"
                            placeholder="Rechercher un exercice..."
                            class="w-64 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500"
                        />
                        <MagnifyingGlassIcon class="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    <select class="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-orange-500">
                        <option value="">Tous les workouts</option>
                        <option value="1">Workout 1</option>
                        <option value="2">Workout 2</option>
                    </select>
                </div>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="text-left border-b border-gray-200">
                            <th class="pb-4 text-sm font-medium text-gray-500">Exercice</th>
                            <th class="pb-4 text-sm font-medium text-gray-500">Workout</th>
                            <th class="pb-4 text-sm font-medium text-gray-500">Poids</th>
                            <th class="pb-4 text-sm font-medium text-gray-500">Séries</th>
                            <th class="pb-4 text-sm font-medium text-gray-500">Répétitions</th>
                            <th class="pb-4 text-sm font-medium text-gray-500">Statut</th>
                            <th class="pb-4 text-sm font-medium text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr v-for="i in 5" :key="i">
                            <td class="py-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                        <span class="text-xl">💪</span>
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-900">Squat</p>
                                        <p class="text-sm text-gray-500">Exercice de jambes</p>
                                    </div>
                                </div>
                            </td>
                            <td class="py-4">
                                <span class="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-full">Workout Jambes</span>
                            </td>
                            <td class="py-4 text-gray-900">80 kg</td>
                            <td class="py-4 text-gray-900">4</td>
                            <td class="py-4 text-gray-900">12</td>
                            <td class="py-4">
                                <span class="px-3 py-1 text-sm bg-green-50 text-green-600 rounded-full">Actif</span>
                            </td>
                            <td class="py-4 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                        <PencilSquareIcon class="h-5 w-5" />
                                    </button>
                                    <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                        <ArchiveBoxIcon class="h-5 w-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="flex items-center justify-between mt-6">
                <div class="text-sm text-gray-500">
                    Affichage de 1 à 5 sur 20 exercices
                </div>
                <div class="flex items-center gap-2">
                    <button class="px-3 py-1 text-sm bg-gray-50 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                        Précédent
                    </button>
                    <button class="px-3 py-1 text-sm bg-orange-600 rounded-lg text-white">
                        1
                    </button>
                    <button class="px-3 py-1 text-sm bg-gray-50 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                        2
                    </button>
                    <button class="px-3 py-1 text-sm bg-gray-50 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                        3
                    </button>
                    <button class="px-3 py-1 text-sm bg-gray-50 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                        Suivant
                    </button>
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