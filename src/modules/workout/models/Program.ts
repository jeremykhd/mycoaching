import type { Workout } from './Workout'

export interface Program {
  id: number
  account_id: number
  title: string
  description: string | null
  duration_weeks: number
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
  program_workouts?: ProgramWorkout[]
}

export interface ProgramWorkout {
  id: number
  program_id: number
  workout_id: number
  day_of_week: number // 1=Monday, 7=Sunday
  week_number: number
  created_at: string
  workout?: Workout
}
