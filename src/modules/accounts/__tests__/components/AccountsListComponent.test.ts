import { flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AccountsListComponent from '../../components/AccountsListComponent.vue'
import { useAccountStore } from '../../store/useAccountStore'
import { createMockAccount, createTestWrapper } from '@/shared/test/testUtils'

describe('AccountsListComponent', () => {
    let wrapper: any
    let accountStore: any

    beforeEach(async () => {
        wrapper = createTestWrapper(AccountsListComponent)
        accountStore = useAccountStore()
        await flushPromises()
    })

    describe('Rendu initial', () => {
        it('should display accounts list correctly', async () => {
            const account = createMockAccount()
            accountStore.accounts = [account]
            await flushPromises()

            expect(wrapper.text()).toContain(account.firstname)
            expect(wrapper.text()).toContain(account.lastname)
            expect(wrapper.text()).toContain(account.email)
            expect(wrapper.text()).toContain('Actif')
        })

        it('should show search input', () => {
            const searchInput = wrapper.find('input[id="searchAccountInput"]')
            expect(searchInput.exists()).toBe(true)
            expect(searchInput.attributes('placeholder')).toBe('Rechercher un compte...')
        })
    })

    describe('Recherche', () => {
        it('should filter accounts based on search query', async () => {
            const accounts = [
                createMockAccount({ firstname: 'test', lastname: 'test', email: 'test@test.com' }),
                createMockAccount({ firstname: 'Jon', lastname: 'Jones', email: 'jon@jones.com' })
            ]

            // Initialiser le store avec les comptes
            accountStore = useAccountStore()
            accountStore.accounts = accounts
            await flushPromises()

            // Vérifier que les deux comptes sont initialement affichés
            let rows = wrapper.findAll('tbody tr')
            expect(rows.length).toBe(2)

            // Effectuer la recherche
            const searchInput = wrapper.find('input[id="searchAccountInput"]')
            await searchInput.setValue('test')
            await nextTick()
            await flushPromises()

            // Vérifier que la valeur est bien mise à jour dans l'input
            expect(searchInput.element.value).toBe('test')

            // Vérifier que le composant filtre correctement
            rows = wrapper.findAll('tbody tr')
            expect(rows.length).toBe(1)
            expect(wrapper.text()).toContain('test test')
            expect(wrapper.text()).not.toContain('Jon Jones')
        })
    })

    describe('Actions', () => {
        it('should emit edit event when edit button clicked', async () => {
            const account = createMockAccount()
            accountStore.accounts = [account]
            await flushPromises()

            const editButton = wrapper.find('button[id="emitEdit"]')
            await editButton.trigger('click')
            await flushPromises()

            expect(wrapper.emitted('edit')).toBeTruthy()
            expect(wrapper.emitted('edit')[0][0]).toEqual(account)
        })

        it('should toggle account status when toggle button clicked', async () => {
            const account = createMockAccount()
            accountStore.accounts = [account]
            accountStore.updateAccount = vi.fn().mockResolvedValue({ ...account, is_active: false })
            await flushPromises()

            const toggleButton = wrapper.find('button[id="emitToggleStatus"]')
            await toggleButton.trigger('click')
            await flushPromises()

            expect(accountStore.updateAccount).toHaveBeenCalledWith(account.id, {
                is_active: false
            })
        })
    })
})
