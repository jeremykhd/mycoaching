import { supabase } from '@/shared/services/supabaseClient'

const WORKOUT_SELECT = `
  *,
  type:workout_exercise_type(*),
  exercises:workout_exercise(*, exercise(*)),
  blocks:workout_block(*)
`

export function useWorkoutService() {
  async function getWorkouts(accountId: number) {
    return await supabase
      .from('workout')
      .select(WORKOUT_SELECT)
      .eq('account_id', accountId)
      .order('created_at', { ascending: false })
  }

  async function getWorkoutById(workoutId: number) {
    return await supabase
      .from('workout')
      .select(WORKOUT_SELECT)
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
    block_id?: number
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

  async function createBlock(data: {
    workout_id: number
    type?: string
    title?: string
    order?: number
  }) {
    return await supabase
      .from('workout_block')
      .insert({
        workout_id: data.workout_id,
        type: data.type || 'superset',
        title: data.title || null,
        order: data.order || null,
      })
      .select()
      .single()
  }

  async function deleteBlock(blockId: number) {
    return await supabase
      .from('workout_block')
      .delete()
      .eq('id', blockId)
  }

  async function updateExerciseBlock(workoutExerciseId: number, blockId: number | null) {
    return await supabase
      .from('workout_exercise')
      .update({ block_id: blockId })
      .eq('id', workoutExerciseId)
      .select()
      .single()
  }

  return {
    getWorkouts,
    getWorkoutById,
    createWorkout,
    deleteWorkout,
    addExerciseToWorkout,
    removeExerciseFromWorkout,
    createBlock,
    deleteBlock,
    updateExerciseBlock,
  }
}
