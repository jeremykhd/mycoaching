import { supabase } from '@/shared/services/supabaseClient'
import type { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js'
import type { Exercise, ExerciseType } from '../models/Exercise'

export function useExerciseService() {
    async function getExercises(): Promise<PostgrestResponse<Exercise>> {
        return await supabase.from('workout_exercise').select('*')
    }

    async function getExerciseTypes(): Promise<PostgrestResponse<ExerciseType>> {
        return await supabase.from('workout_exercise_type').select('*')
    }

    async function postExercise(
        exercise: Exercise
    ): Promise<PostgrestSingleResponse<Omit<Exercise, 'id'>>> {
        return await supabase.from('workout_exercise').insert(exercise).select().single()
    }

    return {
        getExercises,
        getExerciseTypes,
        postExercise
    }
}
