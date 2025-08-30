import { supabase } from '@/shared/services/supabaseClient'
import type { Account } from '../models/Account'
import type { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js'

export function useAccountService() {
  async function getAccount(userId: string): Promise<PostgrestSingleResponse<Account | null>> {
    return await supabase
      .from('account')
      .select(
        '*, health(id, height, weight, target_weight, target_training, measure_weight), training_objectives(training_per_week), role(name)'
      )
      .eq('user_id', userId)
      .maybeSingle()
  }

  async function getAccounts(): Promise<PostgrestResponse<Account>> {
    return await supabase
      .from('account')
      .select(
        '*, health(id, height, weight, target_weight, target_training, measure_weight), training_objectives(training_per_week), role(name)'
      )
  }

  async function postAccount(
    account: Partial<Omit<Account, 'password'>>,
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
    return await supabase
      .from('account')
      .insert(newAccount)
      .select(
        '*, health(id, height, weight, target_weight, target_training, measure_weight), training_objectives(training_per_week), role(name)'
      )
      .single()
  }

  async function patchAccount(
    accountId: number,
    account: Partial<Account>
  ): Promise<PostgrestSingleResponse<Account | null>> {
    return await supabase
      .from('account')
      .update(account)
      .eq('id', accountId)
      .select(
        '*, health(id, height, weight, target_weight, target_training, measure_weight), training_objectives(training_per_week), role(name)'
      )
      .single()
  }

  return {
    getAccount,
    getAccounts,
    postAccount,
    patchAccount
  }
}
