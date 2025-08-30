import { flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CreateAccountView from '../../views/CreateAccountView.vue'
import { useAccountStore } from '../../store/useAccountStore'
import { useAuthStore } from '@/modules/auth/store/useAuthStore'
import { createMockAccount, createTestWrapper } from '@/shared/test/testUtils'
import { useAccountService } from '../../services/useAccountService'

// Mock du service
vi.mock('../../services/useAccountService', () => ({
    useAccountService: () => ({
        getAccounts: vi.fn(),
        getAccount: vi.fn(),
        postAccount: vi.fn(),
        patchAccount: vi.fn()
    })
}))

// Mock du router
const mockRouter = {
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn()
}

vi.mock('vue-router', () => ({
    useRouter: () => mockRouter
}))

describe('CreateAccountView', () => {
    let wrapper: any
    let accountStore: any
    let authStore: any
    let accountService: any
    const mockUser = createMockAccount()

    beforeEach(async () => {
        wrapper = createTestWrapper(CreateAccountView, {
            props: {
                user: mockUser
            },
            global: {
                provide: {
                    router: mockRouter
                }
            }
        })
        accountStore = useAccountStore()
        authStore = useAuthStore()
        accountService = useAccountService()
        vi.clearAllMocks()
        await flushPromises()
    })

    describe('Rendu initial', () => {
        it('should display create account form', async () => {
            expect(wrapper.text()).toContain('Créer un compte')
            expect(wrapper.findComponent({ name: 'AccountFormComponent' }).exists()).toBe(true)
        })
    })

    describe('Gestion du formulaire', () => {
        it('should create account when form is submitted', async () => {
            const mockAccount = createMockAccount()
            const accountData = {
                firstname: 'Jon',
                lastname: 'Jones',
                email: mockUser.email
            }

            accountStore.createAccount = vi.fn().mockResolvedValue(mockAccount)

            // Trouver le formulaire et émettre l'événement submit
            const form = wrapper.findComponent({ name: 'AccountFormComponent' })
            await form.vm.$emit('submit', accountData)
            await nextTick()
            await flushPromises()

            // Vérifier que createAccount a été appelé avec les bons paramètres
            expect(accountStore.createAccount).toHaveBeenCalledWith(
                accountData,
                mockUser.email,
                mockUser.id
            )

            // Vérifier que le router a été appelé pour rediriger
            expect(mockRouter.push).toHaveBeenCalledWith({ name: 'dashboard' })
        })

        it('should navigate to login when cancel is clicked', async () => {
            const form = wrapper.findComponent({ name: 'AccountFormComponent' })
            await form.vm.$emit('cancel')
            await nextTick()

            expect(mockRouter.push).toHaveBeenCalledWith({ name: 'login' })
        })

        // it('should show error message when account creation fails', async () => {
        //     const error = new Error('Failed to create account')
        //     accountStore.createAccount = vi.fn().mockRejectedValue(error)

        //     const form = wrapper.findComponent({ name: 'AccountFormComponent' })
        //     await form.vm.$emit('submit', {})
        //     await flushPromises()

        //     expect(wrapper.text()).toContain('Erreur')
        // })
    })
})
