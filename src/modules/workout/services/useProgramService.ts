import { supabase } from '@/shared/services/supabaseClient'
import type { Program, ProgramWorkout } from '../models/Program'

export function useProgramService() {
  async function getPrograms(accountId: number) {
    return await supabase
      .from('program')
      .select(`
        *,
        program_workouts:program_workout(
          *,
          workout(*)
        )
      `)
      .eq('account_id', accountId)
      .order('created_at', { ascending: false })
  }

  async function getActiveProgram(accountId: number) {
    return await supabase
      .from('program')
      .select(`
        *,
        program_workouts:program_workout(
          *,
          workout(*)
        )
      `)
      .eq('account_id', accountId)
      .eq('is_active', true)
      .single()
  }

  async function createProgram(program: Omit<Program, 'id' | 'created_at' | 'program_workouts'>) {
    return await supabase
      .from('program')
      .insert(program)
      .select()
      .single()
  }

  async function updateProgram(id: number, updates: Partial<Program>) {
    return await supabase
      .from('program')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
  }

  async function deleteProgram(id: number) {
    return await supabase
      .from('program')
      .delete()
      .eq('id', id)
  }

  async function addProgramWorkout(programWorkout: Omit<ProgramWorkout, 'id' | 'created_at' | 'workout'>) {
    return await supabase
      .from('program_workout')
      .insert(programWorkout)
      .select(`*, workout(*)`)
      .single()
  }

  async function removeProgramWorkout(id: number) {
    return await supabase
      .from('program_workout')
      .delete()
      .eq('id', id)
  }

  async function getWorkoutSessions(accountId: number) {
    return await supabase
      .from('workout_session')
      .select(`*, workout(*)`)
      .eq('account_id', accountId)
      .order('created_at', { ascending: false })
  }

  async function getWorkouts(accountId: number) {
    return await supabase
      .from('workout')
      .select(`*, exercises:workout_exercise(*)`)
      .eq('account_id', accountId)
      .order('created_at', { ascending: false })
  }

  return {
    getPrograms,
    getActiveProgram,
    createProgram,
    updateProgram,
    deleteProgram,
    addProgramWorkout,
    removeProgramWorkout,
    getWorkoutSessions,
    getWorkouts,
  }
}
