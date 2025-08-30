import { defineStore } from 'pinia'
import type { Exercise } from '../models/Exercise'
import { ref } from 'vue'
import { useExerciseService } from '../services/useExerciseService'

export const useWorkoutStore = defineStore('workout', () => {
    const { getExercises } = useExerciseService()
    const exercices = ref<Exercise[]>([])

    const fetchExercises = async () => {
        console.log('...fetching exercises:')
        try {
            const { data, error, status } = await getExercises()

            console.log('data exercises:', data)
            console.log('status:', status)
            if (error) throw new Error(error.message)
        } catch (e) {
            console.log(e)
        }
    }

    return {
        exercices,
        fetchExercises
    }
})
