import { supabase } from '@/shared/services/supabaseClient'
import type { Account } from '../models/Account'
import type { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js'

const ACCOUNT_SELECT = '*, health!account_id(id, height, weight, target_weight, target_training, measure_weight), training_objectives!account_id(id, training_per_week), role:role_id(name)'

// Supabase returns one-to-many relations as arrays even for 1-to-1 in practice.
// Normalize health[] and training_objectives[] to single objects.
function normalizeAccount(raw: any): Account | null {
  if (!raw) return null
  return {
    ...raw,
    health: Array.isArray(raw.health) ? raw.health[0] ?? null : raw.health,
    objectives: Array.isArray(raw.training_objectives) ? raw.training_objectives[0] ?? null : raw.training_objectives,
  }
}

export function useAccountService() {
  async function getAccount(userId: string): Promise<PostgrestSingleResponse<Account | null>> {
    const res = await supabase
      .from('account')
      .select(ACCOUNT_SELECT)
      .eq('user_id', userId)
      .maybeSingle()

    if (res.data) {
      (res as any).data = normalizeAccount(res.data)
    }
    return res as PostgrestSingleResponse<Account | null>
  }

  async function getAccounts(): Promise<PostgrestResponse<Account>> {
    const res = await supabase
      .from('account')
      .select(ACCOUNT_SELECT)

    if (res.data) {
      (res as any).data = res.data.map(normalizeAccount)
    }
    return res as PostgrestResponse<Account>
  }

  async function postAccount(
    account: Partial<Account>,
    email: string,
    userId: string
  ): Promise<PostgrestSingleResponse<Account>> {
    const newAccount = {
      firstname: account.firstname,
      lastname: account.lastname,
      birthday: account.birthday,
      email: email,
      gender: account.gender,
      user_id: userId,
      role_id: 1
    }
    const res = await supabase
      .from('account')
      .insert(newAccount)
      .select(ACCOUNT_SELECT)
      .single()

    if (res.data) {
      (res as any).data = normalizeAccount(res.data)
    }
    return res as PostgrestSingleResponse<Account>
  }

  async function patchAccount(
    accountId: number,
    account: Partial<Account>
  ): Promise<PostgrestSingleResponse<Account | null>> {
    const res = await supabase
      .from('account')
      .update(account)
      .eq('id', accountId)
      .select(ACCOUNT_SELECT)
      .single()

    if (res.data) {
      (res as any).data = normalizeAccount(res.data)
    }
    return res as PostgrestSingleResponse<Account | null>
  }

  return {
    getAccount,
    getAccounts,
    postAccount,
    patchAccount
  }
}
