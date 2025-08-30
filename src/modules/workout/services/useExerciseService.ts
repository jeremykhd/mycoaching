import { supabase } from '@/shared/services/supabaseClient'
import type { PostgrestResponse } from '@supabase/supabase-js'
import type { Exercise } from '../models/Exercise'

export function useExerciseService() {
    async function getExercises(): Promise<PostgrestResponse<Exercise>> {
        return await supabase.from('workout_exercise').select('*')
    }
    return {
        getExercises
    }
}
