import { createRouter, createWebHistory } from 'vue-router'
import { accountsRoute } from '@/modules/accounts/router/route'
import { useAuthStore } from '@/modules/auth/store/useAuthStore'
import LoginView from '@/modules/auth/views/LoginView.vue'
import VerifyOTPView from '@/modules/auth/views/VerifyOTPView.vue'
import CreateAccountView from '@/modules/accounts/views/CreateAccountView.vue'
import { ExercisesRoute, workoutRoute } from '@/modules/workout/router/route'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            meta: { requiresAuth: true },
            // component: () => import('../shared/views/HomeView.vue'),
            children: [
                accountsRoute,
                workoutRoute,
                ExercisesRoute,
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    meta: { requiresAuth: true },
                    component: () => import('../shared/views/HomeView.vue')
                },
                {
                    path: '/profil',
                    name: 'profil',
                    meta: { requiresAuth: true },
                    component: () => import('../modules/accounts/views/ProfileView.vue')
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            meta: { requiresAuth: false },
            component: LoginView
        },
        {
            path: '/verify-otp',
            name: 'verify-otp',
            meta: { requiresAuth: false },
            component: VerifyOTPView
        },
        {
            path: '/create-account',
            name: 'create-account',
            meta: { requiresAuth: true },
            component: CreateAccountView
        }
    ]
})

// Garde de navigation
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

    // Vérifier l'état de l'authentification si nécessaire
    if (authStore.user === null) {
        await authStore.fetchUser()
    }

    // Gérer les redirections
    if (requiresAuth && !authStore.user) {
        // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
        next({ name: 'login' })
    } else if (requiresAuth && authStore.user && !authStore.account) {
        // Rediriger vers la page de création de compte si l'utilisateur connecté n'a pas de compte
        next({ name: 'create-account' })
    } else if ((requiresAuth || to.name === 'login') && authStore.pendingVerification) {
        // Rediriger vers la page de verification OTP si une vérification est en attente
        next({ name: 'verify-otp' })
    } else if (to.name === 'verify-otp' && !authStore.pendingVerification) {
        // Rediriger vers la page home si aucune vérification n'est en attente
        next({ name: 'dashboard' })
    } else if (to.name === 'login' && authStore.user) {
        // Rediriger vers la page d'accueil si l'utilisateur est déjà connecté
        next({ name: 'dashboard' })
    } else {
        next()
    }
})

export default router
