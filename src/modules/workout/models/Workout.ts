import type { Exercise, ExerciseType } from './Exercise'

export interface WorkoutExercise {
    id: number
    workout_id: number
    exercise_id: number
    set: number
    repetitions: number
    weight: number
    rest: number
    order: number | null
    created_at: string
    exercise?: Exercise
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
}
