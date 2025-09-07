import { defineStore } from 'pinia'
import type { Exercise, ExerciseType } from '../models/Exercise'
import { ref } from 'vue'
import { useExerciseService } from '../services/useExerciseService'

export const useWorkoutStore = defineStore('workout', () => {
    const { getExercises, getExerciseTypes } = useExerciseService()
    const exercises = ref<Exercise[]>([])
    const exerciseTypes = ref<ExerciseType[]>([])

    const fetchExercises = async () => {
        console.log('...fetching exercises:')
        try {
            const { data, error, status } = await getExercises()

            console.log('data exercises:', data)
            console.log('status:', status)
            if (error) throw new Error(error.message)
            exercises.value = data || []
        } catch (e) {
            console.log(e)
        }
    }

    const fetchExerciseTypes = async () => {
        console.log('...fetching exercises:')

        try {
            const { data, error, status } = await getExerciseTypes()
            console.log('data exercises:', data)
            console.log('status:', status)
            if (error) throw new Error(error.message)
            exerciseTypes.value = data || []
        } catch (e) {
            console.log(e)
        }
    }

    return {
        exercises,
        exerciseTypes,
        fetchExercises,
        fetchExerciseTypes
    }
})
