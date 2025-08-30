import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAccountStore } from '../../store/useAccountStore'
import { useAccountService } from '../../services/useAccountService'
import { useHealthService } from '../../services/useHealthService'
import type { Account } from '../../models/Account'
import type { Health } from '../../models/Health'
import type { Objectives } from '../../models/Objectives'
import { EnumGender } from '../../models/Account'
import { EnumMeasureWeight } from '../../models/Health'
import type {
  PostgrestError,
  PostgrestResponse,
  PostgrestSingleResponse
} from '@supabase/supabase-js'

// Mock des services
vi.mock('../../services/useAccountService', () => ({
  useAccountService: vi.fn(() => ({
    getAccount: vi.fn(),
    getAccounts: vi.fn(),
    postAccount: vi.fn(),
    patchAccount: vi.fn()
  }))
}))

vi.mock('../../services/useHealthService', () => ({
  useHealthService: vi.fn(() => ({
    postHealth: vi.fn(),
    patchHealth: vi.fn()
  }))
}))

vi.mock('../../services/useObjectivesService', () => ({
  useObjectivesService: vi.fn(() => ({
    postObjectives: vi.fn(),
    patchObjectives: vi.fn()
  }))
}))

// Mock de vue-toastification
vi.mock('vue-toastification', () => ({
  useToast: vi.fn(() => ({
    success: vi.fn(),
    error: vi.fn()
  })),
  POSITION: {
    BOTTOM_RIGHT: 'bottom-right'
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

const createMockService = (overrides: Partial<ReturnType<typeof useAccountService>> = {}) => ({
  getAccount: vi.fn(),
  getAccounts: vi.fn(),
  postAccount: vi.fn(),
  patchAccount: vi.fn(),
  ...overrides
})

describe('useAccountStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    it('should initialize with default values', () => {
      const store = useAccountStore()
      expect(store.account).toBeNull()
      expect(store.accounts).toStrictEqual([])
      expect(store.loading).toBe(false)
    })
  })

  describe('fetchAccount', () => {
    it('should fetch account successfully', async () => {
      const mockAccount = createDefaultMockAccount()
      const mockResponse: PostgrestSingleResponse<Account> = {
        data: mockAccount,
        error: null,
        count: null,
        status: 200,
        statusText: 'OK'
      }

      const getAccountMock = vi.fn().mockResolvedValue(mockResponse)
      const mockService = createMockService({ getAccount: getAccountMock })
      vi.mocked(useAccountService).mockReturnValue(mockService)

      const store = useAccountStore()
      await store.fetchAccount(mockAccount.user_id)

      expect(getAccountMock).toHaveBeenCalledWith(mockAccount.user_id)
      expect(store.account).toEqual(mockAccount)
      expect(store.loading).toBe(false)
    })

    it('should handle error when fetching account', async () => {
      const mockError: PostgrestError = {
        code: '500',
        message: 'Internal server error',
        details: '',
        hint: '',
        name: 'PostgrestError'
      }

      const mockResponse: PostgrestSingleResponse<Account> = {
        data: null,
        error: mockError,
        count: null,
        status: 500,
        statusText: 'Internal Server Error'
      }

      const getAccountMock = vi.fn().mockResolvedValue(mockResponse)
      const mockService = createMockService({ getAccount: getAccountMock })
      vi.mocked(useAccountService).mockReturnValue(mockService)

      const store = useAccountStore()
      await store.fetchAccount('123e4567-e89b-12d3-a456-426614174000')

      expect(getAccountMock).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000')
      expect(store.account).toBeNull()
      expect(store.loading).toBe(false)
    })
  })

  describe('fetchAccounts', () => {
    it('should return an array of accounts when data is available', async () => {
      const mockAccounts = [createDefaultMockAccount()]
      const mockResponse: PostgrestResponse<Account> = {
        data: mockAccounts,
        error: null,
        count: mockAccounts.length,
        status: 200,
        statusText: 'OK'
      }

      const getAccountsMock = vi.fn().mockResolvedValue(mockResponse)
      const mockService = createMockService({ getAccounts: getAccountsMock })
      vi.mocked(useAccountService).mockReturnValue(mockService)

      const store = useAccountStore()
      await store.fetchAccounts()

      expect(getAccountsMock).toHaveBeenCalled()
      expect(store.accounts).toStrictEqual(mockAccounts)
    })

    it('should return an empty array when no data is available', async () => {
      const mockResponse: PostgrestResponse<Account> = {
        data: [],
        error: null,
        count: 0,
        status: 200,
        statusText: 'OK'
      }

      const getAccountsMock = vi.fn().mockResolvedValue(mockResponse)
      const mockService = createMockService({ getAccounts: getAccountsMock })
      vi.mocked(useAccountService).mockReturnValue(mockService)

      const store = useAccountStore()
      await store.fetchAccounts()

      expect(getAccountsMock).toHaveBeenCalled()
      expect(store.accounts).toStrictEqual([])
    })

    it('should return an empty array when response data is null', async () => {
      const mockResponse: PostgrestResponse<Account> = {
        data: null,
        error: null as unknown as PostgrestError,
        count: null,
        status: 200,
        statusText: 'OK'
      }

      const getAccountsMock = vi.fn().mockResolvedValue(mockResponse)
      const mockService = createMockService({ getAccounts: getAccountsMock })
      vi.mocked(useAccountService).mockReturnValue(mockService)

      const store = useAccountStore()
      await store.fetchAccounts()

      expect(getAccountsMock).toHaveBeenCalled()
      expect(store.accounts).toStrictEqual([])
    })
  })

  describe('createAccount', () => {
    it('should create account successfully', async () => {
      const mockAccount = createDefaultMockAccount()
      const mockResponse: PostgrestSingleResponse<Account> = {
        data: mockAccount,
        error: null,
        count: null,
        status: 200,
        statusText: 'OK'
      }

      const postAccountMock = vi.fn().mockResolvedValue(mockResponse)
      const mockService = createMockService({ postAccount: postAccountMock })
      vi.mocked(useAccountService).mockReturnValue(mockService)

      const store = useAccountStore()
      const accountData: Partial<Account> = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com'
      }

      await store.createAccount(accountData, 'john@example.com', mockAccount.user_id)

      expect(postAccountMock).toHaveBeenCalledWith(
        accountData,
        'john@example.com',
        mockAccount.user_id
      )
      expect(store.account).toEqual(mockAccount)
      expect(store.loading).toBe(false)
    })
  })

  describe('updateAccount', () => {
    it('should update account successfully', async () => {
      const mockAccount = createDefaultMockAccount()
      const mockResponse: PostgrestSingleResponse<Account> = {
        data: mockAccount,
        error: null,
        count: null,
        status: 200,
        statusText: 'OK'
      }

      const patchAccountMock = vi.fn().mockResolvedValue(mockResponse)
      const mockService = createMockService({ patchAccount: patchAccountMock })
      vi.mocked(useAccountService).mockReturnValue(mockService)

      const store = useAccountStore()
      const accountData: Partial<Account> = {
        firstname: 'John Updated'
      }

      await store.updateAccount(mockAccount.id, accountData)

      expect(patchAccountMock).toHaveBeenCalledWith(mockAccount.id, accountData)
      expect(store.loading).toBe(false)
    })
  })

  describe('createHealth', () => {
    it('should create health successfully', async () => {
      const mockAccount = createDefaultMockAccount()
      const mockHealth = mockAccount.health
      const mockResponse: PostgrestSingleResponse<Account> = {
        data: mockAccount,
        error: null,
        count: null,
        status: 200,
        statusText: 'OK'
      }

      const postHealthMock = vi.fn().mockResolvedValue({ data: mockHealth, error: null })
      const patchAccountMock = vi.fn().mockResolvedValue(mockResponse)
      const mockService = createMockService({
        patchAccount: patchAccountMock
      })
      vi.mocked(useAccountService).mockReturnValue(mockService)
      vi.mocked(useHealthService).mockReturnValue({
        postHealth: postHealthMock,
        patchHealth: vi.fn()
      })

      const store = useAccountStore()
      store.account = mockAccount

      const healthData: Partial<Health> = {
        height: 180,
        weight: 80
      }

      await store.createHealth(healthData)

      expect(postHealthMock).toHaveBeenCalledWith(healthData)
      expect(patchAccountMock).toHaveBeenCalledWith(mockAccount.id, {
        health: mockHealth
      })
      expect(store.account).toEqual(mockAccount)
      expect(store.loading).toBe(false)
    })
  })

  describe('updateHealth', () => {
    it('should update health successfully', async () => {
      const mockAccount = createDefaultMockAccount()
      const mockHealth = mockAccount.health
      const mockResponse: PostgrestSingleResponse<Account> = {
        data: mockAccount,
        error: null,
        count: null,
        status: 200,
        statusText: 'OK'
      }

      const patchHealthMock = vi.fn().mockResolvedValue({ data: mockHealth, error: null })
      const getAccountMock = vi.fn().mockResolvedValue(mockResponse)
      const mockService = createMockService({ getAccount: getAccountMock })
      vi.mocked(useAccountService).mockReturnValue(mockService)
      vi.mocked(useHealthService).mockReturnValue({
        postHealth: vi.fn(),
        patchHealth: patchHealthMock
      })

      const store = useAccountStore()
      store.account = mockAccount

      const healthData: Partial<Omit<Health, 'id'>> = {
        height: 185,
        weight: 75
      }

      await store.updateHealth(mockHealth.id, healthData)

      expect(patchHealthMock).toHaveBeenCalledWith(mockHealth.id, healthData)
      expect(getAccountMock).toHaveBeenCalledWith(mockAccount.user_id)
      expect(store.loading).toBe(false)
    })
  })

  describe('updateObjectives', () => {
    it('should update objectives successfully', async () => {
      const mockAccount = createDefaultMockAccount()
      const mockResponse: PostgrestSingleResponse<Account> = {
        data: mockAccount,
        error: null,
        count: null,
        status: 200,
        statusText: 'OK'
      }

      const patchAccountMock = vi.fn().mockResolvedValue(mockResponse)
      const getAccountMock = vi.fn().mockResolvedValue(mockResponse)
      const mockService = createMockService({
        patchAccount: patchAccountMock,
        getAccount: getAccountMock
      })
      vi.mocked(useAccountService).mockReturnValue(mockService)

      const store = useAccountStore()
      store.account = mockAccount

      const objectivesData: Partial<Objectives> = {
        training_per_week: 4
      }

      await store.updateObjectives(mockAccount.id, objectivesData)

      expect(patchAccountMock).toHaveBeenCalledWith(mockAccount.id, {
        training_objectives: objectivesData
      })
      expect(getAccountMock).toHaveBeenCalledWith(mockAccount.user_id)
      expect(store.loading).toBe(false)
    })
  })
})
