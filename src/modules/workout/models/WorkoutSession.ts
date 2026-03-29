import type { Exercise } from './Exercise'

export interface WorkoutSession {
  id: number
  account_id: number
  workout_id: number
  notes: string | null
  started_at: string
  finished_at: string | null
  created_at: string
}

export interface WorkoutSessionExercise {
  id: number
  workout_session_id: number
  workout_exercise_id: number
  order: number | null
  notes: string | null
  created_at: string
  workout_exercise?: Exercise
  sets?: WorkoutSessionSet[]
}

export interface WorkoutSessionSet {
  id: number
  workout_session_exercise_id: number
  set_number: number
  repetitions: number | null
  weight: number | null
  body_weight: boolean
  completed: boolean
  created_at: string
}
