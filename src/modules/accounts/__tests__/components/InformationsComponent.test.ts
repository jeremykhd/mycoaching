import { flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import InformationsComponent from '../../components/InformationsComponent.vue'
import { useAccountStore } from '../../store/useAccountStore'
import { useAuthStore } from '@/modules/auth/store/useAuthStore'
import { createMockAccount, createTestWrapper } from '@/shared/test/testUtils'
import { nextTick } from 'vue'

describe('InformationsComponent', () => {
    let wrapper: any
    let accountStore: any
    let authStore: any

    beforeEach(async () => {
        wrapper = createTestWrapper(InformationsComponent)
        accountStore = useAccountStore()
        authStore = useAuthStore()
        await flushPromises()
    })

    describe('Rendu initial', () => {
        it('should display user information correctly', async () => {
            const account = createMockAccount()
            authStore.account = account
            await flushPromises()

            expect(wrapper.text()).toContain(account.firstname)
            expect(wrapper.text()).toContain(account.lastname)
            expect(wrapper.text()).toContain(account.email)
            expect(wrapper.text()).toContain(account.phone_number)
            expect(wrapper.text()).toContain('Homme') // Pour EnumGender.male
        })

        it('should show edit button initially', () => {
            const editButton = wrapper.find('button')
            expect(editButton.exists()).toBe(true)
            expect(editButton.text()).toContain('Modifier')
        })
    })

    describe('Mode édition', () => {
        it('should toggle edit mode when clicking edit button', async () => {
            const editButton = wrapper.find('button')
            await editButton.trigger('click')
            await nextTick()
            await flushPromises()

            expect(wrapper.find('input[type="text"]').exists()).toBe(true)
            expect(wrapper.find('select').exists()).toBe(true)
            expect(wrapper.find('button').text()).toContain('Annuler')
        })

        it('should show save and cancel buttons in edit mode', async () => {
            const editButton = wrapper.find('button')
            await editButton.trigger('click')
            await nextTick()
            await flushPromises()

            const buttons = wrapper.findAll('button')
            expect(buttons[1].text()).toContain('Annuler')
            expect(buttons[2].text()).toContain('Enregistrer')
        })
    })

    describe('Mise à jour des informations', () => {
        it('should update account information when saving', async () => {
            const account = createMockAccount()
            authStore.account = account
            await flushPromises()

            const updatedAccount = {
                ...account,
                firstname: 'testtest',
                lastname: 'testtest',
                phone_number: '0987654321',
                gender: 'female'
            }
            accountStore.updateAccount = vi.fn().mockResolvedValue(updatedAccount)

            const editButton = wrapper.find('button')
            await editButton.trigger('click')
            await nextTick()
            await flushPromises()

            const firstnameInput = wrapper.find('input[type="text"]')
            const lastnameInput = wrapper.findAll('input[type="text"]')[1]
            const phoneInput = wrapper.find('input[type="tel"]')
            const genderSelect = wrapper.find('select')

            await firstnameInput.setValue('testtest')
            await lastnameInput.setValue('testtest')
            await phoneInput.setValue('0987654321')
            await genderSelect.setValue('female')
            await nextTick()
            await flushPromises()

            const saveButton = wrapper.findAll('button')[2]
            await saveButton.trigger('click')
            await nextTick()
            await flushPromises()

            expect(accountStore.updateAccount).toHaveBeenCalledWith(account.id, {
                firstname: 'testtest',
                lastname: 'testtest',
                phone_number: '0987654321',
                gender: 'female',
                email: account.email,
                birthday: account.birthday
            })
            expect(authStore.account).toEqual(updatedAccount)
        })

        it('should cancel editing and revert changes', async () => {
            const account = createMockAccount()
            authStore.account = account
            await flushPromises()

            const editButton = wrapper.find('button')
            await editButton.trigger('click')
            await nextTick()
            await flushPromises()

            const firstnameInput = wrapper.find('input[type="text"]')
            await firstnameInput.setValue('Jane')
            await nextTick()
            await flushPromises()

            const cancelButton = wrapper.findAll('button')[0]
            await cancelButton.trigger('click')
            await nextTick()
            await flushPromises()

            expect(wrapper.text()).toContain(account.firstname)
            expect(wrapper.text()).not.toContain('Jane')
        })
    })

    describe('Validation des champs', () => {
        it('should display phone number as "Non renseigné" when empty', async () => {
            const account = createMockAccount({ phone_number: '' })
            authStore.account = account
            await flushPromises()

            expect(wrapper.text()).toContain('Non renseigné')
        })

        it('should display gender as "Non renseigné" when not set', async () => {
            const account = createMockAccount({ gender: undefined })
            authStore.account = account
            await flushPromises()

            expect(wrapper.text()).toContain('Non renseigné')
        })
    })
})
