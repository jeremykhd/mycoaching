import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useAuthStore } from '../../store/useAuthStore'
import LoginView from '../../views/LoginView.vue'

// Mock de Supabase
vi.mock('@/shared/services/supabaseClient', () => ({
    supabase: {
        auth: {
            signInWithOtp: vi.fn().mockResolvedValue({
                data: {},
                error: null
            })
        }
    }
}))

// Mock du router
const mockRouter = vi.fn()

vi.mock('vue-router', async () => {
    return {
        RouterView: {},
        useRouter: () => {
            return {
                push: mockRouter
            }
        }
    }
})

describe('Login View', () => {
    let wrapper: any
    let authStore: any
    let pinia: any

    const createWrapper = () => {
        pinia = createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
            initialState: {
                auth: {
                    loading: false,
                    error: null
                }
            }
        })

        return mount(LoginView, {
            global: {
                plugins: [pinia]
            }
        })
    }

    beforeEach(() => {
        wrapper = createWrapper()
        authStore = useAuthStore()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('should render the login form', () => {
        expect(wrapper.find('form').exists()).toBe(true)
        expect(wrapper.find('input[type="email"]').exists()).toBe(true)
        expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
    })

    it('should show the correct button text when not loading', () => {
        const button = wrapper.find('button')
        expect(button.text()).toContain('Envoyer le code')
    })

    it('should show loading state when authStore.loading is true', async () => {
        authStore.loading = true
        await wrapper.vm.$nextTick()

        const button = wrapper.find('button')
        expect(button.text()).toContain('Envoi en cours...')
    })

    it('should display error message when authStore.error is set', async () => {
        const errorMessage = 'Une erreur est survenue'
        authStore.error = errorMessage
        await wrapper.vm.$nextTick()

        const errorElement = wrapper.find('.text-red-700')
        expect(errorElement.exists()).toBe(true)
        expect(errorElement.text()).toBe(errorMessage)
    })

    it('should call sendOTP and redirect on successful submission', async () => {
        const email = 'test@example.com'

        await wrapper.find('input[type="email"]').setValue(email)
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        expect(authStore.sendOTP).toHaveBeenCalledWith(email)
        expect(mockRouter).toHaveBeenCalledWith({ name: 'verify-otp' })
    })
})
