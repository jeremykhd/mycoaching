import { supabase } from '@/shared/services/supabaseClient'
import type { Exercise, ExerciseForm, ExerciseType } from '../models/Exercise'

export function useExerciseService() {
    async function getExerciseTypes() {
        return await supabase
            .from('workout_exercise_type')
            .select('*')
            .order('name')
    }

    async function createExerciseType(name: string) {
        return await supabase
            .from('workout_exercise_type')
            .insert({ name })
            .select()
            .single()
    }

    async function getUserExercises(accountId: number) {
        return await supabase
            .from('exercise')
            .select('*, type:workout_exercise_type(*)')
            .eq('account_id', accountId)
            .order('title', { ascending: true })
    }

    async function getExerciseById(exerciseId: number) {
        return await supabase
            .from('exercise')
            .select('*, type:workout_exercise_type(*)')
            .eq('id', exerciseId)
            .single()
    }

    async function createExercise(exercise: ExerciseForm) {
        return await supabase
            .from('exercise')
            .insert(exercise)
            .select('*, type:workout_exercise_type(*)')
            .single()
    }

    async function updateExercise(exerciseId: number, updates: Partial<ExerciseForm>) {
        return await supabase
            .from('exercise')
            .update(updates)
            .eq('id', exerciseId)
            .select('*, type:workout_exercise_type(*)')
            .single()
    }

    async function deleteExercise(exerciseId: number) {
        return await supabase
            .from('exercise')
            .delete()
            .eq('id', exerciseId)
    }

    async function getExerciseHistory(exerciseId: number) {
        return await supabase
            .from('workout_session_set')
            .select(`
                *,
                workout_session_exercise!inner(
                    exercise_id,
                    workout_session!inner(
                        created_at,
                        workout(title)
                    )
                )
            `)
            .eq('workout_session_exercise.exercise_id', exerciseId)
            .order('created_at', { ascending: false })
    }

    return {
        getExerciseTypes,
        createExerciseType,
        getUserExercises,
        getExerciseById,
        createExercise,
        updateExercise,
        deleteExercise,
        getExerciseHistory,
    }
}
