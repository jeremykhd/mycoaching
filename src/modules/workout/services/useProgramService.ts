import { supabase } from '@/shared/services/supabaseClient'
import type { Program, ProgramWorkout } from '../models/Program'
import type { WorkoutSession } from '../models/WorkoutSession'

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
      .select(`*, type:workout_exercise_type(*), exercises:workout_exercise(*, exercise(*))`)
      .eq('account_id', accountId)
      .order('created_at', { ascending: false })
  }

  async function createWorkoutSession(data: {
    account_id: number
    workout_id: number
  }) {
    return await supabase
      .from('workout_session')
      .insert({
        account_id: data.account_id,
        workout_id: data.workout_id,
      })
      .select(`*, workout(*, type:workout_exercise_type(*), exercises:workout_exercise(*, exercise(*)))`)
      .single()
  }

  async function getInProgressSession(accountId: number) {
    return await supabase
      .from('workout_session')
      .select(`
        *,
        workout(*, type:workout_exercise_type(*), exercises:workout_exercise(*, exercise(*))),
        session_exercises:workout_session_exercise(
          *,
          sets:workout_session_set(*)
        )
      `)
      .eq('account_id', accountId)
      .is('finished_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
  }

  async function getWorkoutSession(sessionId: number) {
    return await supabase
      .from('workout_session')
      .select(`
        *,
        workout(*, type:workout_exercise_type(*), exercises:workout_exercise(*, exercise(*))),
        session_exercises:workout_session_exercise(
          *,
          sets:workout_session_set(*)
        )
      `)
      .eq('id', sessionId)
      .single()
  }

  async function finishWorkoutSession(sessionId: number, notes?: string) {
    return await supabase
      .from('workout_session')
      .update({
        finished_at: new Date().toISOString(),
        ...(notes ? { notes } : {}),
      })
      .eq('id', sessionId)
      .select()
      .single()
  }

  async function createSessionExercise(data: {
    workout_session_id: number
    workout_exercise_id: number
    order?: number
  }) {
    return await supabase
      .from('workout_session_exercise')
      .insert(data)
      .select()
      .single()
  }

  async function createSessionExercisesBatch(data: {
    workout_session_id: number
    workout_exercise_id: number
    order?: number
  }[]) {
    return await supabase
      .from('workout_session_exercise')
      .insert(data)
      .select()
  }

  async function createSessionSet(data: {
    workout_session_exercise_id: number
    set_number: number
    repetitions?: number
    weight?: number
    body_weight?: boolean
    completed?: boolean
  }) {
    return await supabase
      .from('workout_session_set')
      .insert(data)
      .select()
      .single()
  }

  async function updateSessionSet(id: number, data: Partial<{
    repetitions: number
    weight: number
    body_weight: boolean
    completed: boolean
  }>) {
    return await supabase
      .from('workout_session_set')
      .update(data)
      .eq('id', id)
      .select()
      .single()
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
    createWorkoutSession,
    getInProgressSession,
    getWorkoutSession,
    finishWorkoutSession,
    createSessionExercise,
    createSessionExercisesBatch,
    createSessionSet,
    updateSessionSet,
  }
}
