import { supabase } from '@/shared/services/supabaseClient'
import type { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js'
import type { Exercise, ExerciseForm, ExerciseType } from '../models/Exercise'

export function useExerciseService() {
    async function getExercises(): Promise<PostgrestResponse<Exercise>> {
        return await supabase.from('workout_exercise').select('*')
    }

    async function getExerciseTypes(): Promise<PostgrestResponse<ExerciseType>> {
        return await supabase.from('workout_exercise_type').select('*')
    }

    async function postExercise(
        exercise: ExerciseForm
    ): Promise<PostgrestSingleResponse<Exercise>> {
        return await supabase.from('workout_exercise').insert(exercise).select().single()
    }

    async function getUserExercises(accountId: number) {
        return await supabase
            .from('workout_exercise')
            .select('*')
            .eq('account_id', accountId)
            .order('title', { ascending: true })
    }

    async function getExerciseById(exerciseId: number) {
        return await supabase
            .from('workout_exercise')
            .select('*')
            .eq('id', exerciseId)
            .single()
    }

    async function getExerciseHistory(exerciseId: number) {
        return await supabase
            .from('workout_session_set')
            .select(`
                *,
                workout_session_exercise!inner(
                    workout_exercise_id,
                    workout_session!inner(
                        created_at,
                        workout(title)
                    )
                )
            `)
            .eq('workout_session_exercise.workout_exercise_id', exerciseId)
            .order('created_at', { ascending: false })
    }

    return {
        getExercises,
        getExerciseTypes,
        postExercise,
        getUserExercises,
        getExerciseById,
        getExerciseHistory,
    }
}
