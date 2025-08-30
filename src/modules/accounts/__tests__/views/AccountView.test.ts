import { flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AccountsView from '../../views/AccountsView.vue'
import { useAccountStore } from '../../store/useAccountStore'
import { useAuthStore } from '@/modules/auth/store/useAuthStore'
import { createMockAccount, createTestWrapper } from '@/shared/test/testUtils'
import { useAccountService } from '../../services/useAccountService'

// Mock du service
vi.mock('../../services/useAccountService', () => ({
    useAccountService: () => ({
        getAccounts: vi.fn().mockResolvedValue({
            data: [createMockAccount()],
            error: null,
            count: 1,
            status: 200,
            statusText: 'OK'
        }),
        getAccount: vi.fn(),
        postAccount: vi.fn(),
        patchAccount: vi.fn()
    })
}))

describe('AccountsView', () => {
    let wrapper: any
    let accountStore: any
    let authStore: any
    let accountService: any

    beforeEach(async () => {
        wrapper = createTestWrapper(AccountsView)
        accountStore = useAccountStore()
        authStore = useAuthStore()
        accountService = useAccountService()
        vi.clearAllMocks()
        await flushPromises()
    })

    describe('Rendu initial', () => {
        it('should display accounts list correctly', async () => {
            const accounts = [
                createMockAccount({ firstname: 'test', lastname: 'test' }),
                createMockAccount({ firstname: 'Jon', lastname: 'Jones' })
            ]
            accountStore.accounts = accounts
            await flushPromises()

            expect(wrapper.text()).toContain('Utilisateurs')
            expect(wrapper.text()).toContain('test test')
            expect(wrapper.text()).toContain('Jon Jones')
        })

        it('should fetch accounts on mount if store is empty', async () => {
            const mockAccounts = [createMockAccount()]

            accountStore.accounts = []
            await accountStore.fetchAccounts()

            await flushPromises()

            expect(accountStore.accounts).toEqual(mockAccounts)
        })

        it('should not fetch accounts on mount if store has data', async () => {
            const existingAccount = createMockAccount()
            accountStore.accounts = [existingAccount]

            wrapper = createTestWrapper(AccountsView)
            await flushPromises()

            expect(accountStore.accounts).toEqual([existingAccount])
        })
    })

    describe('Gestion du formulaire', () => {
        it('should show form modal when edit button is clicked', async () => {
            const account = createMockAccount()
            accountStore.accounts = [account]
            await flushPromises()

            // Simuler le clic sur le bouton d'édition via l'événement émis par AccountsListComponent
            const accountsList = wrapper.findComponent({ name: 'AccountsListComponent' })

            // Émettre l'événement edit
            await accountsList.vm.$emit('edit', account)
            await nextTick()

            const accountFormComponent = wrapper.findComponent({ name: 'AccountFormComponent' })

            // Vérifier que le formulaire est présent
            expect(accountFormComponent.exists()).toBe(true)
        })

        it('should update account when form is submitted', async () => {
            const account = createMockAccount()
            const updatedAccount = { ...account, firstname: 'Updated' }
            accountStore.accounts = [account]
            accountStore.updateAccount = vi.fn().mockResolvedValue(updatedAccount)
            await flushPromises()

            // Simuler l'édition
            const accountsList = wrapper.findComponent({ name: 'AccountsListComponent' })

            await accountsList.vm.$emit('edit', account)
            await nextTick()
            // Simuler la soumission du formulaire
            const form = wrapper.findComponent({ name: 'AccountFormComponent' })
            await form.vm.$emit('submit', { firstname: 'Updated' })
            await flushPromises()

            expect(accountStore.updateAccount).toHaveBeenCalledWith(account.id, {
                firstname: 'Updated'
            })
            expect(authStore.account).toEqual(updatedAccount)
        })

        it('should close form modal when cancel is clicked', async () => {
            const account = createMockAccount()
            accountStore.accounts = [account]
            await flushPromises()

            // Simuler l'édition
            const accountsList = wrapper.findComponent({ name: 'AccountsListComponent' })

            await accountsList.vm.$emit('edit', account)
            await nextTick()

            // Simuler l'annulation
            const form = wrapper.findComponent({ name: 'AccountFormComponent' })
            await form.vm.$emit('cancel')
            await nextTick()

            expect(wrapper.find('.fixed.inset-0').exists()).toBe(false)
        })
    })

    describe('Interactions avec le store', () => {
        it('should update auth store when account is updated', async () => {
            const account = createMockAccount()
            const updatedAccount = { ...account, firstname: 'Updated' }
            accountStore.accounts = [account]
            accountStore.updateAccount = vi.fn().mockResolvedValue(updatedAccount)
            await flushPromises()

            // Simuler l'édition et la mise à jour
            const accountsList = wrapper.findComponent({ name: 'AccountsListComponent' })
            await accountsList.vm.$emit('edit', account)
            await nextTick()

            const form = wrapper.findComponent({ name: 'AccountFormComponent' })
            await form.vm.$emit('submit', { firstname: 'Updated' })
            await flushPromises()

            expect(authStore.account).toEqual(updatedAccount)
        })
    })
})
