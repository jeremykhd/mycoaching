export interface Exercise {
    id: number
    title: string
    subtitle: string
    type: ExerciseType
    body_weight: boolean
    weight: number
    repetitions: number
    set: number
    rest: number
    workout_id: number | null
    muscle_group: string | null
    secondary_muscles: string | null
    equipment: string | null
    image_url: string | null
    instructions: string | null
    is_custom: boolean
    account_id: number | null
}
export interface ExerciseForm {
    title: string
    subtitle: string
    type: number
    body_weight: boolean
    weight: number
    repetitions: number
    set: number
    rest: number
    muscle_group?: string
    secondary_muscles?: string
    equipment?: string
    image_url?: string
    instructions?: string
    is_custom?: boolean
}

export interface ExerciseType {
    id: number
    name: string
}
