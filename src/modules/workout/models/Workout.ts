import type { Exercise } from './Exercise'

export interface Workout {
    id: number
    title: string
    subtitle: string | null
    account_id: number | null
    created_at: string
    exercises?: Exercise[]
}
