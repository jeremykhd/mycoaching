import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAccountService } from '../../services/useAccountService'
import { supabase } from '@/shared/services/supabaseClient'
import type { Account } from '../../models/Account'
import { EnumGender } from '../../models/Account'
import { EnumMeasureWeight } from '../../models/Health'
import type { PostgrestError } from '@supabase/supabase-js'

// Mock de Supabase
vi.mock('@/shared/services/supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn()
        })),
        single: vi.fn(),
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn()
          }))
        })),
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn()
            }))
          }))
        }))
      }))
    }))
  }
}))
// Helpers pour les tests
const createDefaultMockAccount = (overrides: Partial<Account> = {}): Account => ({
  id: 1,
  user_id: '123e4567-e89b-12d3-a456-426614174000' as const,
  firstname: 'test',
  lastname: 'test',
  email: 'test@test.com',
  password: 'hashedPassword',
  height: 180,
  gender: EnumGender.male,
  birthday: '1990-01-01',
  phone_number: '1234567890',
  createdAt: '1999-01-01',
  updatedAt: '1999-01-01',
  is_active: true,
  health: {
    id: 1,
    height: 180,
    weight: 75,
    target_weight: 76,
    target_training: 5,
    measure_weight: EnumMeasureWeight.weekly
  },
  objectives: {
    id: 1,
    training_per_week: 5
  },
  role: {
    id: 1,
    name: 'user'
  },
  ...overrides
})

describe('useAccountService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAccount', () => {
    it('should build the correct query for getAccount', async () => {
      const userId: string = '123e4567-e89b-12d3-a456-426614174000'
      const mockAccount: Account = createDefaultMockAccount()

      const mockResponse = {
        data: mockAccount,
        error: null,
        count: null,
        status: 200,
        statusText: 'OK'
      }

      // Configuration du mock
      const fromMock = vi.mocked(supabase.from)
      const selectMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue(mockResponse)
        })
      })
      fromMock.mockReturnValue({ select: selectMock } as any)

      const { getAccount } = useAccountService()
      const result = await getAccount(userId)

      // Vérifications
      expect(fromMock).toHaveBeenCalledWith('account')
      expect(selectMock).toHaveBeenCalledWith(
        '*, health(id, height, weight, target_weight, target_training, measure_weight), training_objectives(training_per_week), role(name)'
      )
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors correctly', async () => {
      const userId: string = '123e4567-e89b-12d3-a456-426614174000'
      const mockError: PostgrestError = {
        code: '500',
        message: 'Internal server error',
        details: '',
        hint: '',
        name: 'PostgrestError'
      }

      const mockResponse = {
        data: null,
        error: mockError,
        count: null,
        status: 500,
        statusText: 'Internal Server Error'
      }

      // Configuration du mock
      const fromMock = vi.mocked(supabase.from)
      const selectMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue(mockResponse)
        })
      })
      fromMock.mockReturnValue({ select: selectMock } as any)

      const { getAccount } = useAccountService()
      const result = await getAccount(userId)

      expect(result).toEqual(mockResponse)
    })
  })

  describe('getAccounts', () => {
    it('should build the correct query for getAccounts', async () => {
      const mockAccounts: Account[] = [createDefaultMockAccount()]

      const mockResponse = {
        data: mockAccounts,
        error: null,
        count: mockAccounts.length,
        status: 200,
        statusText: 'OK'
      }

      // Configuration du mock
      const fromMock = vi.mocked(supabase.from)
      const selectMock = vi.fn().mockResolvedValue(mockResponse)
      fromMock.mockReturnValue({ select: selectMock } as any)

      const { getAccounts } = useAccountService()
      const result = await getAccounts()

      // Vérifications
      expect(fromMock).toHaveBeenCalledWith('account')
      expect(selectMock).toHaveBeenCalledWith(
        '*, health(id, height, weight, target_weight, target_training, measure_weight), training_objectives(training_per_week), role(name)'
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe('postAccount', () => {
    it('should format account data correctly before posting', async () => {
      const accountData: Partial<Account> = {
        firstname: 'test',
        lastname: 'test',
        birthday: '1990-01-01',
        gender: EnumGender.male
      }
      const email: string = 'test@test.com'
      const userId: string = '123e4567-e89b-12d3-a456-426614174000'

      const expectedFormattedData: {} = {
        firstname: accountData.firstname,
        lastname: accountData.lastname,
        birthday: accountData.birthday,
        email: email,
        gender: accountData.gender,
        user_id: userId,
        role_id: 1
      }

      const mockResponse = {
        data: { ...expectedFormattedData, id: 1 },
        error: null,
        count: null,
        status: 200,
        statusText: 'OK'
      }

      // Configuration du mock
      const fromMock = vi.mocked(supabase.from)
      const insertMock = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue(mockResponse)
        })
      })
      fromMock.mockReturnValue({ insert: insertMock } as any)

      const { postAccount } = useAccountService()
      const result = await postAccount(accountData, email, userId)

      // Vérifications
      expect(fromMock).toHaveBeenCalledWith('account')
      expect(insertMock).toHaveBeenCalledWith(expectedFormattedData)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('patchAccount', () => {
    it('should update account with correct data', async () => {
      const accountId = 1
      const accountData: Partial<Account> = {
        firstname: 'test updated',
        lastname: 'test updated'
      }

      const mockResponse = {
        data: { id: accountId, ...accountData },
        error: null,
        count: null,
        status: 200,
        statusText: 'OK'
      }

      // Configuration du mock
      const fromMock = vi.mocked(supabase.from)
      const updateMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue(mockResponse)
          })
        })
      })
      fromMock.mockReturnValue({ update: updateMock } as any)

      const { patchAccount } = useAccountService()
      const result = await patchAccount(accountId, accountData)

      // Vérifications
      expect(fromMock).toHaveBeenCalledWith('account')
      expect(updateMock).toHaveBeenCalledWith(accountData)
      expect(result).toEqual(mockResponse)
    })
  })
})
