export interface Exercise {
    id: number
    title: string
    subtitle: string | null
    muscle_group: string | null
    secondary_muscles: string | null
    equipment: string | null
    image_url: string | null
    instructions: string | null
    body_weight: boolean
    is_custom: boolean
    account_id: number | null
    type_id: number | null
    type?: ExerciseType
    created_at: string
}

export interface ExerciseForm {
    title: string
    subtitle?: string | null
    muscle_group?: string | null
    secondary_muscles?: string | null
    equipment?: string | null
    image_url?: string | null
    instructions?: string | null
    body_weight?: boolean
    is_custom?: boolean
    account_id?: number
    type_id?: number | null
}

export interface ExerciseType {
    id: number
    name: string
}
