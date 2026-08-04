import { flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import HealthComponent from '../../components/HealthComponent.vue'
import { useAccountStore } from '../../store/useAccountStore'
import { useAuthStore } from '@/modules/auth/store/useAuthStore'
import { createMockAccount, createTestWrapper } from '@/shared/test/testUtils'
import { XMarkIcon, CheckIcon } from '@heroicons/vue/24/outline'

describe('HealthComponent', () => {
    let wrapper: any
    let accountStore: any
    let authStore: any

    beforeEach(async () => {
        wrapper = createTestWrapper(HealthComponent)
        accountStore = useAccountStore()
        authStore = useAuthStore()
        await flushPromises()
    })

    describe('État initial', () => {
        it('should show "Aucune donnée de santé" when no health data exists', async () => {
            authStore.account = createMockAccount({ health: undefined })
            await flushPromises()

            expect(wrapper.text()).toContain('Aucune donnée de santé')
            expect(wrapper.text()).toContain('Ajouter')
            expect(wrapper.find('button').text()).toContain('Ajouter')
        })

        it('should display health data when it exists', async () => {
            const account = createMockAccount()
            authStore.account = account
            await flushPromises()

            expect(wrapper.text()).toContain('Poids')
            expect(wrapper.text()).toContain('Obj. poids')
            expect(wrapper.text()).toContain(account.health!.weight.toString())
            expect(wrapper.text()).toContain(account.health!.height.toString())
            expect(wrapper.text()).toContain(account.health!.target_weight.toString())
            expect(wrapper.text()).toContain(account.health!.target_training.toString())
        })
    })

    describe('Mode édition', () => {
        it('should toggle edit mode when clicking edit button', async () => {
            authStore.account = createMockAccount()
            await flushPromises()

            const editButton = wrapper.find('button')
            await editButton.trigger('click')
            await flushPromises()

            expect(wrapper.find('form').exists()).toBe(true)
            expect(wrapper.find('input[type="number"]').exists()).toBe(true)
            expect(wrapper.find('select').exists()).toBe(true)
        })

        it('should show save and cancel buttons in edit mode', async () => {
            authStore.account = createMockAccount()
            await flushPromises()

            const editButton = wrapper.find('button')
            await editButton.trigger('click')
            await flushPromises()

            // Edit mode shows icon buttons: cancel (XMark) then save (Check)
            const buttons = wrapper.findAll('button')
            expect(buttons.length).toBe(2)
            expect(wrapper.findComponent(XMarkIcon).exists()).toBe(true)
            expect(wrapper.findComponent(CheckIcon).exists()).toBe(true)
        })
    })

    describe('Formulaire', () => {
        it('should initialize form with current health data', async () => {
            const account = createMockAccount()
            authStore.account = account
            await flushPromises()

            const editButton = wrapper.find('button')
            await editButton.trigger('click')

            const inputs = wrapper.findAll('input[type="number"]')
            const weightInput = inputs[0]
            const heightInput = inputs[1]
            const targetWeightInput = inputs[2]
            const targetTrainingInput = inputs[3]
            const measureSelect = wrapper.find('select')

            expect(weightInput.exists()).toBe(true)
            expect(heightInput.exists()).toBe(true)
            expect(targetWeightInput.exists()).toBe(true)
            expect(targetTrainingInput.exists()).toBe(true)
            expect(measureSelect.exists()).toBe(true)

            expect((weightInput.element as HTMLInputElement).value).toBe(
                String(account.health!.weight)
            )
            expect((heightInput.element as HTMLInputElement).value).toBe(
                String(account.health!.height)
            )
            expect((targetWeightInput.element as HTMLInputElement).value).toBe(
                String(account.health!.target_weight)
            )
            expect((targetTrainingInput.element as HTMLInputElement).value).toBe(
                String(account.health!.target_training)
            )
            expect((measureSelect.element as HTMLSelectElement).value).toBe(
                account.health!.measure_weight
            )
        })
    })

    describe('Mise à jour des données', () => {
        it('should update health data when saving', async () => {
            const account = createMockAccount()
            authStore.account = account
            await flushPromises()

            accountStore.updateHealth = vi.fn().mockResolvedValue(account.health)

            const editButton = wrapper.find('button')
            await editButton.trigger('click')
            await flushPromises()

            const inputs = wrapper.findAll('input[type="number"]')
            const weightInput = inputs[0]
            const heightInput = inputs[1]
            const measureSelect = wrapper.find('select')

            await weightInput.setValue(80)
            await heightInput.setValue(185)
            await measureSelect.setValue('weekly')
            await flushPromises()

            const form = wrapper.find('form')
            await form.trigger('submit')
            await flushPromises()

            expect(accountStore.updateHealth).toHaveBeenCalledWith(account.health!.id, {
                weight: 80,
                height: 185,
                measure_weight: 'weekly',
                target_weight: account.health!.target_weight,
                target_training: account.health!.target_training
            })
        })

        it('should cancel editing and revert changes', async () => {
            const account = createMockAccount()
            authStore.account = account
            await flushPromises()

            const editButton = wrapper.find('button')
            await editButton.trigger('click')
            await flushPromises()

            const weightInput = wrapper.find('input[type="number"]')
            await weightInput.setValue(80)
            await flushPromises()

            const cancelButton = wrapper.findAll('button')[1]
            await cancelButton.trigger('click')
            await flushPromises()

            expect(wrapper.text()).toContain(account.health!.weight.toString())
        })
    })

    describe('Calculs', () => {
        it('should calculate IMC correctly', async () => {
            const account = createMockAccount()
            authStore.account = account
            await flushPromises()

            const bmiCard = wrapper
                .findAll('.glass-subtle')
                .find((c: any) => c.text().includes('IMC'))
            expect(bmiCard?.text()).toContain('21.6')
        })
    })
})
