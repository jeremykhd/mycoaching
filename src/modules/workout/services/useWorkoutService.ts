import { supabase } from '@/shared/services/supabaseClient'

export function useWorkoutService() {
  async function getWorkouts(accountId: number) {
    return await supabase
      .from('workout')
      .select(`
        *,
        type:workout_exercise_type(*),
        exercises:workout_exercise(*, exercise(*))
      `)
      .eq('account_id', accountId)
      .order('created_at', { ascending: false })
  }

  async function getWorkoutById(workoutId: number) {
    return await supabase
      .from('workout')
      .select(`
        *,
        type:workout_exercise_type(*),
        exercises:workout_exercise(*, exercise(*))
      `)
      .eq('id', workoutId)
      .single()
  }

  async function createWorkout(workout: { title: string; subtitle?: string | null; account_id: number; type_id?: number | null }) {
    return await supabase
      .from('workout')
      .insert(workout)
      .select()
      .single()
  }

  async function deleteWorkout(workoutId: number) {
    return await supabase
      .from('workout')
      .delete()
      .eq('id', workoutId)
  }

  async function addExerciseToWorkout(data: {
    workout_id: number
    exercise_id: number
    set?: number
    repetitions?: number
    weight?: number
    rest?: number
    order?: number
  }) {
    return await supabase
      .from('workout_exercise')
      .insert(data)
      .select('*, exercise(*)')
      .single()
  }

  async function removeExerciseFromWorkout(workoutExerciseId: number) {
    return await supabase
      .from('workout_exercise')
      .delete()
      .eq('id', workoutExerciseId)
  }

  return {
    getWorkouts,
    getWorkoutById,
    createWorkout,
    deleteWorkout,
    addExerciseToWorkout,
    removeExerciseFromWorkout,
  }
}
