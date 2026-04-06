import type { PostgrestSingleResponse } from '@supabase/supabase-js'
import type { Health } from '../models/Health'
import { supabase } from '@/shared/services/supabaseClient'

export interface WeightEntry {
  id: number
  account_id: number
  weight: number
  date: string
}

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

  async function getWeightHistory(accountId: number, limit = 30) {
    return await supabase
      .from('account_health')
      .select('*')
      .eq('account_id', accountId)
      .order('date', { ascending: true })
      .limit(limit)
  }

  return {
    postHealth,
    patchHealth,
    getWeightHistory,
  }
}
