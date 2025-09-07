export interface Exercise {
    id: number
    title: string
    subtitle: string
    type: ExerciseType
    body_weight: number
    weight: number
    repetitions: number
    set: number
    rest: number
}

export interface ExerciseType {
    id: number
    name: string
}
