import type { Exercise, ExerciseType } from './Exercise'

export interface WorkoutBlock {
    id: number
    workout_id: number
    type: 'superset' | 'triset' | 'giant_set' | 'dropset'
    title: string | null
    order: number | null
    created_at: string
    exercises?: WorkoutExercise[]
}

export interface WorkoutExercise {
    id: number
    workout_id: number
    exercise_id: number
    block_id: number | null
    set: number
    repetitions: number
    weight: number
    rest: number
    order: number | null
    created_at: string
    exercise?: Exercise
    block?: WorkoutBlock
}

export interface Workout {
    id: number
    title: string
    subtitle: string | null
    account_id: number | null
    type_id: number | null
    type?: ExerciseType
    created_at: string
    exercises?: WorkoutExercise[]
    blocks?: WorkoutBlock[]
}
