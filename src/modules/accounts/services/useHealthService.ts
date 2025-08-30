import type { PostgrestSingleResponse } from '@supabase/supabase-js'
import type { Health } from '../models/Health'
import { supabase } from '@/shared/services/supabaseClient'

export function useHealthService() {
  async function postHealth(health: Partial<Health>): Promise<PostgrestSingleResponse<Health>> {
    return await supabase.from('health').insert(health).select().single()
  }

  async function patchHealth(
    healthId: number,
    health: Partial<Health>
  ): Promise<PostgrestSingleResponse<Health>> {
    return await supabase.from('health').update(health).eq('id', healthId).select().single()
  }

  return {
    postHealth,
    patchHealth
  }
}
