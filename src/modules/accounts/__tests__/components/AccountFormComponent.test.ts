import { flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AccountFormComponent from '../../components/AccountFormComponent.vue'
import { useAccountStore } from '../../store/useAccountStore'
import { useAuthStore } from '@/modules/auth/store/useAuthStore'
import { createMockAccount, createTestWrapper } from '@/shared/test/testUtils'

describe('AccountFormComponent', () => {
    let wrapper: any
    let accountStore: any
    let authStore: any

    beforeEach(async () => {
        wrapper = createTestWrapper(AccountFormComponent)
        accountStore = useAccountStore()
        authStore = useAuthStore()
        await flushPromises()
    })

    describe('Rendu initial', () => {
        it('should initialize with empty form when no account provided', () => {
            const inputs = wrapper.findAll('input')
            const select = wrapper.find('select')

            expect(inputs[0].element.value).toBe('') // firstname
            expect(inputs[1].element.value).toBe('') // birthday
            expect(inputs[2].element.value).toBe('') // lastname
            expect(inputs[3].element.value).toBe('') // phone_number
            expect(select.element.value).toBe('') // gender
        })

        it('should initialize with account data when provided', async () => {
            const account = createMockAccount()
            wrapper = createTestWrapper(AccountFormComponent, {
                props: { account }
            })
            await flushPromises()

            const inputs = wrapper.findAll('input')
            const select = wrapper.find('select')

            expect(inputs[0].element.value).toBe(account.firstname)
            expect(inputs[1].element.value).toBe(account.birthday)
            expect(inputs[2].element.value).toBe(account.lastname)
            expect(inputs[3].element.value).toBe(account.phone_number)
            expect(select.element.value).toBe(account.gender)
        })
    })

    describe('Validation des champs', () => {
        it('should require all fields', async () => {
            const form = wrapper.find('form')
            await form.trigger('submit')
            await flushPromises()

            const inputs = wrapper.findAll('input')
            const select = wrapper.find('select')

            expect(inputs[0].element.validity.valid).toBe(false) // firstname
            expect(inputs[1].element.validity.valid).toBe(false) // birthday
            expect(inputs[2].element.validity.valid).toBe(false) // lastname
            expect(inputs[3].element.validity.valid).toBe(false) // phone_number
            expect(select.element.validity.valid).toBe(false) // gender
        })
    })

    describe('Soumission du formulaire', () => {
        it('should emit submit event with form data when valid', async () => {
            const account = createMockAccount()
            wrapper = createTestWrapper(AccountFormComponent, {
                props: { account }
            })
            await flushPromises()

            const form = wrapper.find('form')
            await form.trigger('submit')
            await flushPromises()

            expect(wrapper.emitted('submit')).toBeTruthy()
            expect(wrapper.emitted('submit')[0][0]).toEqual({
                firstname: account.firstname,
                lastname: account.lastname,
                birthday: account.birthday,
                phone_number: account.phone_number,
                gender: account.gender,
                is_active: account.is_active
            })
        })

        it('should emit cancel event when cancel button clicked', async () => {
            const cancelButton = wrapper.find('button[type="button"]')
            await cancelButton.trigger('click')
            await flushPromises()

            expect(wrapper.emitted('cancel')).toBeTruthy()
        })
    })
})
