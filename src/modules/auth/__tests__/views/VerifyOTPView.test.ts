import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useAuthStore } from '../../store/useAuthStore'
import VerifyOTPView from '../../views/VerifyOTPView.vue'

// Mock de Supabase
vi.mock('@/shared/services/supabaseClient', () => ({
    supabase: {
        auth: {
            verifyOTP: vi.fn().mockResolvedValue({
                data: {
                    user: { id: '123' },
                    session: {}
                },
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

describe('VerifyOTP View', () => {
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
                    error: null,
                    pendingVerification: true,
                    pendingVerificationEmail: 'test@example.com'
                }
            }
        })

        return mount(VerifyOTPView, {
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

    it('should render the verification form', () => {
        expect(wrapper.find('form').exists()).toBe(true)
        expect(wrapper.find('input[type="text"]').exists()).toBe(true)
        expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
    })

    it('should show the correct button text when not loading', () => {
        const button = wrapper.find('button[type="submit"]')
        expect(button.text()).toContain('Vérifier le code')
    })

    it('should show loading state when authStore.loading is true', async () => {
        authStore.loading = true
        await wrapper.vm.$nextTick()

        const button = wrapper.find('button[type="submit"]')
        expect(button.text()).toContain('Vérification...')
    })

    it('should display error message when authStore.error is set', async () => {
        const errorMessage = 'Une erreur est survenue'
        authStore.error = errorMessage
        await wrapper.vm.$nextTick()

        const errorElement = wrapper.find('.text-red-700')
        expect(errorElement.exists()).toBe(true)
        expect(errorElement.text()).toBe(errorMessage)
    })

    it('should display the email address when pendingVerification is true', () => {
        const emailText = wrapper.find('p.text-white\\/80')
        expect(emailText.exists()).toBe(true)
        expect(emailText.text()).toContain('test@example.com')
    })

    it('should call verifyOTP and redirect on successful submission', async () => {
        const otpCode = '123456'
        await wrapper.find('input[type="text"]').setValue(otpCode)
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        expect(authStore.verifyOTP).toHaveBeenCalledWith(otpCode)
        expect(mockRouter).toHaveBeenCalledWith({ name: 'dashboard' })
    })

    it('should clear pending verification and redirect to login when clicking back button', async () => {
        await wrapper.find('button[type="button"]').trigger('click')

        expect(authStore.clearPendingVerification).toHaveBeenCalled()
        expect(mockRouter).toHaveBeenCalledWith({ name: 'login' })
    })
})
