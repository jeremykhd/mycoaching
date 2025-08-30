import { flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProfileView from '../../views/ProfileView.vue'
import { useAccountStore } from '../../store/useAccountStore'
import { useAuthStore } from '@/modules/auth/store/useAuthStore'
import { createMockAccount, createMockUser, createTestWrapper } from '@/shared/test/testUtils'
import { useAccountService } from '../../services/useAccountService'
import InformationsComponent from '../../components/InformationsComponent.vue'
import HealthComponent from '../../components/HealthComponent.vue'

// Mock du service
vi.mock('../../services/useAccountService', () => ({
    useAccountService: () => ({
        getAccounts: vi.fn(),
        getAccount: vi.fn(),
        postAccount: vi.fn(),
        patchAccount: vi.fn()
    })
}))

describe('ProfileView', () => {
    let wrapper: any
    let accountStore: any
    let authStore: any
    let accountService: any
    const mockUser = createMockUser()
    const mockAccount = createMockAccount()

    beforeEach(async () => {
        wrapper = createTestWrapper(ProfileView, {
            props: {
                user: mockUser,
                account: mockAccount
            },
            global: {
                stubs: {
                    InformationsComponent: false,
                    HealthComponent: false
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
        it('should display profile components', async () => {
            // Vérifier que les composants sont présents
            const informationsComponent = wrapper.findComponent(InformationsComponent)
            const healthComponent = wrapper.findComponent(HealthComponent)

            expect(informationsComponent.exists()).toBe(true)
            expect(healthComponent.exists()).toBe(true)
        })

        it('should set account in store on mount', async () => {
            // Vérifier que le compte est bien défini dans le store
            expect(accountStore.account).toEqual(mockAccount)
        })
    })

    describe('Objectifs section', () => {
        it('should display objectives section', async () => {
            expect(wrapper.text()).toContain('Mes Objectifs')
            expect(wrapper.text()).toContain('Ajouter un objectif')
            expect(wrapper.text()).toContain('La gestion des objectifs sera bientôt disponible')
        })
    })
})
