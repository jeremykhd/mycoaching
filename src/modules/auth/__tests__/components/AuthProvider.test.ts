import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import AuthProvider from '../../components/AuthProvider.vue'
import { useAuthStore } from '../../store/useAuthStore'
import CreateAccountView from '@/modules/accounts/views/CreateAccountView.vue'
import { useAccountStore } from '@/modules/accounts/store/useAccountStore'
import type { User } from '@supabase/supabase-js'
import type { Account } from '@/modules/accounts/models/Account'
import LoginView from '../../views/LoginView.vue'
import VerifyOTPView from '../../views/VerifyOTPView.vue'

// Mock des composants enfants
// vi.mock('../../views/LoginView.vue', () => ({
//   default: {
//     name: 'LoginView',
//     template: '<div>Login View</div>'
//   }
// }))

// vi.mock('../../views/VerifyOTPView.vue', () => ({
//   default: {
//     name: 'VerifyOTPView',
//     template: '<div>Verify OTP View</div>'
//   }
// }))

// vi.mock('@/modules/accounts/views/CreateAccountView.vue', () => ({
//   default: {
//     name: 'CreateAccountView',
//     props: ['user'],
//     template: '<div>Create Account View</div>'
//   }
// }))

// // Mock du composant AuthProvider
// vi.mock('../../components/AuthProvider.vue', () => ({
//   default: {
//     name: 'AuthProvider',
//     components: {
//       LoginView: {
//         name: 'LoginView',
//         template: '<div>Login View</div>'
//       },
//       VerifyOTPView: {
//         name: 'VerifyOTPView',
//         template: '<div>Verify OTP View</div>'
//       },
//       CreateAccountView: {
//         name: 'CreateAccountView',
//         props: ['user'],
//         template: '<div>Create Account View</div>'
//       }
//     },
//     template: `
//       <div>
//         <div v-if="authStore.loadingSession" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
//           <div class="animate-spin h-8 w-8 text-violet-500">
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//               <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
//               <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//           </div>
//         </div>
//         <template v-else>
//           <template v-if="authStore.user && authStore.account">
//             <slot :user="authStore.user" :account="authStore.account"></slot>
//           </template>
//           <CreateAccountView v-else-if="authStore.user && !authStore.account" :user="authStore.user" />
//           <VerifyOTPView v-else-if="authStore.pendingVerification" />
//           <LoginView v-else />
//         </template>
//       </div>
//     `,
//     setup() {
//       const authStore = useAuthStore()
//       return { authStore }
//     }
//   }
// }))

const createMockUser = (overrides: Partial<User> = {}): Partial<User> => ({
    id: '11111111-1111-1111-1111-111111111111',
    email: 'test@test.com',
    ...overrides
})

const createMockAccount = (overrides: Partial<Account> = {}): Partial<Account> => ({
    id: 1,
    user_id: '11111111-1111-1111-1111-111111111111',
    ...overrides
})

describe('AuthProvider', () => {
    let wrapper: any
    let authStore: any
    let accountStore: any
    let pinia: any

    const createWrapper = (props = {}) => {
        pinia = createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
            initialState: {
                auth: {
                    user: null,
                    account: null,
                    loadingSession: false,
                    pendingVerification: false
                }
            }
        })

        return mount(AuthProvider, {
            props,
            global: {
                plugins: [pinia]
            }
        })
    }

    const mountWrapper = async (props = {}) => {
        const wrapper = mount(AuthProvider, {
            ...props,
            global: {
                plugins: [pinia]
            }
        })
        await flushPromises()
        return wrapper
    }

    beforeEach(async () => {
        wrapper = createWrapper()
        authStore = useAuthStore()
        accountStore = useAccountStore()
        await flushPromises()
    })

    describe('Loading state', () => {
        it('should show loading spinner when loadingSession is true', async () => {
            authStore.loadingSession = true
            await flushPromises()

            wrapper = await mountWrapper()

            expect(wrapper.find('.animate-spin').exists()).toBe(true)
            expect(wrapper.find('svg').exists()).toBe(true)
        })
    })

    describe('Authenticated state', () => {
        it('should render slot content when user and account are present', async () => {
            authStore.user = createMockUser()
            authStore.account = createMockAccount()
            await flushPromises()

            wrapper = await mountWrapper({
                slots: {
                    default: '<div>Authenticated Content</div>'
                }
            })

            expect(wrapper.text()).toBe('Authenticated Content')
        })

        it('should pass user and account to slot', async () => {
            authStore.user = createMockUser()
            authStore.account = createMockAccount()
            await flushPromises()

            wrapper = await mountWrapper({
                slots: {
                    default: (props: any) => `${props.user.email} - ${props.account.id}`
                }
            })

            expect(wrapper.text()).toBe('test@test.com - 1')
        })
    })

    describe('User without account', () => {
        it('should render CreateAccountView when user exists but no account', async () => {
            authStore.user = createMockUser()
            authStore.account = null
            await flushPromises()

            wrapper = await mountWrapper()

            const createAccountView = wrapper.findComponent(CreateAccountView)
            expect(createAccountView.exists()).toBe(true)
            expect(createAccountView.props('user')).toEqual(authStore.user)
        })

        it('should pass user prop to CreateAccountView', async () => {
            const user = createMockUser()
            authStore.user = user
            authStore.account = null
            await flushPromises()

            wrapper = await mountWrapper()

            const createAccountView = wrapper.findComponent(CreateAccountView)
            expect(createAccountView.exists()).toBe(true)
            expect(createAccountView.props('user')).toEqual(user)
        })
    })

    describe('OTP verification', () => {
        it('should render VerifyOTPView when pendingVerification is true', async () => {
            authStore.pendingVerification = true
            await flushPromises()

            wrapper = await mountWrapper()
            const verifyOTPView = wrapper.findComponent(VerifyOTPView)

            expect(verifyOTPView.exists()).toBe(true)
        })
    })

    describe('Unauthenticated state', () => {
        it('should render LoginView when no user is present', async () => {
            authStore.user = null
            authStore.account = null
            authStore.pendingVerification = false
            await flushPromises()

            wrapper = await mountWrapper()
            const loginView = wrapper.findComponent(LoginView)

            expect(loginView.exists()).toBe(true)
        })
    })
})
