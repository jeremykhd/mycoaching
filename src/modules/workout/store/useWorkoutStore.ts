import { defineStore } from 'pinia'
import type { Exercise, ExerciseType } from '../models/Exercise'
import { ref } from 'vue'
import { useExerciseService } from '../services/useExerciseService'

export const useWorkoutStore = defineStore('workout', () => {
    const { getUserExercises, getExerciseTypes } = useExerciseService()
    const exercises = ref<Exercise[]>([])
    const exerciseTypes = ref<ExerciseType[]>([])

    const fetchExercises = async (accountId: number) => {
        try {
            const { data, error } = await getUserExercises(accountId)
            if (error) throw new Error(error.message)
            exercises.value = (data as Exercise[]) || []
        } catch (e) {
            console.error(e)
        }
    }

    const fetchExerciseTypes = async () => {
        try {
            const { data, error } = await getExerciseTypes()
            if (error) throw new Error(error.message)
            exerciseTypes.value = (data as ExerciseType[]) || []
        } catch (e) {
            console.error(e)
        }
    }

    return {
        exercises,
        exerciseTypes,
        fetchExercises,
        fetchExerciseTypes
    }
})
