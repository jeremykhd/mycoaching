import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// Mock fetch globally
global.fetch = vi.fn()

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
}))

// Configuration globale pour Vue Test Utils
config.global.stubs = {
    ExclamationCircleIcon: true,
    ArrowRightIcon: true,
    ArrowPathIcon: true
}
