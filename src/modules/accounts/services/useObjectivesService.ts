import type { PostgrestSingleResponse } from '@supabase/supabase-js'
import { supabase } from '@/shared/services/supabaseClient'
import type { Objectives } from '../models/Objectives'

export function useObjectivesService() {
  async function postObjectives(
    objectives: Partial<Objectives>
  ): Promise<PostgrestSingleResponse<Objectives>> {
    return await supabase.from('training_objectives').insert(objectives).select().single()
  }

  async function patchObjectives(
    objectives: Partial<Objectives>
  ): Promise<PostgrestSingleResponse<Objectives>> {
    return await supabase.from('heatraining_objectiveslth').update(objectives).select().single()
  }

  return {
    postObjectives,
    patchObjectives
  }
}
