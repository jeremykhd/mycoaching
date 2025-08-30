import { flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import HealthComponent from '../../components/HealthComponent.vue'
import { useAccountStore } from '../../store/useAccountStore'
import { useAuthStore } from '@/modules/auth/store/useAuthStore'
import { createMockAccount, createTestWrapper } from '@/shared/test/testUtils'
import UiInputNumber from '@/shared/ui/inputs/UiInputNumber.vue'
import UiSelect from '@/shared/ui/select/UiSelect.vue'

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
            expect(wrapper.text()).toContain('Ajouter mes informations')
            expect(wrapper.find('button').text()).toContain('Ajouter mes informations')
        })

        it('should display health data when it exists', async () => {
            const account = createMockAccount()
            authStore.account = account
            await flushPromises()

            expect(wrapper.text()).toContain('Statistiques de Santé')
            expect(wrapper.text()).toContain('Objectifs de Santé')
            expect(wrapper.text()).toContain(account.health.weight.toString())
            expect(wrapper.text()).toContain(account.health.height.toString())
            expect(wrapper.text()).toContain(account.health.target_weight.toString())
            expect(wrapper.text()).toContain(account.health.target_training.toString())
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

            const buttons = wrapper.findAll('button')
            expect(buttons[1].text()).toContain('Annuler')
            expect(buttons[2].text()).toContain('Enregistrer')
        })
    })

    describe('Formulaire', () => {
        it('should initialize form with current health data', async () => {
            const account = createMockAccount()
            authStore.account = account
            await flushPromises()

            const editButton = wrapper.find('button')
            await editButton.trigger('click')

            const inputs = wrapper.findAllComponents(UiInputNumber)
            const weightInput = inputs[0]
            const heightInput = inputs[1]
            const targetWeightInput = inputs[2]
            const targetTrainingInput = inputs[3]
            const measureSelect = wrapper.findComponent(UiSelect)

            expect(weightInput.exists()).toBe(true)
            expect(heightInput.exists()).toBe(true)
            expect(targetWeightInput.exists()).toBe(true)
            expect(targetTrainingInput.exists()).toBe(true)
            expect(measureSelect.exists()).toBe(true)

            expect(weightInput.props('modelValue')).toBe(account.health.weight)
            expect(heightInput.props('modelValue')).toBe(account.health.height)
            expect(targetWeightInput.props('modelValue')).toBe(account.health.target_weight)
            expect(targetTrainingInput.props('modelValue')).toBe(account.health.target_training)
            expect(measureSelect.props('modelValue')).toBe(account.health.measure_weight)
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

            const inputs = wrapper.findAllComponents(UiInputNumber)
            const weightInput = inputs[0]
            const heightInput = inputs[1]
            const measureSelect = wrapper.findComponent(UiSelect)

            await weightInput.setValue(80)
            await heightInput.setValue(185)
            await measureSelect.setValue('weekly')
            await flushPromises()

            const form = wrapper.find('form')
            await form.trigger('submit')
            await flushPromises()

            expect(accountStore.updateHealth).toHaveBeenCalledWith(account.health.id, {
                weight: 80,
                height: 185,
                measure_weight: 'weekly',
                target_weight: account.health.target_weight,
                target_training: account.health.target_training
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

            expect(wrapper.text()).toContain(account.health.weight.toString())
        })
    })

    describe('Calculs', () => {
        it('should calculate IMC correctly', async () => {
            const account = createMockAccount()
            authStore.account = account
            await flushPromises()

            expect(wrapper.find('p[id="IMC"]').text()).toContain('21.6')
        })
    })
})
