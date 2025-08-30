import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { vi } from 'vitest'
import type { Account } from '@/modules/accounts/models/Account'
import { EnumGender } from '@/modules/accounts/models/Account'
import { EnumMeasureWeight } from '@/modules/accounts/models/Health'
import type { Health } from '@/modules/accounts/models/Health'
import type { Objectives } from '@/modules/accounts/models/Objectives'
import type { Role } from '@/modules/accounts/models/Role'
import type { Session, User } from '@supabase/supabase-js'

// Mock factories
export const createMockHealth = (overrides: Partial<Health> = {}): Health => ({
    id: 1,
    height: 180,
    weight: 70,
    target_weight: 75,
    target_training: 3,
    measure_weight: EnumMeasureWeight.weekly,
    ...overrides
})

export const createMockObjectives = (overrides: Partial<Objectives> = {}): Objectives => ({
    id: 1,
    training_per_week: 5,
    ...overrides
})

export const createMockRole = (overrides: Partial<Role> = {}): Role => ({
    id: 1,
    name: 'user',
    ...overrides
})
export const createMockUser = (overrides: Partial<User> = {}): User => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@test.com',
    created_at: '2024-01-01',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    role: 'authenticated',
    ...overrides
})

export const createMockSession = (overrides: Partial<Session> = {}): Session => ({
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_at: 1234567890,
    expires_in: 3600,
    token_type: 'bearer',
    user: createMockUser(),
    ...overrides
})

export const createMockAccount = (overrides: Partial<Account> = {}): Account => ({
    id: 1,
    user_id: '123e4567-e89b-12d3-a456-426614174000',
    firstname: 'test',
    lastname: 'test',
    email: 'test@test.com',
    password: 'hashedPassword',
    birthday: '1990-01-01',
    phone_number: '0123456789',
    gender: EnumGender.male,
    height: 180,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    is_active: true,
    health: createMockHealth(),
    objectives: createMockObjectives(),
    role: createMockRole(),
    ...overrides
})

export const createMockAuthError = (message: string): any => ({
    message,
    status: 400,
    name: 'AuthError',
    code: 'invalid_credentials',
    __isAuthError: true
})

// Test helpers
export const createTestWrapper = (component: any, options = {}) => {
    const pinia = createTestingPinia({
        createSpy: vi.fn,
        stubActions: false,
        ...options
    })

    return mount(component, {
        global: {
            plugins: [pinia]
        },
        ...options
    })
}
